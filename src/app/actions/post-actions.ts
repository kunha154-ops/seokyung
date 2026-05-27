'use server'

import { cookies } from 'next/headers'
import { getDb } from '@/lib/db'
import { auth } from '@/lib/auth'
import { writeFile } from 'fs/promises'
import path from 'path'
import crypto from 'crypto'
import fs from 'fs'

// Allowed file extensions
const ALLOWED_EXTENSIONS = ['pdf', 'hwp', 'hwpx', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png', 'gif', 'zip', 'rar'];
const FORBIDDEN_EXTENSIONS = ['exe', 'js', 'sh', 'bat', 'cmd', 'php', 'html', 'htm', 'cgi', 'pl', 'py'];
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const MAX_FILES = 5;

interface AuthUser {
  id: number;
  name: string;
  role: string;
  isAdmin: boolean;
}

async function getCurrentUser(): Promise<AuthUser | null> {
  // 1. Check NextAuth session first
  try {
    const session = await auth();
    if (session?.user) {
      return {
        id: parseInt(session.user.id as string, 10),
        name: session.user.name || '회원',
        role: (session.user as any).role || 'member',
        isAdmin: (session.user as any).role === 'admin',
      };
    }
  } catch (e) {
    // NextAuth not available, try admin token
  }

  // 2. Check admin cookie token
  const cookieStore = await cookies();
  const adminToken = cookieStore.get('admin_token')?.value;
  const adminSecret = process.env.ADMIN_SECRET;
  
  if (adminSecret && adminToken === adminSecret) {
    return {
      id: 0, // system admin
      name: '관리자',
      role: 'admin',
      isAdmin: true,
    };
  }

  return null;
}

export { getCurrentUser };

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9가-힣._-]/g, '_').substring(0, 100);
}

function validateVideoUrl(url: string): boolean {
  if (!url) return true; // optional field
  const patterns = [
    /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+/,
    /^https?:\/\/youtu\.be\/[\w-]+/,
    /^https?:\/\/(www\.)?youtube\.com\/shorts\/[\w-]+/,
    /^https?:\/\/(www\.)?vimeo\.com\/\d+/,
  ];
  return patterns.some(p => p.test(url));
}

export async function submitPost(formData: FormData): Promise<{ success: boolean; error?: string; redirectUrl?: string }> {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: '로그인이 필요합니다.' };
  }

  const id = formData.get('id')?.toString();
  const title = formData.get('title')?.toString()?.trim();
  const content = formData.get('content')?.toString()?.trim();
  const videoUrl = formData.get('video_url')?.toString()?.trim() || '';
  const boardType = formData.get('boardType')?.toString();
  const category = formData.get('category')?.toString() || '';
  const deletedFileIds: number[] = JSON.parse(formData.get('deletedFileIds')?.toString() || '[]');
  const files = formData.getAll('files') as File[];

  // Validations
  if (!title) return { success: false, error: '제목을 입력해주세요.' };
  if (title.length > 200) return { success: false, error: '제목은 200자 이내로 입력해주세요.' };
  if (!content) return { success: false, error: '내용을 입력해주세요.' };
  if (!boardType) return { success: false, error: '게시판 유형이 지정되지 않았습니다.' };
  if (videoUrl && !validateVideoUrl(videoUrl)) {
    return { success: false, error: '지원되지 않는 영상 URL입니다. (YouTube, Vimeo만 허용)' };
  }

  // File validations
  const validFiles = files.filter(f => f.size > 0);
  if (validFiles.length > MAX_FILES) {
    return { success: false, error: `최대 ${MAX_FILES}개의 파일만 첨부할 수 있습니다.` };
  }
  for (const file of validFiles) {
    if (file.size > MAX_FILE_SIZE) {
      return { success: false, error: `${file.name} 파일이 20MB를 초과합니다.` };
    }
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    if (FORBIDDEN_EXTENSIONS.includes(ext)) {
      return { success: false, error: `${file.name} 파일은 허용되지 않는 확장자입니다.` };
    }
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return { success: false, error: `${file.name} 파일은 지원되지 않는 형식입니다.` };
    }
  }

  const db = getDb();
  let postId: number;

  try {
    if (id) {
      // === UPDATE ===
      postId = parseInt(id, 10);

      // Permission check: author or admin
      if (!user.isAdmin) {
        let existing: any;
        if (boardType === 'notices') existing = db.prepare('SELECT author_id FROM notices WHERE id = ?').get(postId);
        else if (boardType === 'news') existing = db.prepare('SELECT author_id FROM news WHERE id = ?').get(postId);
        else if (boardType === 'resources') existing = db.prepare('SELECT author_id FROM resources WHERE id = ?').get(postId);
        
        if (!existing || (existing.author_id && existing.author_id !== user.id)) {
          return { success: false, error: '수정 권한이 없습니다.' };
        }
      }

      if (boardType === 'notices') {
        db.prepare('UPDATE notices SET title = ?, content = ?, video_url = ?, updated_at = datetime("now", "localtime") WHERE id = ?')
          .run(title, content, videoUrl || null, postId);
      } else if (boardType === 'news') {
        db.prepare('UPDATE news SET title = ?, content = ?, video_url = ?, updated_at = datetime("now", "localtime") WHERE id = ?')
          .run(title, content, videoUrl || null, postId);
      } else if (boardType === 'resources') {
        db.prepare('UPDATE resources SET title = ?, category = ?, video_url = ? WHERE id = ?')
          .run(title, category || 'forms', videoUrl || null, postId);
      }
    } else {
      // === INSERT ===
      let result: any;
      if (boardType === 'notices') {
        result = db.prepare('INSERT INTO notices (title, content, video_url, author_id, status) VALUES (?, ?, ?, ?, ?)').run(title, content, videoUrl || null, user.id || null, 'published');
      } else if (boardType === 'news') {
        result = db.prepare('INSERT INTO news (title, content, video_url, author_id, status) VALUES (?, ?, ?, ?, ?)').run(title, content, videoUrl || null, user.id || null, 'published');
      } else if (boardType === 'resources') {
        result = db.prepare('INSERT INTO resources (title, category, video_url, author_id, status) VALUES (?, ?, ?, ?, ?)').run(title, category || 'forms', videoUrl || null, user.id || null, 'published');
      }
      postId = Number(result!.lastInsertRowid);
    }

    // Delete removed attachments
    for (const fileId of deletedFileIds) {
      const fileInfo = db.prepare('SELECT file_path FROM post_attachments WHERE id = ? AND table_name = ? AND post_id = ?').get(fileId, boardType, postId) as any;
      if (fileInfo) {
        db.prepare('DELETE FROM post_attachments WHERE id = ?').run(fileId);
        const fullPath = path.join(process.cwd(), 'public', fileInfo.file_path);
        if (fs.existsSync(fullPath)) {
          try { fs.unlinkSync(fullPath); } catch (e) { /* ignore */ }
        }
      }
    }

    // Upload new files
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'attachments');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const insertAttachment = db.prepare(
      'INSERT INTO post_attachments (table_name, post_id, original_file_name, stored_file_name, file_path, file_size, mime_type, uploaded_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    );

    for (const file of validFiles) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const ext = path.extname(file.name);
      const storedName = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`;
      const relPath = `/uploads/attachments/${storedName}`;

      await writeFile(path.join(uploadDir, storedName), buffer);

      insertAttachment.run(
        boardType,
        postId,
        sanitizeFileName(file.name),
        storedName,
        relPath,
        formatBytes(file.size),
        file.type,
        user.id || null
      );
    }

    // Determine redirect
    let redirectUrl: string;
    if (boardType === 'notices') redirectUrl = `/news/notices/${postId}`;
    else if (boardType === 'news') redirectUrl = `/news/updates/${postId}`;
    else redirectUrl = `/resources/${category || 'forms'}/${postId}`;

    return { success: true, redirectUrl };
  } catch (error: any) {
    console.error('Post submit error:', error);
    // Return structured error response instead of throwing, so frontend can handle it
    return { success: false, error: '저장 중 오류가 발생했습니다: ' + (error.message || '알 수 없는 오류') };
  }
}

export async function deletePost(boardType: string, postId: number): Promise<{ success: boolean; error?: string }> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: '로그인이 필요합니다.' };

  const allowedTables = ['notices', 'news', 'resources'];
  if (!allowedTables.includes(boardType)) {
    return { success: false, error: '유효하지 않은 게시판 유형입니다.' };
  }

  const db = getDb();
  
  // Permission check
  if (!user.isAdmin) {
    const existing = db.prepare(`SELECT author_id FROM ${boardType} WHERE id = ?`).get(postId) as any;
    if (!existing || (existing.author_id && existing.author_id !== user.id)) {
      return { success: false, error: '삭제 권한이 없습니다.' };
    }
  }

  try {
    // Soft delete
    db.prepare(`UPDATE ${boardType} SET status = 'deleted' WHERE id = ?`).run(postId);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: '삭제 중 오류가 발생했습니다.' };
  }
}

export async function updatePostStatus(boardType: string, postId: number, status: 'published' | 'hidden' | 'deleted'): Promise<{ success: boolean; error?: string }> {
  const user = await getCurrentUser();
  if (!user?.isAdmin) return { success: false, error: '관리자만 상태를 변경할 수 있습니다.' };

  const allowedTables = ['notices', 'news', 'resources'];
  if (!allowedTables.includes(boardType)) {
    return { success: false, error: '유효하지 않은 게시판 유형입니다.' };
  }

  const db = getDb();
  try {
    db.prepare(`UPDATE ${boardType} SET status = ? WHERE id = ?`).run(status, postId);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: '상태 변경 중 오류가 발생했습니다.' };
  }
}

'use server'

import { cookies } from 'next/headers'
import { getDb } from '@/lib/db'
import { getCurrentUser } from '@/app/actions/post-actions'
import { writeFile } from 'fs/promises'
import path from 'path'
import crypto from 'crypto'
import fs from 'fs'

const ALLOWED_EXTENSIONS = ['pdf', 'hwp', 'hwpx', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png', 'gif', 'zip', 'rar'];
const FORBIDDEN_EXTENSIONS = ['exe', 'js', 'sh', 'bat', 'cmd', 'php', 'html', 'htm', 'cgi', 'pl', 'py'];
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const MAX_FILES = 5;

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

export async function submitCommitteePost(formData: FormData): Promise<{ success: boolean; error?: string; redirectUrl?: string }> {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: '로그인이 필요합니다.' };
  }

  if (!user.isAdmin && user.status !== 'approved') {
    return { success: false, error: '관리자 승인 후 이용할 수 있습니다.' };
  }

  const id = formData.get('id')?.toString();
  const title = formData.get('title')?.toString()?.trim();
  const content = formData.get('content')?.toString()?.trim();
  const committeeType = formData.get('committeeType')?.toString();
  const boardType = formData.get('boardType')?.toString();
  const status = formData.get('status')?.toString() || 'public';
  const deletedFileIds: number[] = JSON.parse(formData.get('deletedFileIds')?.toString() || '[]');
  const files = formData.getAll('files') as File[];
  
  const thumbnailFile = formData.get('thumbnail') as File | null;

  if (!title) return { success: false, error: '제목을 입력해주세요.' };
  if (!content) return { success: false, error: '내용을 입력해주세요.' };
  if (!committeeType) return { success: false, error: '위원회 유형이 지정되지 않았습니다.' };
  if (!boardType) return { success: false, error: '게시판 유형이 지정되지 않았습니다.' };

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
  let thumbnailUrl: string | null = null;
  let thumbnailPath: string | null = null;

  try {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'committee');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Handle thumbnail
    if (thumbnailFile && thumbnailFile.size > 0) {
      if (thumbnailFile.size > 5 * 1024 * 1024) return { success: false, error: '대표 이미지는 5MB를 초과할 수 없습니다.' };
      const bytes = await thumbnailFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const ext = path.extname(thumbnailFile.name);
      const storedName = `thumb-${Date.now()}-${crypto.randomBytes(4).toString('hex')}${ext}`;
      thumbnailPath = `/uploads/committee/${storedName}`;
      thumbnailUrl = thumbnailPath;
      await writeFile(path.join(uploadDir, storedName), buffer);
    }

    if (id) {
      postId = parseInt(id, 10);
      if (!user.isAdmin) {
        const existing = db.prepare('SELECT author_id FROM committee_posts WHERE id = ?').get(postId) as any;
        if (!existing || (existing.author_id && existing.author_id !== user.id)) {
          return { success: false, error: '수정 권한이 없습니다.' };
        }
      }

      if (thumbnailUrl) {
        db.prepare('UPDATE committee_posts SET title = ?, content = ?, status = ?, thumbnail_url = ?, thumbnail_path = ?, updated_at = datetime("now", "localtime") WHERE id = ?')
          .run(title, content, status, thumbnailUrl, thumbnailPath, postId);
      } else {
        db.prepare('UPDATE committee_posts SET title = ?, content = ?, status = ?, updated_at = datetime("now", "localtime") WHERE id = ?')
          .run(title, content, status, postId);
      }
    } else {
      const result = db.prepare('INSERT INTO committee_posts (committee_type, board_type, title, content, status, author_id, thumbnail_url, thumbnail_path) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
        .run(committeeType, boardType, title, content, status, user.id || null, thumbnailUrl, thumbnailPath);
      postId = Number(result.lastInsertRowid);
    }

    for (const fileId of deletedFileIds) {
      const fileInfo = db.prepare('SELECT file_path FROM post_attachments WHERE id = ? AND table_name = ? AND post_id = ?').get(fileId, 'committee_posts', postId) as any;
      if (fileInfo) {
        db.prepare('DELETE FROM post_attachments WHERE id = ?').run(fileId);
        const fullPath = path.join(process.cwd(), 'public', fileInfo.file_path);
        if (fs.existsSync(fullPath)) {
          try { fs.unlinkSync(fullPath); } catch (e) {}
        }
      }
    }

    const insertAttachment = db.prepare(
      'INSERT INTO post_attachments (table_name, post_id, original_file_name, stored_file_name, file_path, file_size, mime_type, uploaded_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    );

    for (const file of validFiles) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const ext = path.extname(file.name);
      const storedName = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`;
      const relPath = `/uploads/committee/${storedName}`;

      await writeFile(path.join(uploadDir, storedName), buffer);

      insertAttachment.run(
        'committee_posts',
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
    let basePath = '';
    if (committeeType === 'mission') basePath = '/mission';
    else if (committeeType === 'self_reliance') basePath = '/self-reliance';
    else if (committeeType === 'education') basePath = '/education';

    return { success: true, redirectUrl: `${basePath}/${boardType}/${postId}` };
  } catch (error: any) {
    console.error('Committee post submit error:', error);
    return { success: false, error: '저장 중 오류가 발생했습니다: ' + (error.message || '알 수 없는 오류') };
  }
}

export async function deleteCommitteePostAction(id: number): Promise<{ success: boolean; error?: string }> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: '로그인이 필요합니다.' };

  const db = getDb();
  if (!user.isAdmin) {
    const existing = db.prepare('SELECT author_id FROM committee_posts WHERE id = ?').get(id) as any;
    if (!existing || (existing.author_id && existing.author_id !== user.id)) {
      return { success: false, error: '삭제 권한이 없습니다.' };
    }
  }

  try {
    db.prepare(`UPDATE committee_posts SET status = 'hidden' WHERE id = ?`).run(id); // Soft delete or hide
    return { success: true };
  } catch (error: any) {
    return { success: false, error: '삭제 중 오류가 발생했습니다.' };
  }
}

export async function forceDeleteCommitteePostAction(id: number): Promise<{ success: boolean; error?: string }> {
  const user = await getCurrentUser();
  if (!user?.isAdmin) return { success: false, error: '관리자만 삭제할 수 있습니다.' };

  const db = getDb();
  try {
    db.prepare('DELETE FROM committee_posts WHERE id = ?').run(id);
    db.prepare("DELETE FROM post_attachments WHERE table_name = 'committee_posts' AND post_id = ?").run(id);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: '삭제 중 오류가 발생했습니다.' };
  }
}

export async function updateCommitteePostStatusAction(id: number, status: 'public' | 'hidden'): Promise<{ success: boolean; error?: string }> {
  const user = await getCurrentUser();
  if (!user?.isAdmin) return { success: false, error: '관리자만 상태를 변경할 수 있습니다.' };

  const db = getDb();
  try {
    db.prepare(`UPDATE committee_posts SET status = ? WHERE id = ?`).run(status, id);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: '상태 변경 중 오류가 발생했습니다.' };
  }
}

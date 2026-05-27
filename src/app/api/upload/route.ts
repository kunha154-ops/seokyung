import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import crypto from 'crypto';

// Next.js config for this specific route (though standard route handlers handle streaming automatically, some setups might limit body size. We rely on next.config.ts for global size limit, but we can also stream processing if needed. For now, request.formData() buffers in memory up to the configured limit).
import { auth } from '@/lib/auth';

export async function POST(req: NextRequest) {
  // Authentication Check
  const session = await auth();
  const adminToken = req.cookies.get('admin_token')?.value;
  const adminSecret = process.env.ADMIN_SECRET;
  
  const isUser = !!session?.user;
  const isAdmin = adminSecret && adminToken === adminSecret;
  
  if (!isUser && !isAdmin) {
    return NextResponse.json({ success: false, error: '업로드 권한이 없습니다.' }, { status: 401 });
  }
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = formData.get('folder') as string || 'gallery';

    if (!file) {
      return NextResponse.json({ success: false, error: '파일이 없습니다.' }, { status: 400 });
    }

    // validate folder to prevent path traversal
    if (!['gallery/photos', 'gallery/videos'].includes(folder)) {
      return NextResponse.json({ success: false, error: '잘못된 업로드 경로입니다.' }, { status: 400 });
    }

    // File extension validation
    const originalName = file.name;
    const ext = originalName.substring(originalName.lastIndexOf('.')).toLowerCase();
    const FORBIDDEN_EXTENSIONS = ['.exe', '.js', '.sh', '.bat', '.cmd', '.php', '.html', '.htm', '.cgi', '.pl', '.py'];
    if (FORBIDDEN_EXTENSIONS.includes(ext)) {
      return NextResponse.json({ success: false, error: '허용되지 않는 확장자입니다.' }, { status: 400 });
    }

    // File size validation (e.g. 50MB max for api/upload, though global is 300MB)
    const MAX_UPLOAD_SIZE = 50 * 1024 * 1024;
    if (file.size > MAX_UPLOAD_SIZE) {
      return NextResponse.json({ success: false, error: '파일 크기가 50MB를 초과할 수 없습니다.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = join(process.cwd(), 'public', 'uploads', folder);
    await mkdir(uploadDir, { recursive: true });

    // (originalName and ext already retrieved above)
    
    // generate safe unique name
    const uniqueName = `${Date.now()}-${crypto.randomUUID()}${ext}`;
    const filePath = join(uploadDir, uniqueName);

    await writeFile(filePath, buffer);
    
    const fileUrl = `/uploads/${folder}/${uniqueName}`;

    return NextResponse.json({ 
      success: true, 
      url: fileUrl,
      fileName: originalName,
      fileSize: file.size,
      fileType: file.type
    });

  } catch (error: any) {
    console.error('[Upload API Error]', error);
    return NextResponse.json({ success: false, error: '업로드 중 서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

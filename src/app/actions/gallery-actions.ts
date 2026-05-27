'use server';

import { createGalleryPost, addGalleryMedia, deleteGalleryPost } from '@/lib/queries';
import { getDb } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';

export async function createPhotoGalleryAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: '로그인이 필요합니다.' };
  }
  
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const mediaUrls = formData.getAll('mediaUrls') as string[];
  const mediaSizes = formData.getAll('mediaSizes') as string[]; 
  const mediaTypes = formData.getAll('mediaTypes') as string[];
  const mediaNames = formData.getAll('mediaNames') as string[];
  
  if (!title) return { success: false, error: '제목이 필요합니다.' };
  if (!mediaUrls || mediaUrls.length === 0) return { success: false, error: '최소 한 장 이상의 사진이 필요합니다.' };
  
  try {
    const post = createGalleryPost('photo', title, description, parseInt(session.user.id), 'public', mediaUrls[0]);
    
    for (let i = 0; i < mediaUrls.length; i++) {
      addGalleryMedia(
        post.id,
        'image',
        mediaNames[i] || 'photo',
        mediaUrls[i],
        mediaSizes[i] || null,
        mediaTypes[i] || null,
        i,
        parseInt(session.user.id)
      );
    }
    
    revalidatePath('/gallery/photos');
    revalidatePath('/gallery');
    
    return { success: true, redirectUrl: `/gallery/photo/${post.id}` };
  } catch (error: any) {
    console.error('Gallery create error:', error);
    return { success: false, error: '저장 중 오류가 발생했습니다: ' + (error.message || '알 수 없는 오류') };
  }
}

export async function createVideoGalleryAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: '로그인이 필요합니다.' };
  }
  
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const videoUrl = formData.get('videoUrl') as string;
  const videoFilePath = formData.get('videoFilePath') as string;
  const mediaSize = formData.get('mediaSize') as string;
  const mediaType = formData.get('mediaType') as string;
  const mediaName = formData.get('mediaName') as string;
  
  if (!title) return { success: false, error: '제목이 필요합니다.' };
  if (!videoUrl && !videoFilePath) return { success: false, error: '영상 URL이나 영상 파일이 필요합니다.' };
  
  try {
    const post = createGalleryPost('video', title, description, parseInt(session.user.id), 'public', null, videoUrl, videoFilePath);
    
    if (videoFilePath) {
      addGalleryMedia(
        post.id,
        'video',
        mediaName || 'video',
        videoFilePath,
        mediaSize || null,
        mediaType || null,
        0,
        parseInt(session.user.id)
      );
    }
    
    revalidatePath('/gallery/videos');
    revalidatePath('/gallery');
    
    return { success: true, redirectUrl: `/gallery/video/${post.id}` };
  } catch (error: any) {
    console.error('Video gallery create error:', error);
    return { success: false, error: '저장 중 오류가 발생했습니다: ' + (error.message || '알 수 없는 오류') };
  }
}

export async function deleteGalleryPostAction(postId: number) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: '권한이 없습니다.' };
  }
  
  const db = getDb();
  const post = db.prepare('SELECT author_id FROM gallery_posts WHERE id = ?').get(postId) as { author_id: number } | undefined;
  
  if (!post) {
    return { success: false, error: '게시물을 찾을 수 없습니다.' };
  }
  
  if (session.user.role !== 'admin' && post.author_id !== parseInt(session.user.id)) {
    return { success: false, error: '권한이 없습니다.' };
  }
  
  try {
    deleteGalleryPost(postId);
    revalidatePath('/gallery');
    revalidatePath('/gallery/photos');
    revalidatePath('/gallery/videos');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateGalleryPostAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: '로그인이 필요합니다.' };
  }
  
  const id = Number(formData.get('id'));
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  
  if (!id || !title) return { success: false, error: '필수 정보가 누락되었습니다.' };
  
  const db = getDb();
  const post = db.prepare('SELECT author_id FROM gallery_posts WHERE id = ?').get(id) as { author_id: number } | undefined;
  
  if (!post) {
    return { success: false, error: '게시물을 찾을 수 없습니다.' };
  }
  
  if (session.user.role !== 'admin' && post.author_id !== parseInt(session.user.id)) {
    return { success: false, error: '권한이 없습니다.' };
  }
  
  try {
    db.prepare('UPDATE gallery_posts SET title = ?, description = ? WHERE id = ?')
      .run(title, description, id);
      
    revalidatePath('/gallery');
    revalidatePath('/gallery/photos');
    revalidatePath('/gallery/videos');
    revalidatePath(`/gallery/photo/${id}`);
    revalidatePath(`/gallery/video/${id}`);
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

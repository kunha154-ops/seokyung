'use server';

import { createNotice, updateNotice, deleteNotice, createNews, updateNews, deleteNews, addNewsImage, deleteNewsImage } from '@/lib/queries';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { saveUpload } from '@/lib/upload';
import { unlink } from 'fs/promises';
import { join } from 'path';

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  const secret = process.env.ADMIN_SECRET;
  
  if (!secret || token !== secret) {
    throw new Error('Unauthorized');
  }
}

export async function createNoticeAction(formData: FormData) {
  await requireAdmin();
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const isPinned = formData.get('is_pinned') === 'on';
  
  if (!title || !content) return;
  
  createNotice(title, content, isPinned);
  revalidatePath('/news/notices');
  revalidatePath('/admin/notices');
  redirect('/admin/notices');
}

export async function updateNoticeAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get('id'));
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const isPinned = formData.get('is_pinned') === 'on';
  
  if (!id || !title || !content) return;
  
  updateNotice(id, title, content, isPinned);
  revalidatePath('/news/notices');
  revalidatePath(`/news/notices/${id}`);
  revalidatePath('/admin/notices');
  redirect('/admin/notices');
}

export async function deleteNoticeAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get('id'));
  if (!id) return;
  
  deleteNotice(id);
  revalidatePath('/news/notices');
  revalidatePath('/admin/notices');
  redirect('/admin/notices');
}

export async function createNewsAction(formData: FormData) {
  await requireAdmin();
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  
  if (!title || !content) return;
  
  const thumbnailFile = formData.get('thumbnail') as File | null;
  let thumbnailUrl = null;
  let thumbnailPath = null;
  
  if (thumbnailFile && thumbnailFile.size > 0) {
    thumbnailUrl = await saveUpload(thumbnailFile, 'news');
    thumbnailPath = thumbnailUrl; // In local storage, path and url are same
  }
  
  const news = createNews(title, content, thumbnailUrl, thumbnailPath);
  
  const bodyImages = formData.getAll('bodyImages') as File[];
  for (let i = 0; i < bodyImages.length; i++) {
    const file = bodyImages[i];
    if (file.size > 0) {
      const imgUrl = await saveUpload(file, 'news');
      addNewsImage(news.id, imgUrl, imgUrl, i);
    }
  }
  
  revalidatePath('/news/updates');
  revalidatePath('/admin/news');
  redirect('/admin/news');
}

export async function updateNewsAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get('id'));
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  
  if (!id || !title || !content) return;
  
  const thumbnailFile = formData.get('thumbnail') as File | null;
  const keepThumbnail = formData.get('keep_thumbnail') !== 'false';
  
  let thumbnailUrl: string | null | undefined = undefined;
  let thumbnailPath: string | null | undefined = undefined;
  
  if (thumbnailFile && thumbnailFile.size > 0) {
    thumbnailUrl = await saveUpload(thumbnailFile, 'news');
    thumbnailPath = thumbnailUrl;
  } else if (!keepThumbnail) {
    thumbnailUrl = null;
    thumbnailPath = null;
  }
  
  updateNews(id, title, content, thumbnailUrl, thumbnailPath);
  
  const bodyImages = formData.getAll('bodyImages') as File[];
  if (bodyImages.length > 0 && bodyImages[0].size > 0) {
    // We add new images at the end. For precise sorting/deleting, client-side would pass deleted IDs.
    // For now, we just append them.
    for (let i = 0; i < bodyImages.length; i++) {
      const file = bodyImages[i];
      if (file.size > 0) {
        const imgUrl = await saveUpload(file, 'news');
        addNewsImage(id, imgUrl, imgUrl, 999 + i);
      }
    }
  }
  
  // Handle deletions of existing images
  const deletedImageIdsStr = formData.get('deleted_image_ids') as string;
  if (deletedImageIdsStr) {
    const deletedIds = deletedImageIdsStr.split(',').map(Number);
    for (const dId of deletedIds) {
      if (dId) deleteNewsImage(dId);
    }
  }
  
  revalidatePath('/news/updates');
  revalidatePath(`/news/updates/${id}`);
  revalidatePath('/admin/news');
  redirect('/admin/news');
}

export async function deleteNewsAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get('id'));
  if (!id) return;
  
  deleteNews(id);
  revalidatePath('/news/updates');
  revalidatePath('/admin/news');
  redirect('/admin/news');
}

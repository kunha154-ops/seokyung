'use server';

import { createGalleryPost, addGalleryMedia, deleteGalleryPost, deleteGalleryMedia, getGalleryPostById } from '@/lib/queries';
import { saveUpload } from '@/lib/upload';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  const secret = process.env.ADMIN_SECRET;
  
  if (!secret || token !== secret) {
    throw new Error('Unauthorized');
  }
}

export async function createAlbumAction(formData: FormData) {
  await requireAdmin();
  
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const coverImageFile = formData.get('coverImage') as File | null;
  
  if (!title) throw new Error('제목이 필요합니다.');
  
  let coverImagePath = null;
  if (coverImageFile && coverImageFile.size > 0) {
    coverImagePath = await saveUpload(coverImageFile, 'gallery/covers');
  }
  
  createGalleryPost('photo', title, description, null, 'public', coverImagePath);
  revalidatePath('/gallery/photos');
  revalidatePath('/admin/gallery');
  redirect('/admin/gallery');
}

export async function deleteAlbumAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get('id'));
  if (!id) return;
  
  deleteGalleryPost(id);
  revalidatePath('/gallery/photos');
  revalidatePath('/admin/gallery');
  redirect('/admin/gallery');
}

export async function uploadPhotoAction(formData: FormData) {
  await requireAdmin();
  
  const albumId = Number(formData.get('albumId'));
  const caption = formData.get('caption') as string;
  const photoFile = formData.get('photo') as File | null;
  
  if (!albumId || !photoFile || photoFile.size === 0) {
    throw new Error('앨범 ID와 사진 파일이 필요합니다.');
  }
  
  const imagePath = await saveUpload(photoFile, `gallery/albums/${albumId}`);
  console.log(`[Photo Upload] File saved to: ${imagePath}`);
  addGalleryMedia(albumId, 'image', photoFile.name, imagePath, photoFile.size.toString(), photoFile.type);
  
  revalidatePath(`/gallery/photos/${albumId}`);
  revalidatePath(`/admin/gallery/${albumId}`);
}

export async function deletePhotoAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get('id'));
  const albumId = Number(formData.get('albumId'));
  if (!id || !albumId) return;
  
  // 1. Get file path before deleting from DB
  const db = require('@/lib/db').getDb();
  const media = db.prepare('SELECT file_path FROM gallery_media WHERE id = ?').get(id) as { file_path: string } | undefined;
  
  // 2. Delete from DB
  const deleted = deleteGalleryMedia(id);
  
  // 3. Delete physical file if DB delete succeeded and file path exists
  if (deleted && media && media.file_path) {
    try {
      // file_path is like /uploads/gallery/albums/1/uuid.jpg
      // Needs to be joined with process.cwd(), 'public'
      const absolutePath = join(process.cwd(), 'public', media.file_path.replace(/^\//, ''));
      await unlink(absolutePath);
      console.log(`[Photo Delete] Physical file deleted: ${absolutePath}`);
    } catch (e) {
      console.error(`[Photo Delete Error] Failed to delete physical file: ${media.file_path}`, e);
      // Even if file deletion fails, we don't throw, since DB deletion already succeeded
      // DB and storage can't be easily put in a transaction here without custom rollback.
    }
  }
  
  revalidatePath(`/gallery/photos/${albumId}`);
  revalidatePath(`/admin/gallery/${albumId}`);
}

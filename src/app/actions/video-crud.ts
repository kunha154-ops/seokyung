'use server';

import { createGalleryPost, deleteGalleryPost } from '@/lib/queries';
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

export async function createVideoAction(formData: FormData) {
  await requireAdmin();
  
  const title = formData.get('title') as string;
  let youtubeUrl = formData.get('youtubeUrl') as string;
  const description = formData.get('description') as string;
  
  if (!title || !youtubeUrl) {
    throw new Error('제목과 유튜브 URL이 필요합니다.');
  }

  // Extract YouTube ID from URL (supports youtu.be, youtube.com/watch?v=, youtube.com/embed/)
  let youtubeId = youtubeUrl;
  const match = youtubeUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
  if (match && match[1]) {
    youtubeId = match[1];
  } else if (youtubeUrl.includes('youtube.com/shorts/')) {
    const shortsMatch = youtubeUrl.match(/youtube\.com\/shorts\/([^&?]+)/);
    if (shortsMatch && shortsMatch[1]) {
      youtubeId = shortsMatch[1];
    }
  }
  
  createGalleryPost('video', title, description || '', null, 'public', `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`, youtubeId);
  revalidatePath('/gallery/videos');
  revalidatePath('/admin/videos');
  redirect('/admin/videos');
}

export async function deleteVideoAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get('id'));
  if (!id) return;
  
  deleteGalleryPost(id);
  revalidatePath('/gallery/videos');
  revalidatePath('/admin/videos');
  redirect('/admin/videos');
}

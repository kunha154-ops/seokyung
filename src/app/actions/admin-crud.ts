'use server';

import { createNotice, updateNotice, deleteNotice, createNews, updateNews, deleteNews } from '@/lib/queries';
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
  
  createNews(title, content);
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
  
  updateNews(id, title, content);
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

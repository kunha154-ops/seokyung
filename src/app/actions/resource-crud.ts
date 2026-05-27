'use server';

import { createResource, deleteResource } from '@/lib/queries';
import { saveUpload } from '@/lib/upload';
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

export async function createResourceAction(formData: FormData) {
  await requireAdmin();
  
  const title = formData.get('title') as string;
  const category = formData.get('category') as string; // 'forms' | 'minutes'
  const file = formData.get('file') as File | null;
  
  if (!title || !category) throw new Error('제목과 카테고리가 필요합니다.');
  
  let filePath = null;
  let fileSize = null;
  
  if (file && file.size > 0) {
    filePath = await saveUpload(file, `resources/${category}`);
    // Convert bytes to MB/KB format
    const mb = file.size / (1024 * 1024);
    if (mb >= 1) {
      fileSize = `${mb.toFixed(1)}MB`;
    } else {
      fileSize = `${(file.size / 1024).toFixed(0)}KB`;
    }
  }
  
  createResource(category, title, filePath, fileSize);
  revalidatePath(`/resources/${category}`);
  revalidatePath('/admin/resources');
  redirect('/admin/resources');
}

export async function deleteResourceAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get('id'));
  const category = formData.get('category') as string;
  if (!id) return;
  
  deleteResource(id);
  if (category) {
    revalidatePath(`/resources/${category}`);
  }
  revalidatePath('/admin/resources');
  redirect('/admin/resources');
}

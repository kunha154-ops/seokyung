'use server';

import { createHeroSlide, updateHeroSlide, HeroSlide } from '@/actions/hero';
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

export async function createHeroAction(formData: FormData) {
  await requireAdmin();
  
  const title = formData.get('title') as string;
  const subtitle = formData.get('subtitle') as string;
  const description = formData.get('description') as string;
  
  const desktopImageFile = formData.get('desktop_image') as File | null;
  const mobileImageFile = formData.get('mobile_image') as File | null;
  
  const object_position = formData.get('object_position') as string || 'center center';
  
  const is_active_raw = formData.get('is_active');
  const is_active = is_active_raw === 'true' || is_active_raw === 'on' ? 1 : 0;
  
  const button_enabled_raw = formData.get('button_enabled');
  const button_enabled = button_enabled_raw === 'true' || button_enabled_raw === 'on';
  
  const primary_btn_text = button_enabled ? formData.get('primary_btn_text') as string : null;
  const primary_btn_link = button_enabled ? formData.get('primary_btn_link') as string : null;

  if (!title) throw new Error('제목이 필요합니다.');
  if (!desktopImageFile || desktopImageFile.size === 0) throw new Error('PC용 이미지는 필수입니다.');

  const desktopImagePath = await saveUpload(desktopImageFile, 'hero');
  let mobileImagePath = null;
  if (mobileImageFile && mobileImageFile.size > 0) {
    mobileImagePath = await saveUpload(mobileImageFile, 'hero');
  }

  await createHeroSlide({
    title,
    subtitle,
    description,
    desktop_image: desktopImagePath,
    mobile_image: mobileImagePath || undefined,
    object_position,
    primary_btn_text: primary_btn_text || undefined,
    primary_btn_link: primary_btn_link || undefined,
    is_active
  });

  redirect('/admin/hero');
}

export async function updateHeroAction(formData: FormData) {
  await requireAdmin();
  
  const id = Number(formData.get('id'));
  if (!id) throw new Error('잘못된 요청입니다.');

  const existingSlide = await import('@/actions/hero').then(m => m.getHeroSlide(id));
  if (!existingSlide) throw new Error('슬라이드를 찾을 수 없습니다.');

  const title = formData.get('title') as string;
  const subtitle = formData.get('subtitle') as string;
  const description = formData.get('description') as string;
  
  const desktopImageFile = formData.get('desktop_image') as File | null;
  const mobileImageFile = formData.get('mobile_image') as File | null;
  
  const object_position = formData.get('object_position') as string || 'center center';
  
  const is_active_raw = formData.get('is_active');
  const is_active = is_active_raw === 'true' || is_active_raw === 'on' ? 1 : 0;
  
  const button_enabled_raw = formData.get('button_enabled');
  const button_enabled = button_enabled_raw === 'true' || button_enabled_raw === 'on';
  
  const primary_btn_text = button_enabled ? formData.get('primary_btn_text') as string : null;
  const primary_btn_link = button_enabled ? formData.get('primary_btn_link') as string : null;

  if (!title) throw new Error('제목이 필요합니다.');

  const updates: Partial<HeroSlide> = {
    title,
    subtitle: subtitle || undefined,
    description: description || undefined,
    object_position,
    primary_btn_text: primary_btn_text || undefined,
    primary_btn_link: primary_btn_link || undefined,
    is_active
  };

  if (desktopImageFile && desktopImageFile.size > 0) {
    updates.desktop_image = await saveUpload(desktopImageFile, 'hero');
  } else {
    updates.desktop_image = existingSlide.desktop_image;
  }
  
  const deleteMobileImage = formData.get('delete_mobile_image') === 'true';
  if (deleteMobileImage) {
    updates.mobile_image = undefined;
  } else if (mobileImageFile && mobileImageFile.size > 0) {
    updates.mobile_image = await saveUpload(mobileImageFile, 'hero');
  } else {
    updates.mobile_image = existingSlide.mobile_image;
  }

  await updateHeroSlide(id, updates);

  redirect('/admin/hero');
}

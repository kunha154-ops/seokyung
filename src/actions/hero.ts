'use server';

import { revalidatePath } from 'next/cache';
import { getDb } from '@/lib/db';
import { auth } from '@/lib/auth';
import { cookies } from 'next/headers';

// 관리자 권한 확인 헬퍼
async function requireAdmin() {
  const session = await auth();
  const cookieStore = await cookies();
  const adminToken = cookieStore.get('admin_token')?.value;
  const adminSecret = process.env.ADMIN_SECRET;

  const isUserAdmin = session?.user?.role === 'admin';
  const isTokenAdmin = adminSecret && adminToken === adminSecret;

  if (!isUserAdmin && !isTokenAdmin) {
    throw new Error('관리자 권한이 없습니다.');
  }
}

export type HeroSlide = {
  id: number;
  subtitle: string;
  title: string;
  description: string;
  desktop_image: string;
  mobile_image: string | null;
  object_position: string;
  primary_btn_text: string;
  primary_btn_link: string;
  secondary_btn_text: string;
  secondary_btn_link: string;
  is_active: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

// 슬라이드 조회 (관리자용: 전부 조회, 사용자용: active만 정렬하여 조회)
export async function getHeroSlides(isAdminView = false): Promise<HeroSlide[]> {
  const db = getDb();
  if (isAdminView) {
    await requireAdmin();
    return db.prepare('SELECT * FROM hero_slides ORDER BY sort_order ASC').all() as HeroSlide[];
  }
  return db.prepare('SELECT * FROM hero_slides WHERE is_active = 1 ORDER BY sort_order ASC').all() as HeroSlide[];
}

export async function getHeroSlide(id: number): Promise<HeroSlide | null> {
  await requireAdmin();
  const db = getDb();
  return db.prepare('SELECT * FROM hero_slides WHERE id = ?').get(id) as HeroSlide | null;
}

export async function createHeroSlide(data: Partial<HeroSlide>) {
  await requireAdmin();
  const db = getDb();
  
  // 현재 최대 sort_order 구하기
  const maxOrderRow = db.prepare('SELECT MAX(sort_order) as maxOrder FROM hero_slides').get() as { maxOrder: number | null };
  const nextOrder = (maxOrderRow.maxOrder ?? -1) + 1;

  const stmt = db.prepare(`
    INSERT INTO hero_slides (
      subtitle, title, description, desktop_image, mobile_image, 
      object_position, primary_btn_text, primary_btn_link, 
      secondary_btn_text, secondary_btn_link, is_active, sort_order
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  const result = stmt.run(
    data.subtitle || null,
    data.title,
    data.description || null,
    data.desktop_image,
    data.mobile_image || null,
    data.object_position || 'center center',
    data.primary_btn_text || null,
    data.primary_btn_link || null,
    data.secondary_btn_text || null,
    data.secondary_btn_link || null,
    data.is_active !== undefined ? data.is_active : 1,
    data.sort_order ?? nextOrder
  );

  revalidatePath('/');
  revalidatePath('/admin/hero');
  return { success: true, id: result.lastInsertRowid };
}

export async function updateHeroSlide(id: number, data: Partial<HeroSlide>) {
  await requireAdmin();
  const db = getDb();

  const stmt = db.prepare(`
    UPDATE hero_slides SET
      subtitle = COALESCE(?, subtitle),
      title = COALESCE(?, title),
      description = ?,
      desktop_image = COALESCE(?, desktop_image),
      mobile_image = ?,
      object_position = COALESCE(?, object_position),
      primary_btn_text = ?,
      primary_btn_link = ?,
      secondary_btn_text = ?,
      secondary_btn_link = ?,
      is_active = COALESCE(?, is_active),
      sort_order = COALESCE(?, sort_order),
      updated_at = datetime('now', 'localtime')
    WHERE id = ?
  `);

  stmt.run(
    data.subtitle ?? null,
    data.title ?? null,
    data.description ?? null,
    data.desktop_image ?? null,
    data.mobile_image ?? null,
    data.object_position ?? null,
    data.primary_btn_text ?? null,
    data.primary_btn_link ?? null,
    data.secondary_btn_text ?? null,
    data.secondary_btn_link ?? null,
    data.is_active ?? null,
    data.sort_order ?? null,
    id
  );

  revalidatePath('/');
  revalidatePath('/admin/hero');
  return { success: true };
}

export async function deleteHeroSlide(id: number) {
  await requireAdmin();
  const db = getDb();
  db.prepare('DELETE FROM hero_slides WHERE id = ?').run(id);
  
  revalidatePath('/');
  revalidatePath('/admin/hero');
  return { success: true };
}

export async function toggleHeroSlideActive(id: number, isActive: boolean) {
  await requireAdmin();
  const db = getDb();
  db.prepare("UPDATE hero_slides SET is_active = ?, updated_at = datetime('now', 'localtime') WHERE id = ?").run(isActive ? 1 : 0, id);
  
  revalidatePath('/');
  revalidatePath('/admin/hero');
  return { success: true };
}

export async function updateHeroSlideOrders(updates: { id: number; sort_order: number }[]) {
  await requireAdmin();
  const db = getDb();
  const updateStmt = db.prepare("UPDATE hero_slides SET sort_order = ?, updated_at = datetime('now', 'localtime') WHERE id = ?");
  
  const updateMany = db.transaction((items) => {
    for (const item of items) {
      updateStmt.run(item.sort_order, item.id);
    }
  });
  
  updateMany(updates);
  
  revalidatePath('/');
  revalidatePath('/admin/hero');
  return { success: true };
}

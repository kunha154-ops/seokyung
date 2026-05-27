'use server'

import { getDb } from '@/lib/db'
import { getCurrentUser } from '@/app/actions/post-actions'

export async function updateUserStatus(userId: number, status: 'approved' | 'pending' | 'suspended' | 'rejected') {
  const user = await getCurrentUser();
  
  if (!user?.isAdmin) {
    return { success: false, error: '관리자 권한이 없습니다.' };
  }

  const db = getDb();
  
  try {
    db.prepare('UPDATE users SET status = ? WHERE id = ?').run(status, userId);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: '상태 변경 중 오류가 발생했습니다.' };
  }
}

export async function getUsers(page = 1, limit = 20, search = '', statusFilter = '') {
  const user = await getCurrentUser();
  
  if (!user?.isAdmin) {
    return { users: [], total: 0, totalPages: 0 };
  }

  const db = getDb();
  const offset = (page - 1) * limit;

  let query = 'SELECT id, username, name, email, church, position, phone, status, created_at, last_login FROM users WHERE 1=1';
  let countQuery = 'SELECT COUNT(*) as count FROM users WHERE 1=1';
  const params: any[] = [];

  if (search) {
    query += ' AND (name LIKE ? OR username LIKE ? OR church LIKE ?)';
    countQuery += ' AND (name LIKE ? OR username LIKE ? OR church LIKE ?)';
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  if (statusFilter) {
    query += ' AND status = ?';
    countQuery += ' AND status = ?';
    params.push(statusFilter);
  }

  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  
  const users = db.prepare(query).all(...params, limit, offset) as any[];
  const { count } = db.prepare(countQuery).get(...params) as { count: number };

  return {
    users,
    total: count,
    totalPages: Math.ceil(count / limit)
  };
}

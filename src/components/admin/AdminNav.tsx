'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logout } from '@/app/actions/auth';
import styles from './AdminNav.module.css';

const ADMIN_MENUS = [
  { label: '대시보드', href: '/admin', exact: true },
  { label: '공지사항', href: '/admin/notices' },
  { label: '노회 소식', href: '/admin/news' },
  { label: '포토 갤러리', href: '/admin/gallery' },
  { label: '영상 갤러리', href: '/admin/videos' },
  { label: '자료실', href: '/admin/resources' },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className={styles.adminNav}>
      <div className={styles.navContainer}>
        <div className={styles.logo}>
          <Link href="/admin">서경노회 관리자</Link>
        </div>
        <div className={styles.menuList}>
          {ADMIN_MENUS.map((menu) => {
            const isActive = menu.exact 
              ? pathname === menu.href
              : pathname?.startsWith(menu.href);
              
            return (
              <Link 
                key={menu.href} 
                href={menu.href}
                className={`${styles.menuItem} ${isActive ? styles.active : ''}`}
              >
                {menu.label}
              </Link>
            );
          })}
        </div>
        <div className={styles.logoutBtn} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Link href="/">홈페이지로</Link>
          <form action={logout} style={{ margin: 0, padding: 0 }}>
            <button type="submit" style={{ 
              background: 'transparent', border: '1px solid rgba(255, 255, 255, 0.3)', 
              color: 'rgba(255, 255, 255, 0.8)', padding: '0.4rem 0.8rem', 
              borderRadius: '4px', fontSize: '0.85rem', cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}>로그아웃</button>
          </form>
        </div>
      </div>
    </nav>
  );
}

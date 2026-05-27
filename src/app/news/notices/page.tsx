import Link from "next/link";
import SubPageLayout from "@/components/SubPageLayout";
import SearchBar from "@/components/common/SearchBar";
import styles from "./notices.module.css";
import { getNotices } from "@/lib/queries";

const NEWS_MENU = [
  { label: "공지사항", href: "/news/notices", active: true },
  { label: "노회 소식", href: "/news/updates" },
];

interface PageProps {
  searchParams: Promise<{ page?: string; search?: string }>;
}

export const metadata = { title: "공지사항" };
export const dynamic = 'force-dynamic';

import { cookies } from "next/headers";

export default async function NoticesPage({ searchParams }: PageProps) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  const isLoggedIn = !!token;

  const params = await searchParams;
  const page = Number(params.page) || 1;
  const search = params.search || '';
  const { notices, total, totalPages } = getNotices(page, 10, search);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  };

  return (
    <SubPageLayout
      title="공지사항"
      breadcrumbs={[
        { label: "소식", href: "/news" },
        { label: "공지사항" },
      ]}
      sideMenu={NEWS_MENU}
    >
      <div className={styles.listWrap}>
        {/* Header Actions */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem', justifyContent: 'space-between' }}>
          <SearchBar basePath="/news/notices" placeholder="제목 또는 본문으로 검색" />
          {isLoggedIn && (
            <Link 
              href="/news/notices/write" 
              style={{ 
                padding: '0.65rem 1.25rem', 
                backgroundColor: 'var(--color-primary)', 
                color: 'white', 
                borderRadius: 'var(--radius)', 
                fontSize: '0.9rem', 
                fontWeight: 600,
                whiteSpace: 'nowrap'
              }}
            >
              + 글쓰기
            </Link>
          )}
        </div>

        {/* Count */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', color: 'var(--color-text-muted)', fontSize: 'var(--fs-sm)', borderBottom: '1px solid var(--color-border-light)', paddingBottom: '0.75rem' }}>
          <span>총 <strong style={{ color: 'var(--color-primary)' }}>{total}</strong>건</span>
          {search && <span>&ldquo;{search}&rdquo; 검색 결과</span>}
        </div>

        {/* Table */}
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.thNum}>번호</th>
                <th className={styles.thTitle}>제목</th>
                <th className={styles.thDate}>등록일</th>
                <th className={styles.thViews}>조회</th>
              </tr>
            </thead>
            <tbody>
              {notices.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                    {search ? `"${search}"에 대한 검색 결과가 없습니다.` : '등록된 공지사항이 없습니다.'}
                  </td>
                </tr>
              ) : (
                notices.map((item) => (
                  <tr key={item.id} className={item.is_pinned ? styles.pinned : ""}>
                    <td className={styles.tdNum}>
                      {item.is_pinned ? (
                        <span className={styles.pinnedBadge}>공지</span>
                      ) : (
                        item.id
                      )}
                    </td>
                    <td className={styles.tdTitle}>
                      <Link href={`/news/notices/${item.id}`}>
                        {item.title}
                      </Link>
                    </td>
                    <td className={styles.tdDate}>{formatDate(item.created_at)}</td>
                    <td className={styles.tdViews}>{item.views}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className={styles.pagination}>
            <Link
              href={`/news/notices?page=${page - 1}${search ? `&search=${search}` : ''}`}
              className={`${styles.pageBtn} ${page <= 1 ? styles.pageBtnDisabled : ''}`}
              aria-disabled={page <= 1}
              {...(page <= 1 ? { tabIndex: -1, onClick: (e: React.MouseEvent) => e.preventDefault() } : {})}
            >
              ‹ 이전
            </Link>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/news/notices?page=${p}${search ? `&search=${search}` : ''}`}
                className={`${styles.pageBtn} ${p === page ? styles.pageBtnActive : ''}`}
              >
                {p}
              </Link>
            ))}
            <Link
              href={`/news/notices?page=${page + 1}${search ? `&search=${search}` : ''}`}
              className={`${styles.pageBtn} ${page >= totalPages ? styles.pageBtnDisabled : ''}`}
              aria-disabled={page >= totalPages}
              {...(page >= totalPages ? { tabIndex: -1, onClick: (e: React.MouseEvent) => e.preventDefault() } : {})}
            >
              다음 ›
            </Link>
          </div>
        )}
      </div>
    </SubPageLayout>
  );
}

import Link from "next/link";
import SubPageLayout from "@/components/SubPageLayout";
import SearchBar from "@/components/common/SearchBar";
import styles from "../notices/notices.module.css";
import { getNewsList } from "@/lib/queries";

const NEWS_MENU = [
  { label: "공지사항", href: "/news/notices" },
  { label: "노회 소식", href: "/news/updates", active: true },
];

export const metadata = { title: "노회 소식" };
export const dynamic = 'force-dynamic';

import { getCurrentUser } from "@/app/actions/post-actions";

interface PageProps {
  searchParams: Promise<{ page?: string; search?: string }>;
}

export default async function UpdatesPage({ searchParams }: PageProps) {
  const user = await getCurrentUser();
  const canWrite = user?.isAdmin || user?.status === 'approved';

  const params = await searchParams;
  const page = Number(params.page) || 1;
  const search = params.search || '';
  const { news, total, totalPages } = getNewsList(page, 20, search);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  };

  return (
    <SubPageLayout
      title="노회 소식"
      breadcrumbs={[
        { label: "소식", href: "/news" },
        { label: "노회 소식" },
      ]}
      sideMenu={NEWS_MENU}
    >
      <div className={styles.listWrap}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem', justifyContent: 'space-between' }}>
          <SearchBar basePath="/news/updates" placeholder="제목 또는 본문으로 검색" />
          {canWrite && (
            <Link 
              href="/news/updates/write" 
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

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', color: 'var(--color-text-muted)', fontSize: 'var(--fs-sm)', borderBottom: '1px solid var(--color-border-light)', paddingBottom: '0.75rem' }}>
          <span>총 <strong style={{ color: 'var(--color-primary)' }}>{total}</strong>건</span>
          {search && <span>&ldquo;{search}&rdquo; 검색 결과</span>}
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          {news.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
              {search ? `"${search}"에 대한 검색 결과가 없습니다.` : '등록된 소식이 없습니다.'}
            </div>
          ) : (
            news.map((item) => (
              <div key={item.id} style={{ border: '1px solid var(--color-border-light)', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-surface)' }}>
                <Link href={`/news/updates/${item.id}`} style={{ display: 'block', position: 'relative', height: '180px', backgroundColor: '#f3f4f6' }}>
                  {item.thumbnail_url ? (
                    <img src={item.thumbnail_url} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: '2rem' }}>
                      📰
                    </div>
                  )}
                </Link>
                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', fontWeight: 600, lineHeight: 1.4, flexGrow: 1 }}>
                    <Link href={`/news/updates/${item.id}`} style={{ color: 'var(--color-text)' }}>{item.title}</Link>
                  </h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                    <span>{formatDate(item.created_at)}</span>
                    <span>조회 {item.views}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className={styles.pagination}>
            <Link
              href={`/news/updates?page=${page - 1}${search ? `&search=${search}` : ''}`}
              className={`${styles.pageBtn} ${page <= 1 ? styles.pageBtnDisabled : ''}`}
              aria-disabled={page <= 1}
              {...(page <= 1 ? { tabIndex: -1, onClick: (e: React.MouseEvent) => e.preventDefault() } : {})}
            >
              ‹ 이전
            </Link>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/news/updates?page=${p}${search ? `&search=${search}` : ''}`}
                className={`${styles.pageBtn} ${p === page ? styles.pageBtnActive : ''}`}
              >
                {p}
              </Link>
            ))}
            <Link
              href={`/news/updates?page=${page + 1}${search ? `&search=${search}` : ''}`}
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

import Link from "next/link";
import SubPageLayout from "@/components/SubPageLayout";
import SearchBar from "@/components/common/SearchBar";
import styles from "../resources.module.css";
import { getResources } from "@/lib/queries";

export const dynamic = 'force-dynamic';

const CATEGORIES = [
  { id: "forms", label: "행정서식" },
  { id: "requests", label: "행정처리요청" },
  { id: "general", label: "일반자료실" },
  { id: "resolutions", label: "의사결의서" },
  { id: "minutes-council", label: "의사회의록" },
  { id: "minutes-executive", label: "임원회의록" },
  { id: "court", label: "재판국자료" },
  { id: "official-documents", label: "공문수발" },
  { id: "scans", label: "스켄자료" },
];

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const p = await params;
  const category = CATEGORIES.find(c => c.id === p.category) || CATEGORIES[0];
  return { title: category.label };
}

interface PageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string; search?: string }>;
}

import { cookies } from "next/headers";

export default async function ResourcesCategoryPage({ params, searchParams }: PageProps) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  const isLoggedIn = !!token;

  const p = await params;
  const sp = await searchParams;
  const categoryId = p.category;
  const currentCategory = CATEGORIES.find(c => c.id === categoryId) || CATEGORIES[0];
  
  const page = Number(sp.page) || 1;
  const search = sp.search || '';
  
  const { resources, total, totalPages } = getResources(categoryId, page, 10, search);

  const RES_MENU = CATEGORIES.map(c => ({
    label: c.label,
    href: `/resources/${c.id}`,
    active: c.id === categoryId
  }));

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  };

  return (
    <SubPageLayout
      title={currentCategory.label}
      breadcrumbs={[
        { label: "자료실", href: "/resources" },
        { label: currentCategory.label },
      ]}
      sideMenu={RES_MENU}
    >
      <div className={styles.wrap}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem', justifyContent: 'space-between' }}>
          <SearchBar basePath={`/resources/${categoryId}`} placeholder="제목 또는 파일명으로 검색" />
          {isLoggedIn && (
            <Link 
              href={`/resources/${categoryId}/write`} 
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

        {/* Filters specific to forms, if needed, can be rendered here conditionally */}
        {categoryId === 'forms' && (
          <div className={styles.filters} style={{ marginBottom: '1.5rem' }}>
            <button className={`${styles.filterBtn} ${styles.filterBtnActive}`}>전체</button>
            <button className={styles.filterBtn}>행정</button>
            <button className={styles.filterBtn}>청원</button>
            <button className={styles.filterBtn}>고시</button>
          </div>
        )}

        {/* List */}
        <div className={styles.list}>
          {resources.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              color: 'var(--color-text-muted)',
            }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3, marginBottom: '1.5rem' }}>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <path d="M14 2v6h6"/>
                <path d="M16 13H8"/>
                <path d="M16 17H8"/>
                <path d="M10 9H8"/>
              </svg>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-text-secondary)', marginBottom: '0.75rem' }}>
                {search ? `"${search}" 검색 결과가 없습니다.` : '등록된 자료가 없습니다.'}
              </h3>
            </div>
          ) : (
            resources.map((item) => (
              <Link href={`/resources/${categoryId}/${item.id}`} key={item.id} className={styles.item}>
                <div className={styles.itemInfo}>
                  <div className={styles.itemTitle}>
                    {item.title}
                  </div>
                  <div className={styles.itemMeta}>
                    <span className={styles.badge} style={categoryId === 'minutes' ? { backgroundColor: '#f3e8ff', color: '#7e22ce' } : {}}>{currentCategory.label}</span>
                    <span>{formatDate(item.created_at)}</span>
                    {item.attachment_count && item.attachment_count > 0 ? (
                      <span className={styles.attachmentBadge}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                        첨부파일 {item.attachment_count}개
                      </span>
                    ) : null}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className={styles.pagination} style={{ marginTop: '2rem' }}>
            <Link
              href={`/resources/${categoryId}?page=${page - 1}${search ? `&search=${search}` : ''}`}
              className={`${styles.pageBtn} ${page <= 1 ? styles.pageBtnDisabled : ''}`}
              aria-disabled={page <= 1}
              {...(page <= 1 ? { tabIndex: -1, onClick: (e: React.MouseEvent) => e.preventDefault() } : {})}
            >
              ‹ 이전
            </Link>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/resources/${categoryId}?page=${p}${search ? `&search=${search}` : ''}`}
                className={`${styles.pageBtn} ${p === page ? styles.pageBtnActive : ''}`}
              >
                {p}
              </Link>
            ))}
            <Link
              href={`/resources/${categoryId}?page=${page + 1}${search ? `&search=${search}` : ''}`}
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

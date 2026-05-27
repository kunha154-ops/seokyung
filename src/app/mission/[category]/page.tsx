import Link from "next/link";
import SubPageLayout from "@/components/SubPageLayout";
import SearchBar from "@/components/common/SearchBar";
import { getResources } from "@/lib/queries";
import { cookies } from "next/headers";
import styles from "../Mission.module.css";

export const dynamic = 'force-dynamic';

const CATEGORIES = [
  { id: "trends", label: "선교사동향" },
  { id: "finance", label: "재정보고" },
  { id: "notices", label: "공지사항" },
  { id: "donations", label: "특별후원금" },
  { id: "activities", label: "사업활동" },
];

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const p = await params;
  const category = CATEGORIES.find(c => c.id === p.category) || CATEGORIES[0];
  return { title: `선교위원회 - ${category.label}` };
}

interface PageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string; search?: string }>;
}

export default async function MissionCategoryPage({ params, searchParams }: PageProps) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  const isLoggedIn = !!token;

  const p = await params;
  const sp = await searchParams;
  const categoryId = p.category;
  const currentCategory = CATEGORIES.find(c => c.id === categoryId) || CATEGORIES[0];

  const page = Number(sp.page) || 1;
  const search = sp.search || '';

  // Use resources table with mission-prefixed category
  const missionCategory = `mission-${categoryId}`;
  const { resources, total, totalPages } = getResources(missionCategory, page, 10, search);

  const MISSION_MENU = CATEGORIES.map(c => ({
    label: c.label,
    href: `/mission/${c.id}`,
    active: c.id === categoryId,
  }));

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  };

  return (
    <SubPageLayout
      title={`선교위원회`}
      breadcrumbs={[
        { label: "선교위원회", href: "/mission" },
        { label: currentCategory.label },
      ]}
      sideMenu={MISSION_MENU}
    >
      <div className={styles.container}>
        <div className={styles.header}>
          <SearchBar basePath={`/mission/${categoryId}`} placeholder="제목 또는 내용으로 검색" />
          {isLoggedIn && (
            <Link href={`/mission/${categoryId}/write`} className={styles.writeBtn}>
              + 글쓰기
            </Link>
          )}
        </div>

        <div className={styles.metaInfo}>
          <span>총 <strong style={{ color: 'var(--color-primary)' }}>{total}</strong>건</span>
          {search && <span>&ldquo;{search}&rdquo; 검색 결과</span>}
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{ width: '70px', textAlign: 'center' }}>순서</th>
                <th style={{ textAlign: 'left' }}>제목</th>
                <th style={{ width: '80px', textAlign: 'center' }}>게시자</th>
                <th style={{ width: '100px', textAlign: 'center' }}>게시일자</th>
                <th style={{ width: '50px', textAlign: 'center' }}>첨부</th>
              </tr>
            </thead>
            <tbody>
              {resources.length === 0 ? (
                <tr>
                  <td colSpan={5} className={styles.emptyState}>
                    {search ? `"${search}" 검색 결과가 없습니다.` : '등록된 자료가 없습니다.'}
                  </td>
                </tr>
              ) : (
                resources.map((item, idx) => (
                  <tr key={item.id}>
                    <td className={styles.noCell} style={{ textAlign: 'center' }}>{total - ((page - 1) * 10 + idx)}</td>
                    <td className={styles.titleCell}>
                      <a href={item.file_path || '#'} target="_blank" rel="noopener noreferrer" className={styles.titleLink}>
                        {item.title}
                      </a>
                    </td>
                    <td className={styles.authorCell} style={{ textAlign: 'center' }}>관리자</td>
                    <td className={styles.dateCell} style={{ textAlign: 'center' }}>{formatDate(item.created_at)}</td>
                    <td className={styles.attachCell} style={{ textAlign: 'center' }}>
                      {item.file_path && (
                        <span style={{ color: 'var(--color-primary)', fontSize: '1.1rem' }}>📎</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className={styles.pagination}>
            {page > 1 && (
              <Link href={`/mission/${categoryId}?page=${page - 1}${search ? `&search=${search}` : ''}`} className={styles.pageBtn}>‹ 이전</Link>
            )}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <Link key={p} href={`/mission/${categoryId}?page=${p}${search ? `&search=${search}` : ''}`} className={`${styles.pageBtn} ${p === page ? styles.pageBtnActive : ''}`}>{p}</Link>
            ))}
            {page < totalPages && (
              <Link href={`/mission/${categoryId}?page=${page + 1}${search ? `&search=${search}` : ''}`} className={styles.pageBtn}>다음 ›</Link>
            )}
          </div>
        )}
      </div>
    </SubPageLayout>
  );
}

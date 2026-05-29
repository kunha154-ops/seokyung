import Link from 'next/link';
import { getDb } from '@/lib/db';
import AdminTopBar from '../AdminTopBar';
import styles from '../admin.module.css';

export const dynamic = 'force-dynamic';

const COMMITTEE_MAP: Record<string, string> = {
  'mission': '선교위원회',
  'self_reliance': '자립위원회',
  'education': '교육위원회',
};

const BOARD_MAP: Record<string, string> = {
  'trends': '선교사동향',
  'finance': '재정보고',
  'notices': '공지사항',
  'donations': '특별후원금',
  'activities': '사업활동',
};

export default async function AdminCommitteePage({
  searchParams
}: {
  searchParams: Promise<{ page?: string; committee?: string; search?: string }>;
}) {
  const sp = await searchParams;
  const page = Number(sp.page) || 1;
  const pageSize = 20;
  const committeeFilter = sp.committee || '';
  const search = sp.search || '';
  
  const db = getDb();
  
  let whereClause = "WHERE 1=1";
  const params: any[] = [];
  
  if (committeeFilter) {
    whereClause += " AND cp.committee_type = ?";
    params.push(committeeFilter);
  }
  
  if (search) {
    whereClause += " AND (cp.title LIKE ? OR cp.content LIKE ?)";
    params.push(`%${search}%`, `%${search}%`);
  }
  
  const countRow = db.prepare(`SELECT COUNT(*) as total FROM committee_posts cp ${whereClause}`).get(...params) as { total: number };
  const total = countRow.total;
  const totalPages = Math.ceil(total / pageSize);
  const offset = (page - 1) * pageSize;
  
  const posts = db.prepare(`
    SELECT cp.id, cp.committee_type, cp.board_type, cp.title, cp.status, cp.views, cp.created_at, u.name as author_name
    FROM committee_posts cp
    LEFT JOIN users u ON cp.author_id = u.id
    ${whereClause}
    ORDER BY cp.created_at DESC
    LIMIT ? OFFSET ?
  `).all(...params, pageSize, offset) as any[];

  return (
    <div className={styles.adminPage}>
      <AdminTopBar />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.pageTitle}>위원회 게시판 통합 관리</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>선교, 자립, 교육위원회 게시물을 전체적으로 관리할 수 있습니다.</p>
        </div>

        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <form style={{ display: 'flex', gap: '1rem', width: '100%', alignItems: 'center' }} method="GET" action="/admin/committee">
            <select name="committee" defaultValue={committeeFilter} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}>
              <option value="">전체 위원회</option>
              <option value="mission">선교위원회</option>
              <option value="self_reliance">자립위원회</option>
              <option value="education">교육위원회</option>
            </select>
            <input type="text" name="search" defaultValue={search} placeholder="제목 또는 내용 검색" style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd', flex: 1, minWidth: '200px' }} />
            <button type="submit" className={styles.actionBtn} style={{ margin: 0, padding: '0.6rem 1.2rem' }}>검색</button>
            <Link href="/admin/committee" style={{ padding: '0.6rem 1.2rem', background: '#f3f4f6', color: '#374151', borderRadius: '4px', textDecoration: 'none' }}>초기화</Link>
          </form>
        </div>

        <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '1rem', fontSize: '0.9rem', color: '#6b7280' }}>ID</th>
                <th style={{ padding: '1rem', fontSize: '0.9rem', color: '#6b7280' }}>분류</th>
                <th style={{ padding: '1rem', fontSize: '0.9rem', color: '#6b7280' }}>제목</th>
                <th style={{ padding: '1rem', fontSize: '0.9rem', color: '#6b7280' }}>작성자</th>
                <th style={{ padding: '1rem', fontSize: '0.9rem', color: '#6b7280' }}>등록일</th>
                <th style={{ padding: '1rem', fontSize: '0.9rem', color: '#6b7280' }}>조회</th>
                <th style={{ padding: '1rem', fontSize: '0.9rem', color: '#6b7280' }}>상태</th>
                <th style={{ padding: '1rem', fontSize: '0.9rem', color: '#6b7280' }}>관리</th>
              </tr>
            </thead>
            <tbody>
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>등록된 게시물이 없습니다.</td>
                </tr>
              ) : (
                posts.map(post => {
                  const basePath = post.committee_type === 'mission' ? '/mission' : post.committee_type === 'self_reliance' ? '/self-reliance' : '/education';
                  
                  return (
                    <tr key={post.id} style={{ borderBottom: '1px solid #f3f4f6', opacity: post.status === 'hidden' ? 0.6 : 1 }}>
                      <td style={{ padding: '1rem' }}>{post.id}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ display: 'inline-block', padding: '0.2rem 0.5rem', background: '#e0f2fe', color: '#0369a1', borderRadius: '4px', fontSize: '0.8rem', marginRight: '4px' }}>
                          {COMMITTEE_MAP[post.committee_type] || post.committee_type}
                        </span>
                        <span style={{ display: 'inline-block', padding: '0.2rem 0.5rem', background: '#f3f4f6', color: '#4b5563', borderRadius: '4px', fontSize: '0.8rem' }}>
                          {BOARD_MAP[post.board_type] || post.board_type}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        <Link href={`${basePath}/${post.board_type}/${post.id}`} target="_blank" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 500 }}>
                          {post.title}
                        </Link>
                      </td>
                      <td style={{ padding: '1rem' }}>{post.author_name || '관리자'}</td>
                      <td style={{ padding: '1rem', color: '#6b7280', fontSize: '0.9rem' }}>{post.created_at.split(' ')[0]}</td>
                      <td style={{ padding: '1rem' }}>{post.views}</td>
                      <td style={{ padding: '1rem' }}>
                        {post.status === 'public' 
                          ? <span style={{ color: '#059669', fontSize: '0.9rem', fontWeight: 600 }}>공개</span> 
                          : <span style={{ color: '#dc2626', fontSize: '0.9rem', fontWeight: 600 }}>숨김</span>}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <Link href={`${basePath}/${post.board_type}/${post.id}/edit`} className={styles.actionBtn} style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', margin: 0 }}>수정</Link>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem', gap: '0.5rem' }}>
            {page > 1 && <Link href={`/admin/committee?page=${page-1}${committeeFilter ? `&committee=${committeeFilter}`:''}${search ? `&search=${search}`:''}`} style={{ padding: '0.5rem 1rem', border: '1px solid #ddd', borderRadius: '4px', textDecoration: 'none', color: '#333' }}>이전</Link>}
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <Link 
                key={p} 
                href={`/admin/committee?page=${p}${committeeFilter ? `&committee=${committeeFilter}`:''}${search ? `&search=${search}`:''}`} 
                style={{ 
                  padding: '0.5rem 1rem', 
                  border: '1px solid #ddd', 
                  borderRadius: '4px', 
                  textDecoration: 'none', 
                  background: p === page ? 'var(--color-primary)' : '#fff',
                  color: p === page ? '#fff' : '#333',
                  fontWeight: p === page ? 600 : 400
                }}
              >
                {p}
              </Link>
            ))}
            
            {page < totalPages && <Link href={`/admin/committee?page=${page+1}${committeeFilter ? `&committee=${committeeFilter}`:''}${search ? `&search=${search}`:''}`} style={{ padding: '0.5rem 1rem', border: '1px solid #ddd', borderRadius: '4px', textDecoration: 'none', color: '#333' }}>다음</Link>}
          </div>
        )}
      </div>
    </div>
  );
}

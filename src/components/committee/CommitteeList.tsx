'use client'

import Link from "next/link";
import SearchBar from "@/components/common/SearchBar";
import styles from "./Committee.module.css";
import { CommitteePost } from "@/lib/queries";

interface CommitteeListProps {
  committeeType: 'mission' | 'self_reliance' | 'education';
  boardType: string;
  posts: CommitteePost[];
  total: number;
  page: number;
  totalPages: number;
  search: string;
  canWrite: boolean;
  basePath: string; // e.g. /mission
}

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
};

export default function CommitteeList({
  committeeType,
  boardType,
  posts,
  total,
  page,
  totalPages,
  search,
  canWrite,
  basePath,
}: CommitteeListProps) {
  const boardPath = `${basePath}/${boardType}`;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <SearchBar basePath={boardPath} placeholder="제목 또는 내용으로 검색" />
        {canWrite && (
          <Link href={`${boardPath}/write`} className={styles.writeBtn}>
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
              <th style={{ width: '100px', textAlign: 'center' }}>게시자</th>
              <th style={{ width: '100px', textAlign: 'center' }}>게시일자</th>
              <th style={{ width: '50px', textAlign: 'center' }}>첨부</th>
              <th style={{ width: '50px', textAlign: 'center' }}>조회</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td colSpan={6} className={styles.emptyState}>
                  {search ? `"${search}" 검색 결과가 없습니다.` : '등록된 글이 없습니다.'}
                </td>
              </tr>
            ) : (
              posts.map((item, idx) => (
                <tr key={item.id} className={item.status === 'hidden' ? styles.hiddenRow : ''}>
                  <td className={styles.noCell} style={{ textAlign: 'center' }}>
                    {item.status === 'hidden' ? <span style={{color: 'red', fontSize: '0.8rem'}}>[숨김]</span> : total - ((page - 1) * 10 + idx)}
                  </td>
                  <td className={styles.titleCell}>
                    <Link href={`${boardPath}/${item.id}`} className={styles.titleLink}>
                      {item.title}
                    </Link>
                  </td>
                  <td className={styles.authorCell} style={{ textAlign: 'center' }}>{item.author_name || '관리자'}</td>
                  <td className={styles.dateCell} style={{ textAlign: 'center' }}>{formatDate(item.created_at)}</td>
                  <td className={styles.attachCell} style={{ textAlign: 'center' }}>
                    {item.attachment_count && item.attachment_count > 0 ? (
                      <span style={{ color: 'var(--color-primary)', fontSize: '1.1rem' }}>📎</span>
                    ) : ''}
                  </td>
                  <td className={styles.viewsCell} style={{ textAlign: 'center' }}>{item.views}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          {page > 1 && (
            <Link href={`${boardPath}?page=${page - 1}${search ? `&search=${search}` : ''}`} className={styles.pageBtn}>‹ 이전</Link>
          )}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <Link key={p} href={`${boardPath}?page=${p}${search ? `&search=${search}` : ''}`} className={`${styles.pageBtn} ${p === page ? styles.pageBtnActive : ''}`}>{p}</Link>
          ))}
          {page < totalPages && (
            <Link href={`${boardPath}?page=${page + 1}${search ? `&search=${search}` : ''}`} className={styles.pageBtn}>다음 ›</Link>
          )}
        </div>
      )}
    </div>
  );
}

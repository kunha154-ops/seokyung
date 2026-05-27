import Link from "next/link";
import AdminTopBar from "../AdminTopBar";
import styles from "../admin.module.css";
import { getResources } from "@/lib/queries";
import { deleteResourceAction } from "@/app/actions/resource-crud";
import AdminStatusButton from "./AdminStatusButton";

export const dynamic = 'force-dynamic';

export default function AdminResourcesPage() {
  const { resources: forms } = getResources('forms');
  const { resources: minutes } = getResources('minutes');
  const allResources = [...forms, ...minutes].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  };

  return (
    <div className={styles.adminPage}>
      <AdminTopBar />
      <div className={styles.container}>
        

        <div className={styles.header}>
          <h1 className={styles.pageTitle}>자료실 관리 <span style={{ fontSize: '0.85rem', fontWeight: 400, color: 'var(--color-text-muted)' }}>({allResources.length}건)</span></h1>
          <Link href="/admin/resources/new" className={styles.newBtn}>
            + 새 자료 업로드
          </Link>
        </div>

        <div className={styles.card}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{ width: '80px' }}>카테고리</th>
                <th>제목</th>
                <th style={{ width: '60px' }}>상태</th>
                <th style={{ width: '80px' }}>크기</th>
                <th style={{ width: '100px' }}>등록일</th>
                <th style={{ width: '70px' }}>다운로드</th>
                <th style={{ width: '150px' }}>관리</th>
              </tr>
            </thead>
            <tbody>
              {allResources.length === 0 ? (
                <tr>
                  <td colSpan={7} className={styles.emptyState}>등록된 자료가 없습니다.</td>
                </tr>
              ) : (
                allResources.map((item) => (
                  <tr key={item.id} style={{ opacity: (item as any).status === 'deleted' ? 0.5 : 1 }}>
                    <td>
                      <span style={{ 
                        padding: '0.2rem 0.5rem', 
                        backgroundColor: item.category === 'forms' ? '#e0f2fe' : '#f3e8ff',
                        color: item.category === 'forms' ? '#0369a1' : '#7e22ce',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 600
                      }}>
                        {item.category === 'forms' ? '행정서식' : '회의록'}
                      </span>
                    </td>
                    <td className={styles.titleCell}>{item.title}</td>
                    <td className={styles.idCell}>
                      <AdminStatusButton boardType="resources" postId={item.id} currentStatus={(item as any).status || 'published'} />
                    </td>
                    <td className={styles.sizeCell} style={{ color: '#6b7280', fontSize: '0.85rem' }}>{item.file_size || '-'}</td>
                    <td className={styles.dateCell}>{formatDate(item.created_at)}</td>
                    <td className={styles.viewsCell}>
                      <a href={(item as any).file_url} target="_blank" rel="noopener noreferrer" className={styles.editBtn} aria-label={`자료 ${item.id} 다운로드`}>다운로드</a>
                    </td>
                    <td className={styles.actionCell}>
                      <div className={styles.actionBtns}>
                        <form action={deleteResourceAction} style={{ display: 'inline' }}>
                          <input type="hidden" name="id" value={item.id} />
                          <input type="hidden" name="category" value={item.category} />
                          <button type="submit" className={styles.deleteBtn} aria-label={`자료 ${item.id} 삭제`}>삭제</button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

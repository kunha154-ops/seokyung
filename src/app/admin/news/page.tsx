import Link from "next/link";
import AdminTopBar from "../AdminTopBar";
import styles from "../admin.module.css";
import { getNewsList } from "@/lib/queries";
import { deleteNewsAction } from "@/app/actions/admin-crud";

export const dynamic = 'force-dynamic';

export default function AdminNewsPage() {
  const { news, total } = getNewsList(1, 100);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  };

  return (
    <div className={styles.adminPage}>
      <AdminTopBar />
      <div className={styles.container}>
        

        <div className={styles.header}>
          <h1 className={styles.pageTitle}>노회 소식 관리 <span style={{ fontSize: '0.85rem', fontWeight: 400, color: 'var(--color-text-muted)' }}>({total}건)</span></h1>
          <Link href="/admin/news/new" className={styles.newBtn}>
            + 새 소식 작성
          </Link>
        </div>

        <div className={styles.card}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{ width: '60px' }}>ID</th>
                <th>제목</th>
                <th style={{ width: '100px' }}>등록일</th>
                <th style={{ width: '70px' }}>조회</th>
                <th style={{ width: '100px' }}>관리</th>
              </tr>
            </thead>
            <tbody>
              {news.length === 0 ? (
                <tr>
                  <td colSpan={5} className={styles.emptyState}>등록된 소식이 없습니다.</td>
                </tr>
              ) : (
                news.map((item) => (
                  <tr key={item.id}>
                    <td className={styles.idCell}>{item.id}</td>
                    <td className={styles.titleCell}>{item.title}</td>
                    <td className={styles.dateCell}>{formatDate(item.created_at)}</td>
                    <td className={styles.viewsCell}>{item.views}</td>
                    <td className={styles.actionCell}>
                      <div className={styles.actionBtns}>
                        <Link href={`/admin/news/${item.id}/edit`} className={styles.editBtn} aria-label={`뉴스 ${item.id} 수정`}>수정</Link>
                        <form action={deleteNewsAction} style={{ display: 'inline' }}>
                          <input type="hidden" name="id" value={item.id} />
                          <button type="submit" className={styles.deleteBtn} aria-label={`뉴스 ${item.id} 삭제`}>삭제</button>
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

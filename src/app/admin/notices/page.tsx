import Link from "next/link";
import AdminTopBar from "../AdminTopBar";
import styles from "../admin.module.css";
import { getNotices } from "@/lib/queries";
import { deleteNoticeAction } from "@/app/actions/admin-crud";

export const dynamic = 'force-dynamic';

export default function AdminNoticesPage() {
  const { notices, total } = getNotices(1, 100);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  };

  return (
    <div className={styles.adminPage}>
      <AdminTopBar />
      <div className={styles.container}>
        

        <div className={styles.header}>
          <h1 className={styles.pageTitle}>공지사항 관리 <span style={{ fontSize: '0.85rem', fontWeight: 400, color: 'var(--color-text-muted)' }}>({total}건)</span></h1>
          <Link href="/admin/notices/new" className={styles.newBtn}>
            + 새 공지 작성
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
                <th style={{ width: '140px' }}>관리</th>
              </tr>
            </thead>
            <tbody>
              {notices.length === 0 ? (
                <tr>
                  <td colSpan={5} className={styles.emptyState}>등록된 공지사항이 없습니다.</td>
                </tr>
              ) : (
                notices.map((notice) => (
                  <tr key={notice.id}>
                    <td className={styles.idCell}>{notice.id}</td>
                    <td className={styles.titleCell}>
                      {notice.is_pinned ? <span className={styles.pinnedBadge}>고정</span> : null}
                      {notice.title}
                    </td>
                    <td className={styles.dateCell}>{formatDate(notice.created_at)}</td>
                    <td className={styles.viewsCell}>{notice.views}</td>
                    <td className={styles.actionCell}>
                      <div className={styles.actionBtns}>
                        <Link href={`/admin/notices/${notice.id}/edit`} className={styles.editBtn} aria-label={`공지사항 ${notice.id} 수정`}>수정</Link>
                        <form action={deleteNoticeAction} style={{ display: 'inline' }}>
                          <input type="hidden" name="id" value={notice.id} />
                          <button type="submit" className={styles.deleteBtn} aria-label={`공지사항 ${notice.id} 삭제`}>삭제</button>
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

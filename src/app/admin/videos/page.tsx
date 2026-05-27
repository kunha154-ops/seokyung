import Link from "next/link";
import AdminTopBar from "../AdminTopBar";
import styles from "../admin.module.css";
import { getGalleryPosts } from "@/lib/queries";
import { deleteVideoAction } from "@/app/actions/video-crud";

export const dynamic = 'force-dynamic';

export default function AdminVideosPage() {
  const { posts: videos, total } = getGalleryPosts('video', 1, 100);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  };

  return (
    <div className={styles.adminPage}>
      <AdminTopBar />
      <div className={styles.container}>
        

        <div className={styles.header}>
          <h1 className={styles.pageTitle}>영상 갤러리 관리 <span style={{ fontSize: '0.85rem', fontWeight: 400, color: 'var(--color-text-muted)' }}>({videos.length}개 영상)</span></h1>
          <Link href="/admin/videos/new" className={styles.newBtn}>
            + 새 영상 등록
          </Link>
        </div>

        <div className={styles.card}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{ width: '60px' }}>ID</th>
                <th>영상 제목</th>
                <th style={{ width: '200px' }}>YouTube ID</th>
                <th style={{ width: '100px' }}>등록일</th>
                <th style={{ width: '100px' }}>관리</th>
              </tr>
            </thead>
            <tbody>
              {videos.length === 0 ? (
                <tr>
                  <td colSpan={5} className={styles.emptyState}>등록된 영상이 없습니다.</td>
                </tr>
              ) : (
                videos.map((item) => (
                  <tr key={item.id}>
                    <td className={styles.idCell}>{item.id}</td>
                    <td className={styles.titleCell}>{item.title}</td>
                    <td className={styles.dateCell} style={{ color: '#6b7280', fontSize: '0.85rem' }}>{item.video_file_path}</td>
                    <td className={styles.dateCell}>{formatDate(item.created_at)}</td>
                    <td className={styles.actionCell}>
                      <div className={styles.actionBtns}>
                        <form action={deleteVideoAction} style={{ display: 'inline' }}>
                          <input type="hidden" name="id" value={item.id} />
                          <button type="submit" className={styles.deleteBtn} aria-label={`영상 ${item.id} 삭제`}>삭제</button>
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

import Link from "next/link";
import AdminTopBar from "../AdminTopBar";
import styles from "../admin.module.css";
import { getGalleryPosts } from "@/lib/queries";
import { deleteAlbumAction } from "@/app/actions/gallery-crud";

export const dynamic = 'force-dynamic';

export default function AdminGalleryPage() {
  const { posts: albums, total } = getGalleryPosts('photo', 1, 100);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  };

  return (
    <div className={styles.adminPage}>
      <AdminTopBar />
      <div className={styles.container}>
        

        <div className={styles.header}>
          <h1 className={styles.pageTitle}>포토 갤러리 관리 <span style={{ fontSize: '0.85rem', fontWeight: 400, color: 'var(--color-text-muted)' }}>({albums.length}개 앨범)</span></h1>
          <Link href="/admin/gallery/new" className={styles.newBtn}>
            + 새 앨범 생성
          </Link>
        </div>

        <div className={styles.card}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{ width: '60px' }}>ID</th>
                <th>앨범명</th>
                <th style={{ width: '100px' }}>등록일</th>
                <th style={{ width: '150px' }}>관리</th>
              </tr>
            </thead>
            <tbody>
              {albums.length === 0 ? (
                <tr>
                  <td colSpan={4} className={styles.emptyState}>등록된 앨범이 없습니다.</td>
                </tr>
              ) : (
                albums.map((item) => (
                  <tr key={item.id}>
                    <td className={styles.idCell}>{item.id}</td>
                    <td className={styles.titleCell}>{item.title}</td>
                    <td className={styles.dateCell}>{formatDate(item.created_at)}</td>
                    <td className={styles.actionCell}>
                      <div className={styles.actionBtns}>
                        <Link href={`/admin/gallery/${item.id}`} className={styles.editBtn} aria-label={`앨범 ${item.id} 사진 관리`}>사진 관리</Link>
                        <form action={deleteAlbumAction} style={{ display: 'inline' }}>
                          <input type="hidden" name="id" value={item.id} />
                          <button type="submit" className={styles.deleteBtn} aria-label={`앨범 ${item.id} 삭제`}>삭제</button>
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

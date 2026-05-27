import Link from "next/link";
import { notFound } from "next/navigation";
import AdminTopBar from "../../../AdminTopBar";
import styles from "../../../admin.module.css";
import { updateNoticeAction } from "@/app/actions/admin-crud";
import { getNoticeById } from "@/lib/queries";

export const dynamic = 'force-dynamic';

export default async function EditNoticePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const notice = getNoticeById(Number(id));

  if (!notice) notFound();

  return (
    <div className={styles.adminPage}>
      <AdminTopBar />
      <div className={styles.container}>
        

        <div className={styles.header}>
          <h1 className={styles.pageTitle}>공지사항 수정</h1>
        </div>

        <div className={styles.formCard}>
          <form action={updateNoticeAction}>
            <input type="hidden" name="id" value={notice.id} />

            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="title">제목</label>
              <input type="text" id="title" name="title" className={styles.formInput} defaultValue={notice.title} required />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="content">내용</label>
              <textarea id="content" name="content" className={styles.formTextarea} defaultValue={notice.content} required />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.checkboxRow}>
                <input type="checkbox" name="is_pinned" defaultChecked={notice.is_pinned === 1} />
                <span style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>상단 고정</span>
              </label>
            </div>

            <div className={styles.formActions}>
              <Link href="/admin/notices" className={styles.cancelBtn}>취소</Link>
              <button type="submit" className={styles.submitBtn}>수정 완료</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

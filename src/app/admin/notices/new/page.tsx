import Link from "next/link";
import AdminTopBar from "../../AdminTopBar";
import styles from "../../admin.module.css";
import { createNoticeAction } from "@/app/actions/admin-crud";

export default function NewNoticePage() {
  return (
    <div className={styles.adminPage}>
      <AdminTopBar />
      <div className={styles.container}>
        

        <div className={styles.header}>
          <h1 className={styles.pageTitle}>새 공지사항 작성</h1>
        </div>

        <div className={styles.formCard}>
          <form action={createNoticeAction}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="title">제목</label>
              <input type="text" id="title" name="title" className={styles.formInput} placeholder="공지사항 제목을 입력하세요" required />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="content">내용</label>
              <textarea id="content" name="content" className={styles.formTextarea} placeholder="공지사항 내용을 입력하세요" required />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.checkboxRow}>
                <input type="checkbox" name="is_pinned" />
                <span style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>상단 고정</span>
              </label>
            </div>

            <div className={styles.formActions}>
              <Link href="/admin/notices" className={styles.cancelBtn}>취소</Link>
              <button type="submit" className={styles.submitBtn}>등록</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

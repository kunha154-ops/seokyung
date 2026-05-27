import Link from "next/link";
import AdminTopBar from "../../AdminTopBar";
import styles from "../../admin.module.css";
import { createNewsAction } from "@/app/actions/admin-crud";

export default function NewNewsPage() {
  return (
    <div className={styles.adminPage}>
      <AdminTopBar />
      <div className={styles.container}>
        

        <div className={styles.header}>
          <h1 className={styles.pageTitle}>새 소식 작성</h1>
        </div>

        <div className={styles.formCard}>
          <form action={createNewsAction}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="title">제목</label>
              <input type="text" id="title" name="title" className={styles.formInput} placeholder="소식 제목을 입력하세요" required />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="content">내용</label>
              <textarea id="content" name="content" className={styles.formTextarea} placeholder="소식 내용을 입력하세요" required />
            </div>

            <div className={styles.formActions}>
              <Link href="/admin/news" className={styles.cancelBtn}>취소</Link>
              <button type="submit" className={styles.submitBtn}>등록</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

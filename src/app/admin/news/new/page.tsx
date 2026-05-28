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
              <textarea id="content" name="content" className={styles.formTextarea} placeholder="소식 내용을 입력하세요" required style={{ minHeight: '300px' }} />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="thumbnail">대표 이미지 (썸네일)</label>
              <input type="file" id="thumbnail" name="thumbnail" accept="image/jpeg, image/png, image/webp" className={styles.formInput} />
              <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.25rem' }}>* 16:9 또는 4:3 비율 권장 (최대 5MB). 확장자는 jpg, jpeg, png, webp만 허용됩니다.</p>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="bodyImages">본문 이미지 (여러 장 가능)</label>
              <input type="file" id="bodyImages" name="bodyImages" accept="image/jpeg, image/png, image/webp" className={styles.formInput} multiple />
              <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.25rem' }}>* 여러 이미지를 선택할 수 있습니다. 각 파일은 최대 5MB입니다.</p>
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

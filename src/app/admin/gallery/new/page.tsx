import Link from "next/link";
import AdminTopBar from "../../AdminTopBar";
import styles from "../../admin.module.css";
import { createAlbumAction } from "@/app/actions/gallery-crud";

export default function NewAlbumPage() {
  return (
    <div className={styles.adminPage}>
      <AdminTopBar />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.pageTitle}>새 앨범 생성</h1>
        </div>

        <div className={styles.formCard}>
          <form action={createAlbumAction}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="title">앨범명 <span style={{color: 'red'}}>*</span></label>
              <input type="text" id="title" name="title" className={styles.formInput} placeholder="앨범명을 입력하세요" required />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="description">설명 (선택)</label>
              <textarea id="description" name="description" className={styles.formTextarea} placeholder="앨범에 대한 설명을 입력하세요" rows={4} style={{ minHeight: '100px' }} />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="coverImage">커버 이미지 (선택)</label>
              <input type="file" id="coverImage" name="coverImage" accept="image/jpeg, image/png, image/webp" className={styles.formInput} />
              <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.25rem' }}>* 앨범 목록에 표시될 대표 이미지를 선택하세요. (최대 5MB)</p>
            </div>

            <div className={styles.formActions}>
              <Link href="/admin/gallery" className={styles.cancelBtn}>취소</Link>
              <button type="submit" className={styles.submitBtn}>앨범 생성</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

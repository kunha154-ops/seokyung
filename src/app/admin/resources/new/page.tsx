import Link from "next/link";
import AdminTopBar from "../../AdminTopBar";
import styles from "../../admin.module.css";
import { createResourceAction } from "@/app/actions/resource-crud";

export default function NewResourcePage() {
  return (
    <div className={styles.adminPage}>
      <AdminTopBar />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.pageTitle}>새 자료 업로드</h1>
          <Link href="/admin/resources" className={styles.backBtn}>
            목록으로
          </Link>
        </div>

        <div className={styles.card}>
          <form action={createResourceAction} className={styles.form}>
            
            <div className={styles.formGroup}>
              <label htmlFor="category">카테고리</label>
              <select 
                id="category" 
                name="category" 
                required 
                className={styles.input} 
              >
                <option value="forms">행정서식</option>
                <option value="minutes">회의록</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="title">자료 제목</label>
              <input 
                type="text" 
                id="title" 
                name="title" 
                required 
                className={styles.input} 
                placeholder="예: 2026년 봄 정기회 회의록"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="file">첨부 파일</label>
              <input 
                type="file" 
                id="file" 
                name="file" 
                required
                className={styles.input} 
              />
              <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.5rem' }}>
                한글(hwp), 워드, PDF, 엑셀 등의 문서 파일을 업로드해주세요.
              </p>
            </div>

            <div className={styles.formActions}>
              <Link href="/admin/resources" className={styles.cancelBtn}>
                취소
              </Link>
              <button type="submit" className={styles.submitBtn}>
                업로드
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

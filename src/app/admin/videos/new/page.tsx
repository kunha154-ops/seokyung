import Link from "next/link";
import AdminTopBar from "../../AdminTopBar";
import styles from "../../admin.module.css";
import { createVideoAction } from "@/app/actions/video-crud";

export default function NewVideoPage() {
  return (
    <div className={styles.adminPage}>
      <AdminTopBar />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.pageTitle}>새 영상 등록</h1>
          <Link href="/admin/videos" className={styles.backBtn}>
            목록으로
          </Link>
        </div>

        <div className={styles.card}>
          <form action={createVideoAction} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="title">영상 제목</label>
              <input 
                type="text" 
                id="title" 
                name="title" 
                required 
                className={styles.input} 
                placeholder="예: 2026년 신년하례회 예배 영상"
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="youtubeUrl">YouTube 링크 (URL 또는 ID)</label>
              <input 
                type="text" 
                id="youtubeUrl" 
                name="youtubeUrl" 
                required 
                className={styles.input} 
                placeholder="예: https://www.youtube.com/watch?v=xxxxx 또는 xxxxx"
              />
              <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.5rem' }}>
                유튜브 동영상 링크를 그대로 붙여넣어 주세요. 자동으로 동영상 ID를 추출합니다.
              </p>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description">설명 (선택)</label>
              <textarea 
                id="description" 
                name="description" 
                className={styles.textarea}
                placeholder="영상에 대한 간단한 설명을 입력하세요"
                rows={3}
              />
            </div>

            <div className={styles.formActions}>
              <Link href="/admin/videos" className={styles.cancelBtn}>
                취소
              </Link>
              <button type="submit" className={styles.submitBtn}>
                등록하기
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

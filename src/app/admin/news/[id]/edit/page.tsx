import Link from "next/link";
import AdminTopBar from "../../../AdminTopBar";
import styles from "../../../admin.module.css";
import { updateNewsAction } from "@/app/actions/admin-crud";
import { getNewsById } from "@/lib/queries";
import { notFound } from "next/navigation";

export default async function EditNewsPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const newsItem = getNewsById(Number(id));

  if (!newsItem) {
    notFound();
  }

  return (
    <div className={styles.adminPage}>
      <AdminTopBar />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.pageTitle}>노회 소식 수정</h1>
          <Link href="/admin/news" className={styles.backBtn}>
            목록으로
          </Link>
        </div>

        <div className={styles.card}>
          <form action={updateNewsAction} className={styles.form}>
            <input type="hidden" name="id" value={newsItem.id} />
            
            <div className={styles.formGroup}>
              <label htmlFor="title">제목</label>
              <input 
                type="text" 
                id="title" 
                name="title" 
                required 
                defaultValue={newsItem.title}
                className={styles.input} 
                placeholder="제목을 입력하세요"
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="content">내용</label>
              <textarea 
                id="content" 
                name="content" 
                required 
                defaultValue={newsItem.content}
                className={styles.textarea}
                placeholder="내용을 입력하세요"
                rows={15}
              />
            </div>

            <div className={styles.formActions}>
              <Link href="/admin/news" className={styles.cancelBtn}>
                취소
              </Link>
              <button type="submit" className={styles.submitBtn}>
                수정 완료
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

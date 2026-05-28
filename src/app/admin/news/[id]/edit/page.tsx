import Link from "next/link";
import AdminTopBar from "../../../AdminTopBar";
import styles from "../../../admin.module.css";
import { getNewsById } from "@/lib/queries";
import { notFound } from "next/navigation";
import NewsEditForm from "@/components/admin/NewsEditForm";

export default async function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
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

        <NewsEditForm newsItem={newsItem} />
      </div>
    </div>
  );
}

import AdminTopBar from "@/app/admin/AdminTopBar";
import styles from "@/app/admin/admin.module.css";
import HeroEditForm from "@/components/admin/HeroEditForm";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default function NewHeroPage() {
  return (
    <div className={styles.adminPage}>
      <AdminTopBar />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.pageTitle}>새 히어로 슬라이드 등록</h1>
          <Link href="/admin/hero" className={styles.backBtn}>목록으로</Link>
        </div>

        <HeroEditForm />
      </div>
    </div>
  );
}

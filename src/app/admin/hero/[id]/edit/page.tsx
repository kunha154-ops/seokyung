import AdminTopBar from "@/app/admin/AdminTopBar";
import styles from "@/app/admin/admin.module.css";
import HeroEditForm from "@/components/admin/HeroEditForm";
import Link from "next/link";
import { getHeroSlide } from "@/actions/hero";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function EditHeroPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const slide = await getHeroSlide(Number(id));

  if (!slide) {
    notFound();
  }

  return (
    <div className={styles.adminPage}>
      <AdminTopBar />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.pageTitle}>히어로 슬라이드 수정</h1>
          <Link href="/admin/hero" className={styles.backBtn}>목록으로</Link>
        </div>

        <HeroEditForm slide={slide} />
      </div>
    </div>
  );
}

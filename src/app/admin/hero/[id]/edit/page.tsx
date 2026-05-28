import { notFound } from 'next/navigation';
import { getHeroSlide } from '@/actions/hero';
import HeroAdminForm from '@/components/admin/HeroAdminForm';
import AdminTopBar from '../../../AdminTopBar';
import styles from '@/components/admin/heroAdmin.module.css';

export default async function EditHeroSlidePage({ params }: { params: { id: string } }) {
  const slide = await getHeroSlide(Number(params.id));
  
  if (!slide) {
    notFound();
  }

  return (
    <div className={styles.adminPage}>
      <AdminTopBar />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.pageTitle}>히어로 슬라이드 수정</h1>
        </div>
        <HeroAdminForm initialData={slide} />
      </div>
    </div>
  );
}

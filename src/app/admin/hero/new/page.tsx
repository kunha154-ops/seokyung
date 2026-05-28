import HeroAdminForm from '@/components/admin/HeroAdminForm';
import AdminTopBar from '../../AdminTopBar';
import styles from '@/components/admin/heroAdmin.module.css';

export default function NewHeroSlidePage() {
  return (
    <div className={styles.adminPage}>
      <AdminTopBar />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.pageTitle}>새 히어로 슬라이드 등록</h1>
        </div>
        <HeroAdminForm />
      </div>
    </div>
  );
}

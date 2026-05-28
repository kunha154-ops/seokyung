'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { HeroSlide, deleteHeroSlide, toggleHeroSlideActive, updateHeroSlideOrders } from '@/actions/hero';
import styles from './heroAdmin.module.css';
import AdminTopBar from '@/app/admin/AdminTopBar';

export default function HeroAdminList({ initialSlides }: { initialSlides: HeroSlide[] }) {
  const [slides, setSlides] = useState(initialSlides);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const handleToggleActive = async (id: number, currentActive: number) => {
    try {
      const newActive = currentActive === 1 ? 0 : 1;
      await toggleHeroSlideActive(id, newActive === 1);
      setSlides(slides.map(s => s.id === id ? { ...s, is_active: newActive } : s));
    } catch (e) {
      alert('상태 변경에 실패했습니다.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return;
    try {
      await deleteHeroSlide(id);
      setSlides(slides.filter(s => s.id !== id));
      alert('삭제되었습니다.');
      router.refresh();
    } catch (e) {
      alert('삭제에 실패했습니다.');
    }
  };

  const moveSlide = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === slides.length - 1) return;

    const newSlides = [...slides];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap
    const temp = newSlides[index];
    newSlides[index] = newSlides[targetIndex];
    newSlides[targetIndex] = temp;
    
    setSlides(newSlides);
  };

  const saveOrder = async () => {
    setIsSaving(true);
    try {
      const updates = slides.map((s, index) => ({ id: s.id, sort_order: index }));
      await updateHeroSlideOrders(updates);
      alert('순서가 저장되었습니다.');
      router.refresh();
    } catch (e) {
      alert('순서 저장에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.adminPage}>
      <AdminTopBar />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.pageTitle}>히어로 슬라이드 관리</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>메인 화면 상단의 슬라이드 배너를 관리합니다.</p>
        </div>

        <div className={styles.actionsBar}>
          <button 
            onClick={saveOrder} 
            disabled={isSaving}
            className={`${styles.btn} ${styles.btnSecondary}`}
          >
            {isSaving ? '저장 중...' : '현재 순서 저장'}
          </button>
          <Link href="/admin/hero/new" className={`${styles.btn} ${styles.btnPrimary}`}>
            + 새 슬라이드 등록
          </Link>
        </div>

        {slides.length === 0 ? (
          <div className={styles.emptyState}>
            등록된 슬라이드가 없습니다.
          </div>
        ) : (
          <div className={styles.slideList}>
            {slides.map((slide, index) => (
              <div key={slide.id} className={`${styles.slideCard} ${slide.is_active ? '' : styles.slideInactive}`}>
                
                <div className={styles.orderControls}>
                  <button onClick={() => moveSlide(index, 'up')} disabled={index === 0} title="위로">▲</button>
                  <span className={styles.orderNumber}>{index + 1}</span>
                  <button onClick={() => moveSlide(index, 'down')} disabled={index === slides.length - 1} title="아래로">▼</button>
                </div>

                <div className={styles.thumbnailWrap}>
                  <Image 
                    src={slide.desktop_image} 
                    alt={slide.title}
                    fill
                    style={{ objectFit: 'cover', objectPosition: slide.object_position }}
                    unoptimized
                  />
                  {slide.mobile_image && (
                    <div className={styles.mobileIndicator} title="모바일 썸네일 별도 등록됨">M</div>
                  )}
                </div>

                <div className={styles.slideInfo}>
                  {slide.subtitle && <div className={styles.slideSubtitle}>{slide.subtitle}</div>}
                  <div className={styles.slideTitle} dangerouslySetInnerHTML={{ __html: slide.title }} />
                  <div className={styles.slideStatus}>
                    <span className={slide.is_active ? styles.badgeActive : styles.badgeInactive}>
                      {slide.is_active ? '노출 중' : '숨김'}
                    </span>
                  </div>
                </div>

                <div className={styles.slideActions}>
                  <button 
                    onClick={() => handleToggleActive(slide.id, slide.is_active)}
                    className={styles.actionBtn}
                  >
                    {slide.is_active ? '숨기기' : '노출하기'}
                  </button>
                  <Link href={`/admin/hero/${slide.id}/edit`} className={styles.actionBtn}>
                    수정
                  </Link>
                  <button 
                    onClick={() => handleDelete(slide.id)}
                    className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

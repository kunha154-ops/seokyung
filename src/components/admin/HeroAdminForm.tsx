'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { HeroSlide, createHeroSlide, updateHeroSlide } from '@/actions/hero';
import styles from './heroAdmin.module.css';

type Props = {
  initialData?: HeroSlide;
};

export default function HeroAdminForm({ initialData }: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [subtitle, setSubtitle] = useState(initialData?.subtitle || '');
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  
  const [desktopImage, setDesktopImage] = useState(initialData?.desktop_image || '');
  const [mobileImage, setMobileImage] = useState(initialData?.mobile_image || '');
  const [objectPosition, setObjectPosition] = useState(initialData?.object_position || 'center center');
  
  const [btn1Text, setBtn1Text] = useState(initialData?.primary_btn_text || '');
  const [btn1Link, setBtn1Link] = useState(initialData?.primary_btn_link || '');
  const [btn2Text, setBtn2Text] = useState(initialData?.secondary_btn_text || '');
  const [btn2Link, setBtn2Link] = useState(initialData?.secondary_btn_link || '');
  
  const [isActive, setIsActive] = useState(initialData ? initialData.is_active === 1 : true);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isMobile: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('10MB 이하의 이미지만 업로드 가능합니다.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', isMobile ? 'hero/mobile' : 'hero/desktop');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      
      if (data.success) {
        if (isMobile) {
          setMobileImage(data.url);
        } else {
          setDesktopImage(data.url);
        }
      } else {
        alert(data.error || '업로드에 실패했습니다.');
      }
    } catch (err) {
      alert('네트워크 오류가 발생했습니다.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !desktopImage) {
      alert('메인 타이틀과 PC용 배경 이미지는 필수입니다.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        subtitle,
        title,
        description,
        desktop_image: desktopImage,
        mobile_image: mobileImage || null,
        object_position: objectPosition,
        primary_btn_text: btn1Text,
        primary_btn_link: btn1Link,
        secondary_btn_text: btn2Text,
        secondary_btn_link: btn2Link,
        is_active: isActive ? 1 : 0
      };

      if (initialData) {
        await updateHeroSlide(initialData.id, payload);
        alert('수정되었습니다.');
      } else {
        await createHeroSlide(payload);
        alert('등록되었습니다.');
      }
      router.push('/admin/hero');
    } catch (err) {
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formCard}>
      
      <div className={styles.imageUploadGrid}>
        <div>
          <label className={styles.formLabel}>PC용 배경 이미지 (필수)</label>
          <span className={styles.formHint}>권장 사이즈: 1920x1080 이상 (jpg, png, webp / 최대 10MB)</span>
          {desktopImage ? (
            <div className={styles.previewImage}>
              <Image src={desktopImage} alt="PC 배경" fill style={{ objectFit: 'cover' }} unoptimized />
              <button type="button" onClick={() => setDesktopImage('')} style={{ position: 'absolute', top: 5, right: 5, zIndex: 10 }}>삭제</button>
            </div>
          ) : (
            <div className={styles.uploadBox}>
              <p>클릭하여 이미지 업로드</p>
              <input type="file" accept="image/jpeg, image/png, image/webp" onChange={(e) => handleFileUpload(e, false)} className={styles.uploadInput} />
            </div>
          )}
        </div>

        <div>
          <label className={styles.formLabel}>모바일용 배경 이미지 (선택)</label>
          <span className={styles.formHint}>권장 사이즈: 1080x1600 이상 (미등록 시 PC 이미지가 잘려서 보입니다)</span>
          {mobileImage ? (
            <div className={styles.previewImage} style={{ maxWidth: '200px', margin: '0 auto', height: '300px' }}>
              <Image src={mobileImage} alt="모바일 배경" fill style={{ objectFit: 'cover' }} unoptimized />
              <button type="button" onClick={() => setMobileImage('')} style={{ position: 'absolute', top: 5, right: 5, zIndex: 10 }}>삭제</button>
            </div>
          ) : (
            <div className={styles.uploadBox} style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p>클릭하여 모바일 전용 이미지 업로드</p>
              <input type="file" accept="image/jpeg, image/png, image/webp" onChange={(e) => handleFileUpload(e, true)} className={styles.uploadInput} />
            </div>
          )}
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>이미지 초점 위치</label>
        <span className={styles.formHint}>이미지가 잘릴 때 어느 부분을 중심으로 보여줄지 선택하세요.</span>
        <select value={objectPosition} onChange={(e) => setObjectPosition(e.target.value)} className={styles.formInput}>
          <option value="center center">정중앙 (Center)</option>
          <option value="center top">상단 (Top)</option>
          <option value="center bottom">하단 (Bottom)</option>
          <option value="left center">좌측 (Left)</option>
          <option value="right center">우측 (Right)</option>
        </select>
      </div>

      <hr style={{ margin: '2rem 0', borderColor: '#e2e8f0' }} />

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>상단 작은 문구 (Eyebrow)</label>
        <input type="text" value={subtitle} onChange={e => setSubtitle(e.target.value)} className={styles.formInput} placeholder="예: 신뢰와 은혜" />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>메인 타이틀 (필수)</label>
        <span className={styles.formHint}>줄바꿈이 필요한 곳에는 &lt;br /&gt; 태그를 입력하세요.</span>
        <textarea value={title} onChange={e => setTitle(e.target.value)} className={styles.formInput} rows={3} required placeholder="예: 세상의 빛이 되는<br />거룩한 발걸음" />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>설명 문구</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} className={styles.formInput} rows={2} placeholder="예: 따뜻한 교제와 협력으로 하나님 나라를 확장합니다." />
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>1차 버튼 문구 (보라색 버튼)</label>
          <input type="text" value={btn1Text} onChange={e => setBtn1Text(e.target.value)} className={styles.formInput} placeholder="예: 노회 현황" />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>1차 버튼 링크</label>
          <input type="text" value={btn1Link} onChange={e => setBtn1Link(e.target.value)} className={styles.formInput} placeholder="예: /organization/districts" />
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>2차 버튼 문구 (투명 테두리 버튼)</label>
          <input type="text" value={btn2Text} onChange={e => setBtn2Text(e.target.value)} className={styles.formInput} placeholder="예: 자료실 바로가기" />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>2차 버튼 링크</label>
          <input type="text" value={btn2Link} onChange={e => setBtn2Link(e.target.value)} className={styles.formInput} placeholder="예: /resources/forms" />
        </div>
      </div>

      <div className={styles.formGroup} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <input type="checkbox" id="isActive" checked={isActive} onChange={e => setIsActive(e.target.checked)} style={{ width: '1.2rem', height: '1.2rem' }} />
        <label htmlFor="isActive" className={styles.formLabel} style={{ margin: 0 }}>메인 화면에 노출하기</label>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
        <Link href="/admin/hero" className={`${styles.btn} ${styles.btnSecondary}`}>취소</Link>
        <button type="submit" disabled={isSubmitting} className={`${styles.btn} ${styles.btnPrimary}`}>
          {isSubmitting ? '저장 중...' : '저장하기'}
        </button>
      </div>

    </form>
  );
}

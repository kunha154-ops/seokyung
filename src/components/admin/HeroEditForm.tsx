'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '@/app/admin/admin.module.css';
import { createHeroAction, updateHeroAction } from '@/app/actions/hero-crud';
import { HeroSlide } from '@/actions/hero';

export default function HeroEditForm({ slide }: { slide?: HeroSlide }) {
  const isEdit = !!slide;
  
  const [hasButton, setHasButton] = useState(isEdit ? !!(slide.primary_btn_text || slide.primary_btn_link) : false);
  const [desktopPreview, setDesktopPreview] = useState<string | null>(slide?.desktop_image || null);
  const [mobilePreview, setMobilePreview] = useState<string | null>(slide?.mobile_image || null);
  const [deleteMobileImage, setDeleteMobileImage] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'desktop' | 'mobile') => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (type === 'desktop') setDesktopPreview(url);
      else {
        setMobilePreview(url);
        setDeleteMobileImage(false);
      }
    }
  };

  const handleDeleteMobileImage = () => {
    setMobilePreview(null);
    setDeleteMobileImage(true);
    // Reset file input
    const input = document.getElementById('mobile_image') as HTMLInputElement;
    if (input) input.value = '';
  };

  return (
    <div className={styles.formCard}>
      <form action={isEdit ? updateHeroAction : createHeroAction}>
        {isEdit && <input type="hidden" name="id" value={slide.id} />}
        <input type="hidden" name="delete_mobile_image" value={deleteMobileImage.toString()} />

        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="is_active">노출 여부</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input type="checkbox" id="is_active" name="is_active" defaultChecked={isEdit ? slide.is_active === 1 : true} style={{ width: '18px', height: '18px' }} />
            <span style={{ fontSize: '0.9rem', color: 'var(--color-text)' }}>메인 화면에 노출합니다.</span>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="title">메인 제목 <span style={{color: 'red'}}>*</span></label>
          <input type="text" id="title" name="title" className={styles.formInput} defaultValue={slide?.title || ''} placeholder="강조할 핵심 문구를 입력하세요. (<br />로 줄바꿈 가능)" required />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="subtitle">서브 문구 (선택)</label>
          <input type="text" id="subtitle" name="subtitle" className={styles.formInput} defaultValue={slide?.subtitle || ''} placeholder="제목 위에 작게 표시될 문구" />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="description">설명 문구 (선택)</label>
          <textarea id="description" name="description" className={styles.formTextarea} defaultValue={slide?.description || ''} placeholder="제목 아래에 표시될 상세 설명" rows={3} />
        </div>

        <div className={styles.formGroup} style={{ borderTop: '1px solid var(--color-border-light)', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
          <label className={styles.formLabel} htmlFor="desktop_image">PC용 이미지 <span style={{color: 'red'}}>*</span></label>
          
          {desktopPreview && (
            <div style={{ marginBottom: '1rem', position: 'relative', width: '100%', height: '200px', backgroundColor: '#f3f4f6', borderRadius: '8px', overflow: 'hidden' }}>
              <Image src={desktopPreview} alt="PC 미리보기" fill style={{ objectFit: 'cover' }} />
            </div>
          )}
          
          <input type="file" id="desktop_image" name="desktop_image" accept="image/jpeg, image/png, image/webp" className={styles.formInput} onChange={(e) => handleImageChange(e, 'desktop')} required={!isEdit} />
          <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.25rem' }}>* 가로가 긴 이미지 권장 (1920x800 등). 최대 5MB</p>
        </div>

        <div className={styles.formGroup} style={{ borderTop: '1px solid var(--color-border-light)', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
          <label className={styles.formLabel} htmlFor="mobile_image">모바일용 이미지 (선택)</label>
          
          {mobilePreview && (
            <div style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-start' }}>
              <div style={{ position: 'relative', width: '200px', height: '300px', backgroundColor: '#f3f4f6', borderRadius: '8px', overflow: 'hidden' }}>
                <Image src={mobilePreview} alt="모바일 미리보기" fill style={{ objectFit: 'cover' }} />
              </div>
              <button type="button" onClick={handleDeleteMobileImage} className={styles.deleteBtn} style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}>
                현재 모바일 이미지 삭제
              </button>
            </div>
          )}
          
          <input type="file" id="mobile_image" name="mobile_image" accept="image/jpeg, image/png, image/webp" className={styles.formInput} onChange={(e) => handleImageChange(e, 'mobile')} />
          <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.25rem' }}>* 등록하지 않으면 PC용 이미지가 자동으로 조절되어 표시됩니다.</p>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="object_position">이미지 기준 위치</label>
          <select id="object_position" name="object_position" className={styles.formInput} defaultValue={slide?.object_position || 'center center'}>
            <option value="center center">정중앙 (기본)</option>
            <option value="top center">상단 중앙</option>
            <option value="bottom center">하단 중앙</option>
            <option value="center left">좌측 중앙</option>
            <option value="center right">우측 중앙</option>
          </select>
          <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.25rem' }}>* 화면 비율이 달라질 때 이미지가 잘리지 않고 중심이 될 위치를 선택합니다.</p>
        </div>

        <div className={styles.formGroup} style={{ borderTop: '1px solid var(--color-border-light)', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
          <label className={styles.formLabel} htmlFor="button_enabled">주요 버튼 사용</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <input 
              type="checkbox" 
              id="button_enabled" 
              name="button_enabled" 
              checked={hasButton} 
              onChange={(e) => setHasButton(e.target.checked)}
              style={{ width: '18px', height: '18px' }} 
            />
            <span style={{ fontSize: '0.9rem', color: 'var(--color-text)' }}>슬라이드 하단에 버튼을 표시합니다.</span>
          </div>

          {hasButton && (
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <label className={styles.formLabel} htmlFor="primary_btn_text" style={{ fontSize: '0.85rem' }}>버튼 문구</label>
                <input type="text" id="primary_btn_text" name="primary_btn_text" className={styles.formInput} defaultValue={slide?.primary_btn_text || ''} placeholder="예: 자세히 보기" required={hasButton} />
              </div>
              <div style={{ flex: 2, minWidth: '300px' }}>
                <label className={styles.formLabel} htmlFor="primary_btn_link" style={{ fontSize: '0.85rem' }}>버튼 링크</label>
                <input type="text" id="primary_btn_link" name="primary_btn_link" className={styles.formInput} defaultValue={slide?.primary_btn_link || ''} placeholder="예: /about/greeting" required={hasButton} />
              </div>
            </div>
          )}
        </div>

        <div className={styles.formActions} style={{ marginTop: '2rem' }}>
          <Link href="/admin/hero" className={styles.cancelBtn}>취소</Link>
          <button type="submit" className={styles.submitBtn}>{isEdit ? '수정 완료' : '슬라이드 등록'}</button>
        </div>
      </form>
    </div>
  );
}

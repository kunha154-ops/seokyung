'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '@/app/admin/admin.module.css';
import { updateNewsAction } from '@/app/actions/admin-crud';
import { NewsItem } from '@/lib/queries';

export default function NewsEditForm({ newsItem }: { newsItem: NewsItem }) {
  const [deletedIds, setDeletedIds] = useState<number[]>([]);
  const [keepThumbnail, setKeepThumbnail] = useState(true);

  const images = newsItem.images || [];
  const activeImages = images.filter(img => !deletedIds.includes(img.id));

  const handleDeleteImage = (id: number) => {
    if (confirm('이 이미지를 삭제하시겠습니까? 저장 시 최종 삭제됩니다.')) {
      setDeletedIds(prev => [...prev, id]);
    }
  };

  const handleRemoveThumbnail = () => {
    if (confirm('대표 이미지를 삭제하시겠습니까? 저장 시 최종 삭제됩니다.')) {
      setKeepThumbnail(false);
    }
  };

  return (
    <div className={styles.formCard}>
      <form action={updateNewsAction}>
        <input type="hidden" name="id" value={newsItem.id} />
        <input type="hidden" name="deleted_image_ids" value={deletedIds.join(',')} />
        <input type="hidden" name="keep_thumbnail" value={keepThumbnail.toString()} />

        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="title">제목</label>
          <input type="text" id="title" name="title" className={styles.formInput} defaultValue={newsItem.title} required />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="content">내용</label>
          <textarea id="content" name="content" className={styles.formTextarea} defaultValue={newsItem.content} required style={{ minHeight: '300px' }} />
        </div>

        <div className={styles.formGroup} style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
          <label className={styles.formLabel} htmlFor="thumbnail">대표 이미지 (썸네일)</label>
          
          {newsItem.thumbnail_url && keepThumbnail && (
            <div style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-start' }}>
              <div style={{ position: 'relative', width: '200px', height: '150px', backgroundColor: '#f3f4f6', borderRadius: '8px', overflow: 'hidden' }}>
                <Image src={newsItem.thumbnail_url} alt="Thumbnail" fill style={{ objectFit: 'cover' }} />
              </div>
              <button type="button" onClick={handleRemoveThumbnail} className={styles.deleteBtn} style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}>
                현재 대표 이미지 삭제
              </button>
            </div>
          )}
          
          <input type="file" id="thumbnail" name="thumbnail" accept="image/jpeg, image/png, image/webp" className={styles.formInput} />
          <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.25rem' }}>* 새 이미지를 업로드하면 기존 대표 이미지가 교체됩니다.</p>
        </div>

        <div className={styles.formGroup} style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
          <label className={styles.formLabel} htmlFor="bodyImages">본문 이미지 (여러 장 가능)</label>
          
          {activeImages.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 600 }}>기존 등록된 이미지</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
                {activeImages.map(img => (
                  <div key={img.id} style={{ position: 'relative', border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
                    <div style={{ position: 'relative', height: '120px', backgroundColor: '#f3f4f6' }}>
                      <Image src={img.image_url} alt="본문 이미지" fill style={{ objectFit: 'cover' }} />
                    </div>
                    <div style={{ padding: '0.5rem', display: 'flex', justifyContent: 'center' }}>
                      <button type="button" onClick={() => handleDeleteImage(img.id)} className={styles.deleteBtn} style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', width: '100%' }}>
                        삭제
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <input type="file" id="bodyImages" name="bodyImages" accept="image/jpeg, image/png, image/webp" className={styles.formInput} multiple />
          <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.25rem' }}>* 추가할 이미지를 선택하세요. 기존 이미지와 함께 표시됩니다.</p>
        </div>

        <div className={styles.formActions} style={{ marginTop: '2rem' }}>
          <Link href="/admin/news" className={styles.cancelBtn}>취소</Link>
          <button type="submit" className={styles.submitBtn}>수정 완료</button>
        </div>
      </form>
    </div>
  );
}

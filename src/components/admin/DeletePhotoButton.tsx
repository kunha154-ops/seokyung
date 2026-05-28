'use client';

import { useTransition } from 'react';
import { deletePhotoAction } from '@/app/actions/gallery-crud';
import styles from '@/app/admin/admin.module.css';

export default function DeletePhotoButton({ photoId, albumId }: { photoId: number, albumId: number }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm('정말 이 사진을 삭제하시겠습니까?\n삭제된 사진은 복구할 수 없습니다.')) {
      startTransition(async () => {
        const formData = new FormData();
        formData.append('id', photoId.toString());
        formData.append('albumId', albumId.toString());
        await deletePhotoAction(formData);
      });
    }
  };

  return (
    <button 
      type="button" 
      onClick={handleDelete}
      disabled={isPending}
      className={styles.deleteBtn} 
      style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', width: 'auto', opacity: isPending ? 0.5 : 1 }}
    >
      {isPending ? '삭제 중...' : '삭제'}
    </button>
  );
}

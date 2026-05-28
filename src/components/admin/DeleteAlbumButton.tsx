'use client';

import { useTransition } from 'react';
import { deleteAlbumAction } from '@/app/actions/gallery-crud';
import styles from '@/app/admin/admin.module.css';

export default function DeleteAlbumButton({ albumId }: { albumId: number }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm('정말 이 앨범을 삭제하시겠습니까?\n앨범에 포함된 모든 사진도 함께 삭제되며, 복구할 수 없습니다.')) {
      startTransition(async () => {
        const formData = new FormData();
        formData.append('id', albumId.toString());
        await deleteAlbumAction(formData);
      });
    }
  };

  return (
    <button 
      type="button" 
      onClick={handleDelete}
      disabled={isPending}
      className={styles.deleteBtn} 
      style={{ opacity: isPending ? 0.5 : 1 }}
      aria-label={`앨범 ${albumId} 삭제`}
    >
      {isPending ? '삭제 중...' : '삭제'}
    </button>
  );
}

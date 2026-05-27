'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { deleteGalleryPostAction } from '@/app/actions/gallery-actions';

export default function DeleteGalleryButton({ 
  postId, 
  postType,
  redirectUrl 
}: { 
  postId: number; 
  postType: 'photo' | 'video';
  redirectUrl: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState('');

  const handleDelete = () => {
    if (!confirm('정말로 이 게시물을 삭제하시겠습니까?\n삭제된 데이터는 복구할 수 없습니다.')) {
      return;
    }

    startTransition(async () => {
      try {
        const result = await deleteGalleryPostAction(postId);
        if (result.success) {
          alert('삭제되었습니다.');
          router.push(redirectUrl);
          router.refresh();
        } else {
          setErrorMsg(result.error || '삭제 중 오류가 발생했습니다.');
          alert(result.error || '삭제 중 오류가 발생했습니다.');
        }
      } catch (err: any) {
        setErrorMsg(err.message || '서버 통신 오류가 발생했습니다.');
        alert('서버 통신 오류가 발생했습니다.');
      }
    });
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isPending}
      style={{ 
        padding: '0.6rem 1.5rem', 
        background: '#fee2e2', 
        color: '#b91c1c', 
        border: 'none',
        borderRadius: 'var(--radius)', 
        fontSize: '0.95rem', 
        fontWeight: 500, 
        cursor: isPending ? 'not-allowed' : 'pointer', 
        opacity: isPending ? 0.7 : 1,
        transition: 'all 0.2s'
      }}
    >
      {isPending ? '삭제 중...' : '삭제'}
    </button>
  );
}

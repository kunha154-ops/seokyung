"use client";

import { useRouter } from "next/navigation";
import { deletePost } from "@/app/actions/post-actions";

interface DeletePostButtonProps {
  boardType: string;
  postId: number;
  redirectUrl: string;
}

export default function DeletePostButton({ boardType, postId, redirectUrl }: DeletePostButtonProps) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('정말 이 글을 삭제하시겠습니까?\n삭제된 글은 목록에 표시되지 않습니다.')) return;

    const result = await deletePost(boardType, postId);
    if (result.success) {
      alert('삭제되었습니다.');
      router.push(redirectUrl);
      router.refresh();
    } else {
      alert(result.error || '삭제 중 오류가 발생했습니다.');
    }
  };

  return (
    <button 
      onClick={handleDelete}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
        padding: '0.75rem 1.5rem', background: '#fee2e2', color: '#b91c1c',
        border: '1px solid #fca5a5',
        borderRadius: 'var(--radius)', fontWeight: 600, fontSize: 'var(--fs-sm)',
        cursor: 'pointer',
      }}
    >
      삭제
    </button>
  );
}

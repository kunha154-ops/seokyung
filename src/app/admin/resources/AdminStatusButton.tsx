"use client";

import { useRouter } from "next/navigation";
import { updatePostStatus } from "@/app/actions/post-actions";

interface AdminStatusButtonProps {
  boardType: string;
  postId: number;
  currentStatus: string;
}

export default function AdminStatusButton({ boardType, postId, currentStatus }: AdminStatusButtonProps) {
  const router = useRouter();

  const toggleStatus = async () => {
    const newStatus = currentStatus === 'published' ? 'hidden' : 'published';
    const result = await updatePostStatus(boardType, postId, newStatus);
    if (result.success) {
      router.refresh();
    } else {
      alert(result.error);
    }
  };

  return (
    <button
      onClick={toggleStatus}
      style={{
        padding: '0.2rem 0.5rem',
        background: currentStatus === 'published' ? '#fef3c7' : '#dcfce7',
        color: currentStatus === 'published' ? '#92400e' : '#166534',
        border: 'none',
        borderRadius: '3px',
        fontSize: '0.75rem',
        fontWeight: 600,
        cursor: 'pointer',
      }}
    >
      {currentStatus === 'published' ? '숨김' : '공개'}
    </button>
  );
}

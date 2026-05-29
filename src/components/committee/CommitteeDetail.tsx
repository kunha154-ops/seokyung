'use client'

import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./Committee.module.css";
import { CommitteePost } from "@/lib/queries";
import { deleteCommitteePostAction, updateCommitteePostStatusAction } from "@/app/actions/committee-actions";

interface CommitteeDetailProps {
  post: CommitteePost;
  canEdit: boolean;
  isAdmin: boolean;
  basePath: string; // e.g. /mission
}

export default function CommitteeDetail({
  post,
  canEdit,
  isAdmin,
  basePath,
}: CommitteeDetailProps) {
  const router = useRouter();
  const boardPath = `${basePath}/${post.board_type}`;

  const handleDelete = async () => {
    if (confirm('정말로 이 글을 삭제하시겠습니까?')) {
      const res = await deleteCommitteePostAction(post.id);
      if (res.success) {
        alert('삭제되었습니다.');
        router.push(boardPath);
      } else {
        alert(res.error || '삭제 실패');
      }
    }
  };

  const handleToggleStatus = async () => {
    const newStatus = post.status === 'public' ? 'hidden' : 'public';
    if (confirm(`글을 ${newStatus === 'hidden' ? '숨김' : '공개'} 처리하시겠습니까?`)) {
      const res = await updateCommitteePostStatusAction(post.id, newStatus);
      if (res.success) {
        alert('상태가 변경되었습니다.');
        router.refresh();
      } else {
        alert(res.error || '변경 실패');
      }
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.detailHeader}>
        <h1 className={styles.detailTitle}>
          {post.status === 'hidden' && <span style={{color: 'red', marginRight: '8px'}}>[숨김]</span>}
          {post.title}
        </h1>
        <div className={styles.detailMeta}>
          <span>작성자: {post.author_name || '관리자'}</span>
          <span className={styles.divider}>|</span>
          <span>작성일: {formatDate(post.created_at)}</span>
          <span className={styles.divider}>|</span>
          <span>조회수: {post.views}</span>
        </div>
      </div>

      {post.attachments && post.attachments.length > 0 && (
        <div className={styles.attachments}>
          <div className={styles.attachTitle}>첨부파일</div>
          <ul className={styles.attachList}>
            {post.attachments.map(att => (
              <li key={att.id}>
                <a href={att.file_path} download={att.original_file_name} target="_blank" rel="noopener noreferrer">
                  {att.original_file_name} <span className={styles.fileSize}>({att.file_size})</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className={styles.detailContent}>
        {post.thumbnail_path && (
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <img src={post.thumbnail_path} alt="대표 이미지" style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }} />
          </div>
        )}
        
        <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>') }} />
      </div>

      <div className={styles.detailActions}>
        <div className={styles.leftActions}>
          <Link href={boardPath} className={styles.btnSecondary}>
            목록으로
          </Link>
        </div>
        <div className={styles.rightActions}>
          {isAdmin && (
            <button onClick={handleToggleStatus} className={styles.btnWarning} style={{ marginRight: '10px' }}>
              {post.status === 'public' ? '숨김 처리' : '공개 처리'}
            </button>
          )}
          {canEdit && (
            <>
              <Link href={`${boardPath}/${post.id}/edit`} className={styles.btnPrimary} style={{ marginRight: '10px' }}>
                수정
              </Link>
              <button onClick={handleDelete} className={styles.btnDanger}>
                삭제
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

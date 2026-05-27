import { getGalleryPostById, incrementGalleryView } from "@/lib/queries";
import { notFound } from "next/navigation";
import SubPageLayout from "@/components/SubPageLayout";
import Link from "next/link";
import { auth } from "@/lib/auth";
import styles from "./photoDetail.module.css";
import DeleteGalleryButton from "@/components/gallery/DeleteGalleryButton";
import Lightbox from "@/components/gallery/Lightbox";

const GALLERY_MENU = [
  { label: "포토갤러리", href: "/gallery/photos", active: true },
  { label: "영상갤러리", href: "/gallery/videos" },
];

export default async function PhotoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const p = await params;
  const postId = parseInt(p.id, 10);
  
  if (isNaN(postId)) {
    notFound();
  }

  const post = getGalleryPostById(postId);
  
  if (!post || post.type !== 'photo') {
    notFound();
  }

  incrementGalleryView(postId);

  const session = await auth();
  const isLoggedIn = !!session?.user;
  const isAuthorOrAdmin = isLoggedIn && (session.user.role === 'admin' || session.user.id === String(post.author_id));

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return dateString.substring(0, 10).replace(/-/g, '.');
  };

  return (
    <SubPageLayout
      title="포토갤러리"
      breadcrumbs={[
        { label: "갤러리", href: "/gallery" },
        { label: "포토갤러리", href: "/gallery/photos" },
        { label: "상세보기" }
      ]}
      sideMenu={GALLERY_MENU}
    >
      <div className={styles.photoDetailPage}>
        {/* Header */}
        <div className={styles.photoDetailHeader}>
          <h1>{post.title}</h1>
          <div className={styles.photoDetailMeta}>
            <span><strong>작성자:</strong> {post.author_name || '관리자'}</span>
            <span><strong>작성일:</strong> {formatDate(post.created_at)}</span>
            <span><strong>조회수:</strong> {post.view_count}</span>
          </div>
        </div>

        {/* Content */}
        {post.description && (
          <div className={styles.photoDetailDescription}>
            {post.description}
          </div>
        )}

        {/* Image Grid with Lightbox */}
        {post.media && post.media.length > 0 ? (
          <Lightbox images={post.media as { id: number; file_path: string; file_name: string }[]} />
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', background: '#f8f9fa', borderRadius: '16px', color: '#6b7280', marginTop: '2rem' }}>
            등록된 사진이 없습니다.
          </div>
        )}

        {/* Footer Actions */}
        <div className={styles.footerActions}>
          <Link href={`/gallery/photos`} style={{ padding: '0.6rem 1.5rem', background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)', borderRadius: 'var(--radius)', fontSize: '0.95rem', fontWeight: 500, transition: 'all 0.2s', textDecoration: 'none' }}>
            목록으로
          </Link>
          
          {isAuthorOrAdmin && (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link 
                href={`/gallery/photo/${post.id}/edit`}
                style={{ padding: '0.6rem 1.5rem', background: '#f1f5f9', color: '#475569', borderRadius: 'var(--radius)', fontSize: '0.95rem', fontWeight: 500, textDecoration: 'none' }}
              >
                수정
              </Link>
              <DeleteGalleryButton postId={post.id} postType="photo" redirectUrl="/gallery/photos" />
            </div>
          )}
        </div>
      </div>
    </SubPageLayout>
  );
}

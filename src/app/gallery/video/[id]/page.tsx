import { getGalleryPostById, incrementGalleryView } from "@/lib/queries";
import { notFound } from "next/navigation";
import SubPageLayout from "@/components/SubPageLayout";
import Link from "next/link";
import { auth } from "@/lib/auth";
import DeleteGalleryButton from "@/components/gallery/DeleteGalleryButton";

const GALLERY_MENU = [
  { label: "포토갤러리", href: "/gallery/photos" },
  { label: "영상갤러리", href: "/gallery/videos", active: true },
];

export default async function VideoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const p = await params;
  const postId = parseInt(p.id, 10);
  
  if (isNaN(postId)) {
    notFound();
  }

  const post = getGalleryPostById(postId);
  
  if (!post || post.type !== 'video') {
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

  const getYoutubeEmbedUrl = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  };

  return (
    <SubPageLayout
      title="영상갤러리"
      breadcrumbs={[
        { label: "갤러리", href: "/gallery" },
        { label: "영상갤러리", href: "/gallery/videos" },
        { label: "상세보기" }
      ]}
      sideMenu={GALLERY_MENU}
    >
      <div style={{ maxWidth: '900px', margin: '0 auto', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        {/* Header */}
        <div style={{ borderBottom: '2px solid var(--color-primary)', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '1rem', lineHeight: 1.4 }}>
            {post.title}
          </h1>
          <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--color-text-muted)', fontSize: 'var(--fs-sm)', flexWrap: 'wrap' }}>
            <span><strong style={{ fontWeight: 600, color: 'var(--color-text-secondary)' }}>작성자:</strong> {post.author_name || '관리자'}</span>
            <span><strong style={{ fontWeight: 600, color: 'var(--color-text-secondary)' }}>작성일:</strong> {formatDate(post.created_at)}</span>
            <span><strong style={{ fontWeight: 600, color: 'var(--color-text-secondary)' }}>조회수:</strong> {post.view_count}</span>
          </div>
        </div>

        {/* Video Player */}
        <div style={{ marginBottom: '2rem', borderRadius: 'var(--radius)', overflow: 'hidden', backgroundColor: '#000', aspectRatio: '16/9', position: 'relative' }}>
          {post.video_url && post.video_url.includes('youtu') ? (
            <iframe 
              src={getYoutubeEmbedUrl(post.video_url)} 
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            />
          ) : post.video_file_path ? (
            <video 
              src={post.video_file_path} 
              controls 
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
              preload="metadata"
            >
              해당 브라우저에서는 영상을 재생할 수 없습니다.
            </video>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#fff' }}>
              영상을 불러올 수 없습니다.
            </div>
          )}
        </div>
        
        {/* Download Button (Only for uploaded files, and logged in users) */}
        {post.video_file_path && isLoggedIn && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
            <a 
              href={post.video_file_path} 
              download 
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                padding: '0.6rem 1.25rem', 
                background: 'var(--color-mint-light)', 
                color: 'var(--color-primary)', 
                borderRadius: 'var(--radius)', 
                fontWeight: 600, 
                textDecoration: 'none' 
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              영상 다운로드
            </a>
          </div>
        )}

        {/* Content */}
        {post.description && (
          <div style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--color-text)', marginBottom: '3rem', whiteSpace: 'pre-wrap' }}>
            {post.description}
          </div>
        )}

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem', borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
          <Link href={`/gallery/videos`} style={{ padding: '0.6rem 1.5rem', background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)', borderRadius: 'var(--radius)', fontSize: '0.95rem', fontWeight: 500, transition: 'all 0.2s' }}>
            목록으로
          </Link>
          
          {isAuthorOrAdmin && (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link 
                href={`/gallery/video/${post.id}/edit`}
                style={{ padding: '0.6rem 1.5rem', background: '#f1f5f9', color: '#475569', borderRadius: 'var(--radius)', fontSize: '0.95rem', fontWeight: 500, textDecoration: 'none' }}
              >
                수정
              </Link>
              <DeleteGalleryButton postId={post.id} postType="video" redirectUrl="/gallery/videos" />
            </div>
          )}
        </div>
      </div>
    </SubPageLayout>
  );
}

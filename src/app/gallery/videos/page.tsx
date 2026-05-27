import SubPageLayout from "@/components/SubPageLayout";
import { getGalleryPosts } from "@/lib/queries";
import Link from "next/link";
import { auth } from "@/lib/auth";

export const dynamic = 'force-dynamic';

const GALLERY_MENU = [
  { label: "포토갤러리", href: "/gallery/photos" },
  { label: "영상갤러리", href: "/gallery/videos", active: true },
];

export const metadata = { title: "영상갤러리" };

export default async function VideosPage() {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  const { posts: videos } = getGalleryPosts('video', 1, 50, false);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return dateString.substring(0, 10).replace(/-/g, '.');
  };

  return (
    <SubPageLayout
      title="영상갤러리"
      breadcrumbs={[
        { label: "갤러리", href: "/gallery" },
        { label: "영상갤러리" },
      ]}
      sideMenu={GALLERY_MENU}
    >
      {isLoggedIn ? (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
          <Link 
            href="/gallery/video/new" 
            style={{ 
              padding: '0.65rem 1.25rem', 
              backgroundColor: 'var(--color-primary)', 
              color: 'white', 
              borderRadius: 'var(--radius)', 
              fontSize: '0.9rem', 
              fontWeight: 600,
              whiteSpace: 'nowrap'
            }}
          >
            + 새 영상 등록
          </Link>
        </div>
      ) : (
        <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#666', fontSize: '0.9rem' }}>로그인 후 영상을 등록할 수 있습니다.</span>
          <Link href="/admin/login" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-primary)', textDecoration: 'underline' }}>로그인하기</Link>
        </div>
      )}
      {videos.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          color: 'var(--color-text-muted)',
        }}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3, marginBottom: '1.5rem' }}>
            <polygon points="23 7 16 12 23 17 23 7"/>
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
          </svg>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--color-text-secondary)', marginBottom: '0.75rem' }}>등록된 영상이 없습니다</h3>
          <p style={{ lineHeight: 1.6 }}>노회 행사 영상이 곧 업로드될 예정입니다.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '2rem 1.5rem',
        }}>
          {videos.map((video) => (
            <div key={video.id} style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{
                position: 'relative',
                width: '100%',
                paddingTop: '56.25%', /* 16:9 Aspect Ratio */
                borderRadius: '8px',
                overflow: 'hidden',
                backgroundColor: '#f3f4f6',
                marginBottom: '1rem',
              }}>
                <Link href={`/gallery/video/${video.id}`} style={{ display: 'block', width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 10 }} />
                {video.video_url && video.video_url.includes('youtu') ? (
                  <iframe
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      border: 'none',
                    }}
                    src={video.video_url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/) ? `https://www.youtube.com/embed/${video.video_url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/)![1]}` : video.video_url}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : video.video_file_path ? (
                  <video 
                    src={video.video_file_path} 
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e2e8f0', color: '#94a3b8' }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
                  </div>
                )}
              </div>
              <Link href={`/gallery/video/${video.id}`} style={{ textDecoration: 'none' }}>
                <h3 style={{ 
                  fontSize: '1.1rem', 
                  color: 'var(--color-primary)', 
                  marginBottom: '0.5rem',
                  lineHeight: 1.4,
                }}>
                  {video.title}
                </h3>
              </Link>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                  {formatDate(video.created_at)}
                </span>
              </div>
              {video.description && (
                <p style={{ 
                  fontSize: '0.9rem', 
                  color: '#4b5563', 
                  marginTop: '0.5rem',
                  lineHeight: 1.5,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}>
                  {video.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </SubPageLayout>
  );
}

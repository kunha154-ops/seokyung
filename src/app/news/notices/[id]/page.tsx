import Link from "next/link";
import { notFound } from "next/navigation";
import SubPageLayout from "@/components/SubPageLayout";
import { getNoticeById, getAttachments } from "@/lib/queries";
import { cookies } from "next/headers";
import DeletePostButton from "@/components/common/DeletePostButton";

const NEWS_MENU = [
  { label: "공지사항", href: "/news/notices", active: true },
  { label: "노회 소식", href: "/news/updates" },
];

export const dynamic = 'force-dynamic';

export default async function NoticeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const notice = getNoticeById(Number(id));

  if (!notice || notice.status === 'deleted') {
    notFound();
  }

  const attachments = getAttachments('notices', notice.id);
  
  const cookieStore = await cookies();
  const adminToken = cookieStore.get('admin_token')?.value;
  const isAdmin = adminToken === process.env.ADMIN_SECRET;
  const isLoggedIn = !!adminToken;

  // Hidden posts only visible to admin
  if (notice.status === 'hidden' && !isAdmin) {
    notFound();
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  };

  const getYouTubeEmbedUrl = (url: string) => {
    let videoId = '';
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split(/[?&]/)[0];
    } else if (url.includes('watch?v=')) {
      videoId = url.split('watch?v=')[1]?.split(/[?&]/)[0];
    } else if (url.includes('shorts/')) {
      videoId = url.split('shorts/')[1]?.split(/[?&]/)[0];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  return (
    <SubPageLayout
      title="공지사항"
      breadcrumbs={[
        { label: "소식", href: "/news" },
        { label: "공지사항", href: "/news/notices" },
        { label: notice.title },
      ]}
      sideMenu={NEWS_MENU}
    >
      <article>
        {/* Header */}
        <div style={{
          borderBottom: '2px solid var(--color-primary)',
          paddingBottom: '1.25rem',
          marginBottom: '2rem',
        }}>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', marginBottom: '0.75rem', lineHeight: 1.4 }}>
            {notice.title}
          </h2>
          <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--color-text-muted)', fontSize: 'var(--fs-sm)', flexWrap: 'wrap' }}>
            <span>등록일: {formatDate(notice.created_at)}</span>
            {notice.updated_at !== notice.created_at && <span>수정일: {formatDate(notice.updated_at)}</span>}
            <span>조회: {notice.views}</span>
          </div>
        </div>

        {/* Video Embed */}
        {notice.video_url && (() => {
          const embedUrl = getYouTubeEmbedUrl(notice.video_url);
          if (embedUrl) {
            return (
              <div style={{ marginBottom: '2rem', position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '8px' }}>
                <iframe
                  src={embedUrl}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none', borderRadius: '8px' }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="영상"
                />
              </div>
            );
          }
          return (
            <div style={{ marginBottom: '2rem', padding: '1rem', background: 'var(--color-bg)', borderRadius: '8px' }}>
              <a href={notice.video_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)' }}>
                🎬 영상 링크 바로가기 →
              </a>
            </div>
          );
        })()}

        {/* Content */}
        <div style={{
          whiteSpace: 'pre-line',
          lineHeight: 1.9,
          color: 'var(--color-text-secondary)',
          minHeight: '200px',
          fontSize: 'var(--fs-base)',
        }}>
          {notice.content}
        </div>

        {/* Attachments */}
        {attachments.length > 0 && (
          <div style={{
            marginTop: '2rem',
            padding: '1.25rem',
            background: 'var(--color-bg)',
            borderRadius: '8px',
            border: '1px solid var(--color-border-light)',
          }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--color-text)' }}>
              📎 첨부파일 ({attachments.length})
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {attachments.map(att => (
                <div key={att.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.75rem', background: 'var(--color-surface)', borderRadius: '4px', border: '1px solid var(--color-border-light)' }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--color-text)' }}>
                    {att.original_file_name} <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>({att.file_size})</span>
                  </span>
                  {isLoggedIn ? (
                    <a href={att.file_path} download style={{ padding: '0.25rem 0.75rem', background: 'var(--color-primary)', color: '#fff', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>
                      다운로드
                    </a>
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>로그인 필요</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{
          marginTop: '3rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid var(--color-border)',
          display: 'flex',
          justifyContent: 'center',
          gap: '0.75rem',
          flexWrap: 'wrap',
        }}>
          {isAdmin && (
            <>
              <Link href={`/news/notices/${notice.id}/edit`} style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.75rem 1.5rem', background: 'var(--color-surface)', color: 'var(--color-text)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius)', fontWeight: 600, fontSize: 'var(--fs-sm)',
              }}>
                수정
              </Link>
              <DeletePostButton boardType="notices" postId={notice.id} redirectUrl="/news/notices" />
            </>
          )}
          <Link href="/news/notices" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.75rem 2rem', background: 'var(--color-primary)', color: '#fff',
            borderRadius: 'var(--radius)', fontWeight: 600, fontSize: 'var(--fs-base)',
          }}>
            목록으로
          </Link>
        </div>
      </article>
    </SubPageLayout>
  );
}

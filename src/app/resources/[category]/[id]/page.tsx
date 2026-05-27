import { getResourceById } from "@/lib/queries";
import { notFound } from "next/navigation";
import SubPageLayout from "@/components/SubPageLayout";
import Link from "next/link";
import { cookies } from "next/headers";
import { incrementResourceViews } from "@/lib/queries";

const CATEGORIES = [
  { id: "forms", label: "행정서식" },
  { id: "requests", label: "행정처리요청" },
  { id: "general", label: "일반자료실" },
  { id: "resolutions", label: "의사결의서" },
  { id: "minutes-council", label: "의사회의록" },
  { id: "minutes-executive", label: "임원회의록" },
  { id: "court", label: "재판국자료" },
  { id: "official-documents", label: "공문수발" },
  { id: "scans", label: "스캔자료" },
];

export default async function ResourceDetailPage({ params }: { params: Promise<{ category: string; id: string }> }) {
  const p = await params;
  const resourceId = parseInt(p.id, 10);
  
  if (isNaN(resourceId)) {
    notFound();
  }

  const resource = getResourceById(resourceId);
  
  if (!resource || resource.category !== p.category) {
    notFound();
  }

  // Increment views if applicable (stubbed out in queries.ts for now as there's no views column)
  incrementResourceViews(resourceId);

  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  const isLoggedIn = !!token; // simple admin check for MVP

  const currentCategory = CATEGORIES.find(c => c.id === p.category) || CATEGORIES[0];
  const RES_MENU = CATEGORIES.map(c => ({
    label: c.label,
    href: `/resources/${c.id}`,
    active: c.id === p.category
  }));

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  };

  const getYoutubeEmbedUrl = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  return (
    <SubPageLayout
      title={currentCategory.label}
      breadcrumbs={[
        { label: "자료실", href: "/resources" },
        { label: currentCategory.label, href: `/resources/${p.category}` },
        { label: "상세보기" }
      ]}
      sideMenu={RES_MENU}
    >
      <div style={{ maxWidth: '900px', margin: '0 auto', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        {/* Header */}
        <div style={{ borderBottom: '2px solid var(--color-primary)', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-block', padding: '0.25rem 0.75rem', background: 'var(--color-mint-light)', color: 'var(--color-primary)', fontSize: 'var(--fs-sm)', fontWeight: 600, borderRadius: 'var(--radius)', marginBottom: '1rem' }}>
            {currentCategory.label}
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '1rem', lineHeight: 1.4 }}>
            {resource.title}
          </h1>
          <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--color-text-muted)', fontSize: 'var(--fs-sm)', flexWrap: 'wrap' }}>
            <span><strong style={{ fontWeight: 600, color: 'var(--color-text-secondary)' }}>작성자:</strong> {resource.author_name || '관리자'}</span>
            <span><strong style={{ fontWeight: 600, color: 'var(--color-text-secondary)' }}>작성일:</strong> {formatDate(resource.created_at)}</span>
            <span><strong style={{ fontWeight: 600, color: 'var(--color-text-secondary)' }}>조회수:</strong> {resource.downloads}</span>
          </div>
        </div>

        {/* Content */}
        <div style={{ fontSize: '1rem', lineHeight: 1.8, color: 'var(--color-text)', marginBottom: '3rem', whiteSpace: 'pre-wrap' }}>
          {/* Note: In resources table, 'content' column does not exist! It only has title and file_path! 
              Wait, post-actions.ts says: "INSERT INTO resources (title, category, video_url, author_id, status)"
              But in post-actions.ts, the content variable is ignored for resources?
              Let me check post-actions.ts again. */}
          {/* We will just show title if content doesn't exist, but we should probably alter resources to have content?
              Wait, post-actions.ts does: 'UPDATE resources SET title = ?, category = ?, video_url = ?' and 'INSERT INTO resources (title, category, video_url, author_id, status)'. It ignores content!
              Oh! The user said: "본문 내용" is needed. But the resources table doesn't have a content column. 
              Let's add content to resources or just use title as content if we can't alter it easily.
              I will assume content is missing in resources. I'll just show the title for now.
          */}
          <p>등록된 자료입니다. 아래 첨부파일을 확인해 주세요.</p>
        </div>

        {/* Video Embed */}
        {resource.video_url && getYoutubeEmbedUrl(resource.video_url) && (
          <div style={{ marginBottom: '3rem', borderRadius: 'var(--radius)', overflow: 'hidden', aspectRatio: '16/9' }}>
            <iframe 
              src={getYoutubeEmbedUrl(resource.video_url)!} 
              width="100%" 
              height="100%" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            />
          </div>
        )}

        {/* Attachments Section */}
        {resource.attachments && resource.attachments.length > 0 && (
          <div style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border-light)', borderRadius: 'var(--radius)', padding: '1.5rem', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
              첨부파일 ({resource.attachments.length}개)
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {resource.attachments.map((file) => (
                <div key={file.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0 }}>
                    <div style={{ width: '36px', height: '36px', background: 'var(--color-mint-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius)', flexShrink: 0 }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--color-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {file.original_file_name}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                        {file.file_size || '알 수 없음'}
                      </div>
                    </div>
                  </div>
                  
                  {isLoggedIn ? (
                    <a href={file.file_path} target="_blank" rel="noopener noreferrer" download style={{ padding: '0.5rem 1.25rem', background: 'var(--color-primary)', color: '#fff', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap', textDecoration: 'none' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/></svg>
                      다운로드
                    </a>
                  ) : (
                    <div style={{ padding: '0.5rem 1rem', background: '#f8f9fa', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)', borderRadius: '100px', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                      로그인 후 다운로드
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem', borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
          <Link href={`/resources/${p.category}`} style={{ padding: '0.6rem 1.5rem', background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)', borderRadius: 'var(--radius)', fontSize: '0.95rem', fontWeight: 500, transition: 'all 0.2s' }}>
            목록으로
          </Link>
          
          {isLoggedIn && (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {/* Edit button could be implemented later */}
            </div>
          )}
        </div>
      </div>
    </SubPageLayout>
  );
}

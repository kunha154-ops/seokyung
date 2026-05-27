import SubPageLayout from "@/components/SubPageLayout";
import VideoGalleryCreateForm from "@/components/gallery/VideoGalleryCreateForm";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = {
  title: "새 영상 등록 | 서경노회",
};

export default async function NewVideoGalleryPage() {
  const session = await auth();

  // 비로그인 사용자 차단 및 안내
  if (!session?.user) {
    return (
      <SubPageLayout
        title="영상갤러리 등록"
        breadcrumbs={[
          { label: "게시판", href: "/news" },
          { label: "영상갤러리", href: "/gallery/videos" },
          { label: "새 영상 등록" }
        ]}
      >
        <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          <h2 style={{ fontSize: '1.25rem', color: '#333', marginBottom: '1rem' }}>로그인이 필요합니다</h2>
          <p style={{ color: '#666', marginBottom: '2rem' }}>갤러리에 영상을 등록하려면 로그인이 필요합니다.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/gallery/videos" style={{ padding: '0.75rem 1.5rem', background: '#f1f5f9', color: '#475569', borderRadius: '8px', fontWeight: 600 }}>
              이전으로
            </Link>
            <Link href="/admin/login" style={{ padding: '0.75rem 1.5rem', background: 'var(--color-primary)', color: '#fff', borderRadius: '8px', fontWeight: 600 }}>
              로그인하기
            </Link>
          </div>
        </div>
      </SubPageLayout>
    );
  }

  return (
    <SubPageLayout
      title="새 영상 등록"
      breadcrumbs={[
        { label: "게시판", href: "/news" },
        { label: "영상갤러리", href: "/gallery/videos" },
        { label: "새 영상 등록" }
      ]}
    >
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '0.5rem' }}>영상갤러리 등록</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>외부 유튜브 영상 URL을 연결하거나 영상 파일을 직접 업로드할 수 있습니다.</p>
      </div>
      
      <VideoGalleryCreateForm />
    </SubPageLayout>
  );
}

import SubPageLayout from "@/components/SubPageLayout";
import { getGalleryPostById } from "@/lib/queries";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import VideoGalleryEditForm from "@/components/gallery/VideoGalleryEditForm";

export const metadata = {
  title: "영상 수정 | 서경노회",
};

export default async function EditVideoGalleryPage({ params }: { params: Promise<{ id: string }> }) {
  const p = await params;
  const postId = parseInt(p.id, 10);
  
  if (isNaN(postId)) notFound();

  const post = getGalleryPostById(postId);
  if (!post || post.type !== 'video') notFound();

  const session = await auth();
  const isLoggedIn = !!session?.user;
  const isAuthorOrAdmin = isLoggedIn && (session.user.role === 'admin' || session.user.id === String(post.author_id));

  if (!isAuthorOrAdmin) {
    redirect(`/gallery/video/${post.id}`);
  }

  return (
    <SubPageLayout
      title="영상 수정"
      breadcrumbs={[
        { label: "게시판", href: "/news" },
        { label: "영상갤러리", href: "/gallery/videos" },
        { label: "영상 수정" }
      ]}
    >
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '0.5rem' }}>영상 정보 수정</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>영상의 제목과 설명을 수정합니다. (현재 영상 파일 자체 수정은 지원되지 않습니다.)</p>
      </div>
      
      <VideoGalleryEditForm post={post as any} />
    </SubPageLayout>
  );
}

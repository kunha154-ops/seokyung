import SubPageLayout from "@/components/SubPageLayout";
import { getGalleryPostById } from "@/lib/queries";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import PhotoGalleryEditForm from "@/components/gallery/PhotoGalleryEditForm";

export const metadata = {
  title: "앨범 수정 | 서경노회",
};

export default async function EditPhotoGalleryPage({ params }: { params: Promise<{ id: string }> }) {
  const p = await params;
  const postId = parseInt(p.id, 10);
  
  if (isNaN(postId)) notFound();

  const post = getGalleryPostById(postId);
  if (!post || post.type !== 'photo') notFound();

  const session = await auth();
  const isLoggedIn = !!session?.user;
  const isAuthorOrAdmin = isLoggedIn && (session.user.role === 'admin' || session.user.id === String(post.author_id));

  if (!isAuthorOrAdmin) {
    redirect(`/gallery/photo/${post.id}`);
  }

  return (
    <SubPageLayout
      title="앨범 수정"
      breadcrumbs={[
        { label: "게시판", href: "/news" },
        { label: "포토갤러리", href: "/gallery/photos" },
        { label: "앨범 수정" }
      ]}
    >
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '0.5rem' }}>앨범 수정</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>앨범의 제목과 설명을 수정합니다. (현재 사진 수정은 지원되지 않으며, 필요시 새로 등록해 주세요.)</p>
      </div>
      
      <PhotoGalleryEditForm post={post as any} />
    </SubPageLayout>
  );
}

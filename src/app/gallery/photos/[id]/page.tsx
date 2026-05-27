import Link from "next/link";
import Image from "next/image";
import SubPageLayout from "@/components/SubPageLayout";
import { getGalleryPostById } from "@/lib/queries";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

const GALLERY_MENU = [
  { label: "포토갤러리", href: "/gallery/photos", active: true },
  { label: "영상갤러리", href: "/gallery/videos" },
];

export const metadata = { title: "포토갤러리" };

export default async function PhotoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  const isLoggedIn = !!token;

  const { id } = await params;
  const albumId = id;
  const album = getGalleryPostById(Number(albumId));
  if (!album) return notFound();
  const photos = album.media || [];

  if (!album) {
    return (
      <SubPageLayout
        title="포토갤러리"
        breadcrumbs={[
          { label: "갤러리", href: "/gallery" },
          { label: "포토갤러리", href: "/gallery/photos" },
          { label: "앨범 없음" },
        ]}
        sideMenu={GALLERY_MENU}
      >
        <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--color-text-muted)' }}>
          <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>해당 앨범을 찾을 수 없습니다.</p>
          <Link href="/gallery/photos" style={{
            padding: '0.625rem 1.25rem', background: 'var(--color-primary)', color: '#fff',
            borderRadius: 'var(--radius)', textDecoration: 'none', fontWeight: 600,
          }}>목록으로 돌아가기</Link>
        </div>
      </SubPageLayout>
    );
  }

  return (
    <SubPageLayout
      title="포토갤러리"
      breadcrumbs={[
        { label: "갤러리", href: "/gallery" },
        { label: "포토갤러리", href: "/gallery/photos" },
        { label: album.title },
      ]}
      sideMenu={GALLERY_MENU}
    >
      <article>
        <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '2px solid var(--color-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>{album.title}</h2>
            <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-sm)' }}>
              {new Date(album.created_at).toLocaleDateString()} · {photos.length}장
            </span>
            {album.description && (
              <p style={{ marginTop: '0.5rem', color: '#4b5563', fontSize: '0.95rem' }}>{album.description}</p>
            )}
          </div>
          {isLoggedIn && (
            <Link 
              href={`/admin/gallery/${album.id}`}
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
              + 사진 업로드 / 관리
            </Link>
          )}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1rem',
        }}>
          {photos.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280', gridColumn: '1 / -1' }}>
              등록된 사진이 없습니다.
            </div>
          ) : (
            photos.map((img) => (
              <div key={img.id} style={{
                position: 'relative', aspectRatio: '4/3', borderRadius: 'var(--radius-md)', overflow: 'hidden',
                background: 'var(--color-border-light)',
              }}>
                <Image src={img.file_path} alt={img.file_name || album.title} fill sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: 'cover' }} />
                {img.file_name && (
                  <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', background: 'rgba(0,0,0,0.6)', color: 'white', padding: '0.5rem', fontSize: '0.85rem' }}>
                    {img.file_name}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <Link href="/gallery/photos" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.75rem 2rem', background: 'var(--color-primary)', color: '#fff',
            borderRadius: 'var(--radius)', textDecoration: 'none', fontWeight: 600,
          }}>목록으로</Link>
        </div>
      </article>
    </SubPageLayout>
  );
}

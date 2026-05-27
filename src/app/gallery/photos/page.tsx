import Link from "next/link";
import Image from "next/image";
import SubPageLayout from "@/components/SubPageLayout";
import styles from "./photos.module.css";
import { getGalleryPosts } from "@/lib/queries";
import { auth } from "@/lib/auth";

export const dynamic = 'force-dynamic';

const GALLERY_MENU = [
  { label: "포토갤러리", href: "/gallery/photos", active: true },
  { label: "영상갤러리", href: "/gallery/videos" },
];

export default async function PhotosPage() {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  const { posts } = getGalleryPosts('photo', 1, 50, false);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return dateString.substring(0, 10).replace(/-/g, '.');
  };

  return (
    <SubPageLayout
      title="포토갤러리"
      breadcrumbs={[
        { label: "갤러리", href: "/gallery" },
        { label: "포토갤러리" },
      ]}
      sideMenu={GALLERY_MENU}
    >
      <div className={styles.galleryTopActions}>
        {isLoggedIn ? (
          <Link 
            href="/gallery/photo/new" 
            style={{ 
              padding: '0.65rem 1.25rem', 
              backgroundColor: 'var(--color-primary)', 
              color: 'white', 
              borderRadius: 'var(--radius)', 
              fontSize: '0.9rem', 
              fontWeight: 600,
              textDecoration: 'none'
            }}
          >
            + 새 앨범 등록
          </Link>
        ) : (
          <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flex: 1 }}>
            <span style={{ color: '#666', fontSize: '0.9rem' }}>로그인 후 사진을 등록할 수 있습니다.</span>
            <Link href="/admin/login" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-primary)', textDecoration: 'underline' }}>로그인하기</Link>
          </div>
        )}
      </div>
      
      {posts.length > 0 ? (
        <div className={styles.albumGrid}>
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/gallery/photo/${post.id}`}
              className={styles.albumCard}
            >
              <div className={styles.albumThumb}>
                {post.thumbnail_url ? (
                  <Image
                    src={post.thumbnail_url}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className={styles.albumImage}
                  />
                ) : (
                  <div className={styles.galleryPlaceholder}>이미지 없음</div>
                )}
              </div>
              <div className={styles.albumInfo}>
                <h3>{post.title}</h3>
                <p>{formatDate(post.created_at)} · 사진 {post.media_count || 0}장</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <p>등록된 포토갤러리가 없습니다.</p>
        </div>
      )}
    </SubPageLayout>
  );
}

import Image from "next/image";
import Link from "next/link";
import ScrollRevealWrapper from "@/components/common/ScrollRevealWrapper";
import styles from "./GalleryPreview.module.css";
import { getGalleryPosts } from "@/lib/queries";

export default function GalleryPreview() {
  const { posts } = getGalleryPosts('photo', 1, 4, false); // Show top 4

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return dateString.substring(0, 10).replace(/-/g, '.');
  };

  return (
    <ScrollRevealWrapper as="section" className={styles.homeGallerySection} threshold={0.1} ariaLabel="포토갤러리">
      <div className={`${styles.sectionHeader} reveal-up reveal-stagger-0`}>
        <div>
          <p className={styles.eyebrow}>포토갤러리</p>
          <h2>
            노회의 <span>순간들</span>
          </h2>
        </div>
        <Link href="/gallery/photos" className={styles.viewAllLink}>
          전체보기
        </Link>
      </div>

      <div className={styles.homeGalleryGrid}>
        {posts.map((post, index) => (
          <Link
            key={post.id}
            href={`/gallery/photo/${post.id}`}
            className={`${styles.homeGalleryCard} reveal-up reveal-stagger-${index + 1}`}
          >
            <div className={styles.homeGalleryThumb}>
              {post.thumbnail_url ? (
                <Image
                  src={post.thumbnail_url}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className={styles.homeGalleryImage}
                />
              ) : (
                <div className={styles.galleryPlaceholder}>이미지 없음</div>
              )}
            </div>

            <div className={styles.homeGalleryBody}>
              <h3>{post.title}</h3>
              <p>{formatDate(post.created_at)} · 사진 {post.media_count || 0}장</p>
            </div>
          </Link>
        ))}
      </div>
    </ScrollRevealWrapper>
  );
}

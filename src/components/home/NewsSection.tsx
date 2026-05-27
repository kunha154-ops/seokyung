import Image from "next/image";
import Link from "next/link";
import ScrollRevealWrapper from "@/components/common/ScrollRevealWrapper";
import styles from "./NewsSection.module.css";
import { getNotices, getNewsList } from "@/lib/queries";

export default function NewsSection() {
  const { notices } = getNotices(1, 5);
  const { news } = getNewsList(1, 1);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  };

  const featured = news[0];

  return (
    <ScrollRevealWrapper as="section" className={styles.section} threshold={0.15} ariaLabel="소식">
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Featured article */}
          <div className={`${styles.featured} reveal-up reveal-stagger-0`}>
            <div className={styles.featuredHeader}>
              <span className={styles.eyebrow}>최근 소식</span>
              <h2 className={styles.sectionTitle}>노회 이야기</h2>
            </div>
            {featured ? (
              <Link href={`/news/updates/${featured.id}`} className={styles.featuredCard}>
                <div className={styles.featuredImage}>
                  <Image
                    src="/images/community.jpg"
                    alt={featured.title}
                    fill
                    sizes="(max-width: 899px) 100vw, 560px"
                    className={styles.featuredImg}
                  />
                </div>
                <div className={styles.featuredBody}>
                  <span className={styles.featuredDate}>{formatDate(featured.created_at)}</span>
                  <h3 className={styles.featuredTitle}>{featured.title}</h3>
                  <p className={styles.featuredExcerpt}>{featured.content.slice(0, 100)}...</p>
                </div>
              </Link>
            ) : (
              <div className={styles.featuredCard}>
                <div className={styles.featuredBody}>
                  <p className={styles.featuredExcerpt}>아직 등록된 소식이 없습니다.</p>
                </div>
              </div>
            )}
          </div>

          {/* Notice list */}
          <div className={`${styles.notices} reveal-up reveal-stagger-1`}>
            <div className={styles.noticesHeader}>
              <span className={styles.eyebrow}>공지사항</span>
              <h2 className={styles.sectionTitle}>주요 공지</h2>
            </div>
            <ul className={styles.noticeList}>
              {notices.map((item) => (
                <li key={item.id}>
                  <Link href={`/news/notices/${item.id}`} className={styles.noticeItem}>
                    <span className={styles.noticeTitle}>{item.title}</span>
                    <span className={styles.noticeDate}>{formatDate(item.created_at)}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/news/notices" className={styles.viewAll}>
              전체보기
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
          </div>
        </div>
      </div>
    </ScrollRevealWrapper>
  );
}

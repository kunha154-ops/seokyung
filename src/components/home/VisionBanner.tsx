import Image from "next/image";
import Link from "next/link";
import ScrollRevealWrapper from "@/components/common/ScrollRevealWrapper";
import styles from "./VisionBanner.module.css";

export default function VisionBanner() {
  return (
    <ScrollRevealWrapper as="section" className={styles.section} threshold={0.3} ariaLabel="비전">
      <Image
        src="/images/vision-group.jpg"
        alt=""
        fill
        sizes="100vw"
        className={styles.bgImage}
      />
      <div className={styles.overlay} />
      <div className={styles.content}>
        <span className={`${styles.eyebrow} reveal-up reveal-stagger-0`}>Our Vision</span>
        <h2 className={`${styles.title} reveal-up reveal-stagger-1`}>
          복음으로 하나 되어,<br />
          <em>세상을 섬기는</em> 공동체
        </h2>
        <p className={`${styles.desc} reveal-fade reveal-stagger-2`}>
          서경노회는 그리스도의 사랑 안에서 교회와 교회가 연합하여,<br />
          지역사회와 세계를 향한 선교의 사명을 감당합니다.
        </p>
        <div className="reveal-fade reveal-stagger-3">
          <Link href="/about/greeting" className={styles.cta}>
            노회 소개 보기
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </Link>
        </div>
      </div>
    </ScrollRevealWrapper>
  );
}

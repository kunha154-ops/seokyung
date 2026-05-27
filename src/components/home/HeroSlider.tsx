"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./HeroSlider.module.css";

const SLIDES = [
  {
    image: "/images/slide1.jpg",
    imageAlt: "푸른 하늘 십자가",
    objectPosition: "right center", // 십자가가 우측에 있으므로 잘리지 않게 조정
    subtitle: "신뢰와 은혜",
    title: <>세상의 빛이 되는<br />거룩한 발걸음</>,
    desc: "따뜻한 교제와 협력으로 하나님 나라를 확장합니다.",
    cta: { label: "노회 현황", href: "/organization/districts" },
  },
  {
    image: "/images/slide2.jpg",
    imageAlt: "서경노회 예배당 내부",
    objectPosition: "center center",
    subtitle: "대한예수교장로회 서경노회",
    title: <>교회와 교회를 잇고,<br />복음의 사명을 함께 감당하는 공동체</>,
    desc: "바른 신학과 신앙 위에서 교회의 본질을 지켜갑니다.",
    cta: { label: "노회 소개", href: "/about/greeting" },
  },
  {
    image: "/images/slide3.jpg",
    imageAlt: "서경노회 행사 단체사진",
    objectPosition: "center center",
    subtitle: "대한예수교장로회 서경노회",
    title: <>질서와 신뢰,<br />복음의 사명으로 잇는 공동체</>,
    desc: "바른 신학과 신앙 위에서 교회의 본질을 지켜갑니다.",
    cta: { label: "공지사항", href: "/news/notices" },
  },
  {
    image: "/images/slide4.png",
    imageAlt: "서경노회 정기회 진행 사진",
    objectPosition: "center center",
    subtitle: "복음의 사명",
    title: <>세상을 향해<br />그리스도의 사랑을 전합니다</>,
    desc: "따뜻한 교제와 협력으로 하나님 나라를 확장하는 공동체",
    cta: { label: "포토갤러리", href: "/gallery/photos" },
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const goTo = useCallback(
    (idx: number) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setCurrent(idx);
      setTimeout(() => setIsAnimating(false), 800);
    },
    [isAnimating]
  );

  useEffect(() => {
    // 마지막 슬라이드인 경우 다음으로 넘어가지 않음 (반복 중지)
    if (current >= SLIDES.length - 1) return;

    const timer = setInterval(() => goTo(current + 1), 7000);
    return () => clearInterval(timer);
  }, [current, goTo]);

  const slide = SLIDES[current];

  return (
    <section className={styles.hero} aria-label="메인 비주얼">
      {/* Background images */}
      {SLIDES.map((s, i) => (
        <div
          key={i}
          className={`${styles.bgSlide} ${i === current ? styles.bgActive : ""}`}
        >
          <Image
            src={s.image}
            alt={s.imageAlt}
            fill
            priority={i === 0}
            sizes="100vw"
            quality={100}
            unoptimized={true}
            className={styles.bgImage}
            style={{ objectPosition: s.objectPosition }}
          />
        </div>
      ))}

      {/* Dark overlay */}
      <div className={styles.overlay} />

      {/* Content */}
      <div className={`${styles.heroContent} is-revealed`} key={`c-${current}`}>
        <span className={`${styles.heroLabel} reveal-up reveal-stagger-1`}>{slide.subtitle}</span>
        <h1 className="reveal-up reveal-stagger-2">
          {slide.title}
        </h1>
        <p className="reveal-fade reveal-stagger-3">
          {slide.desc}
        </p>
        <div className={`${styles.heroActions} reveal-fade reveal-stagger-4`}>
          <Link href={slide.cta.href} className={styles.heroPrimaryButton}>
            {slide.cta.label}
          </Link>
          <Link href="/resources/forms" className={styles.heroSecondaryButton}>
            자료실 바로가기
          </Link>
        </div>
      </div>

      {/* Navigation - Only show if multiple slides */}
      {SLIDES.length > 1 && (
        <div className={styles.nav}>
          <div className={styles.navInner}>
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`${styles.navDot} ${i === current ? styles.navDotActive : ""}`}
                aria-label={`슬라이드 ${i + 1}`}
              >
                <span className={styles.navDotBar} />
              </button>
            ))}
            <span className={styles.navCount}>
              {String(current + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
            </span>
          </div>
        </div>
      )}

      {/* Scroll indicator */}
      <div className={styles.scrollIndicator}>
        <div className={styles.scrollLine} />
      </div>
    </section>
  );
}

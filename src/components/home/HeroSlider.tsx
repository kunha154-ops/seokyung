"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./HeroSlider.module.css";

import type { HeroSlide } from "@/actions/hero";

export default function HeroSlider({ initialSlides = [] }: { initialSlides?: HeroSlide[] }) {
  // If no slides are returned from DB, use a default fallback slide
  const SLIDES = initialSlides.length > 0 ? initialSlides : [
    {
      id: 0,
      subtitle: "복음의 사명",
      title: "세상을 향해<br />그리스도의 사랑을 전합니다",
      description: "따뜻한 교제와 협력으로 하나님 나라를 확장하는 공동체",
      desktop_image: "/images/slide4.png",
      mobile_image: null,
      object_position: "center center",
      primary_btn_text: "포토갤러리",
      primary_btn_link: "/gallery/photos",
      secondary_btn_text: "자료실 바로가기",
      secondary_btn_link: "/resources/forms",
    }
  ];

  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

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
  }, [current, goTo, SLIDES.length]);

  const slide = SLIDES[current];

  return (
    <section className={styles.hero} aria-label="메인 비주얼">
      {/* Background images */}
      {SLIDES.map((s, i) => {
        const hasMobileImage = typeof s.mobile_image === "string" && s.mobile_image.trim().length > 0 && s.mobile_image !== "null" && s.mobile_image !== "undefined";
        const hasDesktopImage = typeof s.desktop_image === "string" && s.desktop_image.trim().length > 0;
        
        // 에러 상태인 경우 보여주지 않음
        const desktopError = imageErrors[`desktop_${s.id}`];
        const mobileError = imageErrors[`mobile_${s.id}`];

        return (
          <div
            key={s.id}
            className={`${styles.bgSlide} ${i === current ? styles.bgActive : ""}`}
            style={{ 
              '--desktop-focal': s.object_position || 'center center',
              '--mobile-focal': 'center top' // 모바일 기본 crop은 center top으로 하여 피사체 유지
            } as React.CSSProperties}
          >
            {hasDesktopImage && !desktopError && (
              <Image
                src={s.desktop_image}
                alt=""
                fill
                priority={i === 0}
                sizes="100vw"
                quality={100}
                unoptimized={true}
                className={`${styles.bgImage} ${hasMobileImage && !mobileError ? styles.desktopOnly : ''}`}
                onError={() => setImageErrors(prev => ({ ...prev, [`desktop_${s.id}`]: true }))}
              />
            )}
            {hasMobileImage && !mobileError && (
              <Image
                src={s.mobile_image as string}
                alt=""
                fill
                priority={i === 0}
                sizes="100vw"
                quality={100}
                unoptimized={true}
                className={`${styles.bgImage} ${styles.mobileOnly}`}
                onError={() => setImageErrors(prev => ({ ...prev, [`mobile_${s.id}`]: true }))}
              />
            )}
          </div>
        );
      })}

      {/* Dark overlay */}
      <div className={styles.overlay} />

      {/* Content */}
      <div className={`${styles.heroContent} is-revealed`} key={`c-${current}`}>
        {slide.subtitle && <span className={`${styles.heroLabel} reveal-up reveal-stagger-1`}>{slide.subtitle}</span>}
        <h1 className="reveal-up reveal-stagger-2" dangerouslySetInnerHTML={{ __html: slide.title }} />
        {slide.description && (
          <p className="reveal-fade reveal-stagger-3">
            {slide.description}
          </p>
        )}
        <div className={`${styles.heroActions} reveal-fade reveal-stagger-4`}>
          {slide.primary_btn_text && slide.primary_btn_link && (
            <Link href={slide.primary_btn_link} className={styles.heroPrimaryButton}>
              {slide.primary_btn_text}
            </Link>
          )}
          {slide.secondary_btn_text && slide.secondary_btn_link && (
            <Link href={slide.secondary_btn_link} className={styles.heroSecondaryButton}>
              {slide.secondary_btn_text}
            </Link>
          )}
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

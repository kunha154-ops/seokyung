"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import UserMenu from "@/components/UserMenu";
import styles from "./Header.module.css";

const NAV_ITEMS = [
  {
    label: "노회소개",
    href: "/about",
    sub: [
      { label: "인사말", href: "/about/greeting" },
      { label: "역사와 비전", href: "/about/history" },
      { label: "규칙", href: "/about/rules" },
    ],
  },
  {
    label: "조직",
    href: "/organization/executives",
    sub: [
      { label: "임원진", href: "/organization/executives" },
      { label: "상비부", href: "/organization/departments" },
      { label: "상설위원회", href: "/organization/standing-committees" },
      { label: "시찰회", href: "/organization/districts" },
      { label: "조직도", href: "/organization/chart" },
    ],
  },
  {
    label: "소식",
    href: "/news",
    sub: [
      { label: "공지사항", href: "/news/notices" },
      { label: "노회 소식", href: "/news/updates" },
    ],
  },
  {
    label: "갤러리",
    href: "/gallery",
    sub: [
      { label: "포토갤러리", href: "/gallery/photos" },
      { label: "영상갤러리", href: "/gallery/videos" },
    ],
  },
  {
    label: "자료실",
    href: "/resources",
    sub: [
      { label: "행정서식", href: "/resources/forms" },
      { label: "행정처리요청", href: "/resources/requests" },
      { label: "일반자료실", href: "/resources/general" },
      { label: "의사결의서", href: "/resources/resolutions" },
      { label: "의사회의록", href: "/resources/minutes-council" },
      { label: "임원회의록", href: "/resources/minutes-executive" },
      { label: "재판국자료", href: "/resources/court" },
      { label: "공문수발", href: "/resources/official-documents" },
      { label: "스캔자료", href: "/resources/scans" },
    ],
  },
  {
    label: "선교위원회",
    href: "/mission",
    sub: [
      { label: "선교사동향", href: "/mission/trends" },
      { label: "재정보고", href: "/mission/finance" },
      { label: "공지사항", href: "/mission/notices" },
      { label: "특별후원금", href: "/mission/donations" },
      { label: "사업활동", href: "/mission/activities" },
    ],
  },
  {
    label: "자립위원회",
    href: "/self-reliance",
    sub: [
      { label: "재정보고", href: "/self-reliance/finance" },
      { label: "공지사항", href: "/self-reliance/notices" },
      { label: "특별후원금", href: "/self-reliance/donations" },
      { label: "사업활동", href: "/self-reliance/activities" },
    ],
  },
  {
    label: "교육위원회",
    href: "/education",
    sub: [
      { label: "재정보고", href: "/education/finance" },
      { label: "공지사항", href: "/education/notices" },
      { label: "특별후원금", href: "/education/donations" },
      { label: "사업활동", href: "/education/activities" },
    ],
  },

];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isTransparent = isHome && !isScrolled && !mobileOpen;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <header
      className={`${styles.header} ${isScrolled ? styles.scrolled : ""} ${isTransparent ? styles.transparent : ""}`}
    >
      <div className={styles.inner}>
        {/* Logo */}
        <Link href="/" className={styles.logo} aria-label="서경노회 홈">
          <div className={styles.logoWrapper}>
            <Image 
              src="/images/logo.png" 
              alt="대한예수교장로회 서경노회 로고" 
              fill 
              sizes="(max-width: 768px) 200px, 320px"
              style={{ objectFit: 'contain', objectPosition: 'left center' }} 
            />
          </div>
        </Link>

        {/* Main Nav (Center) */}
        <nav className={styles.nav} aria-label="주 메뉴">
          <ul className={styles.navList}>
            {NAV_ITEMS.map((item, idx) => (
              <li
                key={item.href}
                className={styles.navItem}
                onMouseEnter={() => setActiveDropdown(idx)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link href={item.href} className={styles.navLink}>
                  {item.label}
                </Link>
                {item.sub && activeDropdown === idx && (
                  <ul className={styles.dropdown}>
                    {item.sub.map((sub) => (
                      <li key={sub.href}>
                        <Link href={sub.href} className={styles.dropdownLink}>
                          {sub.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Top Utility Bar (Right) */}
        <div className={styles.topBar}>
          <UserMenu />
        </div>

        {/* Mobile Toggle */}
        <button
          className={`${styles.hamburger} ${mobileOpen ? styles.hamburgerOpen : ""}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="메뉴 열기/닫기"
          aria-expanded={mobileOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className={styles.mobileOverlay} onClick={() => setMobileOpen(false)}>
          <nav
            className={styles.mobileNav}
            onClick={(e) => e.stopPropagation()}
            aria-label="모바일 메뉴"
          >
            {NAV_ITEMS.map((item) => (
              <div key={item.href} className={styles.mobileGroup}>
                <Link
                  href={item.href}
                  className={styles.mobileGroupTitle}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
                {item.sub && (
                  <ul className={styles.mobileSubList}>
                    {item.sub.map((sub) => (
                      <li key={sub.href}>
                        <Link
                          href={sub.href}
                          className={styles.mobileSubLink}
                          onClick={() => setMobileOpen(false)}
                        >
                          {sub.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

"use client";

import Link from "next/link";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import styles from "./QuickAccess.module.css";

const ITEMS = [
  {
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
    label: "공지사항",
    href: "/news/notices",
  },
  {
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
    label: "자료실",
    href: "/resources/forms",
  },
  {
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>,
    label: "포토갤러리",
    href: "/gallery/photos",
  },
  {
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    label: "노회소개",
    href: "/about/greeting",
  },
];

export default function QuickAccess() {
  const { ref, isRevealed } = useScrollReveal({ threshold: 0.1 });

  return (
    <section className={`${styles.quickLinksWrap} ${isRevealed ? "is-revealed" : ""}`} ref={ref} aria-label="빠른 메뉴">
      <div className={styles.quickLinks}>
        {ITEMS.map((item, i) => (
          <Link key={item.href} href={item.href} className={`${styles.quickLinkItem} reveal-up reveal-stagger-${i + 1}`}>
            <div className={styles.icon}>{item.icon}</div>
            <span className={styles.label}>{item.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

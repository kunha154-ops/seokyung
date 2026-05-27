"use client";

import { useEffect, useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import styles from "./StatsSection.module.css";

const STATS = [
  { value: 55, suffix: "년+", label: "노회의 역사" },
  { value: 85, suffix: "개", label: "소속 교회" },
  { value: 120, suffix: "명+", label: "교역자·장로" },
  { value: 12, suffix: "개", label: "위원회 운영" },
];

function useCountUp(end: number, trigger: boolean, dur = 1800) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / dur, 1);
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * end));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [trigger, end, dur]);
  return count;
}

function StatCard({ s, vis, i }: { s: typeof STATS[0], vis: boolean, i: number }) {
  const count = useCountUp(s.value, vis, 1400 + i * 300);
  return (
    <div className={`${styles.statusItem} reveal-up reveal-stagger-${i + 2}`}>
      <div className={styles.statusNumber}>
        <strong>{count}</strong>
        <span>{s.suffix}</span>
      </div>
      <p>{s.label}</p>
    </div>
  );
}

export default function StatsSection() {
  const { ref, isRevealed } = useScrollReveal({ threshold: 0.3 });

  return (
    <section className={`${styles.statusSection} ${isRevealed ? "is-revealed" : ""}`} ref={ref} aria-label="노회 현황">
      <div className={styles.statusInner}>
        <div className={styles.statusHeader}>
          <span className={`${styles.statusLabel} reveal-up reveal-stagger-0`}>노회 현황</span>
          <h2 className="reveal-up reveal-stagger-1">
            함께 세워가는 <span>공동체</span>
          </h2>
          <p className="reveal-fade reveal-stagger-2">
            서경노회는 교회와 교회를 연결하며 복음의 사명을 함께 감당합니다.
          </p>
        </div>
        <div className={styles.statusGrid}>
          {STATS.map((s, i) => (
            <StatCard key={s.label} s={s} vis={isRevealed} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

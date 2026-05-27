"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import styles from "../auth.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/");
        router.refresh();
      }
    } catch {
      setError("로그인 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <div className={styles.logoInner}>
            <Image
              src="/images/logo.png"
              alt="서경노회"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>

        <div className={styles.header}>
          <h1 className={styles.title}>로그인</h1>
          <p className={styles.subtitle}>서경노회 홈페이지에 오신 것을 환영합니다</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="login-username">아이디</label>
            <input
              id="login-username"
              name="username"
              type="text"
              className={styles.input}
              placeholder="아이디를 입력하세요"
              required
              autoComplete="username"
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="login-password">비밀번호</label>
            <input
              id="login-password"
              name="password"
              type="password"
              className={styles.input}
              placeholder="비밀번호를 입력하세요"
              required
              autoComplete="current-password"
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <div className={styles.footer}>
          <p className={styles.footerText}>
            아직 회원이 아니신가요?
            <Link href="/auth/register" className={styles.footerLink}>회원가입</Link>
          </p>
          <Link href="/" className={styles.homeLink}>← 홈으로 돌아가기</Link>
        </div>
      </div>
    </div>
  );
}

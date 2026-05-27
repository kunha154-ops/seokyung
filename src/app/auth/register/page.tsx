"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { registerUser, checkUsername } from "@/app/actions/auth-actions";
import styles from "../auth.module.css";

function getPasswordStrength(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(pw)) score++;

  if (score <= 2) return { level: "weak", label: "약함", css: styles.strengthWeak };
  if (score === 3) return { level: "fair", label: "보통", css: styles.strengthFair };
  if (score === 4) return { level: "good", label: "좋음", css: styles.strengthGood };
  return { level: "strong", label: "매우 강함", css: styles.strengthStrong };
}

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [usernameStatus, setUsernameStatus] = useState<{ available?: boolean; message?: string } | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);

  const strength = password ? getPasswordStrength(password) : null;

  const handleCheckUsername = useCallback(async (username: string) => {
    if (!username || username.length < 4) {
      setUsernameStatus({ available: false, message: "아이디는 4자 이상 입력해주세요." });
      return;
    }
    setCheckingUsername(true);
    try {
      const result = await checkUsername(username);
      setUsernameStatus(result);
    } catch {
      setUsernameStatus({ available: false, message: "확인 중 오류가 발생했습니다." });
    } finally {
      setCheckingUsername(false);
    }
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    try {
      const result = await registerUser(formData);

      if (result.error) {
        setError(result.error);
      } else if (result.success) {
        router.push("/auth/login?registered=true");
      }
    } catch {
      setError("회원가입 중 오류가 발생했습니다.");
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
          <h1 className={styles.title}>회원가입</h1>
          <p className={styles.subtitle}>서경노회 홈페이지 회원이 되어주세요</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* 이름 */}
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="reg-name">이름</label>
            <input
              id="reg-name"
              name="name"
              type="text"
              className={styles.input}
              placeholder="실명을 입력하세요"
              required
              minLength={2}
              maxLength={20}
              autoComplete="name"
            />
          </div>

          {/* 아이디 + 중복확인 */}
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="reg-username">아이디</label>
            <div className={styles.inputWithBtn}>
              <input
                id="reg-username"
                name="username"
                type="text"
                className={styles.input}
                placeholder="영문, 숫자 4~20자"
                required
                minLength={4}
                maxLength={20}
                autoComplete="username"
                onChange={() => setUsernameStatus(null)}
              />
              <button
                type="button"
                className={styles.checkBtn}
                disabled={checkingUsername}
                onClick={() => {
                  const el = document.getElementById("reg-username") as HTMLInputElement;
                  handleCheckUsername(el.value);
                }}
              >
                {checkingUsername ? "확인 중..." : "중복확인"}
              </button>
            </div>
            {usernameStatus && (
              <span className={`${styles.hint} ${usernameStatus.available ? styles.hintOk : styles.hintError}`}>
                {usernameStatus.message}
              </span>
            )}
          </div>

          {/* 비밀번호 */}
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="reg-password">비밀번호</label>
            <input
              id="reg-password"
              name="password"
              type="password"
              className={styles.input}
              placeholder="8자 이상 (대/소문자, 숫자, 특수문자)"
              required
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {strength && (
              <>
                <div className={styles.strengthBar}>
                  <div className={`${styles.strengthFill} ${strength.css}`} />
                </div>
                <span className={`${styles.hint} ${styles.strengthLabel}`} style={{
                  color: strength.level === 'weak' ? '#e74c3c' :
                         strength.level === 'fair' ? '#f39c12' :
                         strength.level === 'good' ? '#2ecc71' : 'var(--color-teal)'
                }}>
                  보안 강도: {strength.label}
                </span>
              </>
            )}
            <span className={styles.hint}>
              영문 대/소문자, 숫자, 특수문자를 각 1개 이상 포함
            </span>
          </div>

          {/* 비밀번호 확인 */}
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="reg-password-confirm">비밀번호 확인</label>
            <input
              id="reg-password-confirm"
              name="passwordConfirm"
              type="password"
              className={styles.input}
              placeholder="비밀번호를 다시 입력하세요"
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "가입 처리 중..." : "회원가입"}
          </button>
        </form>

        <div className={styles.footer}>
          <p className={styles.footerText}>
            이미 회원이신가요?
            <Link href="/auth/login" className={styles.footerLink}>로그인</Link>
          </p>
          <Link href="/" className={styles.homeLink}>← 홈으로 돌아가기</Link>
        </div>
      </div>
    </div>
  );
}

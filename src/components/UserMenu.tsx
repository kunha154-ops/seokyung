"use client";

import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import styles from "./UserMenu.module.css";

export default function UserMenu() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);

  if (status === "loading") {
    return null;
  }

  if (session && session.user) {
    return (
      <div className={styles.container} onMouseLeave={() => setOpen(false)}>
        <button 
          className={styles.userButton} 
          onMouseEnter={() => setOpen(true)}
          onClick={() => setOpen(!open)}
        >
          {session.user.name || "사용자"}님 ▾
        </button>
        {open && (
          <div className={styles.dropdown}>
            <Link href="/admin" className={styles.dropdownItem}>
              관리자 페이지
            </Link>
            <button className={styles.dropdownItem} onClick={() => signOut({ callbackUrl: "/" })}>
              로그아웃
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={styles.authLinks}>
      <Link href="/auth/login" className={styles.loginLink}>로그인</Link>
      <span className={styles.authDivider}>·</span>
      <Link href="/auth/register" className={styles.registerLink}>회원가입</Link>
    </div>
  );
}

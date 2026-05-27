"use client";

import { useSession } from "next-auth/react";
import styles from "./StatusBanner.module.css";

export default function StatusBanner() {
  const { data: session } = useSession();

  if (!session?.user) return null;

  const { status, role } = session.user;

  // 관리자는 배너 불필요
  if (role === 'admin') return null;

  if (status === 'pending') {
    return (
      <div className={`${styles.banner} ${styles.pending}`}>
        회원가입 신청이 완료되었습니다. 관리자 승인 후 게시판 글쓰기와 자료실 다운로드를 이용하실 수 있습니다.
      </div>
    );
  }

  if (status === 'suspended') {
    return (
      <div className={`${styles.banner} ${styles.suspended}`}>
        이용이 제한된 계정입니다. 관리자에게 문의해주세요.
      </div>
    );
  }

  return null;
}

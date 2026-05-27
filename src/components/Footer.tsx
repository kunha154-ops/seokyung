import Link from "next/link";
import Image from "next/image";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <>
      {/* Top Bar: Related Organizations */}
      <div className={styles.topBar}>
        <div className={styles.topBarInner}>
          <a href="https://www.gapck.org" target="_blank" rel="noopener noreferrer" className={styles.topBarLink}>
            대한예수교장로회총회
          </a>
          <a href="https://www.csu.ac.kr" target="_blank" rel="noopener noreferrer" className={styles.topBarLink}>
            총신대학교
          </a>
          <a href="https://www.kidok.com" target="_blank" rel="noopener noreferrer" className={styles.topBarLink}>
            기독신문
          </a>
          <a href="https://gms.kr" target="_blank" rel="noopener noreferrer" className={styles.topBarLink}>
            총회세계선교회(GMS)
          </a>
          <a href="http://www.holybible.or.kr" target="_blank" rel="noopener noreferrer" className={styles.topBarLink}>
            홀리바이블
          </a>
        </div>
      </div>

      {/* Main Footer */}
      <footer className={styles.footer}>
        <div className={styles.inner}>
          <div className={styles.mainContent}>
            {/* Logo */}
            <div className={styles.logoArea}>
              <div className={styles.logoWrapper}>
                <Image
                  src="/images/logo.png"
                  alt="대한예수교장로회 서경노회 로고"
                  fill
                  sizes="200px"
                  style={{ objectFit: 'contain', objectPosition: 'center' }}
                />
              </div>
            </div>

            {/* Info */}
            <div className={styles.infoArea}>
              <div className={styles.infoRow}>
                <span className={styles.infoItem}>
                  <span className={styles.infoLabel}>이메일</span>
                  info@seokyung.org
                </span>
              </div>
              <p className={styles.copyright}>
                COPYRIGHT © {new Date().getFullYear()} <span className={styles.copyrightOrg}>대한예수교장로회 서경노회</span>. ALL RIGHTS RESERVED.
              </p>
            </div>

            {/* Quick Links */}
            <div className={styles.linkGroup}>
              <h4 className={styles.linkTitle}>바로가기</h4>
              <ul className={styles.linkList}>
                <li className={styles.linkItem}><Link href="/about/greeting">인사말</Link></li>
                <li className={styles.linkItem}><Link href="/news/notices">공지사항</Link></li>
                <li className={styles.linkItem}><Link href="/gallery/photos">포토갤러리</Link></li>
                <li className={styles.linkItem}><Link href="/resources/forms">자료실</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

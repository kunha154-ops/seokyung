import styles from "./SubPageLayout.module.css";
import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface SubPageLayoutProps {
  title: string;
  breadcrumbs: BreadcrumbItem[];
  sideMenu?: { label: string; href: string; active?: boolean }[];
  children: React.ReactNode;
}

export default function SubPageLayout({
  title,
  breadcrumbs,
  sideMenu,
  children,
}: SubPageLayoutProps) {
  return (
    <div className={styles.wrapper}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerInner}>
          <h1 className={styles.pageTitle}>{title}</h1>
          <nav aria-label="현재 위치" className={styles.breadcrumb}>
            <Link href="/">홈</Link>
            {breadcrumbs.map((item, idx) => (
              <span key={idx}>
                <span className={styles.sep}>›</span>
                {item.href ? (
                  <Link href={item.href}>{item.label}</Link>
                ) : (
                  <span className={styles.current}>{item.label}</span>
                )}
              </span>
            ))}
          </nav>
        </div>
      </div>

      {/* Content Area */}
      <div className={styles.content}>
        <div className={styles.inner}>
          {sideMenu && (
            <aside className={styles.sidebar} aria-label="하위 메뉴">
              <nav>
                <ul className={styles.sideList}>
                  {sideMenu.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`${styles.sideLink} ${item.active ? styles.sideLinkActive : ""}`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>
          )}
          <div className={styles.main}>{children}</div>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";

export const metadata = {
  title: "페이지를 찾을 수 없습니다",
};

export default function NotFound() {
  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center' as const,
      padding: '3rem 1.5rem',
      fontFamily: 'var(--font-body)',
    }}>
      <span style={{
        fontSize: '6rem',
        fontWeight: 700,
        color: 'var(--color-primary)',
        lineHeight: 1,
        letterSpacing: '-0.04em',
        opacity: 0.15,
      }}>404</span>
      <h1 style={{
        fontSize: '1.5rem',
        fontWeight: 600,
        color: 'var(--color-text)',
        margin: '1rem 0 0.75rem',
      }}>페이지를 찾을 수 없습니다</h1>
      <p style={{
        color: 'var(--color-text-secondary)',
        marginBottom: '2rem',
        lineHeight: 1.6,
        maxWidth: '400px',
      }}>
        요청하신 페이지가 존재하지 않거나, 주소가 변경되었을 수 있습니다.
      </p>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link href="/" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.75rem 1.5rem',
          background: 'var(--color-primary)',
          color: '#fff',
          borderRadius: 'var(--radius-md)',
          fontWeight: 600,
          fontSize: '0.95rem',
          textDecoration: 'none',
          transition: 'background var(--dur-fast) var(--ease)',
        }}>
          홈으로 돌아가기
        </Link>
        <Link href="/news/notices" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.75rem 1.5rem',
          background: 'var(--color-surface)',
          color: 'var(--color-primary)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          fontWeight: 600,
          fontSize: '0.95rem',
          textDecoration: 'none',
          transition: 'border-color var(--dur-fast) var(--ease)',
        }}>
          공지사항 보기
        </Link>
      </div>
    </div>
  );
}

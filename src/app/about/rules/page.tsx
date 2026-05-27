import SubPageLayout from "@/components/SubPageLayout";
import RuleBookClient from "@/components/RuleBookClient";

const ABOUT_MENU = [
  { label: "인사말", href: "/about/greeting" },
  { label: "조직도", href: "/about/organization" },
  { label: "역사와 비전", href: "/about/history" },
  { label: "규칙", href: "/about/rules", active: true },
];

export const metadata = { title: "규칙" };

export default function RulesPage() {
  // 실제 업로드된 이미지 파일이 총 38장이므로 38개 페이지로 설정합니다.
  const TOTAL_PAGES = 38;

  return (
    <SubPageLayout
      title="규칙"
      breadcrumbs={[
        { label: "노회소개", href: "/about" },
        { label: "규칙" },
      ]}
      sideMenu={ABOUT_MENU}
    >
      <article style={{ lineHeight: 1.8 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', fontWeight: 700, marginBottom: '0.5rem' }}>
            서경노회 노회 규칙집
          </h2>
        </div>

        {/* 
          클라이언트 전용 플립북 컴포넌트 렌더링 
        */}
        <RuleBookClient totalImages={TOTAL_PAGES} />

        <div style={{ marginTop: '4rem', padding: '1.5rem', background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-light)' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--color-primary)', fontWeight: 600, marginBottom: '1rem' }}>다운로드 안내</h3>
          <p style={{ color: 'var(--color-text)', fontSize: '0.95rem' }}>
            전체 노회 규칙집 원본 파일이 필요하신 분은 아래 버튼을 통해 다운로드하실 수 있습니다.<br/>
            (※ 차후 PDF 파일이 준비되면 링크가 연결됩니다)
          </p>
          <button style={{ marginTop: '1rem', padding: '0.6rem 1.2rem', background: 'var(--color-teal)', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 600, cursor: 'pointer' }}>
            규칙집 PDF 다운로드
          </button>
        </div>

      </article>
    </SubPageLayout>
  );
}

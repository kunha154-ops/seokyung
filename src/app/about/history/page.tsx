import SubPageLayout from "@/components/SubPageLayout";
import styles from "./History.module.css";

const ABOUT_MENU = [
  { label: "인사말", href: "/about/greeting" },
  { label: "조직도", href: "/about/organization" },
  { label: "역사와 비전", href: "/about/history", active: true },
  { label: "규칙", href: "/about/rules" },

];

export const metadata = { title: "역사와 비전" };

export default function HistoryPage() {
  return (
    <SubPageLayout
      title="역사와 비전"
      breadcrumbs={[
        { label: "노회소개", href: "/about" },
        { label: "역사와 비전" },
      ]}
      sideMenu={ABOUT_MENU}
    >
      <article className={styles.article}>
        <div className={styles.notice}>
          <strong>안내:</strong> 현재 페이지의 노회 역사와 연혁, 비전 내용은 레이아웃 확인을 위해 임의로 작성된 <strong>가상의 예시(Placeholder)</strong>입니다. 실제 서경노회의 공식 자료가 접수되면 업데이트될 예정입니다.
        </div>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>노회의 역사</h2>
          <p className={styles.paragraph}>
            서경노회는 대한예수교장로회(합동) 총회에 소속된 노회로서, 서울 서부 및 경기 일부 지역의 교회들이 함께 모여 복음 전파와 교회의 건강한 성장을 도모하고 있습니다.
          </p>
          <p className={styles.paragraph}>
            노회 설립 이래 55년이 넘는 역사 동안, 서경노회는 수많은 목회자를 배출하고 지역 교회를 세우며, 국내외 선교에 헌신해 왔습니다.
          </p>
        </section>

        {/* Timeline */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>주요 연혁</h2>
          <div className={styles.timeline}>
            {[
              { year: "1970년대", text: "서경노회 설립 및 초기 교회 개척" },
              { year: "1980년대", text: "소속 교회 확장 및 시찰회 조직" },
              { year: "1990년대", text: "해외 선교 사역 본격 시작" },
              { year: "2000년대", text: "교육위원회, 선교위원회 등 상설위원회 확대" },
              { year: "2010년대", text: "캄보디아 선교센터 설립, 지역사회 봉사 강화" },
              { year: "2020년대", text: "디지털 행정 시스템 도입, 소속 교회 85개 달성" },
            ].map((item) => (
              <div key={item.year} className={styles.timelineItem}>
                <div className={styles.timelineMarker} />
                <strong className={styles.timelineYear}>{item.year}</strong>
                <p className={styles.timelineText}>{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>비전</h2>
          <blockquote className={styles.visionQuote}>
            &ldquo;복음으로 하나 되어, 세상을 섬기는 공동체&rdquo;
          </blockquote>
          <p className={styles.paragraph}>
            서경노회는 그리스도의 사랑 안에서 교회와 교회가 연합하여, 지역사회와 세계를 향한 선교의 사명을 감당하며, 다음 세대를 세우는 데 힘쓰고 있습니다.
          </p>
        </section>
      </article>
    </SubPageLayout>
  );
}

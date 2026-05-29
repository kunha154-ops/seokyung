import SubPageLayout from "@/components/SubPageLayout";
import styles from "./Committees.module.css";
import { ORGANIZATION_MENUS } from "@/constants/organization";

export const metadata = { title: "상비부" };

const DEPARTMENTS = [
  { name: "정치부", leader: "신하철", secretary: "강영하", treasurer: "나종문" },
  { name: "감사부", leader: "류호길", secretary: "장경헌", treasurer: "정도민" },
  { name: "고시부", leader: "김희수", secretary: "윤성욱", treasurer: "송헌도" },
  { name: "군경선교부", leader: "김철회", secretary: "전창선", treasurer: "이주환" },
  { name: "규칙부", leader: "임창일", secretary: "이창선", treasurer: "정승열" },
  { name: "전도부", leader: "탁정헌", secretary: "남태웅", treasurer: "문기수" },
  { name: "재정부", leader: "신규갑", secretary: "박상규", treasurer: "주영석" },
  { name: "헌의부", leader: "이훈창", secretary: "이현수", treasurer: "김진구" },
];

export default function DepartmentsPage() {
  const currentPath = "/organization/departments";
  const sideMenu = ORGANIZATION_MENUS.map(menu => ({
    ...menu,
    active: menu.href === currentPath
  }));

  return (
    <SubPageLayout
      title="상비부"
      breadcrumbs={[
        { label: "조직", href: "/organization/executives" },
        { label: "상비부" },
      ]}
      sideMenu={sideMenu}
    >
      <article className={styles.container}>
        
        {/* 상비부 Section */}
        <section>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              상비부
            </h2>
            <p className={styles.sectionDesc}>
              서경노회 주요 행정과 정책을 담당하는 상설 부서입니다.
            </p>
          </div>
          
          <div className={styles.deptGrid}>
            {DEPARTMENTS.map((dept, idx) => (
              <div key={idx} className={styles.deptCard}>
                <h3 className={styles.deptName}>
                  {dept.name}
                </h3>
                <div className={styles.deptContent}>
                  <div className={styles.deptRow}>
                    <span className={styles.deptLabel}>부장</span>
                    <span className={styles.deptValue}>{dept.leader}</span>
                  </div>
                  <div className={styles.deptDivider} />
                  <div className={styles.deptRow}>
                    <span className={styles.deptLabel}>서기</span>
                    <span className={styles.deptValue}>{dept.secretary}</span>
                  </div>
                  <div className={styles.deptDivider} />
                  <div className={styles.deptRow}>
                    <span className={styles.deptLabel}>회계</span>
                    <span className={styles.deptValue}>{dept.treasurer}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </article>
    </SubPageLayout>
  );
}

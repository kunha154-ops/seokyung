import SubPageLayout from "@/components/SubPageLayout";
import styles from "./Committees.module.css";

const ORG_MENU = [
  { label: "임원진", href: "/organization/officers" },
  { label: "위원회", href: "/organization/committees", active: true },
  { label: "시찰회", href: "/organization/districts" },
  { label: "조직도", href: "/about/organization" },
];

export const metadata = { title: "위원회" };

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

const STANDING_COMMITTEES = [
  {
    name: "1. 선거관리위원회",
    roles: [
      { label: "위원장", value: "김철회목사" },
      { label: "부위원장", value: "-" },
      { label: "서기", value: "윤성욱목사" },
      { label: "부서기", value: "-" },
      { label: "회계", value: "-" },
      { label: "총무", value: "-" },
    ],
    members: "노회장 / 장로부노회장 / 서기 / 증경노회장 4인 / 증경장로부노회장 2인 각 시찰장(위임목사)",
  },
  {
    name: "2. 교역자 복리회",
    roles: [
      { label: "위원장", value: "임창일목사" },
      { label: "부위원장", value: "김수환목사" },
      { label: "서기", value: "전수창목사" },
      { label: "회계", value: "주영석장로" },
      { label: "감사", value: "나종문장로" },
    ],
    members: "① 노회장, 서기, 회계 ② 선임순으로 증경노회장 4인 ③ 선임순으로 증경장로부노회장 3인",
  },
  {
    name: "3. 목사은퇴 조정 위원회",
    roles: [
      { label: "위원장", value: "-" },
      { label: "서기", value: "임시당회장(파송당회장)" },
      { label: "회계", value: "-" },
    ],
    members: "목사",
  },
  {
    name: "4. 선교위원회",
    roles: [
      { label: "위원장", value: "임창일목사" },
      { label: "총무", value: "강영하목사" },
      { label: "서기", value: "장경헌목사" },
      { label: "회계", value: "류호길장로" },
    ],
    members: "이훈창목사, 장경헌목사, 임창일목사, 김수환목사, 이춘수목사, 강영하목사, 김승하목사, 신하철목사, 이성진목사, 조용순목사, 박인용목사, 박상규목사, 박희돈목사, 탁정헌목사, 권장혁목사, 전수창목사, 정건택목사, 이창선목사, 신익균목사, 김정일목사, 이현석목사, 윤성욱목사, 김영주목사, 신규갑목사, 안춘전목사, 최승한목사, 양제현목사, 남태웅목사",
    footer: "후원계좌 : 국민은행 848601-04-183753 예금주 서경노회선교위원회",
  },
  {
    name: "5. 노회 교회자립지원위원회 (* 당회기 노회장 당연직)",
    roles: [
      { label: "위원장", value: "신하철 목사" },
      { label: "부위원장", value: "김정일목사(당연직)" },
      { label: "서기", value: "박인용목사(전담간사)" },
      { label: "회계", value: "이병구장로" },
      { label: "감사", value: "장경헌목사" },
    ],
    members: "김수환목사, 이훈창목사, 강영하목사, 양제현목사, 박태성A목사, 이현석목사, 황태성목사, 전수창목사, 주영석장로, (각시찰별 목사,장로중1인추천)",
  },
  {
    name: "6. 서경노회 교육위원회",
    roles: [
      { label: "위원장", value: "김수환목사" },
      { label: "부위원장", value: "강영하목사, 나종문장로" },
      { label: "서기", value: "신규갑목사" },
      { label: "부서기", value: "남궁현우목사" },
      { label: "회계", value: "임운석장로" },
      { label: "실행총무", value: "탁정헌목사" },
    ],
    members: "김영주목사 박인용목사 박창근목사 장경헌목사",
    footer: "교육연구위원 : 김철회목사, 김현관목사, 박상규목사, 박태성A목사, 송종호목사, 정신조목사, 전창선목사, 이덕근목사, (이상 시찰회서기 당연직)",
  },
];

export default function CommitteesPage() {
  return (
    <SubPageLayout
      title="위원회"
      breadcrumbs={[
        { label: "조직", href: "/organization" },
        { label: "위원회" },
      ]}
      sideMenu={ORG_MENU}
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

        {/* 상설위원회 Section */}
        <section>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              상설위원회
            </h2>
            <p className={styles.sectionDesc}>
              특정 목적과 사역을 위해 조직된 위원회입니다.
            </p>
          </div>
          
          <div className={styles.commList}>
            {STANDING_COMMITTEES.map((committee, idx) => (
              <div key={idx} className={styles.commCard}>
                <h3 className={styles.commName}>
                  {committee.name}
                </h3>
                
                <div className={styles.commRoles}>
                  {committee.roles.map((role, rIdx) => (
                    <div key={rIdx} className={styles.commRoleItem}>
                      <span className={styles.commRoleLabel}>{role.label}</span>
                      <span className={styles.commRoleValue}>{role.value}</span>
                    </div>
                  ))}
                </div>
                
                <div className={styles.commMembers}>
                  <div className={styles.commMembersRow}>
                    <span className={styles.commMembersLabel}>위원</span>
                    <span className={styles.commMembersValue}>{committee.members}</span>
                  </div>
                  {committee.footer && (
                    <div className={styles.commFooter}>
                      {committee.footer}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

      </article>
    </SubPageLayout>
  );
}

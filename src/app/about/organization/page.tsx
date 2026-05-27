import SubPageLayout from "@/components/SubPageLayout";
import styles from "./organization.module.css";

const ABOUT_MENU = [
  { label: "인사말", href: "/about/greeting" },
  { label: "조직도", href: "/about/organization", active: true },
  { label: "역사와 비전", href: "/about/history" },
  { label: "규칙", href: "/about/rules" },
];

export default function OrganizationPage() {
  return (
    <SubPageLayout
      title="조직도"
      breadcrumbs={[
        { label: "노회소개", href: "/about" },
        { label: "조직도" },
      ]}
      sideMenu={ABOUT_MENU}
    >
      <article className={styles.article}>
        <div className={styles.tree}>
          <ul className={styles.treeUl}>
            <li className={styles.treeLi}>
              {/* Root Node */}
              <div className={`${styles.node} ${styles.rootNode}`}>
                <h2 className={styles.nodeTitle}>서경노회</h2>
              </div>
              
              <ul className={`${styles.treeUl} ${styles.topLevelUl}`}>
                {/* Executive Committee - Special Side Node */}
                <li className={`${styles.treeLi} ${styles.executiveLi}`}>
                  <div className={`${styles.node} ${styles.executiveNode}`}>
                    <h3 className={styles.nodeTitle}>임원회</h3>
                    <p className={styles.nodeDesc}>노회 행정 총괄</p>
                  </div>
                </li>

                {/* Main Branches */}
                <li className={styles.treeLi}>
                  <div className={`${styles.node} ${styles.branchLabel}`}>상비부</div>
                  <div className={styles.listCard}>
                    <ul>
                      <li>정치부</li>
                      <li>감사부</li>
                      <li>고시부</li>
                      <li>군경선교부</li>
                      <li>규칙부</li>
                      <li>전도부</li>
                      <li>재정부</li>
                      <li>면려부</li>
                      <li>헌의부</li>
                    </ul>
                  </div>
                </li>
                
                <li className={styles.treeLi}>
                  <div className={`${styles.node} ${styles.branchLabel}`}>시찰회</div>
                  <div className={styles.listCard}>
                    <ul>
                      <li>강남시찰</li>
                      <li>강서시찰</li>
                      <li>경기시찰</li>
                      <li>경동시찰</li>
                      <li>남부시찰</li>
                      <li>동부시찰</li>
                      <li>북부시찰</li>
                      <li>서부시찰</li>
                      <li>중부시찰</li>
                    </ul>
                  </div>
                </li>

                <li className={styles.treeLi}>
                  <div className={`${styles.node} ${styles.branchLabel}`}>상설위원회</div>
                  <div className={styles.listCard}>
                    <ul>
                      <li>선거관리위원회</li>
                      <li>교역자복리회</li>
                      <li>은퇴조정위원회</li>
                      <li>선교위원회</li>
                      <li>교회자립지원위원회</li>
                      <li>교육위원회</li>
                    </ul>
                  </div>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </article>
    </SubPageLayout>
  );
}

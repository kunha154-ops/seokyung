import SubPageLayout from "@/components/SubPageLayout";
import Image from "next/image";
import styles from "./greeting.module.css";

const ABOUT_MENU = [
  { label: "인사말", href: "/about/greeting", active: true },
  { label: "조직도", href: "/about/organization" },
  { label: "역사와 비전", href: "/about/history" },
  { label: "규칙", href: "/about/rules" },

];

export default function GreetingPage() {
  return (
    <SubPageLayout
      title="인사말"
      breadcrumbs={[
        { label: "노회소개", href: "/about" },
        { label: "인사말" },
      ]}
      sideMenu={ABOUT_MENU}
    >
      <article className={styles.article}>
        <div className={styles.greetingCard}>
          <div className={styles.photoArea}>
            <div className={styles.photoWrapper}>
              <Image 
                src="/images/pastor.jpg"
                alt="노회장 김정일 목사"
                fill
                sizes="(max-width: 768px) 160px, 200px"
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div className={styles.nameTag}>
              <span className={styles.position}>노회장</span>
              <span className={styles.name}>김정일 목사</span>
            </div>
          </div>
          <div className={styles.textArea}>
            <blockquote className={styles.quote}>
              &ldquo;서경노회 홈페이지를 찾아주셔서 감사합니다.&rdquo;
            </blockquote>

            <div className={styles.body}>
              <p>
                홈페이지를 개설한 첫 번째 목적은 <strong>정보의 공유</strong>입니다.<br />
                총회나 노회에서 진행되는 일이나 지 교회에서 필요한 정보들을 공유하는 것입니다.<br />
                그리고 총회나 노회에서 각 지교회에 보내드리는 공문이나 공지는 홈페이지를 통하여 먼저 게시하겠습니다.
              </p>
              <p>
                두 번째로는 <strong>행정절차의 간소화</strong>입니다.<br />
                노회의 의사 결의서에 실린 각종 행정 서식들을 홈페이지에서 다운 받을 수 있습니다.<br />
                그리고 총회나 노회의 각종 증명서를 요청을 해 주시기를 바랍니다.
              </p>
              <p>
                마지막으로 <strong>소통</strong>입니다.<br />
                각종 게시판을 통하여 서로의 이야기나 의견을 올리고 주고받는 공간이 되었으면 합니다.
              </p>
              <p>
                홈페이지는 저희 회원들이 만들어 가는 것입니다. 좋은 글들을 많이 올려주십시오.
              </p>
              <p>
                여러분의 섬기는 교회와 가정에 하나님의 인도하심을 바라봅니다.
              </p>
              <p className={styles.date}>2026년 4월 14일</p>
            </div>
          </div>
        </div>
      </article>
    </SubPageLayout>
  );
}

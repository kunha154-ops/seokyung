import SubPageLayout from "@/components/SubPageLayout";
import Image from "next/image";
import styles from "./Officers.module.css";

const ORG_MENU = [
  { label: "임원진", href: "/organization/officers", active: true },
  { label: "위원회", href: "/organization/committees" },
  { label: "시찰회", href: "/organization/districts" },
  { label: "조직도", href: "/about/organization" },
];

export const metadata = { title: "임원진" };

const OFFICERS = [
  { position: "노회장", name: "김정일 목사", church: "주함께교회", address: "서울 송파구 백제고분로 46길 3", telChurch: "02-419-9101", telHp: "010-5281-2657" },
  { position: "부노회장", name: "황태성 목사", church: "많은물교회", address: "경기도 남양주시 경강로 399번길 31-1", telChurch: "031-576-6074", telHp: "010-9099-6075" },
  { position: "부노회장", name: "마석홍 장로", church: "영동교회", address: "경기도 이천시 신둔면 원정로 89번길 124(17303)", telChurch: "031-633-0691", telHp: "010-6288-7078" },
  { position: "서기", name: "전수창 목사", church: "꿈이있는교회", address: "경기 부천시 장말로 13 윤주빌딩 4층(14593)", telChurch: "032-323-0096", telHp: "010-4421-0051" },
  { position: "부서기", name: "정신조 목사", church: "소망교회", address: "서울 양천구 남부순환로 502(08039)", telChurch: "02-2605-7082", telHp: "010-3455-8970" },
  { position: "회록서기", name: "남궁현우 목사", church: "서울에스라교회", address: "서울 영등포구 양평동 4가 31-3번지 설록디아망타워 지하1층 101호(07212)", telChurch: "02-581-3927", telHp: "010-3927-1754" },
  { position: "부회록서기", name: "김영주 목사", church: "동대문제일교회", address: "서울 종로구 보문로 3길 24(03111)", telChurch: "02-926-9270", telHp: "010-4661-3927" },
  { position: "회계", name: "주영석 장로", church: "제일성도교회", address: "서울 동작구 장승배기로4길 9, 103-301(06966)", telChurch: "02-886-4111-5", telHp: "010-9289-7036" },
  { position: "부회계", name: "이병구 장로", church: "목동반석교회", address: "서울 영등포구 국제금융로 7길 1 B-1406", telChurch: "02-2654-5855", telHp: "010-3309-5821" },
];

const DIRECTORS = [
  { group: "총회총대", members: [
    { title: "목사", names: "김정일, 임창일, 김수환, 강영하, 정건택, 전수창" },
    { title: "장로", names: "마석홍, 나종문, 임운석, 류호길, 주영석, 이병구" }
  ] },
  { group: "파송이사", members: [
    { title: "총회실행이사", names: "임창일 목사 (목동반석교회)" },
    { title: "GMS 이사", names: "강영하 목사 (늘사랑교회)" },
    { title: "기독신문이사", names: "김수환 목사 (람원교회)" },
    { title: "총회교회자립개발원이사", names: "신하철 목사 (서울숲중앙교회)" },
  ] }
];

export default function OfficersPage() {
  return (
    <SubPageLayout
      title="임원진"
      breadcrumbs={[
        { label: "조직", href: "/organization" },
        { label: "임원진" },
      ]}
      sideMenu={ORG_MENU}
    >
      <article>
        <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.05rem', lineHeight: 1.7, maxWidth: '600px', margin: '0 auto' }}>
            서경노회의 임원은 정기회에서 무기명 투표로 선출되며, 임기는 1년입니다.
          </p>
        </div>

        <div className={styles.officersGrid}>
          {OFFICERS.map((officer, index) => (
            <div key={index} className={styles.officerCard}>
              <div className={styles.officerPosition}>
                {officer.position}
              </div>

              <div className={styles.imageWrapper}>
                <Image 
                  src={`/images/officers/${officer.name.split(" ")[0]}.jpg?v=3`} 
                  alt={officer.name}
                  fill
                  sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 300px"
                  quality={100}
                  unoptimized={true}
                  style={{ objectFit: 'cover' }}
                />
              </div>

              <div className={styles.cardContent}>
                <div className={styles.nameBlock}>
                  <h3 className={styles.officerName}>
                    {officer.name}
                  </h3>
                  <span className={styles.officerChurch}>
                    {officer.church}
                  </span>
                </div>
                
                <div className={styles.divider} />
                
                <div className={styles.infoBlock}>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>주소</span>
                    <span className={styles.infoValue}>{officer.address}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>교회</span>
                    <span className={styles.infoValue}>
                      <a href={`tel:${officer.telChurch.replace(/[^0-9]/g, '')}`} className={styles.infoLink}>{officer.telChurch}</a>
                    </span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>H.P</span>
                    <span className={styles.infoValue}>
                      <a href={`tel:${officer.telHp.replace(/[^0-9]/g, '')}`} className={styles.infoLink}>{officer.telHp}</a>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <section>
          <div style={{ marginBottom: '2rem', borderBottom: '2px solid var(--color-border-light)', paddingBottom: '1rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', fontWeight: 800, margin: 0 }}>
              총회총대 및 파송이사
            </h2>
          </div>
          
          <div className={styles.directorsGrid}>
            {DIRECTORS.map((group, idx) => (
              <div key={idx} className={styles.directorCard}>
                <h3 className={styles.directorTitle}>
                  {group.group}
                </h3>
                <ul className={styles.directorList}>
                  {group.members.map((member, mIdx) => (
                    <li key={mIdx} className={styles.directorItem}>
                      <span className={styles.directorRole}>
                        {member.title}
                      </span>
                      <span className={styles.directorNames}>
                        {member.names}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className={styles.footerBanner}>
            <p className={styles.footerBannerTitle}>서기 주소 및 연락처</p>
            <p className={styles.footerBannerContent}>
              (14593) 경기도 부천시 장말로13 윤주빌딩 4층 <span>|</span> <a href="tel:01044210051" style={{ color: 'white', textDecoration: 'none' }}>Tel. 010-4421-0051</a>
            </p>
          </div>
        </section>
      </article>
    </SubPageLayout>
  );
}

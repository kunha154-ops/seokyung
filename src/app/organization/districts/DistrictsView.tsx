"use client";

import { useState } from "react";
import { DISTRICTS_DATA, DistrictInfo } from "./data";
import styles from "./DistrictsView.module.css";

export default function DistrictsView() {
  const [activeTab, setActiveTab] = useState<string>(DISTRICTS_DATA[0].name);

  const activeDistrict = DISTRICTS_DATA.find((d) => d.name === activeTab) || DISTRICTS_DATA[0];

  return (
    <div className={styles.container}>
      <p className={styles.description}>
        서경노회는 9개 시찰회로 구성되어 있으며, 각 시찰회는 관할 지역의 교회들을 돌보고 관리합니다.
      </p>

      {/* Tabs */}
      <div className={styles.tabsWrapper}>
        <div className={styles.tabs}>
          {DISTRICTS_DATA.map((district) => (
            <button
              key={district.name}
              className={`${styles.tab} ${activeTab === district.name ? styles.activeTab : ""}`}
              onClick={() => setActiveTab(district.name)}
            >
              {district.name}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className={styles.contentArea}>
        <div className={styles.cardHeader}>
          <h2 className={styles.districtName}>
            {activeDistrict.name} <span className={styles.districtCount}>({activeDistrict.count})</span>
          </h2>
          <div className={styles.officers}>
            <div className={styles.officerItem}>
              <span className={styles.officerRole}>시찰장</span>
              <span className={styles.officerName}>{activeDistrict.leader}</span>
            </div>
            <div className={styles.officerItem}>
              <span className={styles.officerRole}>서기</span>
              <span className={styles.officerName}>{activeDistrict.secretary}</span>
            </div>
            <div className={styles.officerItem}>
              <span className={styles.officerRole}>회계</span>
              <span className={styles.officerName}>{activeDistrict.treasurer}</span>
            </div>
          </div>
        </div>

        {activeDistrict.churches ? (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th style={{ width: "6%" }}>번호</th>
                  <th style={{ width: "15%" }}>교회명</th>
                  <th style={{ width: "20%" }}>목사</th>
                  <th style={{ width: "15%" }}>장로</th>
                  <th style={{ width: "24%" }}>교회주소</th>
                  <th style={{ width: "20%" }}>전화번호</th>
                </tr>
              </thead>
              <tbody>
                {activeDistrict.churches.map((church) => (
                  <tr key={church.no}>
                    <td className={styles.center}>{church.no}</td>
                    <td className={styles.churchName}>{church.name}</td>
                    <td className={styles.pastorCell}>{church.pastor}</td>
                    <td className={styles.elderCell}>{church.elder}</td>
                    <td className={styles.address}>{church.address}</td>
                    <td className={styles.phone}>
                      {church.phone.split(", ").map((p, idx) => (
                        <a href={`tel:${p.replace(/[^0-9]/g, '')}`} key={idx} className={styles.phoneItem}>{p}</a>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : activeDistrict.pendingImage ? (
          <div className={styles.pendingMessage}>
            <span className={styles.pendingIcon}>⏳</span>
            <p>교회 상세 정보가 곧 업데이트될 예정입니다.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

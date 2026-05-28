import Link from "next/link";
import AdminTopBar from "./AdminTopBar";
import styles from "./admin.module.css";
import { getNotices, getNewsList, getGalleryPosts, getResources } from "@/lib/queries";

export const dynamic = 'force-dynamic';

export default function AdminPage() {
  const { total: noticeCount, notices } = getNotices(1, 5);
  const { total: newsCount, news } = getNewsList(1, 5);
  const { total: resourceCount, resources } = getResources('forms', 1, 5); // Default to 'forms' or fetch all? Let's assume we just want counts.

  const db = require('@/lib/db').getDb();
  
  // 신규 통합 갤러리 테이블 기반 카운트 조회
  const photoAlbumRow = db.prepare("SELECT COUNT(*) as total FROM gallery_posts WHERE type = 'photo' AND (status IS NULL OR status = 'public')").get() as { total: number };
  const photoCountRow = db.prepare("SELECT COUNT(*) as total FROM gallery_media WHERE media_type = 'image'").get() as { total: number };
  const videoCountRow = db.prepare("SELECT COUNT(*) as total FROM gallery_posts WHERE type = 'video'").get() as { total: number };
  const resourceTotalRow = db.prepare('SELECT COUNT(*) as total FROM resources').get() as { total: number };

  const recentAlbums = db.prepare("SELECT id, title, created_at FROM gallery_posts WHERE type = 'photo' ORDER BY created_at DESC LIMIT 3").all() as any[];
  const emptyImageCount = db.prepare("SELECT COUNT(*) as total FROM gallery_media WHERE file_path IS NULL OR file_path = ''").get() as { total: number };
  
  const heroCountRow = db.prepare("SELECT COUNT(*) as total FROM hero_slides").get() as { total: number };
  const activeHeroCountRow = db.prepare("SELECT COUNT(*) as total FROM hero_slides WHERE is_active = 1").get() as { total: number };

  const cards = [
    { title: "히어로 슬라이드", count: `${activeHeroCountRow.total}건 노출 중`, desc: `총 등록: ${heroCountRow.total}건`, href: "/admin/hero", color: "#8b5cf6" },
    { title: "공지사항", count: noticeCount + '건', desc: notices[0] ? `최근 등록: ${notices[0].title}` : '등록된 공지 없음', href: "/admin/notices", color: "#1976d2" },
    { title: "노회 소식", count: newsCount + '건', desc: news[0] ? `최근 등록: ${news[0].title}` : '등록된 소식 없음', href: "/admin/news", color: "#0d9488" },
    { title: "포토 갤러리", count: `앨범 ${photoAlbumRow.total} / 사진 ${photoCountRow.total}`, desc: recentAlbums[0] ? `최근 앨범: ${recentAlbums[0].title}` : '등록된 앨범 없음', href: "/admin/gallery", color: "#eab308" },
    { title: "영상 갤러리", count: videoCountRow.total + '건', desc: "유튜브 등 영상 등록", href: "/admin/videos", color: "#f43f5e" },
    { title: "자료실", count: resourceTotalRow.total + '건', desc: "각종 문서 및 서식", href: "/admin/resources", color: "#6b7280" },
  ];

  return (
    <div className={styles.adminPage}>
      <AdminTopBar />
      <div className={styles.container}>
        
        {/* Alerts Section */}
        {emptyImageCount.total > 0 && (
          <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong style={{ color: '#b91c1c', display: 'block', marginBottom: '0.25rem' }}>⚠️ 확인 필요</strong>
              <span style={{ color: '#991b1b', fontSize: '0.9rem' }}>이미지 경로가 없는 사진이 {emptyImageCount.total}장 발견되었습니다. 갤러리 관리에서 확인해주세요.</span>
            </div>
            <Link href="/admin/gallery" style={{ padding: '0.5rem 1rem', backgroundColor: '#dc2626', color: 'white', borderRadius: '4px', textDecoration: 'none', fontSize: '0.9rem' }}>바로가기</Link>
          </div>
        )}

        <div className={styles.header}>
          <h1 className={styles.pageTitle}>관리자 대시보드</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>현재 서경노회 홈페이지의 콘텐츠 현황입니다.</p>
        </div>

        {/* Quick Actions */}
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>빠른 작업</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
            <Link href="/admin/hero/new" className={styles.actionBtn} style={{ background: '#8b5cf6' }}>+ 히어로 등록</Link>
            <Link href="/admin/notices/new" className={styles.actionBtn}>+ 공지사항 작성</Link>
            <Link href="/admin/news/new" className={styles.actionBtn}>+ 노회 소식 작성</Link>
            <Link href="/admin/gallery" className={styles.actionBtn} style={{ background: '#f59e0b' }}>+ 새 앨범 생성</Link>
            <Link href="/admin/videos/new" className={styles.actionBtn} style={{ background: '#f43f5e' }}>+ 영상 등록</Link>
            <Link href="/admin/resources/new" className={styles.actionBtn} style={{ background: '#6b7280' }}>+ 자료 업로드</Link>
          </div>
        </div>

        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          {cards.map((card) => (
            <div key={card.title} style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', borderTop: `4px solid ${card.color}`, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.25rem' }}>{card.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{card.desc}</p>
              </div>
              
              <div style={{ fontSize: typeof card.count === 'string' && card.count.includes('/') ? '1.25rem' : '2rem', fontWeight: 800, color: card.color }}>
                {card.count}
              </div>
              
              <Link href={card.href} style={{ alignSelf: 'flex-start', fontSize: '0.9rem', color: card.color, textDecoration: 'none', fontWeight: 600 }}>
                관리 페이지로 이동 &rarr;
              </Link>
            </div>
          ))}
        </div>

        {/* Recent Activities */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
          
          <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', border: '1px solid var(--color-border-light)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--color-primary)', margin: 0 }}>최근 등록된 공지사항</h3>
              <Link href="/admin/notices" style={{ fontSize: '0.85rem', color: 'var(--color-teal)' }}>전체보기</Link>
            </div>
            {notices.length === 0 ? (
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>등록된 내역이 없습니다.</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {notices.map(n => (
                  <li key={n.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.75rem' }}>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{n.title}</p>
                      <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>{n.created_at.split(' ')[0]}</span>
                    </div>
                    <Link href={`/admin/notices/${n.id}/edit`} style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', background: '#f3f4f6', color: '#4b5563', borderRadius: '4px', textDecoration: 'none' }}>수정</Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', border: '1px solid var(--color-border-light)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--color-primary)', margin: 0 }}>최근 등록된 노회 소식</h3>
              <Link href="/admin/news" style={{ fontSize: '0.85rem', color: 'var(--color-teal)' }}>전체보기</Link>
            </div>
            {news.length === 0 ? (
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>등록된 내역이 없습니다.</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {news.map(n => (
                  <li key={n.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.75rem' }}>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{n.title}</p>
                      <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>{n.created_at.split(' ')[0]}</span>
                    </div>
                    <Link href={`/admin/news/${n.id}/edit`} style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', background: '#f3f4f6', color: '#4b5563', borderRadius: '4px', textDecoration: 'none' }}>수정</Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

import React from 'react';
import styles from '@/app/admin/admin.module.css';

interface StateProps {
  message?: string;
}

export function AdminLoadingState({ message = '데이터를 불러오는 중입니다...' }: StateProps) {
  return (
    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
      <div style={{ display: 'inline-block', width: '2rem', height: '2rem', border: '3px solid #f3f3f3', borderTop: '3px solid var(--color-teal)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <p style={{ marginTop: '1rem', fontSize: '0.95rem' }}>{message}</p>
      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export function AdminEmptyState({ message = '아직 등록된 항목이 없습니다.' }: StateProps) {
  return (
    <div className={styles.emptyState}>
      <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem', opacity: 0.5 }}>📭</span>
      {message}
    </div>
  );
}

export function AdminErrorState({ message = '목록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.' }: StateProps) {
  return (
    <div style={{ textAlign: 'center', padding: '3rem', color: '#b91c1c', backgroundColor: '#fef2f2', borderRadius: '8px', border: '1px solid #fecaca' }}>
      <strong style={{ display: 'block', marginBottom: '0.5rem' }}>오류 발생</strong>
      <span style={{ fontSize: '0.9rem' }}>{message}</span>
    </div>
  );
}

export function AdminPermissionState({ message = '관리자 권한이 필요한 페이지입니다.' }: StateProps) {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--color-text-muted)' }}>
      <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>🔒</span>
      <h2 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>접근 권한 없음</h2>
      <p style={{ fontSize: '0.95rem' }}>{message}</p>
    </div>
  );
}

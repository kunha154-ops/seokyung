"use client";

import React, { useState } from "react";
import styles from "./RuleBookClient.module.css";

interface RuleBookClientProps {
  totalImages: number;
}

export default function RuleBookClient({ totalImages }: RuleBookClientProps) {
  const [page, setPage] = useState(0);
  const [hasError, setHasError] = useState(false);

  const nextButtonClick = () => {
    if (page < totalImages - 1) {
      setPage(page + 1);
      setHasError(false);
    }
  };

  const prevButtonClick = () => {
    if (page > 0) {
      setPage(page - 1);
      setHasError(false);
    }
  };

  const goToPage = (index: number) => {
    setPage(index);
    setHasError(false);
  };

  const pages = Array.from({ length: totalImages }, (_, i) => i + 1);
  const currentImageUrl = `/images/rules/${(page + 1).toString().padStart(2, '0')}.jpg`;

  return (
    <div className={styles.bookWrapper} style={{ maxWidth: '1000px', width: '100%' }}>
      
      {/* Large Image Viewer Container */}
      <div style={{ position: 'relative', width: '100%', background: '#fff', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', boxShadow: '0 8px 30px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        
        {/* Left Arrow */}
        <button 
          onClick={prevButtonClick} 
          className={`${styles.arrowButton} ${styles.arrowLeft}`} 
          style={{ position: 'absolute', top: '50%', left: '15px', transform: 'translateY(-50%)', zIndex: 10 }}
          disabled={page === 0}
          aria-label="이전 페이지"
        >
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" />
          </svg>
        </button>

        {/* Current Image */}
        <div style={{ width: '100%', aspectRatio: '2546 / 1860', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa' }}>
          {!hasError ? (
            <img 
              src={currentImageUrl} 
              alt={`규칙집 ${page + 1} 페이지`} 
              style={{ width: '100%', height: '100%', display: 'block', objectFit: 'contain' }}
              onError={() => setHasError(true)}
            />
          ) : (
            <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-primary)', width: '100%' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 700 }}>서경노회 규칙집</h3>
              <p style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem' }}>페이지 {page + 1}</p>
              <span style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>(이미지를 불러올 수 없습니다)</span>
            </div>
          )}
        </div>

        {/* Right Arrow */}
        <button 
          onClick={nextButtonClick} 
          className={`${styles.arrowButton} ${styles.arrowRight}`} 
          style={{ position: 'absolute', top: '50%', right: '15px', transform: 'translateY(-50%)', zIndex: 10 }}
          disabled={page >= totalImages - 1}
          aria-label="다음 페이지"
        >
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
          </svg>
        </button>
      </div>

      {/* Pagination Bar */}
      <div style={{
        marginTop: '2.5rem',
        width: '100%',
        padding: '1.5rem',
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-border-light)',
        boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px dashed var(--color-border)' }}>
          <strong style={{ fontSize: '1.1rem', color: 'var(--color-primary)' }}>전체 페이지 목록</strong>
          <span style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>현재 {page + 1} / {totalImages} 쪽</span>
        </div>
        
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '0.5rem', 
          justifyContent: 'center'
        }}>
          {pages.map((p, idx) => (
            <button
              key={idx}
              onClick={() => goToPage(idx)}
              style={{
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px',
                border: page === idx ? 'none' : '1px solid var(--color-border)',
                background: page === idx ? 'var(--color-primary)' : '#fff',
                color: page === idx ? '#fff' : 'var(--color-text-secondary)',
                fontSize: '1rem',
                fontWeight: page === idx ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: page === idx ? '0 2px 8px rgba(0,0,0,0.15)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (page !== idx) {
                  e.currentTarget.style.background = 'var(--color-mint-light)';
                  e.currentTarget.style.color = 'var(--color-primary)';
                }
              }}
              onMouseLeave={(e) => {
                if (page !== idx) {
                  e.currentTarget.style.background = '#fff';
                  e.currentTarget.style.color = 'var(--color-text-secondary)';
                }
              }}
              aria-label={`${p} 페이지로 이동`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

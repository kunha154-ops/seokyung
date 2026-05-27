'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Media {
  id: number;
  file_path: string;
  file_name: string;
}

export default function Lightbox({ images }: { images: Media[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex]);

  const open = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    setIsOpen(false);
    document.body.style.overflow = '';
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const next = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      {/* Grid rendering for the parent */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '18px', marginTop: '40px' }}>
        {images.map((img, index) => (
          <button
            key={img.id}
            type="button"
            onClick={() => open(index)}
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '4/3',
              overflow: 'hidden',
              border: 0,
              padding: 0,
              borderRadius: '16px',
              background: '#f4f1ec',
              cursor: 'pointer',
              display: 'block'
            }}
          >
            <Image
              src={img.file_path}
              alt={img.file_name}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              style={{ objectFit: 'cover', transition: 'transform 0.3s ease' }}
              onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            />
          </button>
        ))}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {isOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={close}
        >
          {/* Close button */}
          <button 
            onClick={(e) => { e.stopPropagation(); close(); }}
            style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: '#fff', cursor: 'pointer', zIndex: 10000 }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>

          {/* Prev button */}
          {images.length > 1 && (
            <button 
              onClick={(e) => { e.stopPropagation(); prev(); }}
              style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', cursor: 'pointer', width: '50px', height: '50px', borderRadius: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
          )}

          {/* Next button */}
          {images.length > 1 && (
            <button 
              onClick={(e) => { e.stopPropagation(); next(); }}
              style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', cursor: 'pointer', width: '50px', height: '50px', borderRadius: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          )}

          {/* Current Image */}
          <div style={{ position: 'relative', width: '90vw', height: '85vh', maxWidth: '1200px' }} onClick={(e) => e.stopPropagation()}>
            <Image
              src={images[currentIndex].file_path}
              alt={images[currentIndex].file_name}
              fill
              style={{ objectFit: 'contain' }}
              sizes="100vw"
              priority
            />
          </div>

          {/* Counter */}
          <div style={{ position: 'absolute', bottom: '20px', color: '#fff', fontSize: '1rem', background: 'rgba(0,0,0,0.5)', padding: '5px 15px', borderRadius: '15px' }}>
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}

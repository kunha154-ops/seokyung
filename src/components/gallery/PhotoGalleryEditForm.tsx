'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { updateGalleryPostAction } from '@/app/actions/gallery-actions';

export default function PhotoGalleryEditForm({ post }: { post: any }) {
  const router = useRouter();
  const [title, setTitle] = useState(post.title);
  const [description, setDescription] = useState(post.description || '');
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return setErrorMsg('제목을 입력해주세요.');
    
    setErrorMsg('');
    
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append('id', post.id.toString());
        formData.append('title', title.trim());
        formData.append('description', description.trim());
        
        const result = await updateGalleryPostAction(formData);
        
        if (result.success) {
          alert('수정되었습니다.');
          router.push(`/gallery/photo/${post.id}`);
          router.refresh();
        } else {
          setErrorMsg(result.error || '저장 중 오류가 발생했습니다.');
        }
      } catch (err: any) {
        setErrorMsg(err.message || '업로드 중 오류가 발생했습니다.');
      }
    });
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', background: '#fff', borderRadius: '12px', padding: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
      {errorMsg && (
        <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
          {errorMsg}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', color: '#333' }}>앨범 제목 <span style={{ color: '#e11d48' }}>*</span></label>
          <input 
            type="text" 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            placeholder="앨범 제목을 입력하세요"
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem' }}
            disabled={isPending}
          />
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', color: '#333' }}>설명 (선택)</label>
          <textarea 
            value={description} 
            onChange={e => setDescription(e.target.value)} 
            placeholder="앨범에 대한 설명을 입력하세요"
            rows={4}
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem', resize: 'vertical' }}
            disabled={isPending}
          />
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid #eee', paddingTop: '1.5rem' }}>
          <button type="button" onClick={() => router.back()} disabled={isPending} style={{ padding: '0.75rem 1.5rem', background: '#f1f5f9', color: '#475569', borderRadius: '8px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
            취소
          </button>
          <button type="submit" disabled={isPending} style={{ padding: '0.75rem 2rem', background: 'var(--color-primary, #0056b3)', color: '#fff', borderRadius: '8px', fontWeight: 600, border: 'none', cursor: isPending ? 'not-allowed' : 'pointer', opacity: isPending ? 0.7 : 1 }}>
            {isPending ? '수정 중...' : '수정완료'}
          </button>
        </div>
      </form>
    </div>
  );
}

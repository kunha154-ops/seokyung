'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPhotoGalleryAction } from '@/app/actions/gallery-actions';

export default function PhotoGalleryCreateForm() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState<{ current: number, total: number }>({ current: 0, total: 0 });
  const [errorMsg, setErrorMsg] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      if (files.length + selectedFiles.length > 30) {
        alert("최대 30개의 파일만 첨부할 수 있습니다.");
        return;
      }
      
      const validFiles = selectedFiles.filter(f => {
        const ext = f.name.split('.').pop()?.toLowerCase();
        if (!['jpg', 'jpeg', 'png', 'webp'].includes(ext || '')) {
          alert(`${f.name}: 허용되지 않는 확장자입니다. (jpg, png, webp만 허용)`);
          return false;
        }
        return true;
      });
      
      setFiles(prev => [...prev, ...validFiles]);
    }
  };

  const removeFile = (idx: number) => {
    setFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const uploadFilesDirectly = async (filesToUpload: File[]) => {
    const uploadedData = [];
    setProgress({ current: 0, total: filesToUpload.length });
    
    for (let i = 0; i < filesToUpload.length; i++) {
      const file = filesToUpload[i];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'gallery/photos');
      
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        
        if (data.success) {
          uploadedData.push(data);
        } else {
          throw new Error(data.error || 'Upload failed');
        }
      } catch (err: any) {
        console.error(`Failed to upload ${file.name}:`, err);
        throw new Error(`파일 업로드 실패: ${file.name}`);
      }
      
      setProgress(prev => ({ ...prev, current: i + 1 }));
    }
    
    return uploadedData;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return setErrorMsg('제목을 입력해주세요.');
    if (files.length === 0) return setErrorMsg('최소 한 장 이상의 사진을 첨부해주세요.');
    
    setErrorMsg('');
    setIsSubmitting(true);
    
    try {
      // 1. Upload files to local storage via API
      const uploadedFiles = await uploadFilesDirectly(files);
      
      // 2. Submit metadata via Server Action
      const form = new FormData();
      form.append('title', title.trim());
      form.append('description', description.trim());
      
      uploadedFiles.forEach(f => {
        form.append('mediaUrls', f.url);
        form.append('mediaNames', f.fileName);
        form.append('mediaSizes', f.fileSize.toString());
        form.append('mediaTypes', f.fileType);
      });
      
      const result = await createPhotoGalleryAction(form);
      
      if (result.success && result.redirectUrl) {
        alert('포토갤러리에 앨범이 등록되었습니다.');
        router.push(result.redirectUrl);
        router.refresh();
      } else {
        setErrorMsg(result.error || '저장 중 오류가 발생했습니다.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || '업로드 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
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
            disabled={isSubmitting}
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
            disabled={isSubmitting}
          />
        </div>
        
        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', color: '#333' }}>
            사진 첨부 <span style={{ color: '#e11d48' }}>*</span> 
            <span style={{ fontSize: '0.85rem', color: '#666', marginLeft: '0.5rem', fontWeight: 400 }}>(최대 30장, jpg/png/webp)</span>
          </label>
          
          <div style={{ padding: '1.5rem', border: '2px dashed #ccc', borderRadius: '8px', textAlign: 'center', background: '#f8f9fa', marginBottom: '1rem' }}>
            <input 
              type="file" 
              id="photoUpload" 
              multiple 
              accept="image/jpeg, image/png, image/webp" 
              onChange={handleFileChange}
              style={{ display: 'none' }}
              disabled={isSubmitting}
            />
            <label htmlFor="photoUpload" style={{ display: 'inline-block', padding: '0.75rem 1.5rem', background: 'var(--color-primary, #0056b3)', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
              사진 선택하기
            </label>
            <p style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: '#666' }}>고화질 사진도 업로드 가능하며, 여러 장을 한 번에 등록할 수 있습니다.</p>
          </div>
          
          {files.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#444' }}>총 {files.length}장 선택됨</div>
              {files.map((file, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#f1f5f9', borderRadius: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, color: '#64748b' }}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                    <span style={{ fontSize: '0.9rem', color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</span>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                  </div>
                  <button type="button" onClick={() => removeFile(idx)} disabled={isSubmitting} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500 }}>
                    삭제
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid #eee', paddingTop: '1.5rem' }}>
          <button type="button" onClick={() => router.back()} disabled={isSubmitting} style={{ padding: '0.75rem 1.5rem', background: '#f1f5f9', color: '#475569', borderRadius: '8px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
            취소
          </button>
          <button type="submit" disabled={isSubmitting} style={{ padding: '0.75rem 2rem', background: 'var(--color-primary, #0056b3)', color: '#fff', borderRadius: '8px', fontWeight: 600, border: 'none', cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.7 : 1 }}>
            {isSubmitting 
              ? `업로드 중... ${progress.total > 0 ? `(${progress.current}/${progress.total})` : ''}` 
              : '등록하기'}
          </button>
        </div>
      </form>
    </div>
  );
}

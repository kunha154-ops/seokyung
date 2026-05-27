'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createVideoGalleryAction } from '@/app/actions/gallery-actions';

export default function VideoGalleryCreateForm() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [inputType, setInputType] = useState<'url' | 'file'>('url');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0); // Optional for UX if tracking XMLHTTPRequest, but since we use fetch, we just show "Uploading..."
  const [errorMsg, setErrorMsg] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (file.size > 300 * 1024 * 1024) {
        alert("영상 파일은 300MB 이하만 업로드할 수 있습니다.");
        return;
      }
      
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (!['mp4', 'mov', 'webm'].includes(ext || '')) {
        alert("지원되지 않는 영상 형식입니다. (mp4, mov, webm 허용)");
        return;
      }
      
      setVideoFile(file);
    }
  };

  const uploadFileDirectly = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'gallery/videos');
    
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      
      if (data.success) {
        return data;
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (err: any) {
      console.error(`Failed to upload video:`, err);
      throw new Error(`영상 업로드 중 문제가 발생했습니다.`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return setErrorMsg('제목을 입력해주세요.');
    if (inputType === 'url' && !videoUrl.trim()) return setErrorMsg('영상 URL을 입력해주세요.');
    if (inputType === 'file' && !videoFile) return setErrorMsg('영상 파일을 선택해주세요.');
    
    setErrorMsg('');
    setIsSubmitting(true);
    
    try {
      let uploadedData = null;
      if (inputType === 'file' && videoFile) {
        uploadedData = await uploadFileDirectly(videoFile);
      }
      
      const form = new FormData();
      form.append('title', title.trim());
      form.append('description', description.trim());
      
      if (inputType === 'url') {
        form.append('videoUrl', videoUrl.trim());
      } else if (uploadedData) {
        form.append('videoFilePath', uploadedData.url);
        form.append('mediaName', uploadedData.fileName);
        form.append('mediaSize', uploadedData.fileSize.toString());
        form.append('mediaType', uploadedData.fileType);
      }
      
      const result = await createVideoGalleryAction(form);
      
      if (result.success && result.redirectUrl) {
        alert('영상갤러리에 게시물이 등록되었습니다.');
        router.push(result.redirectUrl);
        router.refresh();
      } else {
        setErrorMsg(result.error || '저장 중 오류가 발생했습니다.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || '업로드 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
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
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', color: '#333' }}>영상 제목 <span style={{ color: '#e11d48' }}>*</span></label>
          <input 
            type="text" 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            placeholder="영상 제목을 입력하세요"
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem' }}
            disabled={isSubmitting}
          />
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', color: '#333' }}>설명 (선택)</label>
          <textarea 
            value={description} 
            onChange={e => setDescription(e.target.value)} 
            placeholder="영상에 대한 설명을 입력하세요"
            rows={4}
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem', resize: 'vertical' }}
            disabled={isSubmitting}
          />
        </div>
        
        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', color: '#333' }}>영상 등록 방식 <span style={{ color: '#e11d48' }}>*</span></label>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input type="radio" checked={inputType === 'url'} onChange={() => setInputType('url')} disabled={isSubmitting} />
              유튜브 등 외부 URL 입력
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input type="radio" checked={inputType === 'file'} onChange={() => setInputType('file')} disabled={isSubmitting} />
              영상 파일 직접 업로드
            </label>
          </div>
          
          {inputType === 'url' ? (
            <div>
              <input 
                type="text" 
                value={videoUrl} 
                onChange={e => setVideoUrl(e.target.value)} 
                placeholder="YouTube URL을 입력하세요 (예: https://youtu.be/...)"
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem' }}
                disabled={isSubmitting}
              />
            </div>
          ) : (
            <div style={{ padding: '1.5rem', border: '2px dashed #ccc', borderRadius: '8px', textAlign: 'center', background: '#f8f9fa' }}>
              <input 
                type="file" 
                id="videoUpload" 
                accept="video/mp4, video/quicktime, video/webm" 
                onChange={handleFileChange}
                style={{ display: 'none' }}
                disabled={isSubmitting}
              />
              <label htmlFor="videoUpload" style={{ display: 'inline-block', padding: '0.75rem 1.5rem', background: 'var(--color-primary, #0056b3)', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
                영상 파일 선택 (최대 300MB)
              </label>
              
              {videoFile && (
                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#0ea5e9' }}><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
                  <span style={{ fontWeight: 500 }}>{videoFile.name}</span>
                  <span style={{ fontSize: '0.85rem', color: '#666' }}>({(videoFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid #eee', paddingTop: '1.5rem' }}>
          <button type="button" onClick={() => router.back()} disabled={isSubmitting} style={{ padding: '0.75rem 1.5rem', background: '#f1f5f9', color: '#475569', borderRadius: '8px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
            취소
          </button>
          <button type="submit" disabled={isSubmitting} style={{ padding: '0.75rem 2rem', background: 'var(--color-primary, #0056b3)', color: '#fff', borderRadius: '8px', fontWeight: 600, border: 'none', cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.7 : 1 }}>
            {isSubmitting 
              ? `업로드 중입니다... (파일 크기에 따라 다소 시간이 소요될 수 있습니다)` 
              : '등록하기'}
          </button>
        </div>
      </form>
    </div>
  );
}

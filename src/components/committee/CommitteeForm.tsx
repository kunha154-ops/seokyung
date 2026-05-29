'use client'

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "./Committee.module.css";
import { CommitteePost } from "@/lib/queries";
import { submitCommitteePost } from "@/app/actions/committee-actions";

interface CommitteeFormProps {
  committeeType: 'mission' | 'self_reliance' | 'education';
  boardType: string;
  post?: CommitteePost;
  basePath: string; // e.g. /mission
}

export default function CommitteeForm({
  committeeType,
  boardType,
  post,
  basePath,
}: CommitteeFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  const [title, setTitle] = useState(post?.title || "");
  const [content, setContent] = useState(post?.content || "");
  const [status, setStatus] = useState(post?.status || "public");
  
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(post?.thumbnail_path || null);
  const [deletedFileIds, setDeletedFileIds] = useState<number[]>([]);
  const [existingFiles, setExistingFiles] = useState(post?.attachments || []);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("대표 이미지는 5MB를 초과할 수 없습니다.");
        if (thumbnailInputRef.current) thumbnailInputRef.current.value = "";
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveExistingFile = (fileId: number) => {
    setDeletedFileIds(prev => [...prev, fileId]);
    setExistingFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }
    if (!content.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const formData = new FormData();
      if (post?.id) formData.append('id', post.id.toString());
      formData.append('title', title);
      formData.append('content', content);
      formData.append('committeeType', committeeType);
      formData.append('boardType', boardType);
      formData.append('status', status);
      formData.append('deletedFileIds', JSON.stringify(deletedFileIds));

      if (thumbnailInputRef.current?.files?.[0]) {
        formData.append('thumbnail', thumbnailInputRef.current.files[0]);
      }

      if (fileInputRef.current?.files) {
        const files = Array.from(fileInputRef.current.files);
        for (const file of files) {
          formData.append('files', file);
        }
      }

      const res = await submitCommitteePost(formData);
      
      if (res.success && res.redirectUrl) {
        router.push(res.redirectUrl);
        router.refresh();
      } else {
        setError(res.error || '저장 중 오류가 발생했습니다.');
        setIsSubmitting(false);
      }
    } catch (err) {
      setError('서버와 통신 중 오류가 발생했습니다.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h2 className={styles.formTitle}>{post ? '글 수정' : '글쓰기'}</h2>
        
        {error && <div className={styles.errorMessage}>{error}</div>}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>상태</label>
            <select 
              value={status} 
              onChange={e => setStatus(e.target.value)}
              className={styles.select}
            >
              <option value="public">공개</option>
              <option value="hidden">숨김</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>제목 *</label>
            <input 
              type="text" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              className={styles.input}
              placeholder="제목을 입력하세요"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>대표 이미지 (선택)</label>
            {thumbnailPreview && (
              <div style={{ marginBottom: '10px' }}>
                <img src={thumbnailPreview} alt="대표 이미지 미리보기" style={{ height: '100px', objectFit: 'cover', borderRadius: '4px' }} />
              </div>
            )}
            <input 
              type="file" 
              accept="image/*"
              ref={thumbnailInputRef}
              onChange={handleThumbnailChange}
              className={styles.fileInput}
            />
            <small className={styles.helpText}>목록과 상세 페이지 상단에 표시될 이미지입니다. (최대 5MB)</small>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>내용 *</label>
            <textarea 
              value={content} 
              onChange={e => setContent(e.target.value)} 
              className={styles.textarea}
              placeholder="내용을 입력하세요"
              rows={15}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>첨부파일 (최대 5개)</label>
            
            {existingFiles.length > 0 && (
              <div className={styles.existingFiles}>
                <p>기존 첨부파일:</p>
                <ul>
                  {existingFiles.map(f => (
                    <li key={f.id} style={{ marginBottom: '5px' }}>
                      {f.original_file_name} 
                      <button 
                        type="button" 
                        onClick={() => handleRemoveExistingFile(f.id)}
                        className={styles.removeBtn}
                        style={{ marginLeft: '10px', color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        [삭제]
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <input 
              type="file" 
              multiple
              ref={fileInputRef}
              className={styles.fileInput}
            />
            <small className={styles.helpText}>여러 개의 파일을 선택할 수 있습니다. (파일당 최대 20MB)</small>
          </div>

          <div className={styles.formActions}>
            <button 
              type="button" 
              onClick={() => router.back()} 
              className={styles.btnSecondary}
              disabled={isSubmitting}
            >
              취소
            </button>
            <button 
              type="submit" 
              className={styles.btnPrimary}
              disabled={isSubmitting}
            >
              {isSubmitting ? '저장 중...' : (post ? '수정 완료' : '등록 완료')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

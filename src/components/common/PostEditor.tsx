"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./PostEditor.module.css";

interface PostEditorProps {
  initialData?: {
    id?: number;
    title?: string;
    content?: string;
    video_url?: string | null;
    attachments?: Array<{ id: number; original_file_name: string; file_size: string }>;
  };
  boardType: "notices" | "news" | "resources";
  category?: string; // used for resources
  onSubmitAction: (formData: FormData) => Promise<{ success: boolean; error?: string; redirectUrl?: string }>;
}

export default function PostEditor({ initialData, boardType, category, onSubmitAction }: PostEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [videoUrl, setVideoUrl] = useState(initialData?.video_url || "");
  const [existingFiles, setExistingFiles] = useState(initialData?.attachments || []);
  const [deletedFileIds, setDeletedFileIds] = useState<number[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      if (existingFiles.length - deletedFileIds.length + files.length + selectedFiles.length > 5) {
        alert("최대 5개의 파일만 첨부할 수 있습니다.");
        return;
      }
      const validFiles = selectedFiles.filter(f => {
        if (f.size > 20 * 1024 * 1024) {
          alert(`${f.name} 파일이 20MB를 초과합니다.`);
          return false;
        }
        const ext = f.name.split('.').pop()?.toLowerCase();
        const forbidden = ['exe', 'js', 'sh', 'bat', 'cmd', 'php', 'html'];
        if (ext && forbidden.includes(ext)) {
          alert(`${f.name} 파일은 허용되지 않는 확장자입니다.`);
          return false;
        }
        return true;
      });
      setFiles(prev => [...prev, ...validFiles]);
    }
  };

  const removeNewFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingFile = (id: number) => {
    setDeletedFileIds(prev => [...prev, id]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return setErrorMsg("제목을 입력해주세요.");
    if (!content.trim()) return setErrorMsg("내용을 입력해주세요.");
    
    if (videoUrl.trim() && !videoUrl.includes('youtu') && !videoUrl.includes('vimeo')) {
      return setErrorMsg("지원되지 않는 영상 URL입니다. (YouTube, Vimeo 허용)");
    }

    setErrorMsg("");
    setIsSubmitting(true);

    const formData = new FormData();
    if (initialData?.id) formData.append("id", initialData.id.toString());
    formData.append("title", title.trim());
    formData.append("content", content.trim());
    formData.append("video_url", videoUrl.trim());
    formData.append("boardType", boardType);
    if (category) formData.append("category", category);
    
    formData.append("deletedFileIds", JSON.stringify(deletedFileIds));
    
    files.forEach(file => {
      formData.append("files", file);
    });

    try {
      const result = await onSubmitAction(formData);
      if (result.success && result.redirectUrl) {
        alert('글이 등록되었습니다.');
        router.push(result.redirectUrl);
        router.refresh();
      } else {
        setErrorMsg(result.error || "저장 중 오류가 발생했습니다.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "서버 통신 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.editorWrap}>
      {errorMsg && <div className={styles.errorAlert}>{errorMsg}</div>}
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>제목 <span className={styles.required}>*</span></label>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles.input} 
            placeholder="제목을 입력하세요"
            disabled={isSubmitting}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>영상 URL <span className={styles.optional}>(선택)</span></label>
          <input 
            type="text" 
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className={styles.input} 
            placeholder="YouTube 또는 Vimeo URL을 입력하세요 (예: https://youtu.be/...)"
            disabled={isSubmitting}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>내용 <span className={styles.required}>*</span></label>
          <textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={styles.textarea} 
            placeholder="내용을 입력하세요"
            rows={15}
            disabled={isSubmitting}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>파일 첨부 <span className={styles.optional}>(선택, 최대 5개, 각 20MB 이하)</span></label>
          
          <div className={styles.fileUploadArea}>
            <input 
              type="file" 
              id="fileUpload" 
              multiple 
              onChange={handleFileChange} 
              className={styles.fileInput}
              disabled={isSubmitting}
            />
            <label htmlFor="fileUpload" className={styles.fileBtn}>파일 선택</label>
          </div>

          {(existingFiles.length > 0 || files.length > 0) && (
            <div className={styles.fileList}>
              {existingFiles.filter(f => !deletedFileIds.includes(f.id)).map(file => (
                <div key={`exist-${file.id}`} className={styles.fileItem}>
                  <div className={styles.fileName}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
                    <span>{file.original_file_name}</span>
                    <span className={styles.fileSize}>({file.file_size})</span>
                  </div>
                  <button type="button" onClick={() => removeExistingFile(file.id)} className={styles.fileRemoveBtn}>삭제</button>
                </div>
              ))}
              
              {files.map((file, idx) => (
                <div key={`new-${idx}`} className={styles.fileItem}>
                  <div className={styles.fileName}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
                    <span>{file.name}</span>
                    <span className={styles.fileSize}>({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                    <span className={styles.newBadge}>N</span>
                  </div>
                  <button type="button" onClick={() => removeNewFile(idx)} className={styles.fileRemoveBtn}>취소</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.btnGroup}>
          <button type="button" onClick={() => router.back()} className={styles.cancelBtn} disabled={isSubmitting}>
            취소
          </button>
          <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
            {isSubmitting ? '저장 중...' : '저장하기'}
          </button>
        </div>
      </form>
    </div>
  );
}

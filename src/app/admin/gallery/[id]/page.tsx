import Link from "next/link";
import AdminTopBar from "../../AdminTopBar";
import styles from "../../admin.module.css";
import { getGalleryPostById } from "@/lib/queries";
import { uploadPhotoAction } from "@/app/actions/gallery-crud";
import { notFound } from "next/navigation";
import Image from "next/image";
import DeletePhotoButton from "@/components/admin/DeletePhotoButton";

export default async function AlbumDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const album = getGalleryPostById(Number(id));

  if (!album) {
    notFound();
  }

  const photos = album.media || [];

  return (
    <div className={styles.adminPage}>
      <AdminTopBar />
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.pageTitle}>{album.title} <span style={{ fontSize: '0.85rem', fontWeight: 400, color: 'var(--color-text-muted)' }}>- 사진 관리</span></h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>{album.description}</p>
          </div>
          <Link href="/admin/gallery" className={styles.backBtn}>
            목록으로
          </Link>
        </div>

        <div className={styles.formCard} style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>새 사진 업로드</h2>
          <form action={uploadPhotoAction}>
            <input type="hidden" name="albumId" value={id} />
            
            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="photo">사진 파일 <span style={{color: 'red'}}>*</span></label>
              <input 
                type="file" 
                id="photo" 
                name="photo" 
                accept="image/jpeg, image/png, image/webp"
                multiple
                required 
                className={styles.formInput} 
              />
              <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.25rem' }}>* 여러 이미지를 선택할 수 있습니다. (각 최대 5MB)</p>
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="caption">공통 설명 (선택)</label>
              <input 
                type="text" 
                id="caption" 
                name="caption" 
                className={styles.formInput} 
                placeholder="업로드하는 사진들의 공통 설명을 입력하세요"
              />
            </div>

            <div className={styles.formActions}>
              <button type="submit" className={styles.submitBtn}>
                사진 업로드
              </button>
            </div>
          </form>
        </div>

        <div className={styles.card}>
          <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>등록된 사진 ({photos.length}장)</h2>
          
          {photos.length === 0 ? (
            <div className={styles.emptyState}>아직 등록된 사진이 없습니다. 상단에서 사진을 업로드해주세요.</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
              {photos.map(photo => {
                const isValidImage = photo.file_path && photo.file_path.trim() !== '';
                
                return (
                  <div key={photo.id} style={{ border: '1px solid var(--color-border-light)', borderRadius: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-surface)' }}>
                    <div style={{ position: 'relative', height: '160px', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {isValidImage ? (
                        <Image src={photo.file_path} alt={photo.file_name || '갤러리 사진'} fill sizes="(max-width: 768px) 100vw, 250px" style={{ objectFit: 'cover' }} />
                      ) : (
                        <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>이미지 경로 없음</span>
                      )}
                    </div>
                    <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', flexGrow: 1, justifyContent: 'space-between' }}>
                      <div>
                        <p style={{ fontSize: '0.9rem', color: 'var(--color-text)', margin: 0, fontWeight: 600, wordBreak: 'break-all' }}>
                          {photo.file_name || <span style={{ color: '#9ca3af', fontWeight: 'normal' }}>설명 없음</span>}
                        </p>
                      </div>
                      
                      <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                        <DeletePhotoButton photoId={photo.id} albumId={Number(id)} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

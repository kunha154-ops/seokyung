import Link from "next/link";
import AdminTopBar from "../../AdminTopBar";
import styles from "../../admin.module.css";
import { getGalleryPostById } from "@/lib/queries";
import { uploadPhotoAction, deletePhotoAction } from "@/app/actions/gallery-crud";
import { notFound } from "next/navigation";
import Image from "next/image";

export default async function AlbumDetailsPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const albumId = (await params).id;
  const album = getGalleryPostById(Number(albumId));

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
            <h1 className={styles.pageTitle}>{album.title} - 사진 관리</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>{album.description}</p>
          </div>
          <Link href="/admin/gallery" className={styles.backBtn}>
            목록으로
          </Link>
        </div>

        <div className={styles.card} style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>새 사진 업로드</h2>
          <form action={uploadPhotoAction} className={styles.form}>
            <input type="hidden" name="albumId" value={albumId} />
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                <label htmlFor="photo">사진 파일 <span style={{color: 'red'}}>*</span></label>
                <input 
                  type="file" 
                  id="photo" 
                  name="photo" 
                  accept="image/*"
                  required 
                  className={styles.input} 
                />
              </div>
              
              <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                <label htmlFor="caption">설명 (선택)</label>
                <input 
                  type="text" 
                  id="caption" 
                  name="caption" 
                  className={styles.input} 
                  placeholder="사진 설명을 입력하세요"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="submit" className={styles.submitBtn} style={{ padding: '0.75rem 2rem' }}>
                  사진 업로드
                </button>
              </div>
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
                  <div key={photo.id} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ position: 'relative', height: '160px', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {isValidImage ? (
                        <Image src={photo.file_path} alt={photo.file_name || '갤러리 사진'} fill sizes="(max-width: 768px) 100vw, 250px" style={{ objectFit: 'cover' }} />
                      ) : (
                        <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>이미지 경로 없음</span>
                      )}
                    </div>
                    <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', flexGrow: 1, justifyContent: 'space-between' }}>
                      <div>
                        <p style={{ fontSize: '0.9rem', color: '#374151', margin: 0, fontWeight: 600, wordBreak: 'break-all' }}>
                          {photo.file_name || <span style={{ color: '#9ca3af', fontWeight: 'normal' }}>설명 없음</span>}
                        </p>
                      </div>
                      
                      <form action={deletePhotoAction} style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                        <input type="hidden" name="id" value={photo.id} />
                        <input type="hidden" name="albumId" value={albumId} />
                        <button 
                          type="submit" 
                          className={styles.deleteBtn} 
                          style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', width: 'auto' }}
                          onClick={(e) => {
                            if (!confirm('정말 이 사진을 삭제하시겠습니까?\n삭제된 사진은 복구할 수 없습니다.')) {
                              e.preventDefault();
                            }
                          }}
                        >
                          삭제
                        </button>
                      </form>
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

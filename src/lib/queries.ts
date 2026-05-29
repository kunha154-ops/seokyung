import { getDb } from './db';

// === Attachments ===
export interface Attachment {
  id: number;
  table_name: string;
  post_id: number;
  original_file_name: string;
  stored_file_name: string;
  file_path: string;
  file_size: string | null;
  mime_type: string | null;
  uploaded_by: number | null;
  created_at: string;
}

export function getAttachments(tableName: string, postId: number): Attachment[] {
  const db = getDb();
  return db.prepare('SELECT * FROM post_attachments WHERE table_name = ? AND post_id = ? ORDER BY created_at ASC').all(tableName, postId) as Attachment[];
}

// === Notices ===
export interface Notice {
  id: number;
  title: string;
  content: string;
  is_pinned: number;
  views: number;
  video_url: string | null;
  author_id: number | null;
  status: string | null;
  created_at: string;
  updated_at: string;
}

export interface NoticeListResult {
  notices: Notice[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export function getNotices(page = 1, pageSize = 10, search = ''): NoticeListResult {
  const db = getDb();
  
  let whereClause = "WHERE (status IS NULL OR status = 'published')";
  const params: (string | number)[] = [];
  
  if (search) {
    whereClause += ' AND (title LIKE ? OR content LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  const countRow = db.prepare(`SELECT COUNT(*) as total FROM notices ${whereClause}`).get(...params) as { total: number };
  const total = countRow.total;
  const totalPages = Math.ceil(total / pageSize);
  const offset = (page - 1) * pageSize;

  const notices = db.prepare(
    `SELECT * FROM notices ${whereClause} ORDER BY is_pinned DESC, created_at DESC LIMIT ? OFFSET ?`
  ).all(...params, pageSize, offset) as Notice[];

  return { notices, total, page, pageSize, totalPages };
}

export function getNoticeById(id: number): Notice | undefined {
  const db = getDb();
  // Increment views
  db.prepare('UPDATE notices SET views = views + 1 WHERE id = ?').run(id);
  return db.prepare('SELECT * FROM notices WHERE id = ?').get(id) as Notice | undefined;
}

export function createNotice(title: string, content: string, isPinned = false): Notice {
  const db = getDb();
  const result = db.prepare(
    'INSERT INTO notices (title, content, is_pinned) VALUES (?, ?, ?)'
  ).run(title, content, isPinned ? 1 : 0);
  return db.prepare('SELECT * FROM notices WHERE id = ?').get(result.lastInsertRowid) as Notice;
}

export function updateNotice(id: number, title: string, content: string, isPinned = false): Notice | undefined {
  const db = getDb();
  db.prepare(
    "UPDATE notices SET title = ?, content = ?, is_pinned = ?, updated_at = datetime('now', 'localtime') WHERE id = ?"
  ).run(title, content, isPinned ? 1 : 0, id);
  return db.prepare('SELECT * FROM notices WHERE id = ?').get(id) as Notice | undefined;
}

export function deleteNotice(id: number): boolean {
  const db = getDb();
  const result = db.prepare('DELETE FROM notices WHERE id = ?').run(id);
  return result.changes > 0;
}

// News functions
export interface NewsImage {
  id: number;
  news_id: number;
  image_url: string;
  storage_path: string;
  sort_order: number;
  created_at: string;
}

export interface NewsItem {
  id: number;
  title: string;
  content: string;
  thumbnail_url: string | null;
  thumbnail_path: string | null;
  views: number;
  created_at: string;
  updated_at: string;
  images?: NewsImage[];
}

export function getNewsList(page = 1, pageSize = 10, search = ''): { news: NewsItem[]; total: number; totalPages: number } {
  const db = getDb();
  
  let whereClause = "WHERE (status IS NULL OR status = 'published')";
  const params: (string | number)[] = [];
  
  if (search) {
    whereClause += ' AND (title LIKE ? OR content LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  const countRow = db.prepare(`SELECT COUNT(*) as total FROM news ${whereClause}`).get(...params) as { total: number };
  const total = countRow.total;
  const totalPages = Math.ceil(total / pageSize);
  const offset = (page - 1) * pageSize;
  const news = db.prepare(`SELECT * FROM news ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`).all(...params, pageSize, offset) as NewsItem[];
  return { news, total, totalPages };
}

export function getNewsById(id: number): NewsItem | undefined {
  const db = getDb();
  db.prepare('UPDATE news SET views = views + 1 WHERE id = ?').run(id);
  const news = db.prepare('SELECT * FROM news WHERE id = ?').get(id) as NewsItem | undefined;
  if (news) {
    news.images = db.prepare('SELECT * FROM news_images WHERE news_id = ? ORDER BY sort_order ASC, created_at ASC').all(id) as NewsImage[];
  }
  return news;
}

export function createNews(title: string, content: string, thumbnailUrl: string | null = null, thumbnailPath: string | null = null): NewsItem {
  const db = getDb();
  const result = db.prepare('INSERT INTO news (title, content, thumbnail_url, thumbnail_path) VALUES (?, ?, ?, ?)').run(title, content, thumbnailUrl, thumbnailPath);
  return db.prepare('SELECT * FROM news WHERE id = ?').get(result.lastInsertRowid) as NewsItem;
}

export function updateNews(id: number, title: string, content: string, thumbnailUrl?: string | null, thumbnailPath?: string | null): NewsItem | undefined {
  const db = getDb();
  if (thumbnailUrl !== undefined && thumbnailPath !== undefined) {
    db.prepare(
      "UPDATE news SET title = ?, content = ?, thumbnail_url = ?, thumbnail_path = ?, updated_at = datetime('now', 'localtime') WHERE id = ?"
    ).run(title, content, thumbnailUrl, thumbnailPath, id);
  } else {
    db.prepare(
      "UPDATE news SET title = ?, content = ?, updated_at = datetime('now', 'localtime') WHERE id = ?"
    ).run(title, content, id);
  }
  return db.prepare('SELECT * FROM news WHERE id = ?').get(id) as NewsItem | undefined;
}

export function addNewsImage(newsId: number, imageUrl: string, storagePath: string, sortOrder = 0): NewsImage {
  const db = getDb();
  const result = db.prepare('INSERT INTO news_images (news_id, image_url, storage_path, sort_order) VALUES (?, ?, ?, ?)').run(newsId, imageUrl, storagePath, sortOrder);
  return db.prepare('SELECT * FROM news_images WHERE id = ?').get(result.lastInsertRowid) as NewsImage;
}

export function deleteNewsImage(id: number): boolean {
  const db = getDb();
  const result = db.prepare('DELETE FROM news_images WHERE id = ?').run(id);
  return result.changes > 0;
}

export function deleteNews(id: number): boolean {
  const db = getDb();
  const result = db.prepare('DELETE FROM news WHERE id = ?').run(id);
  return result.changes > 0;
}

// Gallery functions (Unified)
export interface GalleryPost {
  id: number;
  type: 'photo' | 'video';
  title: string;
  description: string | null;
  author_id: number | null;
  author_name?: string | null;
  status: 'public' | 'hidden';
  thumbnail_url: string | null;
  video_url: string | null;
  video_file_path: string | null;
  view_count: number;
  created_at: string;
  media?: GalleryMedia[];
  media_count?: number;
}

export interface GalleryMedia {
  id: number;
  gallery_post_id: number;
  media_type: 'image' | 'video';
  file_name: string;
  file_path: string;
  file_size: string | null;
  file_type: string | null;
  sort_order: number;
  uploaded_by: number | null;
  created_at: string;
}

export function getGalleryPosts(type?: 'photo' | 'video', page = 1, pageSize = 12, includeHidden = false): { posts: GalleryPost[]; total: number; totalPages: number } {
  const db = getDb();
  let whereClause = "WHERE 1=1";
  const params: any[] = [];
  
  if (type) {
    whereClause += " AND gp.type = ?";
    params.push(type);
  }
  
  if (!includeHidden) {
    whereClause += " AND gp.status = 'public'";
  }

  const countRow = db.prepare(`SELECT COUNT(*) as total FROM gallery_posts gp ${whereClause}`).get(...params) as { total: number };
  const total = countRow.total;
  const totalPages = Math.ceil(total / pageSize);
  const offset = (page - 1) * pageSize;

  const posts = db.prepare(`
    SELECT gp.*, u.name as author_name,
           (SELECT COUNT(*) FROM gallery_media gm WHERE gm.gallery_post_id = gp.id) as media_count
    FROM gallery_posts gp
    LEFT JOIN users u ON gp.author_id = u.id
    ${whereClause} 
    ORDER BY gp.created_at DESC 
    LIMIT ? OFFSET ?
  `).all(...params, pageSize, offset) as GalleryPost[];
  
  return { posts, total, totalPages };
}

export function getGalleryPostById(id: number, includeHidden = false): GalleryPost | null {
  const db = getDb();
  const whereClause = includeHidden ? "WHERE gp.id = ?" : "WHERE gp.id = ? AND gp.status = 'public'";
  
  const post = db.prepare(`
    SELECT gp.*, u.name as author_name 
    FROM gallery_posts gp 
    LEFT JOIN users u ON gp.author_id = u.id 
    ${whereClause}
  `).get(id) as GalleryPost | undefined;

  if (!post) return null;

  const media = db.prepare(`
    SELECT * FROM gallery_media 
    WHERE gallery_post_id = ? 
    ORDER BY sort_order ASC, created_at ASC
  `).all(id) as GalleryMedia[];

  post.media = media;
  post.media_count = media.length;

  return post;
}

export function incrementGalleryView(id: number): void {
  const db = getDb();
  db.prepare('UPDATE gallery_posts SET view_count = view_count + 1 WHERE id = ?').run(id);
}

export function createGalleryPost(
  type: 'photo' | 'video',
  title: string,
  description: string | null,
  authorId: number | null,
  status: 'public' | 'hidden' = 'public',
  thumbnailUrl: string | null = null,
  videoUrl: string | null = null,
  videoFilePath: string | null = null
): GalleryPost {
  const db = getDb();
  const result = db.prepare(`
    INSERT INTO gallery_posts (type, title, description, author_id, status, thumbnail_url, video_url, video_file_path)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(type, title, description, authorId, status, thumbnailUrl, videoUrl, videoFilePath);
  
  return db.prepare('SELECT * FROM gallery_posts WHERE id = ?').get(result.lastInsertRowid) as GalleryPost;
}

export function addGalleryMedia(
  galleryPostId: number,
  mediaType: 'image' | 'video',
  fileName: string,
  filePath: string,
  fileSize: string | null = null,
  fileType: string | null = null,
  sortOrder: number = 0,
  uploadedBy: number | null = null
): GalleryMedia {
  const db = getDb();
  const result = db.prepare(`
    INSERT INTO gallery_media (gallery_post_id, media_type, file_name, file_path, file_size, file_type, sort_order, uploaded_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(galleryPostId, mediaType, fileName, filePath, fileSize, fileType, sortOrder, uploadedBy);

  return db.prepare('SELECT * FROM gallery_media WHERE id = ?').get(result.lastInsertRowid) as GalleryMedia;
}

export function deleteGalleryPost(id: number): boolean {
  const db = getDb();
  // Media deletes cascade automatically if setup in SQLite, but better explicit via ON DELETE CASCADE in db.ts
  const result = db.prepare('DELETE FROM gallery_posts WHERE id = ?').run(id);
  return result.changes > 0;
}

// Resources functions
export interface Resource {
  id: number;
  category: string;
  title: string;
  file_path: string | null;
  file_size: string | null;
  downloads: number;
  video_url?: string | null;
  author_id?: number | null;
  author_name?: string | null;
  created_at: string;
  attachment_count?: number;
  attachments?: any[];
  views?: number;
}

export function getResources(category: string, page = 1, pageSize = 10, search = ''): { resources: Resource[]; total: number; totalPages: number } {
  const db = getDb();
  
  let whereClause = "WHERE category = ? AND (status IS NULL OR status = 'published')";
  const params: (string | number)[] = [category];
  
  if (search) {
    whereClause += ' AND (title LIKE ? OR file_path LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  const countRow = db.prepare(`SELECT COUNT(*) as total FROM resources ${whereClause}`).get(...params) as { total: number };
  const total = countRow.total;
  const totalPages = Math.ceil(total / pageSize);
  const offset = (page - 1) * pageSize;

  const resources = db.prepare(`
    SELECT r.*, 
           (SELECT COUNT(*) FROM post_attachments pa WHERE pa.table_name = 'resources' AND pa.post_id = r.id) as attachment_count
    FROM resources r
    ${whereClause} 
    ORDER BY r.created_at DESC 
    LIMIT ? OFFSET ?
  `).all(...params, pageSize, offset) as Resource[];
  return { resources, total, totalPages };
}

export function getResourceById(id: number): Resource | null {
  const db = getDb();
  const resource = db.prepare(`
    SELECT r.*, u.name as author_name 
    FROM resources r 
    LEFT JOIN users u ON r.author_id = u.id 
    WHERE r.id = ? AND (r.status IS NULL OR r.status = 'published')
  `).get(id) as Resource | undefined;

  if (!resource) return null;

  const attachments = db.prepare(`
    SELECT * FROM post_attachments 
    WHERE table_name = 'resources' AND post_id = ? 
    ORDER BY created_at ASC
  `).all(id);

  resource.attachments = attachments;
  resource.attachment_count = attachments.length;

  return resource;
}

export function incrementResourceViews(id: number): void {
  // SQLite table for resources might not have views, let's check schema.
  // Wait, db.ts: resources does NOT have views!
  // I will just return if views column doesn't exist. We'll skip views for now to avoid altering table.
}

export function createResource(category: string, title: string, filePath: string | null, fileSize: string | null): Resource {
  const db = getDb();
  const result = db.prepare('INSERT INTO resources (category, title, file_path, file_size) VALUES (?, ?, ?, ?)').run(category, title, filePath, fileSize);
  return db.prepare('SELECT * FROM resources WHERE id = ?').get(result.lastInsertRowid) as Resource;
}

export function deleteResource(id: number): boolean {
  const db = getDb();
  const result = db.prepare('DELETE FROM resources WHERE id = ?').run(id);
  return result.changes > 0;
}

export function incrementResourceDownload(id: number): void {
  const db = getDb();
  db.prepare('UPDATE resources SET downloads = downloads + 1 WHERE id = ?').run(id);
}


export function deleteGalleryMedia(id: number): boolean {
  const db = getDb();
  const result = db.prepare('DELETE FROM gallery_media WHERE id = ?').run(id);
  return result.changes > 0;
}

// === Committee Posts ===
export interface CommitteePost {
  id: number;
  committee_type: string;
  board_type: string;
  title: string;
  content: string;
  thumbnail_url: string | null;
  thumbnail_path: string | null;
  status: string;
  views: number;
  author_id: number | null;
  author_name?: string | null;
  created_at: string;
  updated_at: string;
  attachment_count?: number;
  attachments?: Attachment[];
}

export function getCommitteePosts(committeeType: string, boardType?: string, page = 1, pageSize = 10, search = '', includeHidden = false): { posts: CommitteePost[]; total: number; totalPages: number } {
  const db = getDb();
  let whereClause = "WHERE cp.committee_type = ?";
  const params: (string | number)[] = [committeeType];

  if (boardType) {
    whereClause += " AND cp.board_type = ?";
    params.push(boardType);
  }

  if (!includeHidden) {
    whereClause += " AND cp.status = 'public'";
  }

  if (search) {
    whereClause += " AND (cp.title LIKE ? OR cp.content LIKE ?)";
    params.push(`%${search}%`, `%${search}%`);
  }

  const countRow = db.prepare(`SELECT COUNT(*) as total FROM committee_posts cp ${whereClause}`).get(...params) as { total: number };
  const total = countRow.total;
  const totalPages = Math.ceil(total / pageSize);
  const offset = (page - 1) * pageSize;

  const posts = db.prepare(`
    SELECT cp.*, u.name as author_name,
           (SELECT COUNT(*) FROM post_attachments pa WHERE pa.table_name = 'committee_posts' AND pa.post_id = cp.id) as attachment_count
    FROM committee_posts cp
    LEFT JOIN users u ON cp.author_id = u.id
    ${whereClause} 
    ORDER BY cp.created_at DESC 
    LIMIT ? OFFSET ?
  `).all(...params, pageSize, offset) as CommitteePost[];

  return { posts, total, totalPages };
}

export function getCommitteePostById(id: number, includeHidden = false): CommitteePost | null {
  const db = getDb();
  const whereClause = includeHidden ? "WHERE cp.id = ?" : "WHERE cp.id = ? AND cp.status = 'public'";
  
  const post = db.prepare(`
    SELECT cp.*, u.name as author_name 
    FROM committee_posts cp 
    LEFT JOIN users u ON cp.author_id = u.id 
    ${whereClause}
  `).get(id) as CommitteePost | undefined;

  if (!post) return null;

  post.attachments = getAttachments('committee_posts', id);
  post.attachment_count = post.attachments.length;

  return post;
}

export function incrementCommitteePostViews(id: number): void {
  const db = getDb();
  db.prepare('UPDATE committee_posts SET views = views + 1 WHERE id = ?').run(id);
}

export function createCommitteePost(
  committeeType: string,
  boardType: string,
  title: string,
  content: string,
  status: string = 'public',
  authorId: number | null = null,
  thumbnailUrl: string | null = null,
  thumbnailPath: string | null = null
): CommitteePost {
  const db = getDb();
  const result = db.prepare(`
    INSERT INTO committee_posts (committee_type, board_type, title, content, status, author_id, thumbnail_url, thumbnail_path)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(committeeType, boardType, title, content, status, authorId, thumbnailUrl, thumbnailPath);
  
  return db.prepare('SELECT * FROM committee_posts WHERE id = ?').get(result.lastInsertRowid) as CommitteePost;
}

export function updateCommitteePost(
  id: number,
  title: string,
  content: string,
  status: string,
  thumbnailUrl?: string | null,
  thumbnailPath?: string | null
): CommitteePost | undefined {
  const db = getDb();
  
  if (thumbnailUrl !== undefined && thumbnailPath !== undefined) {
    db.prepare(`
      UPDATE committee_posts 
      SET title = ?, content = ?, status = ?, thumbnail_url = ?, thumbnail_path = ?, updated_at = datetime('now', 'localtime') 
      WHERE id = ?
    `).run(title, content, status, thumbnailUrl, thumbnailPath, id);
  } else {
    db.prepare(`
      UPDATE committee_posts 
      SET title = ?, content = ?, status = ?, updated_at = datetime('now', 'localtime') 
      WHERE id = ?
    `).run(title, content, status, id);
  }
  
  return db.prepare('SELECT * FROM committee_posts WHERE id = ?').get(id) as CommitteePost | undefined;
}

export function deleteCommitteePost(id: number): boolean {
  const db = getDb();
  const result = db.prepare('DELETE FROM committee_posts WHERE id = ?').run(id);
  // Optional: delete attachments metadata, but physical files remain unless handled by API
  db.prepare("DELETE FROM post_attachments WHERE table_name = 'committee_posts' AND post_id = ?").run(id);
  return result.changes > 0;
}

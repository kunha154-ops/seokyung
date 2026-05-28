import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = process.env.VERCEL ? '/tmp/seokyung.db' : path.join(process.cwd(), 'data', 'seokyung.db');

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    // Ensure data directory exists
    const fs = require('fs');
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initializeSchema(db);
  }
  return db;
}

function initializeSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS notices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      is_pinned INTEGER DEFAULT 0,
      views INTEGER DEFAULT 0,
      video_url TEXT,
      author_id INTEGER REFERENCES users(id),
      status TEXT DEFAULT 'published',
      created_at TEXT DEFAULT (datetime('now', 'localtime')),
      updated_at TEXT DEFAULT (datetime('now', 'localtime'))
    );

    CREATE TABLE IF NOT EXISTS news (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      thumbnail TEXT,
      views INTEGER DEFAULT 0,
      video_url TEXT,
      author_id INTEGER REFERENCES users(id),
      status TEXT DEFAULT 'published',
      created_at TEXT DEFAULT (datetime('now', 'localtime')),
      updated_at TEXT DEFAULT (datetime('now', 'localtime'))
    );

    CREATE TABLE IF NOT EXISTS gallery_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL, -- 'photo' | 'video'
      title TEXT NOT NULL,
      description TEXT,
      author_id INTEGER REFERENCES users(id),
      status TEXT DEFAULT 'public',
      thumbnail_url TEXT,
      video_url TEXT,
      video_file_path TEXT,
      view_count INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now', 'localtime')),
      updated_at TEXT DEFAULT (datetime('now', 'localtime'))
    );

    CREATE TABLE IF NOT EXISTS gallery_media (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      gallery_post_id INTEGER NOT NULL,
      media_type TEXT NOT NULL, -- 'image' | 'video'
      file_name TEXT NOT NULL,
      file_path TEXT NOT NULL,
      file_size TEXT,
      file_type TEXT,
      sort_order INTEGER DEFAULT 0,
      uploaded_by INTEGER REFERENCES users(id),
      created_at TEXT DEFAULT (datetime('now', 'localtime')),
      FOREIGN KEY (gallery_post_id) REFERENCES gallery_posts(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS resources (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT NOT NULL DEFAULT 'forms',
      title TEXT NOT NULL,
      file_path TEXT,
      file_size TEXT,
      downloads INTEGER DEFAULT 0,
      video_url TEXT,
      author_id INTEGER REFERENCES users(id),
      status TEXT DEFAULT 'published',
      created_at TEXT DEFAULT (datetime('now', 'localtime'))
    );

    CREATE TABLE IF NOT EXISTS post_attachments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      table_name TEXT NOT NULL,
      post_id INTEGER NOT NULL,
      original_file_name TEXT NOT NULL,
      stored_file_name TEXT NOT NULL,
      file_path TEXT NOT NULL,
      file_size TEXT,
      mime_type TEXT,
      uploaded_by INTEGER REFERENCES users(id),
      created_at TEXT DEFAULT (datetime('now', 'localtime'))
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      email TEXT,
      church TEXT,
      position TEXT,
      phone TEXT,
      status TEXT DEFAULT 'pending',
      role TEXT DEFAULT 'member',
      failed_attempts INTEGER DEFAULT 0,
      locked_until TEXT,
      created_at TEXT DEFAULT (datetime('now', 'localtime')),
      last_login TEXT
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      session_token TEXT UNIQUE NOT NULL,
      expires_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS hero_slides (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subtitle TEXT,
      title TEXT NOT NULL,
      description TEXT,
      desktop_image TEXT NOT NULL,
      mobile_image TEXT,
      object_position TEXT DEFAULT 'center center',
      primary_btn_text TEXT,
      primary_btn_link TEXT,
      secondary_btn_text TEXT,
      secondary_btn_link TEXT,
      is_active INTEGER DEFAULT 1,
      sort_order INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now', 'localtime')),
      updated_at TEXT DEFAULT (datetime('now', 'localtime'))
    );
  `);

  // Migration for existing databases
  try {
    db.prepare("ALTER TABLE users ADD COLUMN church TEXT").run();
    db.prepare("ALTER TABLE users ADD COLUMN position TEXT").run();
    db.prepare("ALTER TABLE users ADD COLUMN phone TEXT").run();
    db.prepare("ALTER TABLE users ADD COLUMN status TEXT DEFAULT 'pending'").run();
    // 기존 가입자는 불편함이 없도록 자동 승인 처리
    db.prepare("UPDATE users SET status = 'approved'").run();
  } catch (e) {
    // Columns already exist
  }

  // Ensure hero_slides table exists for existing databases
  try {
    db.prepare("SELECT 1 FROM hero_slides LIMIT 1").get();
  } catch (e) {
    db.exec(`
      CREATE TABLE hero_slides (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        subtitle TEXT,
        title TEXT NOT NULL,
        description TEXT,
        desktop_image TEXT NOT NULL,
        mobile_image TEXT,
        object_position TEXT DEFAULT 'center center',
        primary_btn_text TEXT,
        primary_btn_link TEXT,
        secondary_btn_text TEXT,
        secondary_btn_link TEXT,
        is_active INTEGER DEFAULT 1,
        sort_order INTEGER DEFAULT 0,
        created_at TEXT DEFAULT (datetime('now', 'localtime')),
        updated_at TEXT DEFAULT (datetime('now', 'localtime'))
      );
    `);
    
    // 기본 슬라이드 데이터 추가 (이전 static 데이터 기반)
    const insertHero = db.prepare(`
      INSERT INTO hero_slides (subtitle, title, description, desktop_image, object_position, primary_btn_text, primary_btn_link, secondary_btn_text, secondary_btn_link, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    insertHero.run('신뢰와 은혜', '세상의 빛이 되는<br />거룩한 발걸음', '따뜻한 교제와 협력으로 하나님 나라를 확장합니다.', '/images/slide1.jpg', 'right center', '노회 현황', '/organization/districts', '자료실 바로가기', '/resources/forms', 0);
    insertHero.run('대한예수교장로회 서경노회', '교회와 교회를 잇고,<br />복음의 사명을 함께 감당하는 공동체', '바른 신학과 신앙 위에서 교회의 본질을 지켜갑니다.', '/images/slide2.jpg', 'center center', '노회 소개', '/about/greeting', '자료실 바로가기', '/resources/forms', 1);
    insertHero.run('대한예수교장로회 서경노회', '질서와 신뢰,<br />복음의 사명으로 잇는 공동체', '바른 신학과 신앙 위에서 교회의 본질을 지켜갑니다.', '/images/slide3.jpg', 'center center', '공지사항', '/news/notices', '자료실 바로가기', '/resources/forms', 2);
    insertHero.run('복음의 사명', '세상을 향해<br />그리스도의 사랑을 전합니다', '따뜻한 교제와 협력으로 하나님 나라를 확장하는 공동체', '/images/slide4.png', 'center center', '포토갤러리', '/gallery/photos', '자료실 바로가기', '/resources/forms', 3);
  }

  // Ensure news table has thumbnail columns
  try {
    db.prepare("ALTER TABLE news ADD COLUMN thumbnail_url TEXT").run();
    db.prepare("ALTER TABLE news ADD COLUMN thumbnail_path TEXT").run();
  } catch (e) {
    // Columns already exist
  }

  // Seed with sample data if tables are empty
  const count = db.prepare('SELECT COUNT(*) as count FROM notices').get() as { count: number };
  if (count.count === 0) {
    seedData(db);
  }
}

function seedData(db: Database.Database) {
  const insertNotice = db.prepare(
    'INSERT INTO notices (title, content, is_pinned, views, created_at) VALUES (?, ?, ?, ?, ?)'
  );

  const notices = [
    {
      title: '2026년 봄 정기회 안내',
      content: '서경노회 제112회 봄 정기회를 아래와 같이 안내합니다.\n\n일시: 2026년 4월 15일 (화) 오전 10시\n장소: 예정 교회\n\n안건:\n1. 2025년도 사업 및 결산 보고\n2. 2026년도 사업계획 및 예산 심의\n3. 임원 선출\n4. 기타 안건\n\n참석 대상: 소속 목사 및 장로 대의원\n\n많은 참석 부탁드립니다.',
      is_pinned: 1, views: 245, created_at: '2026-04-15 10:00:00'
    },
    {
      title: '2026년도 노회 사업계획서',
      content: '2026년도 서경노회 사업계획서를 배포합니다.\n\n주요 사업:\n- 소속 교회 목회 지원\n- 캄보디아 선교센터 운영\n- 교역자 세미나 개최\n- 지역사회 봉사 활동\n\n자세한 내용은 첨부 파일을 참고해 주세요.',
      is_pinned: 0, views: 189, created_at: '2026-03-20 09:00:00'
    },
    {
      title: '제57회 정기총회 결의사항 안내',
      content: '대한예수교장로회 제57회 정기총회에서 결의된 주요 사항을 안내드립니다.\n\n노회에 해당되는 사항은 차기 정기회에서 논의될 예정입니다.',
      is_pinned: 0, views: 156, created_at: '2026-02-10 14:00:00'
    },
    {
      title: '2026년 신년하례회 안내',
      content: '서경노회 2026년 신년하례회에 목사, 장로님들을 초청합니다.\n\n일시: 2026년 1월 15일\n장소: 추후 공지',
      is_pinned: 0, views: 134, created_at: '2026-01-05 09:00:00'
    },
    {
      title: '2025년 가을 정기회 결의사항',
      content: '2025년 가을 정기회 주요 결의사항을 공유합니다.\n\n1. 2026년도 예산안 승인\n2. 새 임원 인준\n3. 선교 사업 보고',
      is_pinned: 0, views: 201, created_at: '2025-10-22 10:00:00'
    },
  ];

  const insertMany = db.transaction(() => {
    for (const n of notices) {
      insertNotice.run(n.title, n.content, n.is_pinned, n.views, n.created_at);
    }
  });
  insertMany();

  // Seed news
  const insertNews = db.prepare(
    'INSERT INTO news (title, content, views, created_at) VALUES (?, ?, ?, ?)'
  );
  const newsItems = [
    { title: '2026년 봄 정기회가 은혜 가운데 마무리되었습니다', content: '서경노회 제112회 봄 정기회가 4월 15일 예정교회에서 은혜 가운데 진행되었습니다.', views: 203, created_at: '2026-04-16 18:00:00' },
    { title: '캄보디아 선교센터 방문 보고', content: '서경노회 선교위원회가 캄보디아 선교센터를 방문하여 현지 사역 현황을 점검했습니다.', views: 156, created_at: '2026-03-05 10:00:00' },
    { title: '2026년 신년하례회 현장 소식', content: '서경노회 2026년 신년하례회가 1월 10일 성황리에 개최되었습니다.', views: 134, created_at: '2026-01-10 09:00:00' },
  ];

  const insertManyNews = db.transaction(() => {
    for (const n of newsItems) {
      insertNews.run(n.title, n.content, n.views, n.created_at);
    }
  });
  insertManyNews();
}

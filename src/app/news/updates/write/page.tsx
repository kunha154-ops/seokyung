import SubPageLayout from "@/components/SubPageLayout";
import PostEditor from "@/components/common/PostEditor";
import { submitPost } from "@/app/actions/post-actions";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const NEWS_MENU = [
  { label: "공지사항", href: "/news/notices" },
  { label: "노회 소식", href: "/news/updates", active: true },
];

export const metadata = { title: "노회 소식 작성" };

export default async function UpdatesWritePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  
  if (!token) {
    redirect('/admin/login');
  }

  return (
    <SubPageLayout
      title="노회 소식 작성"
      breadcrumbs={[
        { label: "소식", href: "/news" },
        { label: "노회 소식", href: "/news/updates" },
        { label: "글쓰기" }
      ]}
      sideMenu={NEWS_MENU}
    >
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-text)' }}>새 노회 소식 작성</h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>새로운 노회 소식을 등록합니다.</p>
      </div>

      <PostEditor 
        boardType="news" 
        onSubmitAction={submitPost} 
      />
    </SubPageLayout>
  );
}

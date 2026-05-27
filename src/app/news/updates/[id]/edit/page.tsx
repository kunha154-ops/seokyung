import { notFound, redirect } from "next/navigation";
import SubPageLayout from "@/components/SubPageLayout";
import PostEditor from "@/components/common/PostEditor";
import { submitPost } from "@/app/actions/post-actions";
import { getNewsById, getAttachments } from "@/lib/queries";
import { cookies } from "next/headers";

const NEWS_MENU = [
  { label: "공지사항", href: "/news/notices" },
  { label: "노회 소식", href: "/news/updates", active: true },
];

export const metadata = { title: "노회 소식 수정" };
export const dynamic = 'force-dynamic';

export default async function NewsEditPage({ params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token) redirect('/admin/login');

  const { id } = await params;
  const newsItem = getNewsById(Number(id));
  if (!newsItem) notFound();

  const attachments = getAttachments('news', newsItem.id);

  return (
    <SubPageLayout
      title="노회 소식 수정"
      breadcrumbs={[
        { label: "소식", href: "/news" },
        { label: "노회 소식", href: "/news/updates" },
        { label: "수정" },
      ]}
      sideMenu={NEWS_MENU}
    >
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-text)' }}>노회 소식 수정</h2>
      </div>

      <PostEditor
        boardType="news"
        initialData={{
          id: newsItem.id,
          title: newsItem.title,
          content: newsItem.content,
          video_url: (newsItem as any).video_url,
          attachments: attachments.map(a => ({ id: a.id, original_file_name: a.original_file_name, file_size: a.file_size || '' })),
        }}
        onSubmitAction={submitPost}
      />
    </SubPageLayout>
  );
}

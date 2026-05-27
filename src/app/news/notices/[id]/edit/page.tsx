import { notFound, redirect } from "next/navigation";
import SubPageLayout from "@/components/SubPageLayout";
import PostEditor from "@/components/common/PostEditor";
import { submitPost } from "@/app/actions/post-actions";
import { getNoticeById, getAttachments } from "@/lib/queries";
import { cookies } from "next/headers";

const NEWS_MENU = [
  { label: "공지사항", href: "/news/notices", active: true },
  { label: "노회 소식", href: "/news/updates" },
];

export const metadata = { title: "공지사항 수정" };
export const dynamic = 'force-dynamic';

export default async function NoticeEditPage({ params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token) redirect('/admin/login');

  const { id } = await params;
  const notice = getNoticeById(Number(id));
  if (!notice) notFound();

  const attachments = getAttachments('notices', notice.id);

  return (
    <SubPageLayout
      title="공지사항 수정"
      breadcrumbs={[
        { label: "소식", href: "/news" },
        { label: "공지사항", href: "/news/notices" },
        { label: "수정" },
      ]}
      sideMenu={NEWS_MENU}
    >
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-text)' }}>공지사항 수정</h2>
      </div>

      <PostEditor
        boardType="notices"
        initialData={{
          id: notice.id,
          title: notice.title,
          content: notice.content,
          video_url: notice.video_url,
          attachments: attachments.map(a => ({ id: a.id, original_file_name: a.original_file_name, file_size: a.file_size || '' })),
        }}
        onSubmitAction={submitPost}
      />
    </SubPageLayout>
  );
}

import SubPageLayout from "@/components/SubPageLayout";
import PostEditor from "@/components/common/PostEditor";
import { submitPost } from "@/app/actions/post-actions";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const CATEGORIES = [
  { id: "trends", label: "선교사동향" },
  { id: "finance", label: "재정보고" },
  { id: "notices", label: "공지사항" },
  { id: "donations", label: "특별후원금" },
  { id: "activities", label: "사업활동" },
];

export const dynamic = 'force-dynamic';

export default async function MissionWritePage({ params }: { params: Promise<{ category: string }> }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token) redirect('/admin/login');

  const { category } = await params;
  const currentCategory = CATEGORIES.find(c => c.id === category) || CATEGORIES[0];

  const MISSION_MENU = CATEGORIES.map(c => ({
    label: c.label,
    href: `/mission/${c.id}`,
    active: c.id === category,
  }));

  return (
    <SubPageLayout
      title={`${currentCategory.label} 작성`}
      breadcrumbs={[
        { label: "선교위원회", href: "/mission" },
        { label: currentCategory.label, href: `/mission/${category}` },
        { label: "글쓰기" },
      ]}
      sideMenu={MISSION_MENU}
    >
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-text)' }}>새 글 작성</h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
          선교위원회 {currentCategory.label} 카테고리에 새 글을 등록합니다.
        </p>
      </div>

      <PostEditor
        boardType="resources"
        category={`mission-${category}`}
        onSubmitAction={submitPost}
      />
    </SubPageLayout>
  );
}

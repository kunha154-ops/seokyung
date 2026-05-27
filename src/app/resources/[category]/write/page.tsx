import SubPageLayout from "@/components/SubPageLayout";
import PostEditor from "@/components/common/PostEditor";
import { submitPost } from "@/app/actions/post-actions";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const CATEGORIES = [
  { id: "forms", label: "행정서식" },
  { id: "requests", label: "행정처리요청" },
  { id: "general", label: "일반자료실" },
  { id: "resolutions", label: "의사결의서" },
  { id: "minutes-council", label: "의사회의록" },
  { id: "minutes-executive", label: "임원회의록" },
  { id: "court", label: "재판국자료" },
  { id: "official-documents", label: "공문수발" },
  { id: "scans", label: "스캔자료" },
];

export const dynamic = 'force-dynamic';

export default async function ResourceWritePage({ params }: { params: Promise<{ category: string }> }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token) redirect('/admin/login');

  const { category } = await params;
  const currentCategory = CATEGORIES.find(c => c.id === category) || CATEGORIES[0];

  const RES_MENU = CATEGORIES.map(c => ({
    label: c.label,
    href: `/resources/${c.id}`,
    active: c.id === category,
  }));

  return (
    <SubPageLayout
      title={`${currentCategory.label} 작성`}
      breadcrumbs={[
        { label: "자료실", href: "/resources" },
        { label: currentCategory.label, href: `/resources/${category}` },
        { label: "글쓰기" },
      ]}
      sideMenu={RES_MENU}
    >
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-text)' }}>새 자료 등록</h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
          {currentCategory.label} 카테고리에 새 자료를 등록합니다.
        </p>
      </div>

      <PostEditor
        boardType="resources"
        category={category}
        onSubmitAction={submitPost}
      />
    </SubPageLayout>
  );
}

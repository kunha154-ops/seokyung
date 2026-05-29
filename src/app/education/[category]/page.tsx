import { getCommitteePosts } from "@/lib/queries";
import { getCurrentUser } from "@/app/actions/post-actions";
import CommitteeList from "@/components/committee/CommitteeList";
import SubPageLayout from "@/components/SubPageLayout";

export const dynamic = 'force-dynamic';

export const CATEGORIES = [
  { id: "trends", label: "선교사동향" },
  { id: "finance", label: "재정보고" },
  { id: "notices", label: "공지사항" },
  { id: "donations", label: "특별후원금" },
  { id: "activities", label: "사업활동" },
];

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const p = await params;
  const category = CATEGORIES.find(c => c.id === p.category) || CATEGORIES[0];
  return { title: `교육위원회 - ${category.label}` };
}

interface PageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string; search?: string }>;
}

export default async function EducationCategoryPage({ params, searchParams }: PageProps) {
  const user = await getCurrentUser();
  const isAdmin = user?.isAdmin || false;
  const canWrite = isAdmin || user?.status === 'approved';

  const p = await params;
  const sp = await searchParams;
  const categoryId = p.category;
  const currentCategory = CATEGORIES.find(c => c.id === categoryId) || CATEGORIES[0];

  const page = Number(sp.page) || 1;
  const search = sp.search || '';

  const { posts, total, totalPages } = getCommitteePosts(
    'education', 
    categoryId, 
    page, 
    10, 
    search, 
    isAdmin // Admins can see hidden posts
  );

  const MENU = CATEGORIES.map(c => ({
    label: c.label,
    href: `/education/${c.id}`,
    active: c.id === categoryId,
  }));

  return (
    <SubPageLayout
      title="교육위원회"
      breadcrumbs={[
        { label: "교육위원회", href: "/education" },
        { label: currentCategory.label },
      ]}
      sideMenu={MENU}
    >
      <CommitteeList
        committeeType="education"
        boardType={categoryId}
        posts={posts}
        total={total}
        page={page}
        totalPages={totalPages}
        search={search}
        canWrite={canWrite}
        basePath="/education"
      />
    </SubPageLayout>
  );
}

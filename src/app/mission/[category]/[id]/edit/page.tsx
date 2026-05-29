import { notFound, redirect } from "next/navigation";
import { getCommitteePostById } from "@/lib/queries";
import { getCurrentUser } from "@/app/actions/post-actions";
import CommitteeForm from "@/components/committee/CommitteeForm";
import SubPageLayout from "@/components/SubPageLayout";
import { CATEGORIES } from "../../page";

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ category: string; id: string }>;
}

export default async function MissionEditPage({ params }: PageProps) {
  const p = await params;
  const postId = parseInt(p.id, 10);
  
  if (isNaN(postId)) {
    notFound();
  }

  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/login');
  }

  const isAdmin = user.isAdmin || false;
  const post = getCommitteePostById(postId, true); // Get even if hidden

  if (!post || post.committee_type !== 'mission' || post.board_type !== p.category) {
    notFound();
  }

  const canEdit = isAdmin || (user.id === post.author_id);
  if (!canEdit) {
    redirect(`/mission/${p.category}/${p.id}`);
  }

  const currentCategory = CATEGORIES.find(c => c.id === p.category) || CATEGORIES[0];

  const MISSION_MENU = CATEGORIES.map(c => ({
    label: c.label,
    href: `/mission/${c.id}`,
    active: c.id === p.category,
  }));

  return (
    <SubPageLayout
      title="선교위원회"
      breadcrumbs={[
        { label: "선교위원회", href: "/mission" },
        { label: currentCategory.label, href: `/mission/${p.category}` },
        { label: "수정하기" },
      ]}
      sideMenu={MISSION_MENU}
    >
      <CommitteeForm
        committeeType="mission"
        boardType={p.category}
        post={post}
        basePath="/mission"
      />
    </SubPageLayout>
  );
}

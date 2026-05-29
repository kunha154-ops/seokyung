import { notFound } from "next/navigation";
import { getCommitteePostById, incrementCommitteePostViews } from "@/lib/queries";
import { getCurrentUser } from "@/app/actions/post-actions";
import CommitteeDetail from "@/components/committee/CommitteeDetail";
import SubPageLayout from "@/components/SubPageLayout";
import { CATEGORIES } from "../page";

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ category: string; id: string }>;
}

export default async function MissionDetailPage({ params }: PageProps) {
  const p = await params;
  const postId = parseInt(p.id, 10);
  
  if (isNaN(postId)) {
    notFound();
  }

  const user = await getCurrentUser();
  const isAdmin = user?.isAdmin || false;

  const post = getCommitteePostById(postId, isAdmin); // Admins can view hidden posts

  if (!post || post.committee_type !== 'mission' || post.board_type !== p.category) {
    notFound();
  }

  incrementCommitteePostViews(postId);

  const canEdit = isAdmin || (user && user.id === post.author_id);
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
        { label: "상세내용" },
      ]}
      sideMenu={MISSION_MENU}
    >
      <CommitteeDetail
        post={post}
        canEdit={canEdit as boolean}
        isAdmin={isAdmin}
        basePath="/mission"
      />
    </SubPageLayout>
  );
}

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

export default async function SelfRelianceDetailPage({ params }: PageProps) {
  const p = await params;
  const postId = parseInt(p.id, 10);
  
  if (isNaN(postId)) {
    notFound();
  }

  const user = await getCurrentUser();
  const isAdmin = user?.isAdmin || false;

  const post = getCommitteePostById(postId, isAdmin); // Admins can view hidden posts

  if (!post || post.committee_type !== 'self_reliance' || post.board_type !== p.category) {
    notFound();
  }

  incrementCommitteePostViews(postId);

  const canEdit = isAdmin || (user && user.id === post.author_id);
  const currentCategory = CATEGORIES.find(c => c.id === p.category) || CATEGORIES[0];

  const MENU = CATEGORIES.map(c => ({
    label: c.label,
    href: `/self-reliance/${c.id}`,
    active: c.id === p.category,
  }));

  return (
    <SubPageLayout
      title="자립위원회"
      breadcrumbs={[
        { label: "자립위원회", href: "/self-reliance" },
        { label: currentCategory.label, href: `/self-reliance/${p.category}` },
        { label: "상세내용" },
      ]}
      sideMenu={MENU}
    >
      <CommitteeDetail
        post={post}
        canEdit={canEdit as boolean}
        isAdmin={isAdmin}
        basePath="/self-reliance"
      />
    </SubPageLayout>
  );
}

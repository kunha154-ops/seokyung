import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/actions/post-actions";
import CommitteeForm from "@/components/committee/CommitteeForm";
import SubPageLayout from "@/components/SubPageLayout";
import { CATEGORIES } from "../page";

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ category: string }>;
}

export default async function SelfRelianceWritePage({ params }: PageProps) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/login');
  }

  const canWrite = user.isAdmin || user.status === 'approved';
  if (!canWrite) {
    redirect('/self-reliance');
  }

  const p = await params;
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
        { label: "글쓰기" },
      ]}
      sideMenu={MENU}
    >
      <CommitteeForm
        committeeType="self_reliance"
        boardType={p.category}
        basePath="/self-reliance"
      />
    </SubPageLayout>
  );
}

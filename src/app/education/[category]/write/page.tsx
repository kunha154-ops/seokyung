import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/actions/post-actions";
import CommitteeForm from "@/components/committee/CommitteeForm";
import SubPageLayout from "@/components/SubPageLayout";
import { CATEGORIES } from "../page";

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ category: string }>;
}

export default async function EducationWritePage({ params }: PageProps) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/login');
  }

  const canWrite = user.isAdmin || user.status === 'approved';
  if (!canWrite) {
    redirect('/education');
  }

  const p = await params;
  const currentCategory = CATEGORIES.find(c => c.id === p.category) || CATEGORIES[0];

  const MENU = CATEGORIES.map(c => ({
    label: c.label,
    href: `/education/${c.id}`,
    active: c.id === p.category,
  }));

  return (
    <SubPageLayout
      title="교육위원회"
      breadcrumbs={[
        { label: "교육위원회", href: "/education" },
        { label: currentCategory.label, href: `/education/${p.category}` },
        { label: "글쓰기" },
      ]}
      sideMenu={MENU}
    >
      <CommitteeForm
        committeeType="education"
        boardType={p.category}
        basePath="/education"
      />
    </SubPageLayout>
  );
}

import SubPageLayout from "@/components/SubPageLayout";
import DistrictsView from "./DistrictsView";

const ORG_MENU = [
  { label: "임원진", href: "/organization/officers" },
  { label: "위원회", href: "/organization/committees" },
  { label: "시찰회", href: "/organization/districts", active: true },
  { label: "조직도", href: "/about/organization" },
];

export const metadata = { title: "시찰회" };

export default function DistrictsPage() {
  return (
    <SubPageLayout
      title="시찰회"
      breadcrumbs={[
        { label: "조직", href: "/organization" },
        { label: "시찰회" },
      ]}
      sideMenu={ORG_MENU}
    >
      <DistrictsView />
    </SubPageLayout>
  );
}

import SubPageLayout from "@/components/SubPageLayout";
import DistrictsView from "./DistrictsView";
import { ORGANIZATION_MENUS } from "@/constants/organization";

export const metadata = { title: "시찰회" };

export default function DistrictsPage() {
  const currentPath = "/organization/districts";
  const sideMenu = ORGANIZATION_MENUS.map(menu => ({
    ...menu,
    active: menu.href === currentPath
  }));

  return (
    <SubPageLayout
      title="시찰회"
      breadcrumbs={[
        { label: "조직", href: "/organization/executives" },
        { label: "시찰회" },
      ]}
      sideMenu={sideMenu}
    >
      <DistrictsView />
    </SubPageLayout>
  );
}

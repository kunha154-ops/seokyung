import { getHeroSlides } from '@/actions/hero';
import HeroAdminList from '@/components/admin/HeroAdminList';

export const dynamic = 'force-dynamic';

export default async function HeroAdminPage() {
  const slides = await getHeroSlides(true);

  return <HeroAdminList initialSlides={slides} />;
}

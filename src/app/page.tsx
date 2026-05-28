import HeroSlider from "@/components/home/HeroSlider";
import QuickAccess from "@/components/home/QuickAccess";
import StatsSection from "@/components/home/StatsSection";
import NewsSection from "@/components/home/NewsSection";
import GalleryPreview from "@/components/home/GalleryPreview";
import VisionBanner from "@/components/home/VisionBanner";
import { getHeroSlides } from "@/actions/hero";

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const slides = await getHeroSlides(false); // is_active = 1

  return (
    <>
      <HeroSlider initialSlides={slides} />
      <QuickAccess />
      <StatsSection />
      <NewsSection />
      <GalleryPreview />
      <VisionBanner />
    </>
  );
}

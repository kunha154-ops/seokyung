import HeroSlider from "@/components/home/HeroSlider";
import QuickAccess from "@/components/home/QuickAccess";
import StatsSection from "@/components/home/StatsSection";
import NewsSection from "@/components/home/NewsSection";
import GalleryPreview from "@/components/home/GalleryPreview";
import VisionBanner from "@/components/home/VisionBanner";

export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <QuickAccess />
      <StatsSection />
      <NewsSection />
      <GalleryPreview />
      <VisionBanner />
    </>
  );
}

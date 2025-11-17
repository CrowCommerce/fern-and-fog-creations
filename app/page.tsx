import { Metadata } from 'next';
import { getPageMetadata, getHomepageHero } from '@/lib/shopify';

// Homepage components
import HeroSection from '@/components/HeroSection';
import CategorySection from '@/components/CategorySection';
import FeaturedSectionOne from '@/components/FeaturedSectionOne';
import CollectionSection from '@/components/CollectionSection';
import FeaturedSectionTwo from '@/components/FeaturedSectionTwo';

export async function generateMetadata(): Promise<Metadata> {
  const metadata = await getPageMetadata('homepage');

  return {
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords,
    robots: {
      index: metadata.robotsIndex,
      follow: metadata.robotsFollow,
    },
    openGraph: metadata.ogImageUrl
      ? {
          images: [{ url: metadata.ogImageUrl }],
        }
      : undefined,
  };
}

export default async function Home() {
  // Fetch homepage hero content from Shopify
  const hero = await getHomepageHero();

  return (
    <div className="bg-parchment">
      <HeroSection hero={hero} />
      <CategorySection />
      <FeaturedSectionOne />
      <FeaturedSectionTwo />
      <CollectionSection />
    </div>
  );
}

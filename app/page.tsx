import { Metadata } from 'next';
import { headers } from 'next/headers';
import { resolveBuilderContent } from '@/lib/builder/resolve-content';
import { BuilderComponentClient } from '@/components/builder/BuilderComponentClient';
import { getPageMetadata } from '@/lib/shopify';

// Fallback components (used if no Builder.io content exists)
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
  // Access headers to mark as dynamic - required for Builder.io SDK compatibility
  // This prevents Math.random() errors during prerendering
  await headers();

  // Try to fetch Builder.io content for the homepage
  const builderContent = await resolveBuilderContent('page', {
    userAttributes: { urlPath: '/' },
  });

  // If Builder.io content exists, render it
  if (builderContent) {
    return (
      <div className="bg-parchment">
        <BuilderComponentClient
          model="page"
          content={builderContent}
        />
      </div>
    );
  }

  // Fallback: Use hardcoded components
  // This ensures the site works even without Builder.io content configured
  return (
    <div className="bg-parchment">
      <HeroSection />
      <CategorySection />
      <FeaturedSectionOne />
      <FeaturedSectionTwo />
      <CollectionSection />
    </div>
  );
}

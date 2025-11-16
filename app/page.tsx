import { Metadata } from 'next';
import { resolveBuilderContent } from '@/lib/builder/resolve-content';
import { BuilderComponentClient } from '@/components/builder/BuilderComponentClient';

// Fallback components (used if no Builder.io content exists)
import HeroSection from '@/components/HeroSection';
import CategorySection from '@/components/CategorySection';
import FeaturedSectionOne from '@/components/FeaturedSectionOne';
import CollectionSection from '@/components/CollectionSection';
import FeaturedSectionTwo from '@/components/FeaturedSectionTwo';

export const metadata: Metadata = {
  title: 'Fern & Fog Creations | Handmade Coastal Crafts',
  description: 'Sea glass earrings, pressed flower resin, driftwood décor—crafted in small batches on the coast.',
};

/**
 * Render the homepage using Builder.io content when available, otherwise render the static fallback sections.
 *
 * @returns A JSX element for the homepage: Builder.io-rendered page content if available, or the hardcoded HeroSection, CategorySection, FeaturedSectionOne, FeaturedSectionTwo, and CollectionSection fallback layout.
 */
export default async function Home() {
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
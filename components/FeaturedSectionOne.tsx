import { cacheLife, cacheTag } from 'next/cache';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { TAGS } from '@/lib/constants';
import { getHomepageFeatures } from '@/lib/shopify';
import { isShopifyEnabled, isShopifyConfigured } from '@/lib/data-source';
import type { HomepageFeature } from '@/types/homepage';

/**
 * Feature icon component based on iconType
 */
function FeatureIcon({ iconType }: { iconType: string }) {
  return (
    <svg
      className="h-8 w-8 text-fern"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      {iconType === 'gathered' && (
        <>
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
        </>
      )}
      {iconType === 'crafted' && (
        <>
          <path d="M12 21c-1.74 0-3.33-.6-4.5-1.5L12 4.5l4.5 15c-1.17.9-2.76 1.5-4.5 1.5Z" />
          <path d="M7.5 19.5c-1.5-1.26-2.5-3.1-2.5-5.19V3" />
          <path d="M19 3v11.31c0 2.09-1 3.93-2.5 5.19" />
          <path d="M5 3h14" />
        </>
      )}
      {iconType === 'treasured' && (
        <>
          <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
          <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
          <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
        </>
      )}
    </svg>
  );
}

/**
 * Fetch features with caching
 */
async function getFeatures(): Promise<HomepageFeature[]> {
  'use cache';
  cacheTag(TAGS.homepageFeatures);
  cacheLife('days');

  if (isShopifyEnabled() && isShopifyConfigured()) {
    try {
      return await getHomepageFeatures();
    } catch (error) {
      console.error('Failed to fetch features from Shopify:', error);
    }
  }

  return [];
}

export default async function FeaturedSectionOne() {
  const features = await getFeatures();

  if (features.length === 0) {
    return (
      <section aria-labelledby="why-handmade-heading" className="bg-mist py-24 sm:py-32">
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="bg-parchment/50 p-6 rounded-full mb-6">
            <SparklesIcon className="w-12 h-12 text-fern/60" />
          </div>
          <h2 id="why-handmade-heading" className="text-2xl font-display text-bark mb-3">
            Features Coming Soon
          </h2>
          <p className="text-bark/60 max-w-md mx-auto">
            The store owner needs to set up the &quot;Why Handmade Matters&quot; content in Shopify Admin &rarr; Content &rarr; Homepage Feature.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="why-handmade-heading"
      className="bg-mist py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2
            id="why-handmade-heading"
            className="text-4xl font-display font-bold tracking-tight text-bark"
          >
            Why Handmade Matters
          </h2>
          <p className="mt-4 text-lg text-bark/70 max-w-2xl mx-auto">
            Every piece tells a story of the land, the maker, and the moment of
            creation
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 sm:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="flex flex-col items-center text-center"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-fern/10 ring-2 ring-fern/20">
                <FeatureIcon iconType={feature.iconType} />
              </div>
              <h3 className="mt-6 text-xl font-display font-semibold text-bark">
                {feature.name}
              </h3>
              <p className="mt-3 text-base text-bark/70 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Decorative Divider */}
        <div className="mt-20 flex items-center justify-center space-x-4 text-fern/30">
          <div className="h-px w-24 bg-fern/30"></div>
          <span className="text-2xl">&#10070;</span>
          <div className="h-px w-24 bg-fern/30"></div>
        </div>
      </div>
    </section>
  );
}

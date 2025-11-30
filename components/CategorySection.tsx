import Link from 'next/link';
import { cacheLife, cacheTag } from 'next/cache';
import { Squares2X2Icon } from '@heroicons/react/24/outline';
import { TAGS } from '@/lib/constants';
import { getHomepageCategories } from '@/lib/shopify';
import { isShopifyEnabled, isShopifyConfigured } from '@/lib/data-source';
import SpotlightCard from '@/components/SpotlightCard';
import type { HomepageCategory } from '@/types/homepage';

/**
 * Fetch categories with caching
 */
async function getCategories(): Promise<HomepageCategory[]> {
  'use cache';
  cacheTag(TAGS.homepageCategories);
  cacheLife('days');

  if (isShopifyEnabled() && isShopifyConfigured()) {
    try {
      return await getHomepageCategories();
    } catch (error) {
      console.error('Failed to fetch categories from Shopify:', error);
    }
  }

  return [];
}

export default async function CategorySection() {
  const categories = await getCategories();

  if (categories.length === 0) {
    return (
      <section aria-labelledby="category-heading" className="py-24 sm:py-32 bg-parchment">
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="bg-mist/50 p-6 rounded-full mb-6">
            <Squares2X2Icon className="w-12 h-12 text-fern/60" />
          </div>
          <h2 id="category-heading" className="text-2xl font-display text-bark mb-3">
            Categories Coming Soon
          </h2>
          <p className="text-bark/60 max-w-md mx-auto">
            The store owner needs to set up product categories in Shopify Admin &rarr; Content &rarr; Homepage Category.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby="category-heading" className="py-24 sm:py-32 bg-parchment">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 id="category-heading" className="text-4xl font-display font-bold tracking-tight text-bark">
            Explore Our Collections
          </h2>
          <p className="mt-4 text-lg text-bark/70">
            Each piece is one-of-a-kind, crafted from natural materials
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <SpotlightCard key={category.id}>
              <Link
                href={`/products/${category.slug}`}
                className="group relative block"
                prefetch={true}
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    alt={category.name}
                    src={category.imageUrl}
                    className="size-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-moss/90 via-moss/40 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <h3 className="text-2xl font-display font-bold text-parchment mb-2">
                    {category.name}
                  </h3>
                  <p className="text-sm text-mist leading-relaxed">
                    {category.description}
                  </p>
                  <div className="mt-4 flex items-center text-gold text-sm font-medium">
                    Explore
                    <svg className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </SpotlightCard>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/categories"
            className="inline-flex items-center text-fern hover:text-moss font-medium transition-colors"
            prefetch={true}
          >
            View all categories
            <span aria-hidden="true" className="ml-2">&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

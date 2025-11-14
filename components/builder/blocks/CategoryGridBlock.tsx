'use client';

/**
 * CategoryGridBlock - Builder.io wrapper for CategorySection
 *
 * Configurable category grid with coastal theming.
 * Displays 4-column grid of category cards (responsive).
 */

import Link from 'next/link';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
}

export interface CategoryGridBlockProps {
  heading?: string;
  subheading?: string;
  categories?: Category[];
  showViewAllLink?: boolean;
  viewAllHref?: string;
}

export default function CategoryGridBlock({
  heading = 'Explore Our Collections',
  subheading = 'Each piece is one-of-a-kind, crafted from natural materials',
  categories = [],
  showViewAllLink = true,
  viewAllHref = '/categories',
}: CategoryGridBlockProps) {
  // If no categories provided, show placeholder message
  if (categories.length === 0) {
    return (
      <section aria-labelledby="category-heading" className="py-24 sm:py-32 bg-parchment">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-bark/60">
              No categories configured. Add categories in Builder.io to display them here.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby="category-heading" className="py-24 sm:py-32 bg-parchment">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 id="category-heading" className="text-4xl font-display font-bold tracking-tight text-bark">
            {heading}
          </h2>
          <p className="mt-4 text-lg text-bark/70">
            {subheading}
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products/${category.slug}`}
              className="group relative overflow-hidden rounded-lg ring-1 ring-bark/20 hover:ring-fern transition-all duration-300"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  alt={category.name}
                  src={category.image}
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
          ))}
        </div>

        {/* View All Link */}
        {showViewAllLink && (
          <div className="mt-12 text-center">
            <Link
              href={viewAllHref}
              className="inline-flex items-center text-fern hover:text-moss font-medium transition-colors"
            >
              View all categories
              <span aria-hidden="true" className="ml-2">&rarr;</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

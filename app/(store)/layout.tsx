'use client';

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FilterPanel } from '@/components/filters/FilterPanel';
import type { ActiveFilters, SortOption } from '@/types/filter';

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Parse initial filters from URL (shared across products and collections)
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>(() => {
    const filters: ActiveFilters = {};

    const categoryParam = searchParams?.get('category');
    if (categoryParam) {
      filters.category = categoryParam.split(',');
    }

    const minPrice = searchParams?.get('minPrice');
    const maxPrice = searchParams?.get('maxPrice');
    if (minPrice && maxPrice) {
      filters.priceRange = {
        min: parseInt(minPrice),
        max: parseInt(maxPrice),
      };
    }

    const materialParam = searchParams?.get('material');
    if (materialParam) {
      filters.material = materialParam.split(',');
    }

    const sortParam = searchParams?.get('sort');
    if (sortParam) {
      filters.sort = sortParam as SortOption;
    }

    return filters;
  });

  // Update URL when filters change (shared function)
  const handleFilterChange = (newFilters: ActiveFilters) => {
    setActiveFilters(newFilters);

    const params = new URLSearchParams();

    if (newFilters.category && newFilters.category.length > 0) {
      params.set('category', newFilters.category.join(','));
    }

    if (newFilters.priceRange) {
      params.set('minPrice', String(newFilters.priceRange.min));
      params.set('maxPrice', String(newFilters.priceRange.max));
    }

    if (newFilters.material && newFilters.material.length > 0) {
      params.set('material', newFilters.material.join(','));
    }

    if (newFilters.sort) {
      params.set('sort', newFilters.sort);
    }

    const queryString = params.toString();
    const currentPath = window.location.pathname;
    router.replace(queryString ? `${currentPath}?${queryString}` : currentPath, {
      scroll: false,
    });
  };

  return (
    <div className="bg-parchment min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold tracking-tight text-bark sm:text-5xl">
            Shop All Handmade Crafts
          </h1>
          <p className="mt-4 text-lg text-bark/70 max-w-2xl mx-auto">
            Discover one-of-a-kind pieces crafted from natural materials gathered from the Pacific Northwest
          </p>
        </div>

        {/* Content */}
        <Suspense fallback={null}>
          {children}
        </Suspense>
      </div>
    </div>
  );
}

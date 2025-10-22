'use client'

import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Product } from '@/data/products'
import { useFilters } from '@/hooks/useFilters'
import { FilterPanel } from '@/components/filters/FilterPanel'
import { MobileFilterDrawer } from '@/components/filters/MobileFilterDrawer'
import type { ActiveFilters, SortOption } from '@/types/filter'

interface ProductsContentProps {
  products: Product[]
  dataMode: 'shopify' | 'local'
}

export default function ProductsContent({ products, dataMode }: ProductsContentProps) {
  const searchParams = useSearchParams()
  const router = useRouter()

  // Parse initial filters from URL
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>(() => {
    const filters: ActiveFilters = {}

    // Category filter
    const categoryParam = searchParams?.get('category')
    if (categoryParam) {
      filters.category = categoryParam.split(',')
    }

    // Price range filter
    const minPrice = searchParams?.get('minPrice')
    const maxPrice = searchParams?.get('maxPrice')
    if (minPrice && maxPrice) {
      filters.priceRange = {
        min: parseInt(minPrice),
        max: parseInt(maxPrice),
      }
    }

    // Material filter
    const materialParam = searchParams?.get('material')
    if (materialParam) {
      filters.material = materialParam.split(',')
    }

    // Sort
    const sortParam = searchParams?.get('sort')
    if (sortParam) {
      filters.sort = sortParam as SortOption
    }

    return filters
  })

  // Apply filters
  const { filteredProducts, facets, resultCount } = useFilters({
    products,
    initialFilters: activeFilters,
  })

  // Update URL when filters change
  const handleFilterChange = (newFilters: ActiveFilters) => {
    setActiveFilters(newFilters)

    const params = new URLSearchParams()

    // Category
    if (newFilters.category && newFilters.category.length > 0) {
      params.set('category', newFilters.category.join(','))
    }

    // Price range
    if (newFilters.priceRange) {
      params.set('minPrice', String(newFilters.priceRange.min))
      params.set('maxPrice', String(newFilters.priceRange.max))
    }

    // Material
    if (newFilters.material && newFilters.material.length > 0) {
      params.set('material', newFilters.material.join(','))
    }

    // Sort
    if (newFilters.sort) {
      params.set('sort', newFilters.sort)
    }

    const queryString = params.toString()
    router.replace(queryString ? `/products?${queryString}` : '/products', {
      scroll: false,
    })
  }

  // Sort options
  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'name-asc', label: 'Name: A-Z' },
    { value: 'newest', label: 'Newest' },
  ]

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
          {/* Data source indicator (only visible in development) */}
          {process.env.NODE_ENV === 'development' && (
            <p className="mt-2 text-xs text-bark/40">
              Data source: {dataMode === 'shopify' ? '🛍️ Shopify' : '💾 Local'}
            </p>
          )}
        </div>

        {/* Layout: Filters + Products */}
        <div className="lg:grid lg:grid-cols-4 lg:gap-x-8">
          {/* Desktop Filters */}
          <aside className="hidden lg:block">
            <FilterPanel
              facets={facets}
              activeFilters={activeFilters}
              onFilterChange={handleFilterChange}
              resultCount={resultCount}
            />
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Mobile Filter + Sort */}
            <div className="flex items-center justify-between mb-6 lg:mb-8">
              <div className="lg:hidden">
                <MobileFilterDrawer
                  facets={facets}
                  activeFilters={activeFilters}
                  onFilterChange={handleFilterChange}
                  resultCount={resultCount}
                />
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 ml-auto">
                <label htmlFor="sort" className="text-sm text-bark/70">
                  Sort:
                </label>
                <select
                  id="sort"
                  value={activeFilters.sort || 'featured'}
                  onChange={(e) =>
                    handleFilterChange({
                      ...activeFilters,
                      sort: e.target.value as SortOption,
                    })
                  }
                  className="px-3 py-2 text-sm border border-mist rounded-md bg-parchment text-bark focus:outline-none focus:ring-2 focus:ring-fern"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group"
            >
              <div className="aspect-square overflow-hidden rounded-lg ring-1 ring-bark/20 group-hover:ring-fern transition-all">
                <img
                  alt={product.name}
                  src={product.images[0]}
                  className="size-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="mt-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-bark group-hover:text-fern transition-colors">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-sm text-bark/60">
                      {product.materials.slice(0, 2).join(' • ')}
                    </p>
                  </div>
                  <p className="ml-4 text-lg font-display font-semibold text-bark">
                    ${product.price.toFixed(2)}
                  </p>
                </div>
                {product.externalUrl && (
                  <p className="mt-2 text-xs text-gold">
                    Available on Etsy
                  </p>
                )}
              </div>
            </Link>
          ))}
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-lg text-bark/60">No products found matching your filters.</p>
                <button
                  onClick={() => handleFilterChange({})}
                  className="mt-4 inline-flex items-center text-fern hover:text-moss font-medium transition-colors"
                >
                  Clear all filters
                  <span aria-hidden="true" className="ml-2">&rarr;</span>
                </button>
              </div>
            )}

            {/* CTA Section */}
            <div className="mt-20 text-center py-16 px-6 bg-mist rounded-lg">
              <h2 className="text-3xl font-display font-bold text-bark">
                Looking for Something Custom?
              </h2>
              <p className="mt-4 text-lg text-bark/70 max-w-2xl mx-auto">
                I love creating custom pieces. Whether it&apos;s a memorial piece, a special gift, or something uniquely yours, let&apos;s bring your vision to life.
              </p>
              <Link
                href="/contact"
                className="mt-8 inline-flex items-center px-6 py-3 rounded-md bg-fern text-parchment font-medium hover:bg-moss transition-colors"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

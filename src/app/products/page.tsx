'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { products, categories, getProductsByCategory } from '@/data/products'

function ProductsContent() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams?.get('category')
  const [filteredProducts, setFilteredProducts] = useState(products.filter(p => p.forSale))

  useEffect(() => {
    if (categoryParam) {
      setFilteredProducts(getProductsByCategory(categoryParam as 'earrings' | 'resin' | 'driftwood' | 'wall-hangings'))
    } else {
      setFilteredProducts(products.filter(p => p.forSale))
    }
  }, [categoryParam])

  const activeCategory = categories.find(c => c.slug === categoryParam)

  return (
    <div className="bg-parchment min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold tracking-tight text-bark sm:text-5xl">
            {activeCategory ? activeCategory.name : 'Shop All Handmade Crafts'}
          </h1>
          <p className="mt-4 text-lg text-bark/70 max-w-2xl mx-auto">
            {activeCategory
              ? activeCategory.description
              : 'Discover one-of-a-kind pieces crafted from natural materials gathered from the Pacific Northwest'}
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <Link
            href="/products"
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
              !categoryParam
                ? 'bg-fern text-parchment ring-2 ring-fern'
                : 'bg-mist text-bark hover:bg-fern/20 ring-1 ring-bark/20'
            }`}
          >
            All Products
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                categoryParam === category.slug
                  ? 'bg-fern text-parchment ring-2 ring-fern'
                  : 'bg-mist text-bark hover:bg-fern/20 ring-1 ring-bark/20'
              }`}
            >
              {category.name}
            </Link>
          ))}
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
            <p className="text-lg text-bark/60">No products found in this category.</p>
            <Link
              href="/products"
              className="mt-4 inline-flex items-center text-fern hover:text-moss font-medium transition-colors"
            >
              View all products
              <span aria-hidden="true" className="ml-2">&rarr;</span>
            </Link>
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
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="bg-parchment min-h-screen" />}>
      <ProductsContent />
    </Suspense>
  )
}

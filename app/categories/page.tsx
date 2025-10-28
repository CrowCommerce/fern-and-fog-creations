import Link from 'next/link'
import { Metadata } from 'next'
import { categories } from '@/data/products'

export const metadata: Metadata = {
  title: 'Shop by Category | Fern & Fog Creations',
  description: 'Explore our handmade coastal and woodland crafts by category.',
}

export default function CategoriesPage() {
  return (
    <div className="bg-parchment min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-display font-bold text-bark sm:text-5xl">
            Shop by Category
          </h1>
          <p className="mt-4 text-lg text-bark/70 max-w-2xl mx-auto">
            Each collection tells a different story of the coast and forest
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products/${category.slug}`}
              className="group relative overflow-hidden rounded-lg ring-1 ring-bark/20 hover:ring-fern transition-all"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  alt={category.name}
                  src={category.image}
                  className="size-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-moss/90 via-moss/40 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <h2 className="text-3xl font-display font-bold text-parchment mb-3">
                  {category.name}
                </h2>
                <p className="text-base text-mist leading-relaxed mb-4">
                  {category.description}
                </p>
                <div className="flex items-center text-gold text-sm font-medium">
                  Explore Collection
                  <svg className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link
            href="/products"
            className="inline-flex items-center px-6 py-3 bg-transparent text-fern font-medium rounded-md ring-2 ring-fern hover:bg-fern/10 transition-colors"
          >
            View All Products
          </Link>
        </div>
      </div>
    </div>
  )
}

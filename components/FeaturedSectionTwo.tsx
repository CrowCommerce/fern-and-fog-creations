import Link from 'next/link'
import { getFeaturedProducts } from '@/data/products'
import SpotlightCard from '@/components/SpotlightCard'

export default function FeaturedSectionTwo() {
  const featuredProducts = getFeaturedProducts()

  return (
    <section aria-labelledby="featured-heading" className="bg-parchment py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 id="featured-heading" className="text-4xl font-display font-bold tracking-tight text-bark">
            Featured Treasures
          </h2>
          <p className="mt-4 text-lg text-bark/70">
            Handpicked pieces available now
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProducts.slice(0, 6).map((product) => (
            <SpotlightCard key={product.id} className="p-6">
              <Link
                href={`/product/${product.slug}`}
                className="group block"
              >
                <div className="aspect-square overflow-hidden rounded-lg">
                  <img
                    alt={product.name}
                    src={product.images[0]}
                    className="size-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="mt-4 flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-bark group-hover:text-fern transition-colors">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-sm text-bark/60">
                      {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                    </p>
                  </div>
                  <p className="text-lg font-display font-semibold text-bark">
                    ${product.price.toFixed(2)}
                  </p>
                </div>
              </Link>
            </SpotlightCard>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/products"
            className="inline-flex items-center px-6 py-3 rounded-md bg-fern text-parchment font-medium hover:bg-moss transition-colors"
          >
            View All Products
            <span aria-hidden="true" className="ml-2">&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  )
}

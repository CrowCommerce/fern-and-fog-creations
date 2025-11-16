'use client';

import Link from 'next/link';

interface ProductGridBlockProps {
  heading?: string;
  subheading?: string;
  products?: {
    id: string;
    name: string;
    slug: string;
    category: string;
    price: number;
    images: string[] | { url: string }[]; // Support both formats: string array and Builder.io object array
  }[];
  ctaLabel?: string;
  ctaHref?: string;
  backgroundColor?: 'parchment' | 'mist' | 'white';
}

// Helper function to get image URL from either format
function getImageUrl(images: string[] | { url: string }[] | undefined): string {
  if (!images || images.length === 0) {
    return '/stock-assets/products/placeholder.jpg';
  }

  const firstImage = images[0];

  // Check if it's a Builder.io object format { url: '...' }
  if (typeof firstImage === 'object' && firstImage !== null && 'url' in firstImage) {
    return firstImage.url || '/stock-assets/products/placeholder.jpg';
  }

  // Otherwise it's a string
  return typeof firstImage === 'string' ? firstImage : '/stock-assets/products/placeholder.jpg';
}

export default function ProductGridBlock({
  heading = 'Featured Treasures',
  subheading = 'Handpicked pieces available now',
  products = [
    {
      id: '1',
      name: 'Sea Glass Earrings',
      slug: 'sea-glass-earrings',
      category: 'Earrings',
      price: 45.00,
      images: ['/stock-assets/products/earrings-1.jpg'],
    },
    {
      id: '2',
      name: 'Pressed Flower Pendant',
      slug: 'pressed-flower-pendant',
      category: 'Resin',
      price: 65.00,
      images: ['/stock-assets/products/resin-1.jpg'],
    },
    {
      id: '3',
      name: 'Driftwood Sculpture',
      slug: 'driftwood-sculpture',
      category: 'Driftwood',
      price: 120.00,
      images: ['/stock-assets/products/driftwood-1.jpg'],
    },
  ],
  ctaLabel = 'View All Products',
  ctaHref = '/products',
  backgroundColor = 'parchment',
}: ProductGridBlockProps) {
  const bgClass = {
    parchment: 'bg-parchment',
    mist: 'bg-mist',
    white: 'bg-white',
  }[backgroundColor];

  return (
    <section className={`${bgClass} py-24 sm:py-32`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {(heading || subheading) && (
          <div className="text-center mb-16">
            {heading && (
              <h2 className="text-4xl font-display font-bold tracking-tight text-bark">
                {heading}
              </h2>
            )}
            {subheading && (
              <p className="mt-4 text-lg text-bark/70">
                {subheading}
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              className="group"
            >
              <div className="aspect-square overflow-hidden rounded-lg ring-1 ring-bark/20 group-hover:ring-fern transition-all">
                <img
                  alt={product.name}
                  src={getImageUrl(product.images)}
                  className="size-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="mt-4 flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-medium text-bark group-hover:text-fern transition-colors">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-sm text-bark/60">
                    {product.category}
                  </p>
                </div>
                <p className="text-lg font-display font-semibold text-bark">
                  ${product.price.toFixed(2)}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {ctaLabel && ctaHref && (
          <div className="mt-12 text-center">
            <Link
              href={ctaHref}
              className="inline-flex items-center px-6 py-3 rounded-md bg-fern text-parchment font-medium hover:bg-moss transition-colors"
            >
              {ctaLabel}
              <span aria-hidden="true" className="ml-2">&rarr;</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

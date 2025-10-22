'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { getProductBySlug, getRelatedProducts } from '@/data/products'
import { useCart } from '@/context/CartContext'
import { VariantSelector } from '@/components/product/VariantSelector'
import type { ProductVariant } from '@/types/product'
import { formatPriceRange } from '@/lib/variant-utils'

export default function ProductDetailPage() {
  const params = useParams()
  const slug = params?.slug as string
  const product = getProductBySlug(slug)
  const { addItem } = useCart()

  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product?.variants?.[0] || null
  )

  if (!product) {
    return (
      <div className="bg-parchment min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-display font-bold text-bark">Product Not Found</h1>
          <p className="mt-2 text-bark/60">The product you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/products" className="mt-4 inline-block text-fern hover:text-moss">
            Return to Shop
          </Link>
        </div>
      </div>
    )
  }

  const relatedProducts = getRelatedProducts(product, 4)

  // Determine display price and availability
  const displayPrice = selectedVariant?.price || product.price
  const isAvailable = selectedVariant?.availableForSale ?? product.forSale

  const handleAddToCart = () => {
    const itemToAdd = {
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: displayPrice,
      image: selectedVariant?.image || product.images[0],
      variantId: selectedVariant?.id,
      variantTitle: selectedVariant?.title,
      selectedOptions: selectedVariant?.selectedOptions,
    }

    addItem(itemToAdd, quantity)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 3000)
  }

  // JSON-LD for SEO
  const jsonLd = product.forSale ? {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.images,
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "url": typeof window !== 'undefined' ? window.location.href : ''
    }
  } : null

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <div className="bg-parchment min-h-screen">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="mb-8 text-sm">
            <ol className="flex items-center space-x-2 text-bark/60">
              <li><Link href="/" className="hover:text-fern">Home</Link></li>
              <li>/</li>
              <li><Link href="/products" className="hover:text-fern">Shop</Link></li>
              <li>/</li>
              <li className="text-bark font-medium">{product.name}</li>
            </ol>
          </nav>

          <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 lg:items-start">
            {/* Image Gallery */}
            <div>
              <div className="aspect-square overflow-hidden rounded-lg ring-2 ring-bark/20 mb-4">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="size-full object-cover"
                />
              </div>
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      onKeyDown={(e) => {
                        if (e.key === 'ArrowRight') setSelectedImage((prev) => (prev + 1) % product.images.length)
                        if (e.key === 'ArrowLeft') setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length)
                      }}
                      className={`aspect-square overflow-hidden rounded-lg ring-1 transition-all ${
                        selectedImage === index ? 'ring-2 ring-fern' : 'ring-bark/20 hover:ring-fern/50'
                      }`}
                      aria-label={`View image ${index + 1}`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} - View ${index + 1}`}
                        className="size-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="mt-10 lg:mt-0">
              <h1 className="text-3xl font-display font-bold text-bark sm:text-4xl">
                {product.name}
              </h1>

              {/* Price */}
              <div className="mt-4">
                <p className="text-3xl font-display font-semibold text-fern">
                  ${displayPrice.toFixed(2)}
                </p>
                {product.priceRange && (
                  <p className="mt-1 text-sm text-bark/60">
                    Price range: {formatPriceRange(product.priceRange)}
                  </p>
                )}
              </div>

              {/* Variant Selector */}
              {product.variants && product.options && (
                <div className="mt-6 pb-6 border-b border-mist">
                  <VariantSelector
                    options={product.options}
                    variants={product.variants}
                    defaultVariant={selectedVariant}
                    onVariantChange={setSelectedVariant}
                  />
                </div>
              )}

              <div className="mt-6">
                <h2 className="text-sm font-medium text-bark">Materials</h2>
                <ul className="mt-2 list-disc list-inside text-sm text-bark/70">
                  {product.materials.map((material, index) => (
                    <li key={index}>{material}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-6">
                <h2 className="text-sm font-medium text-bark">Description</h2>
                <p className="mt-2 text-base text-bark/70 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {product.story && (
                <div className="mt-6 p-4 bg-mist rounded-lg">
                  <h2 className="text-sm font-medium text-bark font-display">The Story</h2>
                  <p className="mt-2 text-sm text-bark/70 italic leading-relaxed">
                    &quot;{product.story}&quot;
                  </p>
                </div>
              )}

              {/* CTAs */}
              <div className="mt-10 space-y-4">
                {isAvailable && !product.externalUrl && (
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3 py-1 bg-mist text-bark rounded-md hover:bg-fern/20"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="px-4 py-1 bg-mist text-bark rounded-md font-medium">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-3 py-1 bg-mist text-bark rounded-md hover:bg-fern/20"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 px-8 py-3 bg-fern text-parchment font-medium rounded-md hover:bg-moss transition-colors"
                    >
                      {addedToCart ? 'Added to Basket!' : 'Add to Basket'}
                    </button>
                  </div>
                )}

                {product.externalUrl && (
                  <a
                    href={product.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full px-8 py-3 bg-gold text-moss font-medium rounded-md hover:bg-gold/90 transition-colors text-center"
                  >
                    Buy on Etsy →
                  </a>
                )}

                {!product.forSale && (
                  <Link
                    href={`/contact?product=${product.slug}`}
                    className="block w-full px-8 py-3 bg-fern text-parchment font-medium rounded-md hover:bg-moss transition-colors text-center"
                  >
                    Request This Piece
                  </Link>
                )}

                {addedToCart && (
                  <div className="text-center text-sm text-fern" role="status" aria-live="polite">
                    Item added to your basket
                  </div>
                )}
              </div>

              {/* Info Strip */}
              <div className="mt-10 pt-10 border-t border-bark/20">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-around text-center space-y-4 sm:space-y-0">
                  <div className="flex flex-col items-center">
                    <svg className="h-6 w-6 text-fern mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
                      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
                    </svg>
                    <span className="text-sm font-medium text-bark">Gathered</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <svg className="h-6 w-6 text-fern mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path d="M12 21c-1.74 0-3.33-.6-4.5-1.5L12 4.5l4.5 15c-1.17.9-2.76 1.5-4.5 1.5Z"/>
                      <path d="M7.5 19.5c-1.5-1.26-2.5-3.1-2.5-5.19V3"/>
                      <path d="M19 3v11.31c0 2.09-1 3.93-2.5 5.19"/>
                      <path d="M5 3h14"/>
                    </svg>
                    <span className="text-sm font-medium text-bark">Crafted</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <svg className="h-6 w-6 text-fern mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
                      <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
                      <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
                    </svg>
                    <span className="text-sm font-medium text-bark">Treasured</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="mt-24">
              <h2 className="text-2xl font-display font-bold text-bark mb-8">
                You May Also Like
              </h2>
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {relatedProducts.map((related) => (
                  <Link
                    key={related.id}
                    href={`/products/${related.slug}`}
                    className="group"
                  >
                    <div className="aspect-square overflow-hidden rounded-lg ring-1 ring-bark/20 group-hover:ring-fern transition-all">
                      <img
                        src={related.images[0]}
                        alt={related.name}
                        className="size-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="mt-4">
                      <h3 className="text-base font-medium text-bark group-hover:text-fern transition-colors">
                        {related.name}
                      </h3>
                      <p className="mt-1 text-lg font-display font-semibold text-bark">
                        ${related.price.toFixed(2)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  )
}


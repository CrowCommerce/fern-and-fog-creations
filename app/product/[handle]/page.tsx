import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import type { Metadata } from 'next'
import { getProduct, getProducts } from '@/lib/data-source'
import ProductDetailContent from './ProductDetailContent'
import type { Product } from '@/data/products'
import { HIDDEN_PRODUCT_TAG } from '@/lib/constants'
import type { Product as ShopifyProduct } from '@/lib/shopify/types'

interface ProductPageProps {
  params: Promise<{
    handle: string
  }>
}

// Generate static params for all products
export async function generateStaticParams() {
  const products = await getProducts()
  return products.map((product) => ({
    handle: product.slug,
  }))
}

// Type guard to check if product is from Shopify
function isShopifyProduct(product: any): product is ShopifyProduct {
  return 'seo' in product && 'featuredImage' in product && 'tags' in product;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { handle } = await params
  const product = await getProduct(handle)

  if (!product) {
    return {
      title: 'Product Not Found | Fern & Fog Creations',
    }
  }

  // Check if product should be hidden from search engines
  const isHidden = isShopifyProduct(product) && product.tags.includes(HIDDEN_PRODUCT_TAG);

  // Use Shopify SEO fields if available, otherwise fall back to local data
  const title = isShopifyProduct(product) && product.seo?.title
    ? product.seo.title
    : isShopifyProduct(product) ? product.title : product.name;

  const description = isShopifyProduct(product) && product.seo?.description
    ? product.seo.description
    : product.description;

  // Use featuredImage for OpenGraph if available
  const ogImage = isShopifyProduct(product) && product.featuredImage
    ? product.featuredImage.url
    : product.images[0];

  return {
    title: `${title} | Fern & Fog Creations`,
    description,
    robots: {
      index: !isHidden,
      follow: !isHidden,
    },
    openGraph: {
      title,
      description,
      images: ogImage ? [{ url: ogImage }] : undefined,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  }
}

// Get related products by filtering by category
function filterRelatedProducts(
  allProducts: Product[],
  currentProduct: Product,
  limit: number = 4
): Product[] {
  return allProducts
    .filter(p => p.id !== currentProduct.id && p.category === currentProduct.category && p.forSale)
    .slice(0, limit);
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { handle } = await params

  // Fetch product and all products in parallel for better performance
  const [product, allProducts] = await Promise.all([
    getProduct(handle),
    getProducts(),
  ]);

  if (!product) {
    notFound()
  }

  // Filter related products from the already-fetched list
  const relatedProducts = filterRelatedProducts(allProducts, product, 4)

  // Generate JSON-LD structured data for SEO
  const productName = isShopifyProduct(product) && product.seo?.title
    ? product.seo.title
    : isShopifyProduct(product) ? product.title : product.name;

  const productDescription = isShopifyProduct(product) && product.seo?.description
    ? product.seo.description
    : product.description;

  const productImage = isShopifyProduct(product) && product.featuredImage
    ? product.featuredImage.url
    : product.images[0];

  const productPrice = isShopifyProduct(product)
    ? product.priceRange?.minVariantPrice?.amount
    : product.price;

  const productCurrency = isShopifyProduct(product)
    ? product.priceRange?.minVariantPrice?.currencyCode || 'USD'
    : 'USD';

  const productAvailability = isShopifyProduct(product)
    ? product.availableForSale
      ? 'https://schema.org/InStock'
      : 'https://schema.org/OutOfStock'
    : product.forSale
      ? 'https://schema.org/InStock'
      : 'https://schema.org/OutOfStock';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: productName,
    description: productDescription,
    image: productImage,
    offers: {
      '@type': 'Offer',
      price: productPrice,
      priceCurrency: productCurrency,
      availability: productAvailability,
      url: `https://fernfogcreations.com/product/${handle}`,
    },
    brand: {
      '@type': 'Brand',
      name: 'Fern & Fog Creations',
    },
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Suspense fallback={
        <div className="bg-parchment min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-display font-semibold text-bark">Loading product...</h2>
          </div>
        </div>
      }>
        <ProductDetailContent product={product} relatedProducts={relatedProducts} />
      </Suspense>
    </>
  )
}

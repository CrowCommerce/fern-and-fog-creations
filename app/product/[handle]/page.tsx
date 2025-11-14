import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getProduct, getProducts } from '@/lib/data-source'
import ProductDetailContent from './ProductDetailContent'
import type { Product } from '@/data/products'

interface ProductPageProps {
  params: Promise<{
    handle: string
  }>
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

  return {
    title: `${product.name} | Fern & Fog Creations`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images.map(img => ({ url: img })),
    },
  }
}

// Get related products by filtering by category
async function getRelatedProducts(product: Product, limit: number = 4): Promise<Product[]> {
  const allProducts = await getProducts()

  return allProducts
    .filter(p => p.id !== product.id && p.category === product.category && p.forSale)
    .slice(0, limit)
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { handle } = await params
  const product = await getProduct(handle)

  if (!product) {
    notFound()
  }

  // Fetch related products
  const relatedProducts = await getRelatedProducts(product, 4)

  return <ProductDetailContent product={product} relatedProducts={relatedProducts} />
}

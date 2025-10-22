import { Suspense } from 'react'
import { getProducts, getDataSourceMode } from '@/lib/data-source'
import ProductsContent from './ProductsContent'

async function ProductsData() {
  // Fetch products using dual-mode data source
  const allProducts = await getProducts()
  const availableProducts = allProducts.filter(p => p.forSale)
  const dataMode = getDataSourceMode()

  return (
    <ProductsContent
      products={availableProducts}
      dataMode={dataMode}
    />
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="bg-parchment min-h-screen">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-display font-bold tracking-tight text-bark sm:text-5xl">
              Shop All Handmade Crafts
            </h1>
            <p className="mt-4 text-lg text-bark/70">
              Loading products...
            </p>
          </div>
        </div>
      </div>
    }>
      <ProductsData />
    </Suspense>
  )
}

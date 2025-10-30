import { Suspense } from 'react';
import { getProducts, getDataSourceMode } from '@/lib/data-source';
import ProductsClient from './ProductsClient';

async function ProductsData() {
  // Fetch products using dual-mode data source
  const allProducts = await getProducts();
  const availableProducts = allProducts.filter((p) => p.forSale);
  const dataMode = getDataSourceMode();

  // Wrap ProductsClient in Suspense because it uses useSearchParams
  return (
    <Suspense fallback={
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-bark/10 rounded w-1/4"></div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="aspect-square bg-bark/10 rounded-lg"></div>
              <div className="h-4 bg-bark/10 rounded w-3/4"></div>
              <div className="h-4 bg-bark/10 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    }>
      <ProductsClient products={availableProducts} dataMode={dataMode} />
    </Suspense>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center py-12">
          <p className="text-bark/70">Loading products...</p>
        </div>
      }
    >
      <ProductsData />
    </Suspense>
  );
}

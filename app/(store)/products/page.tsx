import { Suspense } from 'react';
import { getProducts, getDataSourceMode } from '@/lib/data-source';
import ProductsClient from './ProductsClient';

async function ProductsData() {
  // Fetch products using dual-mode data source
  const allProducts = await getProducts();
  const availableProducts = allProducts.filter((p) => p.forSale);
  const dataMode = getDataSourceMode();

  return <ProductsClient products={availableProducts} dataMode={dataMode} />;
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

import { Suspense } from 'react';
import { getProducts, getDataSourceMode, isShopifyEnabled } from '@/lib/data-source';
import { getCollections } from '@/lib/shopify';
import ProductsClient from './ProductsClient';
import type { Collection } from '@/lib/shopify/types';

async function ProductsData() {
  // Fetch products using dual-mode data source
  const allProducts = await getProducts();
  const availableProducts = allProducts.filter((p) => p.forSale);
  const dataMode = getDataSourceMode();

  // Fetch collections from Shopify for category filter
  let collections: Collection[] = [];
  if (isShopifyEnabled()) {
    collections = await getCollections();
  }

  return (
    <ProductsClient
      products={availableProducts}
      collections={collections}
      dataMode={dataMode}
    />
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

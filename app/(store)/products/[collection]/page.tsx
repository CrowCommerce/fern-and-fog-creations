import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getProducts, getDataSourceMode } from '@/lib/data-source';
import ProductsClient from '../ProductsClient';

// Valid collection slugs (map to category values)
const VALID_COLLECTIONS = [
  'earrings',
  'resin',
  'driftwood',
  'wall-hangings',
  'pressed-flowers',
  'all',
];

interface CollectionPageProps {
  params: Promise<{
    collection: string;
  }>;
}

async function CollectionData({ collection }: { collection: string }) {
  // Validate collection
  if (!VALID_COLLECTIONS.includes(collection)) {
    notFound();
  }

  // Fetch all products
  const allProducts = await getProducts();
  const availableProducts = allProducts.filter((p) => p.forSale);

  // Filter by collection (category)
  const collectionProducts =
    collection === 'all'
      ? availableProducts
      : availableProducts.filter(
          (p) => p.category.toLowerCase() === collection.toLowerCase() ||
                 p.category.toLowerCase().replace(/\s+/g, '-') === collection
        );

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
      <ProductsClient products={collectionProducts} dataMode={dataMode} />
    </Suspense>
  );
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { collection } = await params;

  return (
    <Suspense
      fallback={
        <div className="text-center py-12">
          <p className="text-bark/70">Loading {collection} products...</p>
        </div>
      }
    >
      <CollectionData collection={collection} />
    </Suspense>
  );
}

// Generate static params for known collections
export async function generateStaticParams() {
  return VALID_COLLECTIONS.map((collection) => ({
    collection,
  }));
}

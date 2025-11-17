import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProducts, getDataSourceMode, isShopifyEnabled } from '@/lib/data-source';
import { getCollection } from '@/lib/shopify';
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

// Helper function to get friendly collection names
function getCollectionDisplayName(handle: string): string {
  const names: Record<string, string> = {
    'earrings': 'Earrings',
    'resin': 'Resin Art',
    'driftwood': 'Driftwood Decor',
    'wall-hangings': 'Wall Hangings',
    'pressed-flowers': 'Pressed Flowers',
    'all': 'All Products',
  };
  return names[handle] || handle.charAt(0).toUpperCase() + handle.slice(1);
}

// Generate metadata for SEO
export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { collection } = await params;

  // Validate collection
  if (!VALID_COLLECTIONS.includes(collection)) {
    return {
      title: 'Collection Not Found | Fern & Fog Creations',
    };
  }

  // If using Shopify, fetch collection data for SEO
  if (isShopifyEnabled()) {
    try {
      const collectionData = await getCollection(collection);

      if (collectionData) {
        return {
          title: collectionData.seo?.title || collectionData.title || getCollectionDisplayName(collection),
          description: collectionData.seo?.description || collectionData.description || `Browse our ${getCollectionDisplayName(collection)} collection`,
          robots: {
            index: true,
            follow: true,
          },
          openGraph: {
            title: collectionData.seo?.title || collectionData.title,
            description: collectionData.seo?.description || collectionData.description,
            type: 'website',
          },
        };
      }
    } catch (error) {
      console.error(`Failed to fetch collection metadata for ${collection}:`, error);
    }
  }

  // Fallback metadata for local mode or when collection not found
  const displayName = getCollectionDisplayName(collection);
  return {
    title: `${displayName} | Fern & Fog Creations`,
    description: `Browse our handmade ${displayName.toLowerCase()} collection. Each piece is crafted with care using materials gathered from the Pacific Northwest shores.`,
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: displayName,
      description: `Browse our handmade ${displayName.toLowerCase()} collection`,
      type: 'website',
    },
  };
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

  return <ProductsClient products={collectionProducts} dataMode={dataMode} />;
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

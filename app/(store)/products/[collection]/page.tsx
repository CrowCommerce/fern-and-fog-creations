import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getDataSourceMode, isShopifyEnabled, convertShopifyToLocal, getProducts } from '@/lib/data-source';
import { getCollection, getCollections, getCollectionProducts } from '@/lib/shopify';
import ProductsClient from '../ProductsClient';
import type { Collection } from '@/lib/shopify/types';
import type { Product as LocalProduct } from '@/data/products';

interface CollectionPageProps {
  params: Promise<{
    collection: string;
  }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Generate metadata for SEO using Shopify collection data
export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { collection } = await params;
  const dataMode = getDataSourceMode();

  // If using Shopify, fetch collection data for SEO
  if (dataMode === 'shopify') {
    try {
      const collectionData = await getCollection(collection);

      if (collectionData) {
        return {
          title: `${collectionData.seo?.title || collectionData.title} | Fern & Fog Creations`,
          description: collectionData.seo?.description || collectionData.description || `Browse our ${collectionData.title} collection`,
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

  // Fallback metadata when Shopify is disabled or collection not found
  return {
    title: `Collection | Fern & Fog Creations`,
    description: `Browse our handmade collection. Each piece is crafted with care using materials gathered from the Pacific Northwest shores.`,
  };
}

async function CollectionData({ collection }: { collection: string }) {
  const dataMode = getDataSourceMode();
  let collectionProducts: LocalProduct[] = [];

  if (dataMode === 'shopify') {
    // Fetch products from specific Shopify collection
    const fetchedProducts = await getCollectionProducts({ collection });

    // If no products found, collection might not exist
    if (!fetchedProducts || fetchedProducts.length === 0) {
      // Verify collection exists
      const collectionData = await getCollection(collection);
      if (!collectionData) {
        notFound();
      }
      // Collection exists but has no products
      collectionProducts = [];
    } else {
      // Convert Shopify products to local format
      collectionProducts = fetchedProducts.map(convertShopifyToLocal);
    }
  } else {
    // Local mode: fallback to filtering by category
    const allProducts = await getProducts();
    const availableProducts = allProducts.filter((p) => p.forSale);

    // Filter by category (local data uses 'category' field)
    collectionProducts = availableProducts.filter(
      (p) => p.category.toLowerCase() === collection.toLowerCase() ||
             p.category.toLowerCase().replace(/\s+/g, '-') === collection
    );
  }

  // Fetch collections from Shopify for category filter
  let collections: Collection[] = [];
  if (dataMode === 'shopify') {
    collections = await getCollections();
  }

  return (
    <ProductsClient
      products={collectionProducts}
      collections={collections}
      dataMode={dataMode}
    />
  );
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { collection } = await params;

  return (
    <Suspense
      fallback={
        <div className="text-center py-12">
          <p className="text-bark/70">Loading products...</p>
        </div>
      }
    >
      <CollectionData collection={collection} />
    </Suspense>
  );
}

/**
 * Generate static params for all Shopify collections at build time
 * This enables static generation for all collection pages
 */
export async function generateStaticParams() {
  const dataMode = getDataSourceMode();
  if (dataMode === 'shopify') {
    const collections = await getCollections();
    return collections
      .filter((collection) => collection.handle) // Exclude "All" collection (empty handle)
      .map((collection) => ({
        collection: collection.handle,
      }));
  }

  // Fallback for local mode: use common categories
  return [
    { collection: 'earrings' },
    { collection: 'resin' },
    { collection: 'driftwood' },
    { collection: 'wall-hangings' },
  ];
}

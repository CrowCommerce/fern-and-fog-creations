/**
 * Dual-Mode Data Source Switcher
 *
 * Provides a unified interface for fetching product data from either:
 * - Local data (src/data/products.ts) - for development/demo
 * - Shopify API (src/lib/shopify) - for production
 *
 * Toggle via NEXT_PUBLIC_USE_SHOPIFY environment variable.
 */

import { products as localProducts, Product as LocalProduct } from '@/data/products';
import * as shopify from '@/lib/shopify';
import type { Product as ShopifyProduct } from '@/lib/shopify/types';

/**
 * Check if Shopify mode is enabled via environment variable
 */
export const isShopifyEnabled = (): boolean => {
  return process.env.NEXT_PUBLIC_USE_SHOPIFY === 'true';
};

/**
 * Check if Shopify is properly configured
 */
export const isShopifyConfigured = (): boolean => {
  return !!(
    process.env.SHOPIFY_STORE_DOMAIN &&
    process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN
  );
};

/**
 * Get products - uses Shopify or local data based on configuration
 */
export async function getProducts(options?: {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<LocalProduct[]> {
  if (isShopifyEnabled() && isShopifyConfigured()) {
    try {
      // Fetch from Shopify
      const shopifyProducts = await shopify.getProducts({
        query: options?.query,
        reverse: options?.reverse,
        sortKey: options?.sortKey
      });

      // Convert Shopify products to local format
      return shopifyProducts.map(convertShopifyToLocal);
    } catch (error) {
      console.error('Failed to fetch from Shopify, falling back to local data:', error);
      return getLocalProducts(options);
    }
  }

  // Use local data
  return getLocalProducts(options);
}

/**
 * Get single product by handle/slug - uses Shopify or local data
 */
export async function getProduct(slug: string): Promise<LocalProduct | undefined> {
  if (isShopifyEnabled() && isShopifyConfigured()) {
    try {
      // Fetch from Shopify
      const shopifyProduct = await shopify.getProduct(slug);

      if (!shopifyProduct) {
        return undefined;
      }

      // Convert Shopify product to local format
      return convertShopifyToLocal(shopifyProduct);
    } catch (error) {
      console.error(`Failed to fetch product "${slug}" from Shopify, falling back to local data:`, error);
      return localProducts.find(p => p.slug === slug);
    }
  }

  // Use local data
  return localProducts.find(p => p.slug === slug);
}

/**
 * Get local products with optional filtering
 */
function getLocalProducts(options?: {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
}): LocalProduct[] {
  let filtered = [...localProducts];

  // Apply query filter (simple text search)
  if (options?.query) {
    const query = options.query.toLowerCase();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.materials.some(m => m.toLowerCase().includes(query))
    );
  }

  // Apply sorting
  if (options?.sortKey) {
    switch (options.sortKey) {
      case 'TITLE':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'PRICE':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'CREATED_AT':
      case 'CREATED':
        filtered.sort((a, b) => parseInt(a.id) - parseInt(b.id));
        break;
    }
  }

  // Apply reverse
  if (options?.reverse) {
    filtered.reverse();
  }

  return filtered;
}

/**
 * Convert Shopify product format to local product format
 */
function convertShopifyToLocal(shopifyProduct: ShopifyProduct): LocalProduct {
  // Extract price from Shopify's price range
  const price = parseFloat(shopifyProduct.priceRange.minVariantPrice.amount);

  // Map Shopify category/collection to local category
  // Default to 'earrings' if no mapping found
  const category = mapShopifyCategory(shopifyProduct) || 'earrings';

  // Extract images
  const images = shopifyProduct.images.map(img => img.url);

  // Extract materials from tags (convention: tags like "material:Silver" or "material:Sea glass")
  const materials = extractMaterialsFromTags(shopifyProduct.tags);

  // Convert Shopify variants to local variant format
  const variants = shopifyProduct.variants?.map(v => ({
    id: v.id,
    title: v.title,
    price: parseFloat(v.price.amount),
    availableForSale: v.availableForSale,
    selectedOptions: v.selectedOptions,
    sku: undefined as string | undefined, // Would need to be added to Shopify fragment
    quantityAvailable: undefined as number | undefined,
    image: undefined as string | undefined
  }));

  // Extract options from Shopify
  const options = shopifyProduct.options?.map(opt => ({
    id: opt.id,
    name: opt.name,
    values: opt.values
  }));

  // Calculate price range if variants exist
  let priceRange: { min: number; max: number } | undefined;
  if (variants && variants.length > 0) {
    const prices = variants.map(v => v.price);
    priceRange = {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  }

  return {
    id: shopifyProduct.id,
    slug: shopifyProduct.handle,
    name: shopifyProduct.title,
    price,
    category,
    images,
    materials: materials.length > 0 ? materials : ['Handcrafted'],
    description: shopifyProduct.description,
    forSale: shopifyProduct.availableForSale,
    featured: shopifyProduct.tags.includes('featured'),
    variants,
    options,
    priceRange
  };
}

/**
 * Map Shopify tags to local category
 */
function mapShopifyCategory(product: ShopifyProduct): LocalProduct['category'] | undefined {
  const tags = product.tags.map(t => t.toLowerCase());

  if (tags.includes('earrings')) return 'earrings';
  if (tags.includes('resin')) return 'resin';
  if (tags.includes('driftwood')) return 'driftwood';
  if (tags.includes('wall-hangings')) return 'wall-hangings';

  return undefined;
}

/**
 * Extract materials from Shopify tags
 * Convention: tags like "material:Silver" or just "Silver"
 */
function extractMaterialsFromTags(tags: string[]): string[] {
  const materials: string[] = [];

  for (const tag of tags) {
    // Check for "material:" prefix
    if (tag.toLowerCase().startsWith('material:')) {
      materials.push(tag.substring(9)); // Remove "material:" prefix
    } else {
      // Common material keywords
      const materialKeywords = [
        'silver', 'gold', 'sea glass', 'resin', 'driftwood',
        'copper', 'brass', 'sterling silver', 'rose gold'
      ];

      const lowerTag = tag.toLowerCase();
      if (materialKeywords.some(keyword => lowerTag.includes(keyword))) {
        materials.push(tag);
      }
    }
  }

  return materials;
}

/**
 * Get current data source mode
 */
export function getDataSourceMode(): 'shopify' | 'local' {
  return isShopifyEnabled() && isShopifyConfigured() ? 'shopify' : 'local';
}

/**
 * Get data source status for debugging
 */
export function getDataSourceStatus(): {
  mode: 'shopify' | 'local';
  shopifyEnabled: boolean;
  shopifyConfigured: boolean;
  reason: string;
} {
  const enabled = isShopifyEnabled();
  const configured = isShopifyConfigured();

  let reason = '';
  if (!enabled) {
    reason = 'NEXT_PUBLIC_USE_SHOPIFY is not set to "true"';
  } else if (!configured) {
    reason = 'Shopify credentials not configured (missing SHOPIFY_STORE_DOMAIN or SHOPIFY_STOREFRONT_ACCESS_TOKEN)';
  } else {
    reason = 'Shopify is enabled and configured';
  }

  return {
    mode: enabled && configured ? 'shopify' : 'local',
    shopifyEnabled: enabled,
    shopifyConfigured: configured,
    reason
  };
}

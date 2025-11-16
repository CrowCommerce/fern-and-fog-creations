/**
 * Builder.io Configuration
 *
 * Central configuration for Builder.io integration including:
 * - API key validation
 * - Model definitions
 * - Reserved path protection
 */

if (!process.env.NEXT_PUBLIC_BUILDER_PUBLIC_KEY) {
  throw new Error(
    'Missing NEXT_PUBLIC_BUILDER_PUBLIC_KEY environment variable. ' +
    'Please add it to your .env.local file. ' +
    'Get your API key from: https://builder.io/account/organization'
  );
}

export const builderConfig = {
  /**
   * Builder.io Public API Key
   * This is safe to expose in client-side code
   */
  apiKey: process.env.NEXT_PUBLIC_BUILDER_PUBLIC_KEY,

  /**
   * Builder.io Model Definitions
   * These correspond to content models created in Builder.io dashboard
   */
  models: {
    page: 'page',
    productPage: 'product-page',
    collectionPage: 'collection-page',
    theme: 'theme',
    announcementBar: 'announcement-bar',
    navigation: 'navigation',
    footer: 'footer',
  },

  /**
   * Reserved Paths
   * These routes are protected and will NOT be handled by Builder.io catch-all
   * Ensures e-commerce functionality remains intact
   */
  reservedPaths: [
    'products',      // Product listing/collections
    'product',       // Product detail pages
    'cart',          // Shopping cart
    'checkout',      // Checkout flow
    'account',       // User account pages
    'api',           // API routes
    '_next',         // Next.js internal routes
  ],

  /**
   * Check if a given path is reserved (shouldn't be handled by Builder.io)
   * @param path - URL path to check (e.g., '/products/earrings' or 'products/earrings')
   * @returns true if path starts with a reserved segment
   */
  isReservedPath(path: string): boolean {
    const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
    const firstSegment = normalizedPath.split('/')[0];
    return (this.reservedPaths as readonly string[]).includes(firstSegment);
  },
} as const;

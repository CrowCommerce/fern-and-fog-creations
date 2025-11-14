/**
 * Builder.io Configuration
 *
 * Central configuration for Builder.io visual CMS integration.
 * This file defines API keys and model names used throughout the app.
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
   * Required for both server-side and client-side rendering
   */
  apiKey: process.env.NEXT_PUBLIC_BUILDER_PUBLIC_KEY,

  /**
   * Model names for different content types
   * These match the models configured in your Builder.io space
   */
  models: {
    page: 'page',                    // Landing pages and marketing content
    productPage: 'product-page',     // Product detail page customization
    collectionPage: 'collection-page', // Collection page customization
    theme: 'theme',                  // Site-wide theme settings
    announcementBar: 'announcement-bar', // Global announcement bar
  },

  /**
   * Reserved paths that should NOT be handled by Builder.io catch-all route
   * These paths are reserved for Shopify e-commerce functionality
   */
  reservedPaths: [
    'products',   // Product listing and collection pages
    'product',    // Individual product detail pages
    'cart',       // Shopping cart
    'checkout',   // Shopify checkout redirect
    'account',    // User account pages
    'api',        // API routes
    '_next',      // Next.js internal routes
  ],

  /**
   * Check if a given path is reserved (should not be caught by Builder.io)
   */
  isReservedPath(path: string): boolean {
    const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
    const firstSegment = normalizedPath.split('/')[0];
    return (this.reservedPaths as readonly string[]).includes(firstSegment);
  },
};

export type BuilderConfig = typeof builderConfig;

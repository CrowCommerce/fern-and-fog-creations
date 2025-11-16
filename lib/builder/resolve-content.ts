/**
 * Builder.io Content Resolution
 *
 * Server-side utility for fetching Builder.io content with proper caching.
 * This should be used in Server Components to pre-fetch content before
 * passing it to the client-side BuilderComponent.
 */

import { builder } from '@builder.io/sdk';
import type { BuilderContent } from '@builder.io/sdk';
import { builderConfig } from './config';

// Initialize Builder.io SDK server-side
builder.init(builderConfig.apiKey);

export interface ResolveContentOptions {
  /**
   * User attributes for targeting/personalization
   * Example: { urlPath: '/about', locale: 'en-US' }
   */
  userAttributes?: Record<string, any>;

  /**
   * Locale for internationalization
   * @default 'en-US'
   */
  locale?: string;

  /**
   * Whether to enrich content with resolved references
   * @default true
   */
  enrich?: boolean;

  /**
   * Whether to bypass cache (useful in development)
   * @default true in development, false in production
   */
  cachebust?: boolean;
}

/**
 * Fetch Builder.io content for a given model
 *
 * @param modelName - Builder.io model name (e.g., 'page', 'product-page')
 * @param options - Additional options for content fetching
 * @returns Builder.io content or null if not found
 *
 * @example
 * ```typescript
 * // Fetch a page by URL path
 * const content = await resolveBuilderContent('page', {
 *   userAttributes: { urlPath: '/about-us' }
 * });
 *
 * // Fetch with locale
 * const content = await resolveBuilderContent('page', {
 *   userAttributes: { urlPath: '/about-us' },
 *   locale: 'fr-FR'
 * });
 * ```
 */
export async function resolveBuilderContent(
  modelName: string,
  options: ResolveContentOptions = {}
): Promise<BuilderContent | null> {
  // Skip Builder.io calls entirely if no API key is configured
  // This prevents both SDK errors and Next.js prerender issues with Math.random()
  if (!builderConfig.apiKey) {
    return null;
  }

  const {
    userAttributes = {},
    locale = 'en-US',
    enrich = true,
    cachebust = process.env.NODE_ENV === 'development',
  } = options;

  try {
    const content = await builder
      .get(modelName, {
        userAttributes: {
          ...userAttributes,
          locale,
        },
        options: {
          locale,
          enrich,
          cachebust,
        },
        apiKey: builderConfig.apiKey,
      })
      .toPromise();

    return content || null;
  } catch (error) {
    console.error(
      `[Builder.io] Error fetching content for model "${modelName}":`,
      error
    );
    return null;
  }
}

/**
 * Check if content exists for a given URL path
 *
 * @param urlPath - URL path to check
 * @returns true if content exists
 */
export async function hasBuilderContent(urlPath: string): Promise<boolean> {
  if (!builderConfig.apiKey) {
    return false;
  }

  const content = await resolveBuilderContent('page', {
    userAttributes: { urlPath },
    enrich: false, // Don't need full content, just checking existence
  });
  return content !== null;
}

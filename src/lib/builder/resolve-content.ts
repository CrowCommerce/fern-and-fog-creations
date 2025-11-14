/**
 * Builder.io Content Resolver
 *
 * Server-side utility for fetching Builder.io content with proper caching.
 * Adapted for Next.js App Router with React Server Components.
 */

import { builder } from '@builder.io/sdk';
import type { BuilderContent } from '@builder.io/sdk';
import { builderConfig } from './config';

// Initialize Builder.io SDK
builder.init(builderConfig.apiKey);

/**
 * Targeting attributes that can be used for content personalization
 * and A/B testing in Builder.io
 */
export interface TargetingAttributes {
  urlPath?: string;
  productHandle?: string;
  collectionHandle?: string;
  locale?: string;
  [key: string]: any;
}

/**
 * Options for content resolution
 */
export interface ResolveContentOptions {
  /** Targeting attributes for personalization */
  userAttributes?: TargetingAttributes;
  /** Locale for internationalization */
  locale?: string;
  /** Whether to enrich content with resolved references */
  enrich?: boolean;
  /** Cache bust in development/preview */
  cachebust?: boolean;
}

/**
 * Resolves Builder.io content for a given model and targeting attributes
 *
 * This function fetches content from Builder.io with proper error handling
 * and returns null if no content is found (for graceful fallbacks).
 *
 * @param modelName - Builder.io model name (e.g., 'page', 'product-page')
 * @param options - Content resolution options
 * @returns Builder.io content or null if not found
 *
 * @example
 * // Fetch a landing page by URL
 * const content = await resolveBuilderContent('page', {
 *   userAttributes: { urlPath: '/about-us' }
 * });
 *
 * @example
 * // Fetch product page customization
 * const content = await resolveBuilderContent('product-page', {
 *   userAttributes: { productHandle: 'summer-dress' }
 * });
 */
export async function resolveBuilderContent(
  modelName: string,
  options: ResolveContentOptions = {}
): Promise<BuilderContent | null> {
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
    console.error(`[Builder.io] Error fetching content for model "${modelName}":`, error);
    return null;
  }
}

/**
 * Checks if Builder.io content exists for a given URL path
 *
 * Useful for determining whether to render a Builder.io page
 * or fall back to a 404.
 *
 * @param urlPath - The URL path to check (e.g., '/about-us')
 * @returns true if content exists, false otherwise
 */
export async function hasBuilderContent(urlPath: string): Promise<boolean> {
  const content = await resolveBuilderContent('page', {
    userAttributes: { urlPath },
  });
  return content !== null;
}

/**
 * Type guard to check if a value is valid Builder.io content
 */
export function isBuilderContent(value: any): value is BuilderContent {
  return (
    value &&
    typeof value === 'object' &&
    'id' in value &&
    'data' in value &&
    typeof value.id === 'string'
  );
}

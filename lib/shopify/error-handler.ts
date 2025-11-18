import { type ShopifyAPIError, isShopifyError } from '@/lib/type-guards';

/**
 * Centralized Error Handler for Shopify Data Fetching
 *
 * Provides:
 * - User-friendly error messages
 * - Sentry error reporting (when configured)
 * - Graceful fallbacks
 * - Consistent error logging
 */

// Type guard for ShopifyAPIError
function isShopifyAPIError(error: unknown): error is ShopifyAPIError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'type' in error &&
    'message' in error &&
    'retryable' in error
  );
}

// User-friendly error messages based on error type
export function getUserFriendlyMessage(error: unknown): string {
  if (isShopifyAPIError(error)) {
    switch (error.type) {
      case 'network':
        return 'Unable to connect to our store. Please check your internet connection and try again.';

      case 'rate_limit':
        return 'Too many requests. Please wait a moment and try again.';

      case 'graphql':
        return 'There was a problem loading store data. Please refresh the page.';

      default:
        return 'Something went wrong. Please try again later.';
    }
  }

  // Generic error message
  return 'An unexpected error occurred. Please try again.';
}

// Get error context for logging/monitoring
export function getErrorContext(
  error: unknown,
  functionName: string
): {
  message: string;
  type: string;
  operation?: string;
  status?: number;
  retryable: boolean;
} {
  if (isShopifyAPIError(error)) {
    return {
      message: error.message,
      type: error.type,
      operation: error.operation,
      status: error.status,
      retryable: error.retryable,
    };
  }

  return {
    message: error instanceof Error ? error.message : String(error),
    type: 'unknown',
    retryable: false,
  };
}

/**
 * Report error to Sentry (if configured)
 *
 * This is a browser-compatible Sentry reporting function.
 * Only reports errors if NEXT_PUBLIC_SENTRY_DSN is configured.
 */
export function reportErrorToSentry(
  error: unknown,
  context: {
    functionName: string;
    tags?: Record<string, string | number | boolean>;
    extra?: Record<string, any>;
  }
): void {
  // Only report to Sentry if DSN is configured
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
    return;
  }

  // Dynamically import Sentry (works in both client and server)
  if (typeof window !== 'undefined') {
    // Client-side
    import('@sentry/nextjs').then((Sentry) => {
      Sentry.captureException(error, {
        tags: {
          source: 'shopify_data_fetch',
          function: context.functionName,
          ...context.tags,
        },
        extra: context.extra,
      });
    }).catch((err) => {
      console.error('[Sentry] Failed to load client SDK:', err);
    });
  } else {
    // Server-side
    import('@sentry/nextjs').then((Sentry) => {
      Sentry.captureException(error, {
        tags: {
          source: 'shopify_data_fetch',
          function: context.functionName,
          ...context.tags,
        },
        extra: context.extra,
      });
    }).catch((err) => {
      console.error('[Sentry] Failed to load server SDK:', err);
    });
  }
}

/**
 * Wrapper for Shopify data fetching with comprehensive error handling
 *
 * @param fn - The async function to execute
 * @param functionName - Name of the function (for logging/monitoring)
 * @param fallback - Fallback value to return on error
 * @param options - Additional options
 * @returns The result of fn() or the fallback value
 *
 * @example
 * ```typescript
 * export async function getContactPage(): Promise<ContactPage> {
 *   'use cache';
 *   cacheTag(TAGS.contactPage);
 *   cacheLife('days');
 *
 *   return withShopifyErrorHandling(
 *     async () => {
 *       const res = await shopifyFetch<ShopifyContactPageOperation>({
 *         query: getContactPageQuery,
 *       });
 *       // ... transform data
 *       return transformedData;
 *     },
 *     'getContactPage',
 *     DEFAULT_CONTACT_PAGE,
 *     { reportToSentry: true }
 *   );
 * }
 * ```
 */
export async function withShopifyErrorHandling<T>(
  fn: () => Promise<T>,
  functionName: string,
  fallback: T,
  options: {
    reportToSentry?: boolean;
    logError?: boolean;
    customMessage?: string;
  } = {}
): Promise<T> {
  const {
    reportToSentry = true,
    logError = true,
    customMessage,
  } = options;

  try {
    return await fn();
  } catch (error) {
    const errorContext = getErrorContext(error, functionName);
    const userMessage = customMessage || getUserFriendlyMessage(error as any);

    // Log error for debugging
    if (logError) {
      console.error(`[Error Handler] ${functionName} failed:`, {
        ...errorContext,
        userMessage,
      });
    }

    // Report to Sentry if enabled
    if (reportToSentry) {
      reportErrorToSentry(error, {
        functionName,
        tags: {
          error_type: errorContext.type,
          status: errorContext.status || 0,
          retryable: errorContext.retryable,
        },
        extra: {
          operation: errorContext.operation,
          message: errorContext.message,
          userMessage,
        },
      });
    }

    // Return graceful fallback
    console.warn(`[Error Handler] ${functionName} returning fallback value`);
    return fallback;
  }
}

/**
 * Synchronous version for client components
 * Only logs errors, doesn't handle async operations
 */
export function handleShopifyError(
  error: unknown,
  functionName: string,
  options: {
    reportToSentry?: boolean;
    customMessage?: string;
  } = {}
): string {
  const {
    reportToSentry = true,
    customMessage,
  } = options;

  const errorContext = getErrorContext(error, functionName);
  const userMessage = customMessage || getUserFriendlyMessage(error as any);

  console.error(`[Error Handler] ${functionName} failed:`, errorContext);

  // Report to Sentry if enabled
  if (reportToSentry) {
    reportErrorToSentry(error, {
      functionName,
      tags: {
        error_type: errorContext.type,
      },
      extra: errorContext,
    });
  }

  return userMessage;
}

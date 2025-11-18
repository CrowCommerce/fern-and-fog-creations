// Base Shopify error interface
export interface ShopifyErrorLike {
  status: number;
  message: Error;
  cause?: Error;
}

// GraphQL-specific error
export interface GraphQLError {
  message: string;
  locations?: Array<{
    line: number;
    column: number;
  }>;
  path?: string[];
  extensions?: {
    code?: string;
    [key: string]: any;
  };
}

// Network error (fetch failures, timeouts, etc.)
export interface NetworkError extends Error {
  code?: string;
  errno?: number;
  syscall?: string;
}

// Rate limit error from Shopify
export interface RateLimitError {
  status: 429;
  message: string;
  retryAfter?: number; // seconds
}

// Enhanced Shopify API error with context
export interface ShopifyAPIError {
  type: 'graphql' | 'network' | 'rate_limit' | 'unknown';
  message: string;
  status?: number;
  operation?: string; // GraphQL operation name
  query?: string; // Full query
  variables?: Record<string, any>;
  cause?: Error;
  graphqlErrors?: GraphQLError[];
  retryable: boolean;
}

export const isObject = (object: unknown): object is Record<string, unknown> => {
  return typeof object === 'object' && object !== null && !Array.isArray(object);
};

export const isShopifyError = (error: unknown): error is ShopifyErrorLike => {
  if (!isObject(error)) return false;

  if (error instanceof Error) return true;

  return findError(error);
};

// Type guard for GraphQL errors
export const isGraphQLError = (error: unknown): error is { errors: GraphQLError[] } => {
  return (
    isObject(error) &&
    'errors' in error &&
    Array.isArray(error.errors) &&
    error.errors.length > 0 &&
    'message' in error.errors[0]
  );
};

// Type guard for network errors
export const isNetworkError = (error: unknown): error is NetworkError => {
  return (
    error instanceof Error &&
    ('code' in error || 'errno' in error || 'syscall' in error)
  );
};

// Type guard for rate limit errors
export const isRateLimitError = (error: unknown): error is RateLimitError => {
  return (
    isObject(error) &&
    'status' in error &&
    error.status === 429
  );
};

// Helper to check if error is retryable
export const isRetryableError = (error: unknown): boolean => {
  // Network errors are typically retryable
  if (isNetworkError(error)) {
    const networkError = error as NetworkError;
    // Retry on connection errors, timeouts, DNS errors
    return ['ECONNRESET', 'ETIMEDOUT', 'ENOTFOUND', 'ECONNREFUSED'].includes(networkError.code || '');
  }

  // Rate limit errors are retryable after delay
  if (isRateLimitError(error)) {
    return true;
  }

  // 5xx server errors are retryable
  if (isObject(error) && 'status' in error && typeof error.status === 'number') {
    return error.status >= 500 && error.status < 600;
  }

  return false;
};

function findError<T extends object>(error: T): boolean {
  if (Object.prototype.toString.call(error) === '[object Error]') {
    return true;
  }

  const prototype = Object.getPrototypeOf(error) as T | null;

  return prototype === null ? false : findError(prototype);
}

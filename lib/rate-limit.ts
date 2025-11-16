/**
 * Rate Limiting Utility
 *
 * Provides rate limiting capabilities for API routes and server actions
 * using Upstash Redis. This helps prevent abuse and spam.
 *
 * Usage:
 * ```typescript
 * import { rateLimit } from '@/lib/rate-limit';
 *
 * export async function POST(request: Request) {
 *   const { success, limit, reset, remaining } = await rateLimit(request);
 *
 *   if (!success) {
 *     return new Response('Too many requests', {
 *       status: 429,
 *       headers: {
 *         'X-RateLimit-Limit': limit.toString(),
 *         'X-RateLimit-Remaining': remaining.toString(),
 *         'X-RateLimit-Reset': new Date(reset).toISOString(),
 *       },
 *     });
 *   }
 *
 *   // Handle request...
 * }
 * ```
 */

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Check if Upstash is configured
const isUpstashConfigured =
  !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN;

// Initialize Redis client (only if configured)
const redis = isUpstashConfigured
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null;

/**
 * Rate limiter instances for different use cases
 * Each instance has different limits and windows
 */

// General API rate limiter: 10 requests per 10 seconds
export const apiRateLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, '10 s'),
      analytics: true,
      prefix: '@fern-fog/api',
    })
  : null;

// Contact form rate limiter: 5 submissions per 10 minutes
export const contactFormRateLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, '10 m'),
      analytics: true,
      prefix: '@fern-fog/contact',
    })
  : null;

// Authentication rate limiter: 5 attempts per 5 minutes
export const authRateLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, '5 m'),
      analytics: true,
      prefix: '@fern-fog/auth',
    })
  : null;

/**
 * Get client identifier from request
 * Uses IP address or falls back to a generic identifier
 */
function getClientIdentifier(request: Request): string {
  // Try to get IP from various headers (Vercel, Cloudflare, generic)
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');

  const ip = cfConnectingIp || realIp || forwarded?.split(',')[0] || 'unknown';

  return ip;
}

/**
 * Rate limit a request
 *
 * @param request - The incoming request
 * @param limiter - The rate limiter to use (default: apiRateLimiter)
 * @returns Rate limit result with success status and metadata
 */
export async function rateLimit(
  request: Request,
  limiter: Ratelimit | null = apiRateLimiter
) {
  // If Upstash is not configured, bypass rate limiting
  if (!isUpstashConfigured || !limiter) {
    console.warn(
      '[Rate Limit] Upstash Redis not configured. Rate limiting disabled. ' +
        'Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN to enable.'
    );

    return {
      success: true,
      limit: 0,
      remaining: 0,
      reset: Date.now(),
      pending: Promise.resolve(),
    };
  }

  const identifier = getClientIdentifier(request);

  try {
    const { success, limit, reset, remaining, pending } = await limiter.limit(identifier);

    return {
      success,
      limit,
      remaining,
      reset,
      pending,
    };
  } catch (error) {
    console.error('[Rate Limit] Error checking rate limit:', error);

    // On error, allow the request through but log it
    return {
      success: true,
      limit: 0,
      remaining: 0,
      reset: Date.now(),
      pending: Promise.resolve(),
    };
  }
}

/**
 * Rate limit by custom identifier (e.g., user ID, email)
 *
 * @param identifier - Custom identifier string
 * @param limiter - The rate limiter to use
 * @returns Rate limit result
 */
export async function rateLimitByIdentifier(
  identifier: string,
  limiter: Ratelimit | null = apiRateLimiter
) {
  if (!isUpstashConfigured || !limiter) {
    return {
      success: true,
      limit: 0,
      remaining: 0,
      reset: Date.now(),
      pending: Promise.resolve(),
    };
  }

  try {
    const { success, limit, reset, remaining, pending } = await limiter.limit(identifier);

    return {
      success,
      limit,
      remaining,
      reset,
      pending,
    };
  } catch (error) {
    console.error('[Rate Limit] Error checking rate limit:', error);
    return {
      success: true,
      limit: 0,
      remaining: 0,
      reset: Date.now(),
      pending: Promise.resolve(),
    };
  }
}

/**
 * Create rate limit response headers
 * Use these to inform clients about their rate limit status
 */
export function createRateLimitHeaders(result: {
  limit: number;
  remaining: number;
  reset: number;
}): Record<string, string> {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': new Date(result.reset).toISOString(),
  };
}

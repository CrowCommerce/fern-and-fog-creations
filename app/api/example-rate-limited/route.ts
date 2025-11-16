/**
 * Example Rate-Limited API Route
 *
 * This example demonstrates how to implement rate limiting on API routes.
 * Use this pattern for any API endpoints that need protection from abuse.
 *
 * DELETE THIS FILE if not needed in production - it's just an example.
 */

import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, createRateLimitHeaders, apiRateLimiter } from '@/lib/rate-limit';

export async function GET(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResult = await rateLimit(request, apiRateLimiter);

  // If rate limit exceeded, return 429 Too Many Requests
  if (!rateLimitResult.success) {
    return NextResponse.json(
      {
        error: 'Too Many Requests',
        message: 'You have exceeded the rate limit. Please try again later.',
        resetAt: new Date(rateLimitResult.reset).toISOString(),
      },
      {
        status: 429,
        headers: createRateLimitHeaders(rateLimitResult),
      }
    );
  }

  // Handle the request normally
  const response = {
    message: 'Request successful',
    timestamp: new Date().toISOString(),
    rateLimit: {
      limit: rateLimitResult.limit,
      remaining: rateLimitResult.remaining,
      reset: new Date(rateLimitResult.reset).toISOString(),
    },
  };

  return NextResponse.json(response, {
    headers: createRateLimitHeaders(rateLimitResult),
  });
}

export async function POST(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResult = await rateLimit(request, apiRateLimiter);

  if (!rateLimitResult.success) {
    return NextResponse.json(
      {
        error: 'Too Many Requests',
        message: 'You have exceeded the rate limit. Please try again later.',
        resetAt: new Date(rateLimitResult.reset).toISOString(),
      },
      {
        status: 429,
        headers: createRateLimitHeaders(rateLimitResult),
      }
    );
  }

  // Parse request body
  const body = await request.json();

  // Process the request...
  const response = {
    message: 'POST request successful',
    receivedData: body,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(response, {
    headers: createRateLimitHeaders(rateLimitResult),
  });
}

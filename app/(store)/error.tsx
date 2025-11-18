'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import * as Sentry from '@sentry/nextjs';

export default function ProductsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to Sentry (or console if not configured)
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      Sentry.captureException(error, {
        tags: {
          errorBoundary: 'products',
          digest: error.digest,
        },
        contexts: {
          errorBoundary: {
            name: 'Products Error Boundary',
            componentStack: error.stack,
          },
        },
      });
    } else {
      console.error('Products page error:', error);
    }
  }, [error]);

  return (
    <div className="bg-parchment min-h-screen flex items-center justify-center px-4 py-16">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mb-8">
          <svg
            className="mx-auto h-24 w-24 text-fern/40"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
            />
          </svg>
        </div>

        <h1 className="text-4xl font-display font-bold text-moss mb-4">
          Unable to Load Products
        </h1>

        <p className="text-lg text-bark/70 mb-8">
          We're having trouble loading our product catalog. This might be a temporary connection issue.
        </p>

        {error.digest && (
          <p className="text-sm text-bark/50 mb-8 font-mono">
            Error ID: {error.digest}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={reset}
            className="inline-flex items-center px-6 py-3 border-2 border-fern bg-fern text-parchment font-medium rounded-md hover:bg-moss hover:border-moss transition-colors"
          >
            Try again
          </button>

          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 border-2 border-fern text-fern font-medium rounded-md hover:bg-fern/10 transition-colors"
          >
            Return home
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-mist">
          <p className="text-sm text-bark/60">
            You can also browse our{' '}
            <Link href="/gallery" className="text-fern hover:text-moss underline">
              gallery
            </Link>{' '}
            or{' '}
            <Link href="/contact" className="text-fern hover:text-moss underline">
              contact us
            </Link>{' '}
            if this problem persists.
          </p>
        </div>
      </div>
    </div>
  );
}

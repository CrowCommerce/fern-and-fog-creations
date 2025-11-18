'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import * as Sentry from '@sentry/nextjs';

export default function GalleryError({
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
          errorBoundary: 'gallery',
          digest: error.digest,
        },
        contexts: {
          errorBoundary: {
            name: 'Gallery Error Boundary',
            componentStack: error.stack,
          },
        },
      });
    } else {
      console.error('Gallery page error:', error);
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
              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
            />
          </svg>
        </div>

        <h1 className="text-4xl font-display font-bold text-moss mb-4">
          Unable to Load Gallery
        </h1>

        <p className="text-lg text-bark/70 mb-8">
          We're having trouble loading the gallery images. Please try again in a moment.
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
            href="/products"
            className="inline-flex items-center px-6 py-3 border-2 border-fern text-fern font-medium rounded-md hover:bg-fern/10 transition-colors"
          >
            Browse products
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-mist">
          <p className="text-sm text-bark/60">
            Browse our{' '}
            <Link href="/products" className="text-fern hover:text-moss underline">
              available products
            </Link>{' '}
            or{' '}
            <Link href="/" className="text-fern hover:text-moss underline">
              return home
            </Link>.
          </p>
        </div>
      </div>
    </div>
  );
}

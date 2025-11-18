'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import * as Sentry from '@sentry/nextjs';

export default function AboutError({
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
          errorBoundary: 'about',
          digest: error.digest,
        },
        contexts: {
          errorBoundary: {
            name: 'About Page Error Boundary',
            componentStack: error.stack,
          },
        },
      });
    } else {
      console.error('About page error:', error);
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
              d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
            />
          </svg>
        </div>

        <h1 className="text-4xl font-display font-bold text-moss mb-4">
          Unable to Load About Page
        </h1>

        <p className="text-lg text-bark/70 mb-8">
          We're having trouble loading our story. Please try refreshing the page.
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
            prefetch={true}
            className="inline-flex items-center px-6 py-3 border-2 border-fern text-fern font-medium rounded-md hover:bg-fern/10 transition-colors"
          >
            Browse products
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-mist">
          <p className="text-sm text-bark/60">
            Visit our{' '}
            <Link href="/gallery" prefetch={true} className="text-fern hover:text-moss underline">
              gallery
            </Link>,{' '}
            <Link href="/products" prefetch={true} className="text-fern hover:text-moss underline">
              shop products
            </Link>, or{' '}
            <Link href="/contact" prefetch={true} className="text-fern hover:text-moss underline">
              get in touch
            </Link>.
          </p>
        </div>
      </div>
    </div>
  );
}

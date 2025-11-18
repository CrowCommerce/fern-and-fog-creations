'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import * as Sentry from '@sentry/nextjs';

export default function ContactError({
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
          errorBoundary: 'contact',
          digest: error.digest,
        },
        contexts: {
          errorBoundary: {
            name: 'Contact Page Error Boundary',
            componentStack: error.stack,
          },
        },
      });
    } else {
      console.error('Contact page error:', error);
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
              d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
            />
          </svg>
        </div>

        <h1 className="text-4xl font-display font-bold text-moss mb-4">
          Unable to Load Contact Form
        </h1>

        <p className="text-lg text-bark/70 mb-8">
          We're having trouble loading the contact form. Please try again or reach out to us directly.
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
          <div className="bg-mist/50 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-display font-semibold text-moss mb-2">
              Alternative Ways to Reach Us
            </h2>
            <p className="text-sm text-bark/70">
              You can also browse our{' '}
              <Link href="/gallery" prefetch={true} className="text-fern hover:text-moss underline">
                gallery
              </Link>{' '}
              or visit our{' '}
              <Link href="/about" prefetch={true} className="text-fern hover:text-moss underline">
                about page
              </Link>{' '}
              to learn more about our work.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

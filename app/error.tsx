'use client';

import { useEffect } from 'react';
import Link from 'next/link';

/**
 * Renders a full-screen error UI that informs the user, logs the error, and offers recovery actions.
 *
 * Logs the provided error to the console when the component mounts or when the `error` changes.
 *
 * @param error - The caught error to display information for; if `error.digest` is present it is shown as an Error ID.
 * @param reset - Callback invoked when the user requests a retry (connected to the "Try again" button).
 * @returns A centered, responsive error page containing a message, optional error ID, a "Try again" button, and a "Return home" link.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
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
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        </div>

        <h1 className="text-4xl font-display font-bold text-moss mb-4">
          Oops! Something went wrong
        </h1>

        <p className="text-lg text-bark/70 mb-8">
          We're sorry, but something unexpected happened. We've logged the error and will look into it.
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
            If this problem persists, please{' '}
            <Link href="/contact" className="text-fern hover:text-moss underline">
              contact us
            </Link>{' '}
            and include the error ID above.
          </p>
        </div>
      </div>
    </div>
  );
}
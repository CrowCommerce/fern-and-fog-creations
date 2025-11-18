import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found | Fern & Fog Creations',
  description: 'The page you are looking for could not be found.',
};

export default function NotFound() {
  return (
    <div className="bg-parchment min-h-screen flex items-center justify-center px-4 py-16">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mb-8">
          <svg
            className="mx-auto h-24 w-24 text-fern/40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <p className="text-lg font-display font-semibold text-fern mb-2">404</p>

        <h1 className="text-4xl font-display font-bold text-moss mb-4">
          Page Not Found
        </h1>

        <p className="text-lg text-bark/70 mb-8">
          Sorry, we couldn't find the page you're looking for. It may have been moved, or the link might be broken.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            prefetch={true}
            className="inline-flex items-center px-6 py-3 border-2 border-fern bg-fern text-parchment font-medium rounded-md hover:bg-moss hover:border-moss transition-colors"
          >
            <svg
              className="mr-2 h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Go home
          </Link>

          <Link
            href="/products"
            prefetch={true}
            className="inline-flex items-center px-6 py-3 border-2 border-fern text-fern font-medium rounded-md hover:bg-fern/10 transition-colors"
          >
            Browse products
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-mist">
          <p className="text-sm text-bark/60 mb-4">Popular pages:</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/products" prefetch={true} className="text-fern hover:text-moss underline">
              All Products
            </Link>
            <Link href="/gallery" prefetch={true} className="text-fern hover:text-moss underline">
              Gallery
            </Link>
            <Link href="/about" prefetch={true} className="text-fern hover:text-moss underline">
              About Us
            </Link>
            <Link href="/contact" prefetch={true} className="text-fern hover:text-moss underline">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Orders | Fern & Fog Creations',
  description: 'View your order history.',
}

export default function OrderHistoryPage() {
  return (
    <div className="bg-parchment min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-display font-bold text-bark mb-6">
            Order History
          </h1>
          <p className="text-lg text-bark/70 mb-8">
            Sign in to view your order history and track shipments.
          </p>

          <div className="p-8 bg-mist rounded-lg">
            <svg
              className="mx-auto h-12 w-12 text-bark/30 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
              />
            </svg>
            <p className="text-base text-bark/70 mb-6">
              Account authentication is not yet implemented in this demo.
            </p>
            <p className="text-sm text-bark/60">
              For order inquiries, please{' '}
              <Link href="/contact" className="text-fern hover:text-moss font-medium">
                contact us
              </Link>
              .
            </p>
          </div>

          <div className="mt-8">
            <Link
              href="/products"
              className="inline-flex items-center px-6 py-3 bg-fern text-parchment font-medium rounded-md hover:bg-moss transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

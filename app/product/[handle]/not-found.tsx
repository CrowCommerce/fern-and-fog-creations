import Link from 'next/link'

export default function ProductNotFound() {
  return (
    <div className="bg-parchment min-h-screen flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="text-3xl font-display font-bold text-bark sm:text-4xl">
          Product Not Found
        </h1>
        <p className="mt-4 text-lg text-bark/70">
          The product you&apos;re looking for doesn&apos;t exist or may have been removed.
        </p>
        <Link
          href="/products"
          className="mt-8 inline-block px-8 py-3 bg-fern text-parchment font-medium rounded-md hover:bg-moss transition-colors"
        >
          Return to Shop
        </Link>
      </div>
    </div>
  )
}

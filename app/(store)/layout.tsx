import { Suspense } from 'react';

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-parchment min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold tracking-tight text-bark sm:text-5xl">
            Shop All Handmade Crafts
          </h1>
          <p className="mt-4 text-lg text-bark/70 max-w-2xl mx-auto">
            Discover one-of-a-kind pieces crafted from natural materials gathered from the Pacific Northwest
          </p>
        </div>

        {/* Content */}
        <Suspense fallback={null}>
          {children}
        </Suspense>
      </div>
    </div>
  );
}

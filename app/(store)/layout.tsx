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
        <Suspense fallback={
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-bark/10 rounded w-1/4"></div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <div className="aspect-square bg-bark/10 rounded-lg"></div>
                  <div className="h-4 bg-bark/10 rounded w-3/4"></div>
                  <div className="h-4 bg-bark/10 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        }>
          {children}
        </Suspense>
      </div>
    </div>
  );
}

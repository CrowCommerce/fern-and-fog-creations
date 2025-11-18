export default function ProductsLoading() {
  return (
    <div className="bg-parchment min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header Skeleton */}
        <div className="mb-12">
          <div className="h-10 w-64 bg-mist/50 rounded-md animate-pulse mb-4"></div>
          <div className="h-6 w-96 bg-mist/50 rounded-md animate-pulse"></div>
        </div>

        {/* Filters and Products Grid */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Skeleton (Desktop) */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="space-y-6">
              <div>
                <div className="h-6 w-24 bg-mist/50 rounded-md animate-pulse mb-4"></div>
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-5 w-full bg-mist/50 rounded-md animate-pulse"></div>
                  ))}
                </div>
              </div>
              <div>
                <div className="h-6 w-32 bg-mist/50 rounded-md animate-pulse mb-4"></div>
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-10 w-full bg-mist/50 rounded-md animate-pulse"></div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid Skeleton */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  {/* Image Skeleton */}
                  <div className="aspect-square bg-mist/50 animate-pulse"></div>

                  {/* Content Skeleton */}
                  <div className="p-4 space-y-3">
                    <div className="h-5 w-3/4 bg-mist/50 rounded-md animate-pulse"></div>
                    <div className="h-4 w-full bg-mist/50 rounded-md animate-pulse"></div>
                    <div className="h-4 w-2/3 bg-mist/50 rounded-md animate-pulse"></div>
                    <div className="h-6 w-20 bg-mist/50 rounded-md animate-pulse mt-2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GalleryLoading() {
  return (
    <div className="bg-parchment min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header Skeleton */}
        <div className="text-center mb-12">
          <div className="h-12 w-80 bg-mist/50 rounded-md animate-pulse mx-auto mb-4"></div>
          <div className="h-6 w-96 bg-mist/50 rounded-md animate-pulse mx-auto mb-2"></div>
          <div className="h-6 w-72 bg-mist/50 rounded-md animate-pulse mx-auto"></div>
        </div>

        {/* Category Filter Skeleton */}
        <div className="flex justify-center mb-12">
          <div className="flex gap-3 flex-wrap">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 w-24 bg-mist/50 rounded-full animate-pulse"></div>
            ))}
          </div>
        </div>

        {/* Gallery Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(12)].map((_, index) => (
            <div key={index} className="group">
              {/* Image Skeleton */}
              <div className="aspect-square rounded-lg ring-1 ring-bark/20 overflow-hidden">
                <div className="size-full bg-mist/50 animate-pulse"></div>
              </div>

              {/* Content Skeleton */}
              <div className="mt-4 space-y-2">
                <div className="h-6 w-3/4 bg-mist/50 rounded-md animate-pulse"></div>
                <div className="h-4 w-1/2 bg-mist/50 rounded-md animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Loading Indicator */}
        <div className="flex justify-center items-center mt-12">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 border-4 border-fern border-t-transparent rounded-full animate-spin"></div>
            <p className="text-bark/60 text-sm">Loading gallery...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

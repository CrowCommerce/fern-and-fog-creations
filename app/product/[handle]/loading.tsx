export default function ProductLoading() {
  return (
    <div className="bg-parchment min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images Skeleton */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-mist/50 rounded-lg animate-pulse"></div>

            {/* Thumbnail Strip */}
            <div className="flex gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-20 h-20 bg-mist/50 rounded-md animate-pulse"></div>
              ))}
            </div>
          </div>

          {/* Product Details Skeleton */}
          <div className="space-y-6">
            {/* Title */}
            <div className="h-10 w-3/4 bg-mist/50 rounded-md animate-pulse"></div>

            {/* Price */}
            <div className="h-8 w-32 bg-mist/50 rounded-md animate-pulse"></div>

            {/* Description */}
            <div className="space-y-3">
              <div className="h-4 w-full bg-mist/50 rounded-md animate-pulse"></div>
              <div className="h-4 w-full bg-mist/50 rounded-md animate-pulse"></div>
              <div className="h-4 w-5/6 bg-mist/50 rounded-md animate-pulse"></div>
            </div>

            {/* Variant Selector */}
            <div className="space-y-3">
              <div className="h-5 w-24 bg-mist/50 rounded-md animate-pulse"></div>
              <div className="flex gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-12 w-20 bg-mist/50 rounded-md animate-pulse"></div>
                ))}
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="h-14 w-full bg-mist/50 rounded-md animate-pulse"></div>

            {/* Product Details Accordion */}
            <div className="space-y-4 pt-6 border-t border-mist">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-6 w-48 bg-mist/50 rounded-md animate-pulse"></div>
                  <div className="h-4 w-full bg-mist/50 rounded-md animate-pulse"></div>
                  <div className="h-4 w-3/4 bg-mist/50 rounded-md animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products Skeleton */}
        <div className="mt-20">
          <div className="h-8 w-64 bg-mist/50 rounded-md animate-pulse mb-8"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="aspect-square bg-mist/50 animate-pulse"></div>
                <div className="p-4 space-y-3">
                  <div className="h-5 w-3/4 bg-mist/50 rounded-md animate-pulse"></div>
                  <div className="h-6 w-20 bg-mist/50 rounded-md animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

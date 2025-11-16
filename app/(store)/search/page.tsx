import { redirect } from 'next/navigation';
import { getProducts } from '@/lib/data-source';
import type { Metadata } from 'next';

const defaultSort = {
  title: 'Relevance',
  slug: null,
  sortKey: 'RELEVANCE',
  reverse: false,
};

const sorting = [
  defaultSort,
  {
    title: 'Trending',
    slug: 'trending-desc',
    sortKey: 'BEST_SELLING',
    reverse: false,
  },
  {
    title: 'Latest arrivals',
    slug: 'latest-desc',
    sortKey: 'CREATED_AT',
    reverse: true,
  },
  {
    title: 'Price: Low to high',
    slug: 'price-asc',
    sortKey: 'PRICE',
    reverse: false,
  },
  {
    title: 'Price: High to low',
    slug: 'price-desc',
    sortKey: 'PRICE',
    reverse: true,
  },
];

export async function generateMetadata(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  const searchParams = await props.searchParams;
  const query = searchParams?.q as string;

  return {
    title: query
      ? `Search results for "${query}" | Fern & Fog Creations`
      : 'Search Products | Fern & Fog Creations',
    description: query
      ? `Search results for "${query}" - handmade coastal crafts`
      : 'Search our collection of handmade coastal crafts',
  };
}

export default async function SearchPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const { sort, q: searchValue } = searchParams as { [key: string]: string };

  // Redirect to products page if no search query
  if (!searchValue) {
    redirect('/products');
  }

  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;

  const products = await getProducts({
    sortKey,
    reverse,
    query: searchValue,
  });

  const resultsText = products.length === 1 ? 'result' : 'results';

  return (
    <div className="bg-parchment min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Search Results Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold font-display text-bark">
            Search Results
          </h1>
          <p className="mt-4 text-lg text-bark/70">
            {products.length === 0 ? (
              <>
                No products found for{' '}
                <span className="font-semibold text-bark">
                  &quot;{searchValue}&quot;
                </span>
              </>
            ) : (
              <>
                Showing {products.length} {resultsText} for{' '}
                <span className="font-semibold text-bark">
                  &quot;{searchValue}&quot;
                </span>
              </>
            )}
          </p>
        </div>

        {/* Product Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {products.map((product) => (
              <a
                key={product.id}
                href={`/product/${product.slug}`}
                className="group"
              >
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-mist xl:aspect-h-8 xl:aspect-w-7">
                  <img
                    alt={product.name}
                    src={product.images[0]}
                    className="h-full w-full object-cover object-center group-hover:opacity-75 transition-opacity"
                  />
                </div>
                <h3 className="mt-4 text-sm font-medium text-bark">
                  {product.name}
                </h3>
                <p className="mt-1 text-lg font-semibold text-bark">
                  {product.priceRange
                    ? `$${product.priceRange.min}${
                        product.priceRange.min !== product.priceRange.max
                          ? ` - $${product.priceRange.max}`
                          : ''
                      }`
                    : `$${product.price}`}
                </p>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-bark/60 mb-4">
              Try adjusting your search terms or browse all products
            </p>
            <a
              href="/products"
              className="inline-flex items-center justify-center rounded-md bg-moss px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-fern transition-colors"
            >
              View All Products
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

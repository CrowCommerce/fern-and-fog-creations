"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { analytics } from "@/lib/analytics/tracker";
import Link from "next/link";
import {
  ShoppingBagIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import type { Product } from "@/data/products";
import { useFilters } from "@/hooks/useFilters";
import { FilterPanel } from "@/components/filters/FilterPanel";
import { MobileFilterDrawer } from "@/components/filters/MobileFilterDrawer";
import SortDropdown from "@/components/filters/SortDropdown";
import type { ActiveFilters, SortOption } from "@/types/filter";
import type { Collection } from "@/lib/shopify/types";

interface ProductsClientProps {
  products: Product[];
  collections?: Collection[];
  dataMode: "shopify" | "local";
}

export default function ProductsClient({
  products,
  collections = [],
  dataMode,
}: ProductsClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Helper function to get image URL from either local (string) or Shopify (object) format
  const getImageUrl = (image: any): string => {
    if (!image) return "/placeholder.jpg";
    if (typeof image === "string") return image; // Local data format
    return image.url || "/placeholder.jpg"; // Shopify data format
  };

  // Parse initial filters from URL
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>(() => {
    const filters: ActiveFilters = {};

    // Category filter
    const categoryParam = searchParams?.get("category");
    if (categoryParam) {
      filters.category = categoryParam.split(",");
    }

    // Price range filter
    const minPrice = searchParams?.get("minPrice");
    const maxPrice = searchParams?.get("maxPrice");
    if (minPrice && maxPrice) {
      filters.priceRange = {
        min: parseInt(minPrice),
        max: parseInt(maxPrice),
      };
    }

    // Sort
    const sortParam = searchParams?.get("sort");
    if (sortParam) {
      filters.sort = sortParam as SortOption;
    }

    return filters;
  });

  // Apply filters
  const { filteredProducts, facets, resultCount } = useFilters({
    products,
    collections,
    initialFilters: activeFilters,
  });

  // Track view_item_list event on mount
  useEffect(() => {
    if (filteredProducts.length > 0) {
      const collectionName = activeFilters.category?.[0] || "all-products";
      analytics.viewItemList({
        item_list_id: collectionName,
        item_list_name:
          collectionName === "all-products"
            ? "All Products"
            : collectionName.charAt(0).toUpperCase() + collectionName.slice(1),
        items_count: filteredProducts.length,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Fire once on mount

  // Update URL when filters change
  const handleFilterChange = (newFilters: ActiveFilters) => {
    setActiveFilters(newFilters);

    const params = new URLSearchParams();

    // Category
    if (newFilters.category && newFilters.category.length > 0) {
      params.set("category", newFilters.category.join(","));
    }

    // Price range
    if (newFilters.priceRange) {
      params.set("minPrice", String(newFilters.priceRange.min));
      params.set("maxPrice", String(newFilters.priceRange.max));
    }

    // Sort
    if (newFilters.sort) {
      params.set("sort", newFilters.sort);
    }

    const queryString = params.toString();
    router.replace(queryString ? `/products?${queryString}` : "/products", {
      scroll: false,
    });
  };

  // 1. Store Empty State (No products at all)
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
        <div className="bg-mist/50 p-6 rounded-full mb-6">
          <ShoppingBagIcon className="w-12 h-12 text-fern/60" />
        </div>
        <h2 className="text-2xl font-serif text-bark mb-3">
          No Products Found
        </h2>
        <p className="text-bark/60 max-w-md mx-auto">
          The store owner needs to add products to the inventory. Please check
          back later.
        </p>
      </div>
    );
  }

  return (
    <div className="lg:grid lg:grid-cols-4 lg:gap-x-8">
      {/* Desktop Filter Panel - Left Sidebar */}
      <aside className="hidden lg:block">
        <FilterPanel
          facets={facets}
          activeFilters={activeFilters}
          onFilterChange={handleFilterChange}
          resultCount={resultCount}
        />
      </aside>

      {/* Main Content Area */}
      <div className="lg:col-span-3">
        {/* Mobile Filter + Sort */}
        <div className="flex items-center justify-between mb-6 lg:mb-8">
          <div className="lg:hidden">
            <MobileFilterDrawer
              facets={facets}
              activeFilters={activeFilters}
              onFilterChange={handleFilterChange}
              resultCount={resultCount}
            />
          </div>

          {/* Sort Dropdown */}
          <div className="ml-auto">
            <SortDropdown
              value={activeFilters.sort || "featured"}
              onChange={(sort) =>
                handleFilterChange({ ...activeFilters, sort })
              }
            />
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed border-bark/20 rounded-lg bg-parchment/30">
            <div className="bg-white p-4 rounded-full mb-4 shadow-sm">
              <MagnifyingGlassIcon className="w-8 h-8 text-bark/40" />
            </div>
            <h3 className="text-lg font-medium text-bark mb-2">
              No matching products
            </h3>
            <p className="text-bark/60 mb-6 max-w-sm">
              We couldn't find any products matching your current filters. Try
              adjusting your search criteria.
            </p>
            <button
              onClick={() => handleFilterChange({})}
              className="px-6 py-2.5 bg-fern text-parchment rounded-md hover:bg-moss transition-colors font-medium text-sm"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
            {filteredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                prefetch={true}
                className="group relative"
              >
                {/* Product Image */}
                <div className="aspect-square w-full overflow-hidden rounded-lg bg-mist">
                  <img
                    src={getImageUrl(product.images?.[0])}
                    alt={product.name}
                    className="h-full w-full object-cover object-center group-hover:opacity-90 transition-opacity"
                  />
                </div>

                {/* Product Info */}
                <div className="mt-4 flex flex-col">
                  <h3 className="text-base font-medium text-bark group-hover:text-fern transition-colors">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-sm text-bark/60 capitalize">
                    {product.category}
                  </p>
                  <p className="mt-2 text-base font-semibold text-bark">
                    ${product.price.toFixed(2)}
                  </p>
                </div>

                {/* Out of Stock Badge */}
                {!product.forSale && (
                  <div className="absolute top-2 right-2 bg-bark/80 text-parchment px-2 py-1 rounded text-xs font-medium">
                    Sold Out
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}

        {/* Result Count */}
        <div className="mt-8 text-center text-sm text-bark/60">
          Showing {filteredProducts.length} of {products.length} products
        </div>
      </div>
    </div>
  );
}

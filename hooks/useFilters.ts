/**
 * Hook for managing product filtering logic
 * Handles filter state, URL sync, and result counting
 */

'use client';

import { useMemo } from 'react';
import type { Product } from '@/data/products';
import type { ActiveFilters, FilterFacet, SortOption } from '@/types/filter';

interface UseFiltersProps {
  products: Product[];
  initialFilters?: ActiveFilters;
}

export function useFilters({ products, initialFilters = {} }: UseFiltersProps) {
  // Apply filters to products
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Category filter
    if (initialFilters.category && initialFilters.category.length > 0) {
      filtered = filtered.filter((p) =>
        initialFilters.category!.includes(p.category)
      );
    }

    // Price range filter
    if (initialFilters.priceRange) {
      filtered = filtered.filter((p) => {
        const price = p.price;
        return (
          price >= initialFilters.priceRange!.min &&
          price <= initialFilters.priceRange!.max
        );
      });
    }

    // Material filter
    if (initialFilters.material && initialFilters.material.length > 0) {
      filtered = filtered.filter((p) =>
        p.materials.some((m) =>
          initialFilters.material!.some((filterMat) =>
            m.toLowerCase().includes(filterMat.toLowerCase())
          )
        )
      );
    }

    // Availability filter
    if (initialFilters.availability !== undefined) {
      filtered = filtered.filter((p) => p.forSale === initialFilters.availability);
    }

    // Apply sorting
    if (initialFilters.sort) {
      filtered = applySort(filtered, initialFilters.sort);
    }

    return filtered;
  }, [products, initialFilters]);

  // Generate facets based on available products
  const facets = useMemo((): FilterFacet[] => {
    const allPrices = products.map((p) => p.price);
    const minPrice = Math.floor(Math.min(...allPrices) / 10) * 10;
    const maxPrice = Math.ceil(Math.max(...allPrices) / 10) * 10;

    // Get unique materials
    const allMaterials = new Set<string>();
    products.forEach((p) => {
      p.materials.forEach((m) => {
        // Simplify materials (e.g., "Sterling silver hooks" -> "Silver")
        const simplified = simplifyMaterial(m);
        allMaterials.add(simplified);
      });
    });

    return [
      {
        id: 'category',
        name: 'Category',
        type: 'checkbox',
        options: [
          { value: 'earrings', label: 'Earrings', count: products.filter((p) => p.category === 'earrings').length },
          { value: 'resin', label: 'Resin Art', count: products.filter((p) => p.category === 'resin').length },
          { value: 'driftwood', label: 'Driftwood', count: products.filter((p) => p.category === 'driftwood').length },
          { value: 'wall-hangings', label: 'Wall Hangings', count: products.filter((p) => p.category === 'wall-hangings').length },
        ],
      },
      {
        id: 'priceRange',
        name: 'Price Range',
        type: 'range',
        min: minPrice,
        max: maxPrice,
        options: [],
      },
      {
        id: 'material',
        name: 'Materials',
        type: 'checkbox',
        options: Array.from(allMaterials)
          .sort()
          .map((m) => ({
            value: m,
            label: m,
            count: products.filter((p) =>
              p.materials.some((mat) =>
                mat.toLowerCase().includes(m.toLowerCase())
              )
            ).length,
          }))
          .filter((opt) => opt.count > 0),
      },
    ];
  }, [products]);

  return {
    filteredProducts,
    facets,
    resultCount: filteredProducts.length,
  };
}

// Helper: Apply sort to products
function applySort(products: Product[], sort: SortOption): Product[] {
  const sorted = [...products];

  switch (sort) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'name-desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case 'newest':
      // Assuming newer products have higher IDs
      return sorted.sort((a, b) => parseInt(b.id) - parseInt(a.id));
    case 'featured':
    default:
      // Featured first, then by ID
      return sorted.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return parseInt(a.id) - parseInt(b.id);
      });
  }
}

// Helper: Simplify material names for filtering
function simplifyMaterial(material: string): string {
  const lower = material.toLowerCase();

  if (lower.includes('silver')) return 'Silver';
  if (lower.includes('gold')) return 'Gold';
  if (lower.includes('resin')) return 'Resin';
  if (lower.includes('sea glass')) return 'Sea Glass';
  if (lower.includes('driftwood')) return 'Driftwood';
  if (lower.includes('fern') || lower.includes('flower')) return 'Pressed Flowers';
  if (lower.includes('shell')) return 'Shells';
  if (lower.includes('macrame')) return 'Macramé';

  // Return first word capitalized
  return material.split(' ')[0].charAt(0).toUpperCase() + material.split(' ')[0].slice(1);
}

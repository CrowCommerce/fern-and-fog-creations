/**
 * Filter types for collection/product filtering
 * Used by FilterPanel, PriceRangeFilter, and products page
 */

export interface FilterOption {
  value: string
  label: string
  count?: number // Number of products matching this option
}

export interface FilterFacet {
  id: string
  name: string // Display name e.g., "Category", "Price Range"
  type: 'checkbox' | 'radio' | 'range' | 'select'
  options: FilterOption[]
  min?: number // For range type
  max?: number // For range type
}

export type SortOption =
  | 'featured'
  | 'price-asc'
  | 'price-desc'
  | 'newest'
  | 'name-asc'
  | 'name-desc'

export interface ActiveFilters {
  category?: string[]
  priceRange?: { min: number; max: number }
  availability?: boolean
  sort?: SortOption
}

export interface FilterState {
  facets: FilterFacet[]
  activeFilters: ActiveFilters
  resultCount: number
}

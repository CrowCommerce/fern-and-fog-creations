/**
 * Type definitions barrel export
 * Central import point for all custom types
 */

export type {
  ProductVariant,
  ProductOption,
  PriceRange,
  ProductWithVariants,
} from './product'

export type {
  FilterOption,
  FilterFacet,
  SortOption,
  ActiveFilters,
  FilterState,
} from './filter'

// Cart types are defined in @/components/cart/cart-context.tsx
// export type {
//   CartItem,
//   CartAction,
//   CartHistory,
//   OptimisticCartState,
// } from './cart'

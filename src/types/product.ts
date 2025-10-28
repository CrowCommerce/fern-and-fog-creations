/**
 * Product variant and option types
 * Based on Shopify Storefront API but adapted for local data structure
 */

export interface ProductVariant {
  id: string
  title: string
  price: number
  availableForSale: boolean
  selectedOptions: {
    name: string
    value: string
  }[]
  sku?: string
  quantityAvailable?: number
  image?: string
}

export interface ProductOption {
  id: string
  name: string // e.g., "Size", "Color", "Material"
  values: string[] // e.g., ["Small", "Medium", "Large"]
}

export interface PriceRange {
  min: number
  max: number
}

/**
 * Extended product type with optional variant support
 * Backward compatible with existing Product interface from src/data/products.ts
 */
export interface ProductWithVariants {
  id: string
  slug: string
  name: string
  price: number // Represents base price or "from" price when variants exist
  priceRange?: PriceRange
  category: 'earrings' | 'resin' | 'driftwood' | 'wall-hangings'
  images: string[]
  materials: string[]
  description: string
  forSale: boolean
  featured?: boolean
  externalUrl?: string
  story?: string

  // New variant support (optional - backward compatible)
  variants?: ProductVariant[]
  options?: ProductOption[]
}

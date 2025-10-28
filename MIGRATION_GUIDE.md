# Migration Guide - New Features

This guide shows you how to use the newly added features in Fern & Fogs Creation.

---

## Table of Contents

1. [Adding Variants to Products](#adding-variants-to-products)
2. [Using the Variant Selector](#using-the-variant-selector)
3. [Working with Enhanced Cart](#working-with-enhanced-cart)
4. [Creating Custom Filters](#creating-custom-filters)
5. [Utility Functions Reference](#utility-functions-reference)

---

## 1. Adding Variants to Products

### Step 1: Define Options and Variants

```typescript
// src/data/products.ts

const newProduct: Product = {
  id: '17',
  slug: 'custom-bracelet',
  name: 'Custom Sea Glass Bracelet',
  price: 55.00,  // Base price (lowest variant)
  priceRange: { min: 55.00, max: 75.00 },  // Optional: shows range in UI
  category: 'earrings',
  images: [
    '/images/bracelet-blue.jpg',
    '/images/bracelet-green.jpg',
  ],
  materials: ['Sea glass', 'Sterling silver'],
  description: 'Beautiful handcrafted bracelet...',
  forSale: true,
  featured: false,

  // NEW: Define product options
  options: [
    {
      id: 'color',
      name: 'Color',
      values: ['Ocean Blue', 'Seafoam Green', 'Sandy Beige']
    },
    {
      id: 'size',
      name: 'Size',
      values: ['Small (6.5")', 'Medium (7")', 'Large (7.5")']
    }
  ],

  // NEW: Define all possible variants
  variants: [
    {
      id: '17-blue-small',
      title: 'Ocean Blue / Small (6.5")',
      price: 55.00,
      availableForSale: true,
      selectedOptions: [
        { name: 'Color', value: 'Ocean Blue' },
        { name: 'Size', value: 'Small (6.5")' }
      ],
      sku: 'BRAC-BLUE-SM',
      quantityAvailable: 3,
      image: '/images/bracelet-blue.jpg'  // Optional: variant-specific image
    },
    {
      id: '17-blue-medium',
      title: 'Ocean Blue / Medium (7")',
      price: 60.00,
      availableForSale: true,
      selectedOptions: [
        { name: 'Color', value: 'Ocean Blue' },
        { name: 'Size', value: 'Medium (7")' }
      ],
      sku: 'BRAC-BLUE-MD',
      quantityAvailable: 5
    },
    {
      id: '17-green-large',
      title: 'Seafoam Green / Large (7.5")',
      price: 75.00,
      availableForSale: false,  // Out of stock
      selectedOptions: [
        { name: 'Color', value: 'Seafoam Green' },
        { name: 'Size', value: 'Large (7.5")' }
      ],
      sku: 'BRAC-GREEN-LG',
      quantityAvailable: 0
    },
    // ... more variants
  ]
}
```

### Step 2: Variant Selector Auto-Displays

The `VariantSelector` component automatically renders when `product.variants` and `product.options` exist:

```tsx
// In src/app/products/[slug]/page.tsx (already integrated)

{product.variants && product.options && (
  <VariantSelector
    options={product.options}
    variants={product.variants}
    defaultVariant={selectedVariant}
    onVariantChange={setSelectedVariant}
  />
)}
```

**No code changes needed** - it's already integrated!

---

## 2. Using the Variant Selector

### For End Users

1. **Select Options**: Click buttons or use dropdown to choose Color, Size, etc.
2. **View Availability**: Unavailable options are grayed out with strikethrough
3. **See Stock**: "3 in stock" or "Out of stock" indicator appears
4. **Price Updates**: Display price changes based on selected variant
5. **Share Link**: URL updates automatically - sharing link includes selected variant

### For Developers - Accessing Selected Variant

```typescript
// In your product detail component

const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
  product.variants?.[0] || null
)

// Display price based on selection
const displayPrice = selectedVariant?.price || product.price

// Check availability
const isAvailable = selectedVariant?.availableForSale ?? product.forSale

// Add to cart with variant info
const handleAddToCart = () => {
  addItem({
    productId: product.id,
    slug: product.slug,
    name: product.name,
    price: displayPrice,
    image: selectedVariant?.image || product.images[0],
    variantId: selectedVariant?.id,           // NEW
    variantTitle: selectedVariant?.title,     // NEW
    selectedOptions: selectedVariant?.selectedOptions  // NEW
  }, quantity)
}
```

---

## 3. Working with Enhanced Cart

### Undo Feature

```typescript
import { useCart } from '@/context/CartContext'

function MyComponent() {
  const { undoLastAction, canUndo, isPending } = useCart()

  return (
    <>
      {canUndo && (
        <button onClick={undoLastAction}>
          Undo last change
        </button>
      )}

      {isPending && <div>Updating cart...</div>}
    </>
  )
}
```

### Optimistic UI Updates

```typescript
const { optimisticItems, items, isPending } = useCart()

// Use optimistic items for instant feedback
const displayItems = isPending ? optimisticItems : items

return (
  <ul>
    {displayItems.map(item => (
      <li key={item.productId} className={isPending ? 'opacity-60' : ''}>
        {item.name} - {item.variantTitle || 'No variant'}
      </li>
    ))}
  </ul>
)
```

### Variant Information in Cart

Cart items now include:

```typescript
{
  productId: string
  slug: string
  name: string
  price: number
  quantity: number
  image: string
  // NEW fields
  variantId?: string
  variantTitle?: string             // e.g., "Ocean Blue / Medium"
  selectedOptions?: Array<{
    name: string
    value: string
  }>
}
```

---

## 4. Creating Custom Filters

### Adding a New Filter Type

```typescript
// src/hooks/useFilters.ts

// In the facets array, add:
{
  id: 'handmade',
  name: 'Handmade Status',
  type: 'radio',  // Single selection
  options: [
    { value: 'all', label: 'All Products', count: products.length },
    { value: 'handmade', label: 'Handmade Only', count: handmadeCount },
    { value: 'custom', label: 'Custom Orders', count: customCount },
  ]
}
```

### Implementing Filter Logic

```typescript
// In useFilters hook

if (initialFilters.handmade && initialFilters.handmade !== 'all') {
  filtered = filtered.filter((p) => {
    if (initialFilters.handmade === 'handmade') return p.isHandmade
    if (initialFilters.handmade === 'custom') return p.customOrderAvailable
    return true
  })
}
```

### Using Filters with URL Params

```typescript
// Products page automatically syncs filters to URL

// Access filters from URL:
const searchParams = useSearchParams()
const category = searchParams?.get('category')  // "earrings"
const minPrice = searchParams?.get('minPrice')  // "30"
const sort = searchParams?.get('sort')          // "price-asc"

// Update filters programmatically:
handleFilterChange({
  category: ['earrings', 'resin'],
  priceRange: { min: 30, max: 80 },
  sort: 'price-asc'
})

// URL becomes:
// /products?category=earrings,resin&minPrice=30&maxPrice=80&sort=price-asc
```

---

## 5. Utility Functions Reference

### Variant Utils

```typescript
import {
  getVariantFromOptions,
  getAvailableOptionsForSelection,
  formatPriceRange,
  getPriceRangeFromVariants,
  isSelectionAvailable,
  getCheapestVariant,
  formatVariantTitle
} from '@/lib/variant-utils'

// Find variant by selected options
const variant = getVariantFromOptions(
  product.variants,
  { Color: 'Blue', Size: 'Medium' }
)

// Get available options for current selection
const available = getAvailableOptionsForSelection(
  product.variants,
  { Color: 'Blue' }  // What sizes are available for Blue?
)
// Returns: { Size: ['Small', 'Medium'] }

// Format price range
const priceText = formatPriceRange({ min: 40, max: 60 })
// Returns: "$40.00 - $60.00"

// Get price range from variants
const range = getPriceRangeFromVariants(product.variants)
// Returns: { min: 40, max: 60 }

// Check if selection is available
const available = isSelectionAvailable(
  product.variants,
  { Color: 'Blue', Size: 'Large' }
)
// Returns: true/false

// Get cheapest available variant
const cheapest = getCheapestVariant(product.variants)
// Returns: ProductVariant with lowest price

// Format variant title
const title = formatVariantTitle(variant)
// Returns: "Blue / Medium"
```

---

## Quick Start Examples

### Example 1: Add a Simple Variant Product

```typescript
// 1. Copy existing product structure
// 2. Add options array
// 3. Add variants array
// 4. Done! Variant selector auto-appears

const simpleProduct = {
  ...existingProduct,
  price: 30.00,
  priceRange: { min: 30.00, max: 40.00 },
  options: [
    { id: 'size', name: 'Size', values: ['Small', 'Large'] }
  ],
  variants: [
    {
      id: 'prod-small',
      title: 'Small',
      price: 30.00,
      availableForSale: true,
      selectedOptions: [{ name: 'Size', value: 'Small' }],
      sku: 'PROD-SM',
      quantityAvailable: 10
    },
    {
      id: 'prod-large',
      title: 'Large',
      price: 40.00,
      availableForSale: true,
      selectedOptions: [{ name: 'Size', value: 'Large' }],
      sku: 'PROD-LG',
      quantityAvailable: 5
    }
  ]
}
```

### Example 2: Use Optimistic Cart Updates in Custom Component

```typescript
'use client'

import { useCart } from '@/context/CartContext'

export function QuickAddButton({ product }: { product: Product }) {
  const { addItem, isPending, canUndo, undoLastAction } = useCart()

  const handleQuickAdd = () => {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.images[0]
    })
  }

  return (
    <div>
      <button
        onClick={handleQuickAdd}
        disabled={isPending}
        className="px-4 py-2 bg-moss text-parchment rounded"
      >
        {isPending ? 'Adding...' : 'Quick Add'}
      </button>

      {canUndo && (
        <button
          onClick={undoLastAction}
          className="ml-2 text-sm underline"
        >
          Undo
        </button>
      )}
    </div>
  )
}
```

### Example 3: Create Custom Filter UI

```typescript
import { FilterPanel } from '@/components/filters/FilterPanel'
import { useFilters } from '@/hooks/useFilters'
import { useState } from 'react'

export function CustomProductBrowser() {
  const [activeFilters, setActiveFilters] = useState({})

  const { filteredProducts, facets, resultCount } = useFilters({
    products: allProducts,
    initialFilters: activeFilters
  })

  return (
    <div className="grid grid-cols-4 gap-8">
      <aside>
        <FilterPanel
          facets={facets}
          activeFilters={activeFilters}
          onFilterChange={setActiveFilters}
          resultCount={resultCount}
        />
      </aside>
      <div className="col-span-3">
        {/* Your product grid */}
      </div>
    </div>
  )
}
```

---

## Environment Variables

No new environment variables required! All features work with existing configuration.

---

## Troubleshooting

### Variant Selector Not Appearing

**Problem**: VariantSelector doesn't show on product page

**Solution**: Check that product has both `options` and `variants` defined:

```typescript
console.log(product.options)   // Should be array
console.log(product.variants)  // Should be array
```

### Filters Not Working

**Problem**: Filters don't update products

**Solution**: Ensure `useFilters` hook receives correct props:

```typescript
const { filteredProducts } = useFilters({
  products: products.filter(p => p.forSale),  // Only for-sale products
  initialFilters: activeFilters
})
```

### Cart Undo Not Showing

**Problem**: Undo button never appears

**Solution**: Check that history is being saved:

```typescript
const { canUndo } = useCart()
console.log(canUndo)  // Should be true after cart modification
```

---

## Migration Checklist

- [x] Review `FEATURES_ADDED.md` for all new features
- [x] Run `pnpm build` to verify build success
- [x] Test variant selector on product pages
- [x] Test filters on `/products` page
- [x] Test cart undo functionality
- [ ] Add variants to your custom products (optional)
- [ ] Customize filter options (optional)
- [ ] Add unit tests (recommended)
- [ ] Test on mobile devices
- [ ] Run Lighthouse audit

---

## Support

For issues or questions:
1. Check this migration guide
2. Review `FEATURES_ADDED.md`
3. Check TypeScript types in `src/types/`
4. Inspect component source code (well-documented)

---

**Last Updated**: October 21, 2025

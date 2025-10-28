# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Fern & Fog Creations is a Next.js 15 e-commerce application for handmade coastal crafts (sea glass earrings, pressed flower resin, driftwood décor). It uses the App Router, React Server Components, TypeScript, Tailwind CSS v4, and integrates with Shopify's GraphQL Storefront API.

**Package Manager:** pnpm (v10.19.0+)

## Development Commands

```bash
# Start development server (uses Turbopack)
pnpm dev

# Build for production (uses Turbopack)
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint
```

Development server runs on `http://localhost:3000`

## Architecture Overview

### App Router Structure

This project uses Next.js 15's App Router with the following page structure:

- `/` - Homepage with hero, category sections, and featured products
- `/products` - Product listing with category filtering via URL params (`?category=earrings`)
- `/products/[slug]` - Dynamic product detail pages
- `/cart` - Shopping cart page
- `/checkout` - Checkout page
- `/categories`, `/gallery`, `/contact`, `/about`, `/account` - Additional pages

### Server vs Client Components

**Default: Server Components** - Most pages and layouts are server components for optimal performance.

**Client Components** (marked with `'use client'`):
- `src/context/CartContext.tsx` - Global cart state management
- `src/components/layout/Header.tsx` - Navigation with cart integration
- `src/components/layout/ShoppingCartDrawer.tsx` - Interactive cart drawer
- `src/app/products/page.tsx` - Product filtering with useSearchParams
- `src/app/products/[slug]/page.tsx` - Image gallery interactions

**Important:** Mark components with `'use client'` ONLY when they need:
- React hooks (useState, useEffect, useContext)
- Event handlers (onClick, onChange)
- Browser APIs (localStorage, window)

### Dual-Mode Data Source Architecture

**Critical Pattern:** This app supports both Shopify and local data sources via `src/lib/data-source.ts`.

**Data Source Control:**
```bash
# Toggle between modes via environment variable
NEXT_PUBLIC_USE_SHOPIFY=true   # Use Shopify API
NEXT_PUBLIC_USE_SHOPIFY=false  # Use local data from src/data/products.ts
```

**Unified Interface Functions:**
```typescript
// Always use these functions - they automatically route to correct source
import { getProduct, getProducts } from '@/lib/data-source';

// Check current mode
import { getDataSourceMode, isShopifyEnabled } from '@/lib/data-source';
```

**Important:** The data source layer automatically converts Shopify's format to match the local `Product` interface, ensuring components work seamlessly with either source.

### Shopify Integration

**API Layer:** `src/lib/shopify/index.ts` contains all Shopify API interactions via GraphQL.

**Direct Shopify Functions** (use `src/lib/data-source.ts` instead in components):
```typescript
// From src/lib/shopify/index.ts - internal use only
getProduct(handle)                    // Fetch single product
getProducts(query, sort, reverse)     // Fetch products with filtering
getCollections()                      // Fetch all collections
getCart()                             // Fetch cart contents
addToCart(lines)                      // Add items to cart
removeFromCart(lineIds)               // Remove items
updateCart(lines)                     // Update quantities
getProductRecommendations(productId)  // Related products
```

**GraphQL Organization:**
- `src/lib/shopify/queries/` - GraphQL queries (product, cart, collection, menu, page)
- `src/lib/shopify/mutations/` - GraphQL mutations (cart operations)
- `src/lib/shopify/fragments/` - Reusable GraphQL fragments (product, cart, image, seo)

**Caching Strategy:**
```typescript
'use cache';
cacheTag(TAGS.products);  // Tags: products, collections, cart
cacheLife('days');
```

Uses Next.js 15's native caching with cache tags for targeted revalidation.

**Environment Variables Required:**
```
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-token-here
SHOPIFY_REVALIDATION_SECRET=your-secret
NEXT_PUBLIC_USE_SHOPIFY=true
```

**Development Workflow:**
1. **Local Development**: Set `NEXT_PUBLIC_USE_SHOPIFY=false` to use `src/data/products.ts`
2. **Shopify Testing**: Set `NEXT_PUBLIC_USE_SHOPIFY=true` with valid credentials
3. **Production**: Always use `NEXT_PUBLIC_USE_SHOPIFY=true`

**Fallback:** If Shopify env vars not configured, app automatically falls back to local data.

### State Management

**Cart State:** React Context API (`src/context/CartContext.tsx`)

```typescript
const {
  // Standard cart operations
  items, addItem, removeItem, updateQuantity, clearCart, total, itemCount,

  // Optimistic updates (React 19 useOptimistic)
  optimisticItems, isPending,

  // Undo functionality
  undoLastAction, canUndo
} = useCart();
```

**Features:**
- **Optimistic Updates**: Cart mutations update UI instantly via `useOptimistic` before actual state changes
- **Undo Support**: Last 5 actions can be undone with `undoLastAction()`
- **Shopify Sync**: When `NEXT_PUBLIC_USE_SHOPIFY=true`, cart changes sync to Shopify (fire-and-forget, local cart remains source of truth)
  - Cart sync handled via `src/lib/shopify-cart-adapter.ts` which maps local cart format to Shopify's merchandiseId format
  - Uses `variantId` if available, falls back to `productId`
- **Persistence**: Cart state persisted to `localStorage` under key `fern-fog-cart`

**Important:** Cart context is client-side only. Wrap usage in Client Components.

### Product Variants System

Products support multiple variants (colors, sizes, etc.) via the `variants` and `options` fields.

**Product Structure:**
```typescript
interface Product {
  // Basic fields
  id: string;
  name: string;
  price: number; // Base price

  // Variant support
  variants?: ProductVariant[]; // All available variants
  options?: ProductOption[];   // Option groups (Color, Size, etc.)
  priceRange?: { min: number; max: number }; // Price range across variants
}
```

**Variant Selection Component:**
```typescript
import VariantSelector from '@/components/product/VariantSelector';

// In product detail page
<VariantSelector
  variants={product.variants}
  options={product.options}
  selectedVariant={selectedVariant}
  onVariantChange={setSelectedVariant}
/>
```

**Utilities:**
- `src/lib/variant-utils.ts` - Helper functions for variant selection logic
- `src/components/product/VariantSelector.tsx` - Client component for variant UI

**Pattern:** When a product has variants, use the selected variant's price and availability. Fall back to base `product.price` if no variants.

### Product Filtering System

The products page supports filtering and sorting via URL search params and dedicated filter components.

**Filter Components:**
- `src/components/filters/FilterPanel.tsx` - Desktop filter sidebar
- `src/components/filters/MobileFilterDrawer.tsx` - Mobile filter drawer
- `src/components/filters/CheckboxFilter.tsx` - Category/tag checkboxes
- `src/components/filters/PriceRangeFilter.tsx` - Min/max price inputs
- `src/components/filters/SortDropdown.tsx` - Sort order selector

**URL Pattern:**
```
/products?category=earrings&sort=price&order=asc&minPrice=20&maxPrice=100
```

**Implementation Pattern:**
```typescript
'use client';
import { useSearchParams } from 'next/navigation';

const searchParams = useSearchParams();
const category = searchParams?.get('category');
const sortBy = searchParams?.get('sort');
```

**Note:** Filter state is managed via URL for shareability and back-button support.

### Path Aliases

TypeScript paths are configured for clean imports:

```typescript
import { useCart } from '@/context/CartContext';
import { getProducts } from '@/lib/shopify';
import Header from '@/components/layout/Header';
```

`@/*` maps to `./src/*`

## Styling & Theming

### Tailwind CSS v4

**Configuration:** `postcss.config.mjs` with `@tailwindcss/postcss` plugin.

**Theme Definition:** `src/app/globals.css` defines brand colors as CSS variables:

```css
--moss: #33593D;        /* Dark green */
--fern: #4F7942;        /* Medium green */
--parchment: #F5F0E6;   /* Off-white background */
--bark: #5B4636;        /* Brown text */
--mist: #E6ECE8;        /* Light gray */
--gold: #C5A05A;        /* Accent gold */
```

**Usage in Components:**
```jsx
<div className="bg-parchment text-bark">
  <h1 className="text-moss font-display">
```

**Typography:**
- `font-display` - Cormorant Garamond (headings)
- `font-sans` - Inter (body text)

Both loaded via `next/font/google` in `src/app/layout.tsx`.

**Custom Utilities:**
- `.ring-brand` - Custom focus ring
- `.parchment-texture` - Textured background
- `.leaf-divider` - Decorative divider
- `.skip-to-content` - Accessibility skip link

## TypeScript Patterns

**Strict Mode Enabled:** All code must satisfy TypeScript strict checks.

**Key Type Locations:**
- `src/data/products.ts` - Local `Product` interface
- `src/lib/shopify/types.ts` - Shopify API types
- `src/context/CartContext.tsx` - Cart-related types

**Type Guards:** `src/lib/type-guards.ts` contains utility functions like `isShopifyError()` for runtime type checking.

**Important Pattern - Shopify Data Reshaping:**

Shopify API responses are "reshaped" into internal types:
```typescript
// In src/lib/shopify/index.ts
const reshapeProduct = (product: ShopifyProduct): Product => { /* ... */ }
const reshapeCart = (cart: ShopifyCart): Cart => { /* ... */ }
```

Always use reshaped data in components, not raw Shopify responses.

## UI Component Library

**Headless UI:** Used for accessible, unstyled interactive components.

```typescript
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { ShoppingBagIcon, XMarkIcon } from '@heroicons/react/24/outline';
```

**Icons:** Heroicons (outline and solid variants)

**Pattern:** Build custom styled components around Headless UI primitives for accessibility.

## Common Development Patterns

### Adding a New Product Feature

1. Add GraphQL query/mutation in `src/lib/shopify/queries/` or `mutations/`
2. Add GraphQL fragment if needed in `src/lib/shopify/fragments/`
3. Add TypeScript types in `src/lib/shopify/types.ts`
4. Implement API function in `src/lib/shopify/index.ts` with reshape logic
5. Use in components via Server Component data fetching or Client Component hooks

### Adding a New Page

```bash
# Create new route
mkdir src/app/new-page
touch src/app/new-page/page.tsx
```

```typescript
// src/app/new-page/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Title | Fern & Fog Creations',
  description: 'Page description',
};

export default function NewPage() {
  return (
    <div className="bg-parchment min-h-screen">
      {/* Content */}
    </div>
  );
}
```

### Dynamic Routes with URL Search Params

```typescript
'use client';
import { useSearchParams } from 'next/navigation';

const searchParams = useSearchParams();
const category = searchParams?.get('category');

// Update URL without reload
<Link href={`/products?category=${slug}`}>
```

### Adding to Cart Pattern

```typescript
'use client';
import { useCart } from '@/context/CartContext';

const { addItem } = useCart();

const handleAddToCart = () => {
  addItem({
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.images[0],
    slug: product.slug,
  }, quantity);
};
```

### Metadata & SEO

All pages should export `metadata` for SEO:

```typescript
export const metadata: Metadata = {
  title: 'Page Title',
  description: 'Description for search engines',
  openGraph: {
    images: [{ url: '/og-image.jpg' }],
  },
};
```

For dynamic metadata:
```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const product = await getProduct(params.slug);
  return {
    title: product.title,
    description: product.description,
  };
}
```

## File Organization Best Practices

**Components:**
- Layout components → `src/components/layout/`
- Page-specific sections → `src/components/` (e.g., `HeroSection.tsx`, `CategorySection.tsx`)
- Reusable UI → `src/components/` (e.g., `Lightbox.tsx`)

**Data:**
- Static/fallback data → `src/data/`
- API integrations → `src/lib/shopify/`
- Utilities → `src/lib/utils.ts`
- Constants → `src/lib/constants.ts`

**Assets:**
- Product images → `public/stock-assets/products/`
- Category images → `public/stock-assets/categories/`
- Icons → `public/icons/`

## Testing & Quality

**Linting:** ESLint configured with Next.js recommended rules.

```bash
pnpm lint
```

**Type Checking:**
```bash
# TypeScript will check types during build
pnpm build
```

## Accessibility

This codebase prioritizes accessibility:

- Semantic HTML (`<nav>`, `<main>`, `<article>`)
- ARIA labels (`aria-label`, `aria-live`, `role`)
- Keyboard navigation support
- Focus management in modals
- Skip-to-content link

**Maintain these standards** when adding new features.

## Important Notes

- **No API routes**: Direct Shopify GraphQL integration via server functions, no `/app/api` routes
- **Image optimization**: Next.js Image component configured with remote patterns for:
  - `cdn.shopify.com/s/files/**` (Shopify CDN)
  - `via.placeholder.com` (Placeholders)
  - `tailwindcss.com/plus-assets/**` (TailwindUI assets)
  - Supports AVIF and WebP formats
- **Cart is client-only**: No server-side cart persistence; uses localStorage
- **Turbopack enabled**: Both `dev` and `build` use `--turbopack` flag
- **Next.js 15 features**: Uses `'use cache'` directive, `cacheTag()`, `cacheLife()` for caching, `useOptimistic` for cart updates
- **Suspense boundaries**: Use `<Suspense>` for loading states in async components
- **React 19**: This project uses React 19 features including `useOptimistic` hook

## Git Workflow

- Main branch: (not configured in repo yet)
- Current branch: `feat/shopify`
- Use conventional commit messages (e.g., `feat:`, `fix:`, `chore:`)

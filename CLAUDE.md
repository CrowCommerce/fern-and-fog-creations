# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Fern & Fog Creations is a Next.js 16 (canary) e-commerce application for handmade coastal crafts (sea glass earrings, pressed flower resin, driftwood décor). It uses the App Router, React Server Components, TypeScript, Tailwind CSS v4, and integrates with Shopify's GraphQL Storefront API.

**Package Manager:** pnpm (v10.19.0+)

**Key Technologies:**
- Next.js 16.0.1-canary.5 with Turbopack
- React 19.1.0 (uses `useOptimistic`, `use` hook)
- TypeScript 5 (strict mode)
- Tailwind CSS v4
- Headless UI 2.x for accessible components

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

## Known Issues & TODOs

### 🔧 Cart Drawer - Remove Loading Overlay During Quantity Updates

**Issue:** When users click the +/- buttons to adjust item quantities in the cart drawer, a loading overlay appears even though the cart updates optimistically. This creates a janky UX compared to 4mula-shop-tailwindui which updates instantly without any loading state.

**Current Behavior:**
- ShoppingCartDrawer.tsx (lines 78-87) shows a loading overlay when `isPending` is true
- The overlay appears during the `updateItemQuantity` server action
- Users see "Updating..." spinner even though the UI already updated optimistically

**Expected Behavior:**
- Quantity should update instantly (already working via `updateCartItem()` optimistic update)
- No loading overlay should appear since the change is already reflected
- Server action should happen silently in the background

**Files Involved:**
- `src/components/layout/ShoppingCartDrawer.tsx` (lines 78-87)
- `handleUpdateQuantity` function uses both `updateCartItem()` (optimistic) and `updateItemQuantity()` (server)

**Fix:**
Remove the loading overlay div or conditionally hide it for quantity updates while keeping it for remove actions. The optimistic update already provides instant feedback, so the loading state is redundant.

**Reference:** See 4mula-shop-tailwindui cart implementation for comparison of smooth, instant quantity updates.

---

## Architecture Overview

### Builder.io Visual CMS Integration

Fern & Fog Creations integrates Builder.io as a visual CMS for managing marketing pages, landing pages, and content pages while preserving all existing Shopify e-commerce functionality.

**Core Integration Files:**
- `src/lib/builder/config.ts` - Builder.io configuration and reserved paths
- `src/lib/builder/resolve-content.ts` - Server-side content fetching
- `src/components/builder/BuilderComponentClient.tsx` - Client wrapper for Builder.io components
- `src/components/builder/BuilderInit.tsx` - SDK initialization
- `src/components/builder/register-components.tsx` - Custom component registration
- `src/lib/builder/cart-adapter.ts` - Cart integration hooks for Builder.io components
- `app/[...page]/page.tsx` - Catch-all route for CMS-managed pages

**Catch-All Route with Path Exclusions:**

Builder.io manages pages via a catch-all route at `app/[...page]/page.tsx` that **excludes** the following reserved paths:
- `/products/*` - Product listing and collections (e-commerce)
- `/product/*` - Individual product pages (e-commerce)
- `/cart` - Shopping cart (e-commerce)
- `/checkout` - Shopify checkout (e-commerce)
- `/account/*` - User account pages
- `/api/*` - API routes
- `/_next/*` - Next.js internal routes

**Builder.io Pages Handle:**
- Marketing landing pages (e.g., `/about-us`, `/our-story`)
- Content pages (e.g., `/blog/*`, `/press`)
- Custom promotional pages
- Any path not reserved for e-commerce

**Environment Variables:**
```bash
BUILDER_PUBLIC_KEY=your-builder-public-key
NEXT_PUBLIC_BUILDER_PUBLIC_KEY=your-builder-public-key  # Same value for SSR + client
```

**Cart Integration:**

Builder.io components can access cart functionality via hooks in `src/lib/builder/cart-adapter.ts`:
```typescript
import { useBuilderCart, useCartState } from '@/lib/builder/cart-adapter';

// In a Builder.io component
const cart = useBuilderCart();
const { itemCount, totalAmount } = useCartState();
```

**Component Registration:**

Custom components are registered in `src/components/builder/register-components.tsx` to appear in Builder.io's visual editor. To add new components:
1. Create component wrapper with Builder.io-friendly props
2. Register with `Builder.registerComponent()`
3. Define input schema for visual editor controls
4. Add to custom insert menu

**Testing Builder.io Pages:**

1. Start dev server: `pnpm dev`
2. Create content in Builder.io dashboard at https://builder.io
3. Publish content
4. Access at your chosen URL path (e.g., `/test-page`)
5. Verify reserved paths still work (e.g., `/products`, `/cart`)

**Important Notes:**
- Builder.io initializes in `app/layout.tsx` via `<BuilderInit />`
- All Shopify e-commerce functionality remains unchanged
- Cart, product pages, checkout are NOT managed by Builder.io
- Custom components must preserve brand theming (moss, fern, parchment colors)

### App Router Structure

This project uses Next.js 16's App Router with the `app/` directory (not `src/app/`).

**Route Structure:**
- `/` - Homepage with hero, category sections, and featured products
- `/products` - Product listing (route group: `app/(store)/products/page.tsx`)
- `/products/[collection]` - Collection-specific product pages
- `/product/[handle]` - Individual product detail pages
- `/cart` - Shopping cart page
- `/checkout` - Checkout page (redirects to Shopify checkout)
- `/categories`, `/gallery`, `/contact`, `/about`, `/account` - Additional pages

**Route Groups:**
- `app/(store)/` - Route group for product browsing with shared filter layout
  - Contains `layout.tsx` that manages filter state across products/collections
  - Filters are synced via URL search params for shareability

**Server Actions:** Cart mutations in `src/components/cart/actions.ts`

### Server vs Client Components

**Default: Server Components** - Most pages and layouts are server components for optimal performance.

**Client Components** (marked with `'use client'`):
- `src/components/cart/cart-context.tsx` - Global cart state management
- `src/components/layout/Header.tsx` - Navigation with cart integration
- `src/components/layout/ShoppingCartDrawer.tsx` - Interactive cart drawer
- `app/(store)/layout.tsx` - Shared filter layout for products pages
- `app/(store)/products/ProductsClient.tsx` - Product filtering with useSearchParams
- Product detail pages - Image gallery interactions

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

Uses Next.js 16's native caching with cache tags for targeted revalidation. Next.js config enables:
- `experimental.cacheComponents: true` - Component-level caching
- `experimental.inlineCss: true` - Inline critical CSS
- `experimental.useCache: true` - Enable `'use cache'` directive

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

### State Management & Cart Architecture

**Cart State:** React Context API + Server Actions pattern

The cart uses a hybrid architecture combining Server Actions for mutations and React 19's `useOptimistic` for instant UI updates:

**Cart Context** (`src/components/cart/cart-context.tsx`):
```typescript
const { cart, updateCartItem, addCartItem } = useCart();

// Update cart item quantity
updateCartItem(merchandiseId, 'plus');   // Increment
updateCartItem(merchandiseId, 'minus');  // Decrement
updateCartItem(merchandiseId, 'delete'); // Remove

// Add item to cart
addCartItem(variant, product);
```

**Server Actions** (`src/components/cart/actions.ts`):
```typescript
'use server';
import { addItem, removeItem, updateItemQuantity, redirectToCheckout } from '@/components/cart/actions';

// These are called by form actions and useActionState
addItem(prevState, selectedVariantId);
removeItem(prevState, merchandiseId);
updateItemQuantity(prevState, { merchandiseId, quantity });
redirectToCheckout(); // Redirects to Shopify checkout
```

**Key Features:**
- **Optimistic Updates**: Cart UI updates instantly via React 19's `useOptimistic` hook before server mutations complete
- **Server-Side Persistence**: Cart stored in Shopify via Server Actions, tracked by `cartId` cookie
- **Type-Safe**: Uses `Cart` and `CartItem` types from `@/lib/shopify/types`
- **Revalidation**: Uses `revalidateTag(TAGS.cart)` to invalidate cache after mutations

**Important Patterns:**
1. Cart provider wraps app in `app/layout.tsx` with `cartPromise` from `getCart()`
2. Client components use `useCart()` hook to access cart state
3. Mutations trigger Server Actions which update Shopify and revalidate cache
4. Optimistic reducer in `cart-context.tsx` handles local state updates
5. React 19's `use` hook unwraps the `cartPromise` in the hook

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

**Variant UI Rendering:**
- **≤4 options**: Renders as button grid for quick visual selection
- **>4 options**: Renders as styled Headless UI `Listbox` dropdown (not native `<select>`)
- `src/components/product/VariantDropdown.tsx` - Styled dropdown using Headless UI
- Dropdown features: capitalized labels, out-of-stock indicators, checkmarks, keyboard navigation

**Utilities:**
- `src/lib/variant-utils.ts` - Helper functions for variant selection logic
- `src/components/product/VariantSelector.tsx` - Client component for variant UI
- `src/hooks/useVariantSelection.ts` - Hook for variant state management and URL syncing

**Pattern:** When a product has variants, use the selected variant's price and availability. Fall back to base `product.price` if no variants.

### Product Filtering System

The products page supports filtering and sorting via URL search params and dedicated filter components.

**Filter Components:**
- `src/components/filters/FilterPanel.tsx` - Desktop filter sidebar
- `src/components/filters/MobileFilterDrawer.tsx` - Mobile filter drawer
- `src/components/filters/CheckboxFilter.tsx` - Category/tag checkboxes
- `src/components/filters/PriceRangeFilter.tsx` - Min/max price inputs
- `src/components/filters/SortDropdown.tsx` - Sort order selector

**Filter Architecture:**
- The `app/(store)/layout.tsx` manages filter state across all product pages
- Filters are synced to URL search params for shareability and back-button support
- `ProductsClient.tsx` receives filter props from the layout

**URL Pattern:**
```
/products?category=earrings&sort=price-asc&minPrice=20&maxPrice=100
/products/[collection]?sort=newest&material=sea-glass
```

**Implementation Pattern:**
```typescript
'use client';
import { useSearchParams, useRouter } from 'next/navigation';

// In app/(store)/layout.tsx - manages state for all product pages
const searchParams = useSearchParams();
const [activeFilters, setActiveFilters] = useState<ActiveFilters>(() => {
  // Parse from URL on mount
});

const handleFilterChange = (newFilters: ActiveFilters) => {
  setActiveFilters(newFilters);
  // Update URL with new params
};
```

### Product Detail State Management

Product detail pages use a dedicated context for managing variant selection and image gallery state via URL params.

**Product Context** (`src/components/product/product-context.tsx`):
```typescript
'use client';
import { useProduct, useUpdateURL, ProductProvider } from '@/components/product/product-context';

// Wrap product detail page with ProductProvider
<ProductProvider>
  <ProductDetailContent />
</ProductProvider>

// In child components:
const { state, updateOption, updateImage } = useProduct();
const updateURL = useUpdateURL();

// Update variant option and sync to URL
const newState = updateOption('Color', 'Blue');
updateURL(newState); // Updates URL to ?Color=Blue

// Update active image and sync to URL
const newState = updateImage('2');
updateURL(newState); // Updates URL to ?image=2
```

**Key Features:**
- Variant selection synced to URL search params (e.g., `?Color=Blue&Size=Large`)
- Image gallery state in URL for shareability
- React 19's `useOptimistic` for instant UI updates before URL navigation

### Path Aliases

TypeScript paths are configured for clean imports:

```typescript
import { useCart } from '@/components/cart/cart-context';
import { getProducts } from '@/lib/shopify';
import Header from '@/components/layout/Header';
```

**Important:** `@/*` maps to `./src/*` (configured in `tsconfig.json`)
- App routes are in `app/` (no src prefix)
- Everything else (components, lib, types, data) is in `src/`

## Styling & Theming

### Tailwind CSS v4

**Configuration:** `postcss.config.mjs` with `@tailwindcss/postcss` plugin.

**Theme Definition:** `app/globals.css` defines brand colors as CSS variables:

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

Both loaded via `next/font/google` in `app/layout.tsx`.

**Custom Utilities:**
- `.ring-brand` - Custom focus ring
- `.parchment-texture` - Textured background
- `.leaf-divider` - Decorative divider
- `.skip-to-content` - Accessibility skip link

## TypeScript Patterns

**Strict Mode Enabled:** All code must satisfy TypeScript strict checks.

**Key Type Locations:**
- `src/types/product.ts` - Product type definitions
- `src/types/filter.ts` - Filter and sort type definitions
- `src/types/index.ts` - Consolidated type exports
- `src/lib/shopify/types.ts` - Shopify API types
- `src/components/cart/cart-context.tsx` - Cart-related types

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

**Headless UI:** Used for accessible, unstyled interactive components (v2.x).

**Common Components:**
```typescript
// Dialogs/Modals
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';

// Dropdowns/Select
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';

// Icons
import { ShoppingBagIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
```

**Dropdown Pattern (Listbox):**
- Use `Listbox` for custom-styled dropdowns, never native `<select>` elements
- Examples: `SortDropdown.tsx`, `VariantDropdown.tsx`
- Features: Full style control, render props with state, built-in accessibility
- Auto-positioning with `anchor="bottom start"` prop on `ListboxOptions`

**Styling Pattern:**
- Use `classNames()` utility from `@/lib/utils` for conditional classes
- Render props provide state: `{({ active, selected, open }) => ...}`
- Apply brand theme colors (parchment, bark, fern, mist, moss, gold)

**Icons:** Heroicons (outline for large/decorative, solid 20px for UI controls)

## Common Development Patterns

### Adding a New Product Feature

1. Add GraphQL query/mutation in `src/lib/shopify/queries/` or `mutations/`
2. Add GraphQL fragment if needed in `src/lib/shopify/fragments/`
3. Add TypeScript types in `src/lib/shopify/types.ts`
4. Implement API function in `src/lib/shopify/index.ts` with reshape logic
5. Use in components via Server Component data fetching or Client Component hooks

### Adding a New Page

```bash
# Create new route in app/ directory
mkdir app/new-page
touch app/new-page/page.tsx
```

```typescript
// app/new-page/page.tsx
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

**Note:** For product-related pages that need filters, place them inside `app/(store)/` route group.

### Dynamic Routes with URL Search Params

```typescript
'use client';
import { useSearchParams } from 'next/navigation';

const searchParams = useSearchParams();
const category = searchParams?.get('category');

// Update URL without reload
<Link href={`/products/${slug}`}>  // Use route-based navigation, not query params
```

### Dynamic Route Params (Next.js 15+ Async Pattern)

**Critical:** In Next.js 15+, `params` in dynamic routes is now a Promise that must be awaited:

```typescript
// ❌ WRONG - Next.js 14 pattern (will error)
export default async function Page({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug)
}

// ✅ CORRECT - Next.js 15+ pattern
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProduct(slug)
}
```

**This applies to:**
- Page components: `app/product/[handle]/page.tsx`
- `generateMetadata` functions
- All dynamic route parameters (`[slug]`, `[id]`, `[handle]`, etc.)

### Adding to Cart Pattern

```typescript
'use client';
import { useCart } from '@/components/cart/cart-context';
import { addItem } from '@/components/cart/actions';
import { useActionState } from 'react';

const { cart, addCartItem } = useCart();

// Client-side optimistic update
const handleAddToCart = () => {
  addCartItem(selectedVariant, product);
};

// Server Action via form (recommended)
const [message, formAction] = useActionState(addItem, null);

<form action={formAction}>
  <input type="hidden" name="variantId" value={selectedVariant.id} />
  <button type="submit">Add to Cart</button>
</form>
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
- Utilities → `src/lib/utils.ts` (contains shared utilities like `classNames()`, `createUrl()`, etc.)
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

- **App directory location**: All routes are in `app/` (not `src/app/`)
- **Server Actions for cart**: Cart mutations use Server Actions (`src/components/cart/actions.ts`), not API routes
- **Route groups**: Product pages use `app/(store)/` route group for shared filter layout
- **Image optimization**: Next.js Image component configured with remote patterns for:
  - `cdn.shopify.com/s/files/**` (Shopify CDN)
  - `via.placeholder.com` (Placeholders)
  - `tailwindcss.com/plus-assets/**` (TailwindUI assets)
  - Supports AVIF and WebP formats
- **Cart persistence**: Cart stored server-side in Shopify, tracked by `cartId` cookie
- **Turbopack enabled**: Both `dev` and `build` use `--turbopack` flag
- **Next.js 16 canary features**:
  - `'use cache'` directive with `cacheTag()` and `cacheLife()` for granular caching
  - `experimental.cacheComponents` for component-level caching
  - `experimental.inlineCss` for critical CSS inlining
- **React 19 features**:
  - `useOptimistic` hook for optimistic UI updates
  - `use` hook for unwrapping promises in components
  - `useActionState` for Server Action form handling
- **Suspense boundaries**: Use `<Suspense>` for loading states in async Server Components

## Git Workflow

- Main branch: `main`
- Use conventional commit messages (e.g., `feat:`, `fix:`, `chore:`)

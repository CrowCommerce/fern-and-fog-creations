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

## Architecture Overview

### Builder.io Visual CMS Integration ✨

Fern & Fog Creations uses Builder.io as a visual CMS for marketing pages, landing pages, and content pages while preserving all Shopify e-commerce functionality.

**Core Integration Files:**
- `src/lib/builder/config.ts` - Configuration and reserved path protection
- `src/lib/builder/resolve-content.ts` - Server-side content fetching
- `src/components/builder/BuilderComponentClient.tsx` - Client component wrapper
- `src/components/builder/BuilderInit.tsx` - SDK initialization
- `src/components/builder/register-components.tsx` - Custom component registration
- `src/lib/builder/cart-adapter.ts` - Cart integration hooks
- `app/[...page]/page.tsx` - Catch-all route for CMS pages

**Custom Fern & Fog Components:**

The following branded components are available in Builder.io's visual editor:

1. **HeroBlock** - Full-width hero with background image, heading, description, and dual CTAs
   - Configurable: background image, heading, description, button labels/links
   - Location: `src/components/builder/blocks/HeroBlock.tsx`

2. **CategoryGridBlock** - 4-column responsive category grid
   - Configurable: heading, categories (name, image, description, slug), view all link
   - Location: `src/components/builder/blocks/CategoryGridBlock.tsx`

3. **FeatureGridBlock** - 3-column feature grid with emoji icons
   - Configurable: heading, features (name, description, emoji icon), background color
   - Location: `src/components/builder/blocks/FeatureGridBlock.tsx`

4. **TextBlock** - Flexible rich text content block
   - Configurable: heading, rich text content, alignment, background, max width
   - Location: `src/components/builder/blocks/TextBlock.tsx`

5. **CTABlock** - Call-to-action section with buttons
   - Configurable: heading, description, buttons (labels/links), background color
   - Location: `src/components/builder/blocks/CTABlock.tsx`

**Route Protection:**

Builder.io's catch-all route (`app/[...page]/page.tsx`) **excludes** these reserved paths:
- `/products/*` - Product listing/collections
- `/product/*` - Product detail pages
- `/cart` - Shopping cart
- `/api/*` - API routes
- `/_next/*` - Next.js internals

**Builder.io Pages Handle:**
- Marketing landing pages (`/about-us`, `/our-story`)
- Blog posts (`/blog/*`)
- Promotional pages
- Any non-reserved path

**Environment Variables:**
```bash
BUILDER_PUBLIC_KEY=your-api-key
NEXT_PUBLIC_BUILDER_PUBLIC_KEY=your-api-key  # Same value
```

**Cart Integration:**

Builder.io components can access cart functionality:
```typescript
import { useBuilderCart, useCartState } from '@/lib/builder/cart-adapter';

const cart = useBuilderCart();
const { itemCount, totalAmount, isEmpty } = useCartState();
```

**Creating Pages in Builder.io:**

1. Go to https://builder.io/content
2. Create new "page" entry
3. Set URL path (e.g., `/about-us`, `/blog/post-title`, `/landing/summer-sale`)
4. Drag Fern & Fog components from the left sidebar
5. Configure component inputs in the right panel
6. Publish when ready
7. Visit your URL to see the live page

**Catch-All Route:**
The app includes a catch-all route (`app/[...page]/page.tsx`) that enables creating arbitrary pages in Builder.io:
- Homepage (`/`) - Builder.io content with fallback
- Any custom path (e.g., `/about-us`, `/blog/*`, `/landing/*`)
- Protected routes (products, cart, checkout) are NOT handled by Builder.io

```typescript
// app/[...page]/page.tsx
// Automatically fetches Builder.io content for any non-reserved path
const builderContent = await resolveBuilderContent('page', {
  userAttributes: { urlPath: `/${pageSegments.join('/')}` },
});
```

**Reserved Paths (Protected from Builder.io):**
- `/products` - Product listing
- `/product/*` - Product details
- `/cart` - Shopping cart
- `/checkout` - Checkout
- `/account` - User accounts
- `/api/*` - API routes
- `/_next/*` - Next.js internals

**Important Notes:**
- All custom components maintain coastal/woodland theming
- Components use brand colors: moss, fern, parchment, bark, mist, gold
- Shopify e-commerce routes are completely protected
- Cart, products, checkout are NOT managed by Builder.io
- Create unlimited marketing pages, landing pages, blog posts via Builder.io

### Contact Form (Jotform Integration) ✅

The contact form uses **Jotform** - a no-code form builder with built-in spam protection and email notifications.

**Why Jotform:**
- Free tier: 100 submissions/month with CAPTCHA included
- No custom email service setup required (Jotform handles email delivery)
- Business owners can manage forms without code via Jotform dashboard
- Built-in spam protection (reCAPTCHA)
- 24/7 support on all plans

**Implementation:**
```typescript
// app/contact/page.tsx
import dynamic from 'next/dynamic'

const JotformEmbed = dynamic(() => import('react-jotform-embed'), {
  ssr: false,
  loading: () => <div>Loading form...</div>
})

// Embed Jotform via React component
<JotformEmbed src={`https://form.jotform.com/${formId}`} />
```

**Configuration:**
```bash
# Environment variable required
NEXT_PUBLIC_JOTFORM_FORM_ID=your-form-id
```

**Setup Steps:**
1. Create account at https://www.jotform.com/
2. Create contact form (use template or build from scratch)
3. Get form ID from URL (e.g., `jotform.com/241234567890` → `241234567890`)
4. Add to environment variables
5. Form auto-loads on `/contact` page

**Managing Submissions:**
- Business owners log into Jotform dashboard
- View all submissions in real-time
- Export to CSV/Excel
- Email notifications sent automatically
- No code changes needed to manage form

**See GO_LIVE.md for complete Jotform setup tutorial**

### Error Monitoring (Sentry Integration) ✅

Production error tracking via **Sentry** - automatically captures and reports errors.

**Implementation Files:**
- `instrumentation.ts` - Server-side error tracking
- `lib/sentry-client.ts` - Client-side error tracking
- `app/error.tsx` - Error boundary with Sentry integration

**Server-Side Tracking:**
```typescript
// instrumentation.ts
export async function register() {
  const Sentry = await import('@sentry/nextjs');
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 0.1,
    environment: process.env.NODE_ENV,
  });
}
```

**Error Boundary Integration:**
```typescript
// app/error.tsx
import * as Sentry from '@sentry/nextjs';

useEffect(() => {
  Sentry.captureException(error, {
    tags: { errorBoundary: 'root' },
  });
}, [error]);
```

**Configuration:**
```bash
# Environment variables (optional - gracefully disabled if not set)
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
SENTRY_AUTH_TOKEN=your-auth-token
```

**Features:**
- Automatic error capture on client and server
- Source maps support
- Stack trace with code context
- Error replay (session recording)
- Email alerts on new errors
- Free tier: 5,000 errors/month

**If not configured:** Falls back to console.error - site works normally without Sentry

### Rate Limiting (Upstash Redis) ✅

Flexible rate limiting utility for API routes and server actions.

**Implementation:**
```typescript
// lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit';

// Pre-configured limiters
export const apiRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '10 s'), // 10 req/10s
});

export const contactFormRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '10 m'), // 5 req/10m
});
```

**Usage in API Routes:**
```typescript
// app/api/example/route.ts
import { rateLimit, createRateLimitHeaders } from '@/lib/rate-limit';

export async function POST(request: Request) {
  const rateLimitResult = await rateLimit(request);

  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too Many Requests' },
      {
        status: 429,
        headers: createRateLimitHeaders(rateLimitResult)
      }
    );
  }

  // Handle request...
}
```

**Configuration:**
```bash
# Optional - gracefully disabled if not configured
UPSTASH_REDIS_REST_URL=your-upstash-url
UPSTASH_REDIS_REST_TOKEN=your-upstash-token
```

**Current Usage:**
- Contact form uses Jotform's built-in CAPTCHA (no rate limiting needed)
- Rate limiting utility ready for future API routes
- Example implementation in `app/api/example-rate-limited/route.ts`

**If not configured:** Rate limiting is bypassed - requests allowed through without limits

### Image Optimization ✅

All hero images use Next.js Image component for automatic optimization.

**Implementation:**
```typescript
// components/builder/blocks/HeroBlock.tsx
import Image from 'next/image'

<Image
  src={backgroundImage}
  fill
  priority
  sizes="100vw"
  className="object-cover object-center"
  quality={90}
/>
```

**Benefits:**
- Automatic WebP/AVIF conversion
- Lazy loading (except priority images)
- Responsive image sizes
- Blur placeholder (if configured)
- CDN delivery via Vercel

**Configured Remote Patterns:**
```javascript
// next.config.ts
images: {
  formats: ['image/avif', 'image/webp'],
  remotePatterns: [
    { hostname: 'cdn.shopify.com' },      // Shopify product images
    { hostname: 'via.placeholder.com' },   // Placeholders
    { hostname: 'tailwindcss.com' },       // TailwindUI assets
  ],
}
```

**Components Using Optimized Images:**
- `HeroBlock` - Builder.io hero component
- `HeroSection` - Hardcoded fallback hero
- Product images (via Shopify) - Automatically optimized

### App Router Structure

This project uses Next.js 16's App Router with the `app/` directory (not `src/app/`).

**Route Structure:**
- `/` - Homepage with hero, category sections, and featured products
- `/products` - Product listing (route group: `app/(store)/products/page.tsx`)
- `/products/[collection]` - Collection-specific product pages
- `/product/[handle]` - Individual product detail pages
- `/cart` - Shopping cart page (redirects to Shopify checkout on checkout button click)
- `/gallery`, `/contact`, `/about` - Marketing content pages

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
- Category images → `public/stock-assets/categories/` (used in product collection pages)
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

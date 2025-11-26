# CLAUDE.md

## Project Overview

Fern & Fog Creations is a Next.js 16 (canary) e-commerce app for handmade coastal crafts. Uses App Router, React Server Components, TypeScript, Tailwind CSS v4, and Shopify GraphQL Storefront API.

**Tech Stack:** Next.js 16.0.1-canary.5, React 19.1.0, TypeScript 5 (strict), Tailwind v4, Headless UI 2.x
**Package Manager:** pnpm (v10.19.0+)

## Commands

```bash
pnpm dev      # Development server (Turbopack) on localhost:3000
pnpm build    # Production build
pnpm lint     # ESLint
```

## Architecture

### Data Source (Dual-Mode)

Toggle via `NEXT_PUBLIC_USE_SHOPIFY=true|false`:
- **true**: Fetches from Shopify GraphQL API
- **false**: Uses local data from `src/data/products.ts`

Always import from `@/lib/data-source` (not directly from `@/lib/shopify`):
```typescript
import { getProduct, getProducts, getRelatedProducts } from '@/lib/data-source';
```

### Shopify CMS Strategy

All content managed via Shopify metaobjects (single source of truth):
- Products & collections (Shopify native)
- Navigation menus, page SEO metadata
- Gallery items, homepage hero, about page, contact page

Metaobject queries use `'use cache'` with `cacheTag()` and `cacheLife('days')`. Webhooks at `/api/revalidate` handle cache invalidation.

### Directory Structure

```
app/                          # Routes (NOT src/app/)
  (store)/                    # Route group for products with shared filter layout
  product/[handle]/           # Product detail pages
  api/revalidate/             # Shopify webhooks
src/
  components/
    cart/                     # Cart context, actions, UI
    filters/                  # Filter components
    layout/                   # Header, Footer, etc.
    product/                  # Product detail components
  lib/
    shopify/                  # GraphQL queries, mutations, fragments
    data-source.ts            # Unified data layer
    utils.ts                  # Shared utilities (classNames, createUrl, etc.)
  types/                      # TypeScript definitions
  data/                       # Local fallback data
```

**Path alias:** `@/*` maps to `./src/*`

### Server vs Client Components

Default to Server Components. Use `'use client'` only for:
- React hooks (useState, useEffect, useContext)
- Event handlers
- Browser APIs

Key client components: `cart-context.tsx`, `Header.tsx`, `ShoppingCartDrawer.tsx`, `app/(store)/layout.tsx`

### Cart Architecture

Hybrid pattern: React Context + Server Actions + `useOptimistic`

```typescript
// Client: optimistic updates
const { cart, addCartItem, updateCartItem } = useCart();

// Server Actions in src/components/cart/actions.ts
addItem, removeItem, updateItemQuantity, redirectToCheckout
```

Cart persisted in Shopify, tracked by `cartId` cookie.

### Dynamic Route Params (Next.js 15+)

**Critical:** `params` is now a Promise:
```typescript
// Correct pattern
export default async function Page({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
}
```

### Caching

```typescript
'use cache';
cacheTag(TAGS.products);  // Tags: products, collections, cart, gallery, metadata, homepage, aboutPage, contactPage
cacheLife('days');
```

## Styling

**Tailwind v4** with CSS variables in `app/globals.css`:
- `--moss` (#33593D), `--fern` (#4F7942), `--parchment` (#F5F0E6)
- `--bark` (#5B4636), `--mist` (#E6ECE8), `--gold` (#C5A05A)

**Fonts:** `font-display` (Cormorant Garamond), `font-sans` (Inter)

**Icons:** Heroicons (`@heroicons/react/24/outline`, `@heroicons/react/20/solid`)

## Environment Variables

```bash
# Required for Shopify mode
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-token
SHOPIFY_REVALIDATION_SECRET=your-secret
NEXT_PUBLIC_USE_SHOPIFY=true

# Admin API (for migrations only)
SHOPIFY_ADMIN_ACCESS_TOKEN=your-admin-token

# Optional integrations
NEXT_PUBLIC_JOTFORM_FORM_ID=your-form-id
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
UPSTASH_REDIS_REST_URL=your-url
UPSTASH_REDIS_REST_TOKEN=your-token
```

**For complete setup instructions:** See [docs/SHOPIFY_SETUP.md](docs/SHOPIFY_SETUP.md)

## Key Patterns

### Product Types
```typescript
interface Product {
  id: string; slug: string; name: string; price: number;
  category: string;  // From Shopify collection handle
  images: string[]; materials: string[]; description: string;
  forSale: boolean; featured?: boolean;
  variants?: ProductVariant[]; options?: ProductOption[];
  priceRange?: { min: number; max: number };
}
```

### Filter URL Pattern
```
/products?category=earrings&sort=price-asc&minPrice=20&maxPrice=100
```

Categories dynamically generated from Shopify collections.

### Dropdowns
Use Headless UI `Listbox`, never native `<select>`. See `SortDropdown.tsx`, `VariantDropdown.tsx`.

### Shopify Data Reshaping
Raw Shopify responses are reshaped in `lib/shopify/index.ts`:
```typescript
const reshapeProduct = (product: ShopifyProduct): Product => { ... }
```

## Migration Scripts

```bash
pnpm migrate:products      # Migrate products to Shopify
pnpm setup:homepage        # Create homepage_hero metaobject
pnpm setup:about           # Create about page metaobjects
pnpm setup:contact         # Create contact_page metaobject

# Add :dry suffix for preview mode
```

## Important Notes

- Routes in `app/` (not `src/app/`)
- Cart uses Server Actions, not API routes
- Products use `app/(store)/` route group for shared filter layout
- Image optimization: AVIF/WebP, remote patterns for cdn.shopify.com
- Turbopack enabled for dev and build
- React 19: `useOptimistic`, `use` hook, `useActionState`

## Git Workflow

Commit and push after completing tasks. Use conventional commits format.

```bash
# Undo last commit, keep changes
git reset --soft HEAD~1

# Revert specific commit (safe)
git revert <commit-hash>
```

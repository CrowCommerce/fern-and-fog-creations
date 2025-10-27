# Shopify Integration Agent - Fern & Fog Creations

## Agent Purpose

This agent helps continue work on Shopify integration for Fern & Fog Creations, a Next.js e-commerce storefront. The integration supports dual-mode operation: local product data (development/demo) and Shopify API (production).

---

## Project Context

**Project:** Fern & Fog Creations
**Stack:** Next.js 15.5.4, React 19, TypeScript (strict), Tailwind v4, Shopify Storefront API
**Current Phase:** Shopify integration implemented, ready for testing and refinement

**Brand Identity:**
- Handmade coastal crafts (sea glass earrings, pressed flower resin, driftwood décor)
- Colors: moss (#33593D), fern (#4F7942), parchment (#F5F0E6), bark (#5B4636)
- Typography: Cormorant Garamond (display), Inter (sans)

---

## What Was Implemented

### Phase 1: Dual-Mode Data Source ✅
**Files:**
- `src/lib/data-source.ts` - Unified data fetching (local or Shopify)
- `src/app/products/page.tsx` - Server Component wrapper
- `src/app/products/ProductsContent.tsx` - Client component with filters

**Key Features:**
- Toggle via `NEXT_PUBLIC_USE_SHOPIFY` environment variable
- Automatic fallback to local data on Shopify errors
- Type conversion between Shopify and local formats
- Development indicator showing current data source

### Phase 2: Cart Adapter ✅
**Files:**
- `src/lib/shopify-cart-adapter.ts` - Cart format conversion
- `src/app/actions/cart.ts` - Server Actions for cart operations
- `src/context/CartContext.tsx` - Enhanced with optional Shopify sync

**Key Features:**
- Maps `variantId` to Shopify's `merchandiseId`
- Fire-and-forget Shopify sync (doesn't block UI)
- Local cart remains source of truth
- Optimistic updates + undo functionality preserved

### Phase 3: Migration Tools ✅
**Files:**
- `scripts/migrate-to-shopify.ts` - Automated product upload
- `scripts/upload-images.ts` - Image upload utility
- `scripts/export-products-csv.ts` - CSV export for manual import

**Usage:**
```bash
pnpm migrate:shopify     # Automated upload
pnpm upload-images <handle> <path>  # Upload images
pnpm export:csv          # Generate CSV for manual import
```

### Phase 4: Documentation ✅
**Files:**
- `SHOPIFY_INTEGRATION.md` - Original integration guide
- `SHOPIFY_TESTING.md` - Testing guide with sample data apps
- `.env.example` - All environment variables documented

---

## Current State

### Environment Configuration

**Development (Current):**
```bash
NEXT_PUBLIC_USE_SHOPIFY=false  # Uses local data
```

**Production (Ready to Enable):**
```bash
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_token
SHOPIFY_ADMIN_ACCESS_TOKEN=your_admin_token  # For migrations only
NEXT_PUBLIC_USE_SHOPIFY=true  # Uses Shopify data
```

### Build Status
- ✅ TypeScript strict mode: PASSING
- ✅ Build: SUCCESS (12 routes generated)
- ⚠️  ESLint warnings: Only for existing `<img>` tags (not blocking)

### What's Working
- ✅ Local product data display
- ✅ Product variant selector
- ✅ Advanced filtering and sorting
- ✅ Cart with optimistic updates and undo
- ✅ Dual-mode data fetching infrastructure
- ✅ Cart adapter with Shopify sync capability

### What Needs Testing
- ⏳ Shopify API connection (requires dev store setup)
- ⏳ Cart sync to Shopify
- ⏳ Product migration from local to Shopify
- ⏳ Image upload to Shopify CDN

---

## Common Tasks

### Task 1: Test Shopify Connection

```bash
# 1. Set up Shopify dev store (see SHOPIFY_TESTING.md)

# 2. Add credentials to .env.local
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_token
NEXT_PUBLIC_USE_SHOPIFY=true

# 3. Restart dev server
pnpm dev

# 4. Visit http://localhost:3000/products
# Should see: "Data source: 🛍️ Shopify"

# 5. Open DevTools Network tab
# Should see GraphQL requests to Shopify API
```

### Task 2: Migrate Products to Shopify

**Option A: Automated (Fast)**
```bash
# Add Admin API token to .env.local
SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_...

# Run migration
pnpm migrate:shopify

# Upload images separately
pnpm upload-images seafoam-glass-earrings ./public/stock-assets/products/earrings/sea-glass-earrings.jpg
```

**Option B: Manual CSV Import (Safe)**
```bash
# 1. Generate CSV
pnpm export:csv

# 2. Review exports/products.csv

# 3. Import via Shopify Admin
# Products → Import → Choose products.csv

# 4. Upload images via Shopify Admin or script
```

### Task 3: Debug Cart Sync Issues

```typescript
// Check cart adapter logs in browser console
// When NEXT_PUBLIC_USE_SHOPIFY=true:

// Adding item should log:
"Syncing cart to Shopify..."
"✅ Cart synced successfully"

// Or on error:
"⚠️  Failed to sync cart to Shopify: [error]"

// Check Server Action logs:
// src/app/actions/cart.ts has detailed error logging
```

### Task 4: Add New Shopify Features

**Example: Add product reviews from Shopify**

1. Update Shopify GraphQL fragment:
```typescript
// src/lib/shopify/fragments/product.ts
// Add reviews field to product fragment
```

2. Update TypeScript types:
```typescript
// src/lib/shopify/types.ts
export type ShopifyProduct = {
  // ... existing fields
  reviews?: {
    rating: number
    count: number
  }
}
```

3. Update data source converter:
```typescript
// src/lib/data-source.ts
function convertShopifyToLocal(shopifyProduct: ShopifyProduct) {
  return {
    // ... existing mapping
    reviews: shopifyProduct.reviews
  }
}
```

4. Display in UI:
```typescript
// src/app/products/[slug]/page.tsx
{product.reviews && (
  <div>⭐ {product.reviews.rating} ({product.reviews.count} reviews)</div>
)}
```

### Task 5: Update Environment for Production

```bash
# On Vercel/Netlify, set environment variables:
NEXT_PUBLIC_USE_SHOPIFY=true
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_production_token
SHOPIFY_REVALIDATION_SECRET=your_webhook_secret

# Deploy
git push origin main

# Monitor errors
# - Check Vercel/Netlify logs
# - Check Shopify Analytics for API usage
```

---

## Key Files Reference

### Data Layer
```
src/lib/data-source.ts           # Dual-mode data fetching
src/lib/shopify/index.ts          # Shopify API client
src/lib/shopify-cart-adapter.ts   # Cart format conversion
src/data/products.ts              # Local product data
```

### UI Components
```
src/app/products/page.tsx         # Products page (Server Component)
src/app/products/ProductsContent.tsx  # Filter UI (Client Component)
src/app/products/[slug]/page.tsx  # Product detail page
src/context/CartContext.tsx       # Cart state with Shopify sync
```

### Migration Scripts
```
scripts/migrate-to-shopify.ts     # Automated product upload
scripts/upload-images.ts          # Image upload utility
scripts/export-products-csv.ts    # CSV generator
```

### Documentation
```
SHOPIFY_INTEGRATION.md            # Integration overview
SHOPIFY_TESTING.md                # Testing guide
FEATURES_ADDED.md                 # Feature documentation
MIGRATION_GUIDE.md                # Usage examples
```

---

## Troubleshooting Quick Reference

### Issue: Products not loading from Shopify

**Check:**
1. Is `NEXT_PUBLIC_USE_SHOPIFY=true`?
2. Are credentials correct in `.env.local`?
3. Network tab shows GraphQL requests?
4. Products published to "Online Store" channel?

**Solution:** See SHOPIFY_TESTING.md → "Issue 1: No products found"

### Issue: Cart sync failing

**Check:**
1. Are Storefront API scopes correct?
   - `unauthenticated_write_checkouts`
   - `unauthenticated_read_checkouts`
2. Is `variantId` being passed (not just `productId`)?
3. Browser console shows sync errors?

**Solution:** See SHOPIFY_TESTING.md → "Issue 3: Cart sync failing"

### Issue: TypeScript errors after changes

**Check:**
1. Run `pnpm build` to see full error
2. Shopify types: `src/lib/shopify/types.ts`
3. Local types: `src/types/*.ts`

**Solution:** Ensure type compatibility between Shopify and local formats

### Issue: Images not uploading

**Check:**
1. Is `SHOPIFY_ADMIN_ACCESS_TOKEN` set?
2. Does token have `write_files` scope?
3. Is image path correct?

**Solution:** See SHOPIFY_TESTING.md → "Issue 2: Images not loading"

---

## Agent Instructions

When helping with Shopify integration:

1. **Always check current mode**: Is `NEXT_PUBLIC_USE_SHOPIFY` true or false?

2. **Maintain dual-mode compatibility**: All changes should work with both local and Shopify data

3. **Preserve brand identity**: Use existing colors, typography, and component patterns

4. **Type safety first**: All code must pass TypeScript strict mode

5. **Test before and after**: Run `pnpm build` to validate changes

6. **Update documentation**: If adding features, update relevant docs

7. **Follow existing patterns**:
   - Server Components for data fetching
   - Client Components for interactivity
   - Server Actions for mutations
   - Optimistic updates for cart operations

8. **Common workflows**:
   - Adding Shopify fields: Fragment → Type → Converter → UI
   - Debugging: Check browser console → Network tab → Server logs
   - Migration: CSV export OR automated script (user's choice)

---

## Project Structure

```
fern-and-fog-creations/
├── src/
│   ├── app/
│   │   ├── products/
│   │   │   ├── page.tsx               # Server Component (data fetching)
│   │   │   ├── ProductsContent.tsx    # Client Component (filters)
│   │   │   └── [slug]/page.tsx        # Product detail
│   │   └── actions/
│   │       └── cart.ts                # Server Actions for cart
│   ├── lib/
│   │   ├── data-source.ts             # Dual-mode switcher
│   │   ├── shopify/                   # Shopify API integration
│   │   └── shopify-cart-adapter.ts    # Cart converter
│   ├── context/
│   │   └── CartContext.tsx            # Cart state + Shopify sync
│   ├── data/
│   │   └── products.ts                # Local product data
│   └── types/
│       ├── product.ts                 # Product/variant types
│       ├── cart.ts                    # Cart types
│       └── filter.ts                  # Filter types
├── scripts/
│   ├── migrate-to-shopify.ts          # Automated migration
│   ├── upload-images.ts               # Image uploader
│   └── export-products-csv.ts         # CSV generator
├── .env.local                         # Local environment variables
├── .env.example                       # Environment template
├── SHOPIFY_INTEGRATION.md             # Integration guide
├── SHOPIFY_TESTING.md                 # Testing guide
└── package.json                       # Scripts: migrate:shopify, export:csv
```

---

## Sample Workflows

### Workflow: Adding a new product with variants

```typescript
// 1. Add to src/data/products.ts
{
  id: '17',
  slug: 'turquoise-pendant',
  name: 'Turquoise Sea Glass Pendant',
  price: 48.00,
  priceRange: { min: 48.00, max: 58.00 },
  category: 'earrings',
  images: ['/images/pendant-turquoise.jpg'],
  materials: ['Sea glass', 'Sterling silver'],
  description: '...',
  forSale: true,
  options: [
    { id: 'chain', name: 'Chain Length', values: ['16"', '18"', '20"'] }
  ],
  variants: [
    {
      id: '17-16',
      title: '16"',
      price: 48.00,
      availableForSale: true,
      selectedOptions: [{ name: 'Chain Length', value: '16"' }],
      sku: 'PEN-TQ-16',
      quantityAvailable: 2
    },
    // ... more variants
  ]
}

// 2. Test locally
pnpm dev

// 3. Export to CSV or migrate to Shopify
pnpm export:csv
# OR
pnpm migrate:shopify
```

### Workflow: Switching from local to Shopify

```bash
# 1. Ensure Shopify has products
# Option A: Use sample data app (see SHOPIFY_TESTING.md)
# Option B: Migrate local products

# 2. Update .env.local
NEXT_PUBLIC_USE_SHOPIFY=true

# 3. Restart server
pnpm dev

# 4. Verify in browser
# Check data source indicator: "Data source: 🛍️ Shopify"

# 5. Test cart sync
# Add item to cart
# Check console for: "✅ Cart synced successfully"
```

---

## Version Information

**Implementation Date:** October 2025
**Next.js Version:** 15.5.4
**Shopify API Version:** 2024-01 (Admin), Storefront API
**Build Status:** ✅ PASSING

---

## Quick Commands

```bash
# Development
pnpm dev                          # Start dev server
pnpm build                        # Test build

# Shopify Operations
pnpm migrate:shopify              # Upload products to Shopify
pnpm upload-images <handle> <path>  # Upload images
pnpm export:csv                   # Generate CSV for manual import

# Testing
# 1. Set NEXT_PUBLIC_USE_SHOPIFY=true
# 2. Visit http://localhost:3000/products
# 3. Check Network tab for Shopify API calls
```

---

**Last Updated:** October 2025
**Status:** Implementation complete, ready for testing
**Next Step:** Configure Shopify dev store and test connection

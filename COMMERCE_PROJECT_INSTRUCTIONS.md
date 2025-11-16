# Next.js Commerce Project Instructions

These instructions apply to all Next.js Commerce projects built on the Vercel Commerce template.

---

## 🏗️ Architecture Overview

### Core Technologies
- **Next.js 16+** (App Router with Turbopack)
- **React 19+** (Server Components, useOptimistic, useActionState)
- **TypeScript 5** (strict mode enabled)
- **Tailwind CSS v4** (utility-first styling)
- **Shopify Storefront API** (or other e-commerce backend)
- **pnpm** (package manager)

### Key Architectural Patterns

#### 1. **Server Components by Default**
- All components are Server Components unless marked with `'use client'`
- Only use Client Components when you need:
  - React hooks (useState, useEffect, useContext)
  - Event handlers (onClick, onChange)
  - Browser APIs (localStorage, window)

#### 2. **Server Actions for Mutations**
- Cart operations use Server Actions (not API routes)
- Located in `[component]/actions.ts` files
- Pattern: `'use server'` directive at top of file
- Example: `src/components/cart/actions.ts`

#### 3. **Dual-Mode Data Architecture**
- Support both production API (Shopify) and local development data
- Controlled via `NEXT_PUBLIC_USE_SHOPIFY` environment variable
- Unified interface in `lib/data-source.ts`
- Always use data-source functions, never call Shopify directly from components

#### 4. **Optimistic UI Updates**
- Use React 19's `useOptimistic` hook for instant feedback
- Pattern: Update UI immediately, sync to server in background
- Example: Cart quantity updates, add to cart

---

## 📁 File Structure Conventions

### Standard Directory Layout
```
app/                    # Next.js App Router pages (NOT in src/)
  ├── (store)/         # Route group for shared layouts
  ├── product/[handle] # Dynamic routes
  ├── layout.tsx       # Root layout
  ├── page.tsx         # Homepage
  ├── error.tsx        # Global error boundary
  ├── not-found.tsx    # 404 page
  ├── robots.ts        # SEO - search engine directives
  └── sitemap.ts       # SEO - dynamic sitemap

components/             # Reusable UI components
  ├── layout/          # Header, Footer, etc.
  ├── cart/            # Cart-related components
  │   ├── cart-context.tsx
  │   └── actions.ts   # Server Actions
  ├── product/         # Product-related components
  ├── filters/         # Filter components
  └── builder/         # CMS blocks (if using Builder.io)

lib/                    # Utilities and integrations
  ├── shopify/         # Shopify API integration
  │   ├── index.ts     # Main API functions
  │   ├── queries/     # GraphQL queries
  │   ├── mutations/   # GraphQL mutations
  │   ├── fragments/   # Reusable GraphQL fragments
  │   └── types.ts     # TypeScript types
  ├── data-source.ts   # Unified data interface
  ├── utils.ts         # Utility functions
  └── constants.ts     # App constants

data/                   # Local/fallback data
  ├── products.ts      # Product data
  └── gallery.ts       # Other static data

hooks/                  # Custom React hooks
types/                  # TypeScript type definitions
```

### Path Aliases
```typescript
// tsconfig.json is configured with:
import { useCart } from '@/components/cart/cart-context';
import { getProducts } from '@/lib/shopify';
import Header from '@/components/layout/Header';
```

**Important:** `@/*` maps to `./src/*` for components/lib/data, but `app/` is at root level.

---

## 🎨 Styling Conventions

### Tailwind CSS Best Practices

1. **Brand Colors as CSS Variables**
```css
/* app/globals.css */
--brand-primary: #color;
--brand-secondary: #color;
--brand-accent: #color;
```

2. **Use Semantic Class Names**
```tsx
<div className="bg-primary text-secondary">
  <h1 className="font-display text-4xl">
```

3. **Responsive Design**
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
```

### Component Styling Patterns
- Use `classNames()` utility from `@/lib/utils` for conditional classes
- Headless UI for accessible interactive components (never native `<select>`)
- Maintain consistent spacing with Tailwind spacing scale

---

## 🛒 E-Commerce Patterns

### Cart Management

**Pattern: Context + Server Actions + Optimistic Updates**

```typescript
// 1. Cart Context (Client Component)
'use client';
import { useOptimistic } from 'react';

const { cart, addCartItem, updateCartItem } = useCart();

// 2. Optimistic Update
addCartItem(variant, product); // Updates UI instantly

// 3. Server Action (in background)
// Located in components/cart/actions.ts
'use server';
export async function addItem(prevState, variantId) {
  // Persist to Shopify/backend
}
```

**Key Files:**
- `components/cart/cart-context.tsx` - Client-side state
- `components/cart/actions.ts` - Server Actions
- `lib/shopify/index.ts` - API calls

### Product Variants

**Pattern: URL Params + Client State**

```typescript
// Product options in URL: ?Color=Blue&Size=Large
import { useVariantSelection } from '@/hooks/useVariantSelection';

const { selectedVariant, updateOption } = useVariantSelection({
  product,
  searchParams,
});
```

**UI Patterns:**
- ≤4 options: Button grid
- >4 options: Headless UI Listbox (NOT `<select>`)
- Show availability, prices, images per variant

### Filtering & Sorting

**Pattern: URL Search Params + Server Components**

```typescript
// app/(store)/products/page.tsx
export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; category?: string }>;
}) {
  const params = await searchParams; // Next.js 15+ pattern
  const products = await getProducts({
    sort: params.sort,
    category: params.category
  });
}
```

**Important:** Always use route groups like `(store)/` for shared filter layouts.

---

## 🔄 Data Fetching Patterns

### Server Component Data Fetching

```typescript
// ✅ CORRECT - Server Component
export default async function ProductPage({ params }) {
  const { handle } = await params; // Next.js 15+ async params
  const product = await getProduct(handle);

  return <ProductDetails product={product} />;
}
```

### Caching Strategy (Next.js 16)

```typescript
'use cache';
import { cacheTag, cacheLife } from 'next/cache';

export async function getProducts() {
  cacheTag('products');
  cacheLife('days');

  // Fetch data
}

// Revalidate on-demand
import { revalidateTag } from 'next/cache';
revalidateTag('products');
```

### Error Handling

```typescript
// Always wrap API calls
try {
  const data = await fetchData();
  return data;
} catch (error) {
  console.error('Error:', error);
  return null; // Or throw for error boundary
}
```

---

## 🎯 Critical Next.js 15+ Patterns

### 1. **Async Params (BREAKING CHANGE)**

```typescript
// ❌ WRONG - Old Next.js 14 pattern
export default async function Page({ params }) {
  const product = await getProduct(params.slug);
}

// ✅ CORRECT - Next.js 15+ pattern
export default async function Page({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
}
```

**Applies to:**
- All dynamic routes `[slug]`, `[id]`, `[handle]`
- `generateMetadata` functions
- All route params are now Promises

### 2. **Image Optimization**

```typescript
// ❌ AVOID
<img src="/image.jpg" alt="Product" />

// ✅ PREFER
import Image from 'next/image';

<Image
  src="/image.jpg"
  alt="Product"
  width={500}
  height={500}
  className="object-cover"
/>
```

**Configure in `next.config.ts`:**
```typescript
images: {
  remotePatterns: [
    { hostname: 'cdn.shopify.com' },
  ],
  formats: ['image/avif', 'image/webp'],
}
```

### 3. **Metadata for SEO**

```typescript
// Static metadata
export const metadata: Metadata = {
  title: 'Page Title',
  description: 'Page description',
};

// Dynamic metadata
export async function generateMetadata({ params }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  return {
    title: product.title,
    description: product.description,
    openGraph: {
      images: [product.image],
    },
  };
}
```

---

## 🏪 Shopify Integration

### GraphQL Best Practices

1. **Use Fragments**
```graphql
# lib/shopify/fragments/product.ts
fragment ProductFragment on Product {
  id
  handle
  title
  description
  # ... fields
}
```

2. **Reshape Data**
```typescript
// Always reshape Shopify responses to internal types
const reshapeProduct = (shopifyProduct): Product => {
  return {
    id: shopifyProduct.id,
    name: shopifyProduct.title,
    // ... map fields
  };
};
```

3. **Cache Tags**
```typescript
import { TAGS } from '@/lib/constants';

export async function getProducts() {
  cacheTag(TAGS.products);
  // Shopify API call
}
```

### Environment Variables

```bash
# Shopify (Required for production)
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-token
SHOPIFY_REVALIDATION_SECRET=your-secret

# Data Source Control
NEXT_PUBLIC_USE_SHOPIFY=true  # or false for local data

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

---

## 🧩 Component Patterns

### Client vs Server Components

**Server Components (default):**
```typescript
// No 'use client' directive
export default async function ProductGrid() {
  const products = await getProducts();
  return <div>{/* render */}</div>;
}
```

**Client Components:**
```typescript
'use client';
import { useState } from 'react';

export default function InteractiveComponent() {
  const [state, setState] = useState();
  // ... hooks, event handlers
}
```

### Composition Pattern

```typescript
// Server Component (parent)
export default async function ProductPage() {
  const product = await getProduct();

  return (
    <>
      <ProductImages images={product.images} /> {/* Server */}
      <ProductVariantSelector variants={product.variants} /> {/* Client */}
      <AddToCartButton product={product} /> {/* Client */}
    </>
  );
}
```

### Headless UI Components

```typescript
// Always use Headless UI, never native elements
import { Listbox } from '@headlessui/react';

// ❌ AVOID
<select>...</select>

// ✅ PREFER
<Listbox value={selected} onChange={setSelected}>
  <ListboxButton>...</ListboxButton>
  <ListboxOptions>
    <ListboxOption>...</ListboxOption>
  </ListboxOptions>
</Listbox>
```

---

## 🎨 CMS Integration (Builder.io)

### Architecture Pattern

```typescript
// 1. Reserved Paths (protect e-commerce routes)
// lib/builder/config.ts
reservedPaths: ['products', 'product', 'cart', 'checkout']

// 2. Content Resolution
// app/page.tsx
const content = await resolveBuilderContent('page', {
  userAttributes: { urlPath: '/' }
});

// 3. Fallback Pattern
if (content) {
  return <BuilderComponentClient content={content} />;
}
return <HardcodedComponents />; // Fallback
```

### Custom Blocks Registration

```typescript
'use client';
import { Builder } from '@builder.io/react';
import dynamic from 'next/dynamic';

const CustomBlock = dynamic(() => import('./blocks/CustomBlock'));

Builder.registerComponent(CustomBlock, {
  name: 'CustomBlock',
  inputs: [
    { name: 'heading', type: 'text' },
    { name: 'image', type: 'file' },
  ],
});
```

---

## ✅ Production Readiness Checklist

### Must-Have Pages
- [ ] Legal pages (Privacy, Terms, Shipping, Returns)
- [ ] Error boundaries (`app/error.tsx`, `app/not-found.tsx`)
- [ ] SEO files (`app/robots.ts`, `app/sitemap.ts`)
- [ ] Contact page (with functional form)

### Analytics & Tracking
- [ ] Google Analytics or GTM installed
- [ ] Use `@next/third-parties` package
- [ ] E-commerce event tracking configured

### Environment Configuration
- [ ] `.env.example` with all variables documented
- [ ] Production environment variables set
- [ ] API keys secured (never committed)

### Performance
- [ ] Images use Next.js `Image` component
- [ ] Proper caching strategy (`cacheTag`, `cacheLife`)
- [ ] Turbopack enabled for builds
- [ ] Bundle size optimized

### Testing
- [ ] Cart flow (add, update, remove, checkout)
- [ ] Product variants work correctly
- [ ] Filters and sorting functional
- [ ] Mobile responsive
- [ ] Accessibility (ARIA labels, keyboard navigation)

---

## 🚨 Common Pitfalls to Avoid

### 1. **Using Client Components Unnecessarily**
```typescript
// ❌ WRONG - Making entire page client-side
'use client';
export default function Page() {
  const data = await fetch(); // Can't await in client component!
}

// ✅ CORRECT - Server Component with Client islands
export default async function Page() {
  const data = await fetch();
  return <ClientInteractiveComponent data={data} />;
}
```

### 2. **Calling Shopify Directly from Components**
```typescript
// ❌ WRONG
import { shopifyFetch } from '@/lib/shopify';
const products = await shopifyFetch(query);

// ✅ CORRECT
import { getProducts } from '@/lib/data-source';
const products = await getProducts();
```

### 3. **Not Awaiting Params (Next.js 15+)**
```typescript
// ❌ WRONG
export default async function Page({ params }) {
  const product = await getProduct(params.slug); // ERROR!
}

// ✅ CORRECT
export default async function Page({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);
}
```

### 4. **Using Native Select Elements**
```typescript
// ❌ WRONG - Poor accessibility and styling
<select>
  <option>Option 1</option>
</select>

// ✅ CORRECT - Headless UI Listbox
<Listbox value={selected} onChange={setSelected}>
  {/* Fully styled and accessible */}
</Listbox>
```

### 5. **Missing Error Boundaries**
```typescript
// ❌ WRONG - No error handling
const product = await getProduct(id);

// ✅ CORRECT - With error boundary
try {
  const product = await getProduct(id);
  if (!product) notFound();
} catch (error) {
  // Let error boundary handle it
  throw error;
}
```

---

## 📝 Code Style Guidelines

### TypeScript
- **Always use strict mode**
- **Define interfaces for all props**
- **Use type guards for runtime checks**

```typescript
interface ProductProps {
  product: Product;
  variant?: ProductVariant;
}

export default function ProductCard({
  product,
  variant
}: ProductProps) {
  // ...
}
```

### Imports
```typescript
// Order: External → Internal → Types
import { useState } from 'react';
import Link from 'next/link';

import { useCart } from '@/components/cart/cart-context';
import { getProducts } from '@/lib/shopify';

import type { Product } from '@/types';
```

### Naming Conventions
- **Components:** PascalCase (`ProductCard.tsx`)
- **Utilities:** camelCase (`formatPrice.ts`)
- **Constants:** UPPER_SNAKE_CASE (`TAGS.PRODUCTS`)
- **Types/Interfaces:** PascalCase (`Product`, `CartItem`)

---

## 🔧 Development Workflow

### Local Development
```bash
# Install dependencies
pnpm install

# Start dev server (uses Turbopack)
pnpm dev

# Build for production
pnpm build

# Run linter
pnpm lint
```

### Environment Setup
1. Copy `.env.example` to `.env.local`
2. Set `NEXT_PUBLIC_USE_SHOPIFY=false` for local development
3. Add Shopify credentials when ready to test with real data

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/new-feature

# Commit with conventional commits
git commit -m "feat: add new feature"
git commit -m "fix: resolve bug"
git commit -m "docs: update documentation"

# Push and create PR
git push -u origin feature/new-feature
```

---

## 📚 Key Documentation References

- **Next.js 16:** https://nextjs.org/docs
- **React 19:** https://react.dev
- **Shopify Storefront API:** https://shopify.dev/api/storefront
- **Tailwind CSS v4:** https://tailwindcss.com/docs
- **Headless UI:** https://headlessui.com
- **Builder.io:** https://www.builder.io/c/docs

---

## 💡 Pro Tips

1. **Use Server Components by default** - Only go client-side when absolutely necessary
2. **Implement optimistic updates** - Makes the UX feel instant and responsive
3. **Always have fallback data** - Never break the site if APIs fail
4. **Cache aggressively** - Use Next.js cache tags for instant updates
5. **Test with real data early** - Don't wait until production to connect Shopify
6. **Mobile-first design** - Most e-commerce traffic is mobile
7. **Accessibility matters** - Use Headless UI and proper ARIA labels
8. **Monitor performance** - Use Vercel Analytics or similar tools

---

## 🎯 Project-Specific Customization

When starting a new Commerce project:

1. **Update brand colors** in `app/globals.css`
2. **Configure fonts** in `app/layout.tsx`
3. **Set product categories** in `data/products.ts`
4. **Customize Builder.io blocks** for brand-specific sections
5. **Update legal pages** with actual policies
6. **Configure Analytics** tracking IDs
7. **Set up Shopify** store and API credentials

---

**Last Updated:** 2025-11-16
**Template Version:** Based on Vercel Commerce + Next.js 16 + React 19

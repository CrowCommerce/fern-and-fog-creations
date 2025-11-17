# Fern & Fog Creations

**Handmade Coastal & Woodland Treasures**

A Next.js 16 e-commerce storefront for handmade coastal crafts (sea glass earrings, pressed flower resin, driftwood décor) with Shopify integration and full CMS capabilities.

---

## 🌟 Features

### E-Commerce
- ✅ Product catalog with variants (color, size)
- ✅ Collection/category pages with filtering and sorting
- ✅ Shopping cart with optimistic updates (React 19)
- ✅ Shopify checkout integration
- ✅ Real-time inventory sync

### Content Management (Shopify CMS)
- ✅ **No-code content editing** via Shopify Admin
- ✅ SEO metadata for all pages (titles, descriptions, OpenGraph)
- ✅ Navigation menus (header + footer)
- ✅ Homepage hero section (heading, description, CTAs, background image)
- ✅ About page (story, process steps, values, CTAs)
- ✅ Contact page (customizable text, optional contact info)
- ✅ Gallery portfolio items with categories
- ✅ Instant updates via webhooks (no deploy needed!)

### Performance & SEO
- ✅ Next.js 16 App Router with Turbopack
- ✅ React Server Components for optimal performance
- ✅ Native caching with automatic revalidation
- ✅ JSON-LD structured data for rich snippets
- ✅ Blur placeholders for images
- ✅ Link prefetching for instant navigation
- ✅ Responsive images (WebP, AVIF)

### Developer Experience
- ✅ TypeScript strict mode
- ✅ Tailwind CSS v4 with custom brand theming
- ✅ Headless UI components (accessible by default)
- ✅ Error handling with retry logic
- ✅ Rate limiting protection (Upstash Redis)
- ✅ Error monitoring (Sentry integration)
- ✅ Jotform contact forms (no backend needed)

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and pnpm 10.19.0+
- Shopify store with Storefront API access
- (Optional) Shopify Admin API access for CMS features

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd Fern-And-Fog-Creations

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Shopify credentials

# Run development server
pnpm dev
```

Visit `http://localhost:3000`

### Environment Variables

Required:
```bash
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-token
SHOPIFY_REVALIDATION_SECRET=your-webhook-secret
NEXT_PUBLIC_USE_SHOPIFY=true
```

Optional:
```bash
# Jotform contact form
NEXT_PUBLIC_JOTFORM_FORM_ID=your-form-id

# Error monitoring
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
SENTRY_AUTH_TOKEN=your-auth-token

# Rate limiting
UPSTASH_REDIS_REST_URL=your-upstash-url
UPSTASH_REDIS_REST_TOKEN=your-upstash-token
```

---

## 📖 Documentation

### For Business Users

- **[Shopify CMS Guide](docs/SHOPIFY_CMS_GUIDE.md)** - Complete guide to managing website content
- **[Menu Management](docs/MENU_MANAGEMENT.md)** - How to edit navigation menus
- **[Metadata & SEO](docs/METADATA_MANAGEMENT.md)** - Optimizing for search engines

### For Developers

- **[CLAUDE.md](CLAUDE.md)** - Complete technical documentation and architecture
- **[Gallery System](docs/GALLERY.md)** - Portfolio/gallery implementation
- **[Shopify CMS Conversion Roadmap](docs/SHOPIFY_CMS_CONVERSION_ROADMAP.md)** - Implementation plan and progress

---

## 🎨 Brand Theming

Custom color palette (Tailwind CSS v4):
- **Moss** (`#33593D`) - Dark green primary
- **Fern** (`#4F7942`) - Medium green
- **Parchment** (`#F5F0E6`) - Off-white background
- **Bark** (`#5B4636`) - Brown text
- **Mist** (`#E6ECE8`) - Light gray
- **Gold** (`#C5A05A`) - Accent color

Typography:
- **Headings**: Cormorant Garamond (font-display)
- **Body**: Inter (font-sans)

---

## 🛠️ Development

### Commands

```bash
pnpm dev          # Start development server (Turbopack)
pnpm build        # Build for production (Turbopack)
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

### Shopify CMS Setup

First-time setup requires creating metaobject definitions:

```bash
# Create contact page metaobject
pnpm setup:contact

# Create about page metaobjects
pnpm setup:about

# Create homepage hero metaobject
pnpm setup:homepage

# Dry-run mode (preview without creating)
pnpm setup:contact:dry
pnpm setup:about:dry
pnpm setup:homepage:dry
```

These scripts create the necessary metaobject types in Shopify Admin and populate them with default content.

### Cache Management

Content is cached with Next.js 16's native caching:
- **Cache Duration**: 1 day (`cacheLife('days')`)
- **Revalidation**: Automatic via Shopify webhooks
- **Tags**: Products, collections, menus, metadata, gallery, contact, about, homepage

**Testing cache revalidation:**
```bash
# Trigger manual revalidation
curl -X POST "https://your-domain.com/api/revalidate?secret=YOUR_SECRET" \
  -H "x-shopify-topic: metaobjects/update"
```

---

## 🏗️ Architecture

### Tech Stack

- **Framework**: Next.js 16.0.1-canary.5 (App Router, Turbopack)
- **React**: 19.1.0 (useOptimistic, use hook, Server Components)
- **TypeScript**: 5 (strict mode)
- **Styling**: Tailwind CSS v4
- **UI Components**: Headless UI 2.x
- **Icons**: Heroicons
- **CMS**: Shopify metaobjects
- **Forms**: Jotform
- **Error Monitoring**: Sentry
- **Rate Limiting**: Upstash Redis

### Project Structure

```
Fern-And-Fog-Creations/
├── app/                    # Next.js App Router pages
│   ├── (store)/           # Route group for products with filters
│   ├── api/               # API routes (webhooks, etc.)
│   ├── product/[handle]/  # Product detail pages
│   ├── about/             # About page
│   ├── contact/           # Contact page
│   ├── gallery/           # Gallery page
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── layout/           # Header, Footer, Navigation
│   ├── cart/             # Cart drawer, actions
│   ├── product/          # Product cards, variants
│   └── ...
├── lib/                   # Utilities and integrations
│   ├── shopify/          # Shopify API integration
│   │   ├── queries/      # GraphQL queries
│   │   ├── mutations/    # GraphQL mutations
│   │   └── fragments/    # Reusable fragments
│   ├── data-source.ts    # Dual-mode data (Shopify/local)
│   ├── constants.ts      # Cache tags, config
│   └── utils.ts          # Helper functions
├── data/                  # Local fallback data
├── scripts/               # Migration scripts
├── docs/                  # Documentation
├── public/                # Static assets
└── types/                 # TypeScript type definitions
```

### Key Patterns

**Server Components (Default)**
```typescript
// app/page.tsx
export default async function Home() {
  const hero = await getHomepageHero(); // Cached
  return <HeroSection hero={hero} />;
}
```

**Client Components** (when needed)
```typescript
'use client';
// For interactivity, hooks, browser APIs
```

**Data Fetching with Caching**
```typescript
export async function getHomepageHero(): Promise<HomepageHero> {
  'use cache';
  cacheTag(TAGS.homepage);
  cacheLife('days');

  const res = await shopifyFetch<ShopifyHomepageHeroOperation>({
    query: getHomepageHeroQuery,
  });

  return reshapeHomepageHero(res.body.data);
}
```

**Optimistic Updates** (React 19)
```typescript
const { cart, updateCartItem } = useCart();

// Instant UI update before server mutation
updateCartItem(merchandiseId, 'plus');
```

---

## 📊 Performance

### Metrics

- ✅ Lighthouse Score: 90+
- ✅ First Contentful Paint: < 1.5s
- ✅ Time to Interactive: < 3.5s
- ✅ Cumulative Layout Shift: < 0.1

### Optimizations

1. **Caching Strategy**
   - All Shopify queries cached for 1 day
   - Webhook revalidation for instant updates
   - Server Components for zero JavaScript by default

2. **Image Optimization**
   - Next.js Image component (automatic WebP/AVIF)
   - Blur placeholders for hero images
   - Responsive sizing with `sizes` attribute
   - Lazy loading (except priority images)

3. **Code Splitting**
   - Automatic route-based splitting
   - Dynamic imports for heavy components
   - Tree-shaking for unused code

4. **Network**
   - Prefetching for critical navigation
   - Retry logic with exponential backoff
   - Rate limiting protection

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Homepage loads with correct hero content
- [ ] Navigation menus work (desktop + mobile)
- [ ] Product listing with filters and sorting
- [ ] Product detail with variants
- [ ] Add to cart (optimistic update)
- [ ] Cart drawer opens/closes
- [ ] Checkout redirect to Shopify
- [ ] About page with CMS content
- [ ] Contact page with Jotform
- [ ] Gallery with filtering
- [ ] SEO metadata on all pages
- [ ] 404 page for invalid routes
- [ ] Mobile responsiveness
- [ ] Keyboard navigation

### E2E Testing (Playwright)

```bash
# Install Playwright (future)
pnpm add -D @playwright/test

# Run tests (future)
pnpm test:e2e
```

---

## 🚢 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Import to Vercel**
   - Connect GitHub repository
   - Vercel auto-detects Next.js
   - Add environment variables

3. **Configure Shopify Webhooks**
   - Webhook URL: `https://your-domain.com/api/revalidate?secret=YOUR_SECRET`
   - Topics: products/*, collections/*, menus/*, metaobjects/*

### Environment Variables (Production)

Set these in Vercel dashboard:
```
SHOPIFY_STORE_DOMAIN
SHOPIFY_STOREFRONT_ACCESS_TOKEN
SHOPIFY_REVALIDATION_SECRET
NEXT_PUBLIC_USE_SHOPIFY=true
NEXT_PUBLIC_JOTFORM_FORM_ID
NEXT_PUBLIC_SENTRY_DSN (optional)
SENTRY_AUTH_TOKEN (optional)
UPSTASH_REDIS_REST_URL (optional)
UPSTASH_REDIS_REST_TOKEN (optional)
```

---

## 🤝 Contributing

This is a client project for Fern & Fog Creations. Contact the project owner for contribution guidelines.

---

## 📝 License

Proprietary - All rights reserved © Fern & Fog Creations

---

## 🆘 Support

- **Business Users**: See [docs/SHOPIFY_CMS_GUIDE.md](docs/SHOPIFY_CMS_GUIDE.md)
- **Developers**: See [CLAUDE.md](CLAUDE.md)
- **Issues**: Contact project administrator

---

**Built with ❤️ using Next.js 16, React 19, and Shopify**

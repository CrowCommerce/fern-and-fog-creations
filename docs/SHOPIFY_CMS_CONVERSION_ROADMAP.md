# Shopify CMS Conversion Roadmap
**Project:** Fern & Fog Creations
**Goal:** Convert application to use Shopify as a complete CMS for all content management
**Reference:** Next.js Commerce implementation patterns (`/references/commerce`)

---

## Table of Contents
1. [Overview](#overview)
2. [Architecture Principles](#architecture-principles)
3. [Execution Waves](#execution-waves)
4. [Detailed Task Breakdown](#detailed-task-breakdown)
5. [Shopify Configuration Required](#shopify-configuration-required)
6. [Testing Strategy](#testing-strategy)
7. [Rollback Plan](#rollback-plan)

---

## Overview

### Current State
- Gallery page uses Shopify metaobjects (✅ Complete)
- Products use Shopify Storefront API
- Header/Footer menus are hardcoded
- Page metadata is static
- Homepage content is hardcoded
- About/Contact pages are static

### Target State
- **All menus** managed via Shopify Menu API
- **All page metadata** managed via Shopify metaobjects
- **Homepage content** fully editable in Shopify Admin
- **About/Contact pages** editable via metaobjects
- **Webhook-based cache revalidation** for instant updates
- **Consistent CMS patterns** across entire application

### Success Criteria
- ✅ Business users can edit all navigation without code changes
- ✅ Business users can edit all page content without code changes
- ✅ All metadata (SEO, OpenGraph) editable in Shopify
- ✅ Cache invalidation works automatically
- ✅ Performance meets or exceeds current benchmarks
- ✅ All existing functionality preserved

---

## Architecture Principles

### 1. Server Components First
All CMS data fetching uses Next.js Server Components (following Next.js Commerce pattern):

```typescript
// Good: Server Component
export async function Header() {
  const menu = await getMenu('fern-fog-header-menu');
  return <nav>{/* render menu */}</nav>;
}

// Avoid: Client-side fetching unless required for interactivity
```

### 2. GraphQL Fragment Composition
Reuse fragments across queries to maintain consistency:

```typescript
// fragments/seo.ts
const seoFragment = /* GraphQL */ `
  fragment seo on SEO {
    description
    title
  }
`;

// queries/product.ts
export const getProductQuery = /* GraphQL */ `
  query getProduct($handle: String!) {
    product(handle: $handle) {
      ...product
    }
  }
  ${productFragment}  // Includes seoFragment
`;
```

### 3. Data Reshaping Layer
Always reshape Shopify data before exposing to components:

```typescript
// lib/shopify/index.ts
const reshapeMenu = (shopifyMenu: ShopifyMenu): Menu[] => {
  return shopifyMenu.items.map(item => ({
    title: item.title,
    path: item.url
      .replace(domain, '')
      .replace('/collections', '/search')
      .replace('/pages', '')
  }));
};
```

### 4. Cache Tag Strategy
Use descriptive cache tags for targeted revalidation:

```typescript
export const TAGS = {
  collections: 'collections',
  products: 'products',
  cart: 'cart',
  menus: 'menus',           // New
  pageMetadata: 'metadata',  // New
  homepage: 'homepage'       // New
};
```

### 5. Graceful Fallbacks
Always provide fallback content when Shopify data unavailable:

```typescript
export async function getMenu(handle: string): Promise<Menu[]> {
  'use cache';
  cacheTag(TAGS.menus);

  const res = await shopifyFetch<ShopifyMenuOperation>({
    query: getMenuQuery,
    variables: { handle }
  });

  // Fallback to empty array, not error
  return res.body?.data?.menu?.items || [];
}
```

---

## Execution Waves

### Wave 1: Foundation (Sequential)
**Duration:** 2-3 hours
**Goal:** Establish reusable GraphQL fragment library

| Task | Agent | Status |
|------|-------|--------|
| 1.1: GraphQL Fragments Refactor | GraphQL Architecture Agent | Pending |

**Deliverables:**
- `lib/shopify/fragments/seo.ts`
- `lib/shopify/fragments/image.ts`
- `lib/shopify/fragments/menu.ts`
- Updated product/cart fragments

---

### Wave 2: Core CMS (Parallel)
**Duration:** 6-8 hours (parallel execution)
**Goal:** Implement menu system, metadata, and product SEO

| Task | Agent | Dependencies | Status |
|------|-------|--------------|--------|
| 2.1: Menu System | Menu System Agent | 1.1 | Pending |
| 2.2: Page Metadata | Metadata Agent | 1.1 | Pending |
| 2.3: Product SEO | Product SEO Agent | 1.1 | Pending |
| 2.4: Collection CMS | Collection CMS Agent | 1.1 | Pending |
| 3.1: Homepage CMS | Homepage CMS Agent | None | Pending |

**Critical Path:** Tasks 2.1, 2.2, 4.1 are MVP requirements

---

### Wave 3: Advanced Features (Parallel)
**Duration:** 4-6 hours
**Goal:** Complete content pages and infrastructure

| Task | Agent | Dependencies | Status |
|------|-------|--------------|--------|
| 3.2: About Page | About Page Agent | 2.2 | Pending |
| 3.3: Contact Page | Contact Page Agent | 2.2 | Pending |
| 4.1: Webhooks | Webhook Agent | 2.1, 2.2, 2.3 | Pending |
| 4.2: Error Handling | Error Handling Agent | None | Pending |

---

### Wave 4: Optimization (Sequential)
**Duration:** 2-3 hours
**Goal:** Performance tuning and optimization

| Task | Agent | Dependencies | Status |
|------|-------|--------------|--------|
| 4.3: Performance | Performance Agent | All Wave 2 & 3 | Pending |

---

### Wave 5: Finalization (Sequential)
**Duration:** 3-4 hours
**Goal:** Documentation and comprehensive testing

| Task | Agent | Dependencies | Status |
|------|-------|--------------|--------|
| 5.1: Documentation | Documentation Agent | All previous | Pending |
| 5.2: E2E Testing | QA Agent | All previous | Pending |

---

## Detailed Task Breakdown

### Task 1.1: GraphQL Fragments Refactor
**Agent:** GraphQL Architecture Agent
**Priority:** P0 (Blocker)
**Duration:** 2-3 hours

#### Objective
Create reusable GraphQL fragment library following Next.js Commerce patterns.

#### Files to Create
1. **`lib/shopify/fragments/seo.ts`**
```typescript
const seoFragment = /* GraphQL */ `
  fragment seo on SEO {
    description
    title
  }
`;

export default seoFragment;
```

2. **`lib/shopify/fragments/image.ts`**
```typescript
const imageFragment = /* GraphQL */ `
  fragment image on Image {
    url
    altText
    width
    height
  }
`;

export default imageFragment;
```

3. **`lib/shopify/fragments/menu.ts`**
```typescript
const menuFragment = /* GraphQL */ `
  fragment menu on Menu {
    items {
      title
      url
      items {
        title
        url
      }
    }
  }
`;

export default menuFragment;
```

#### Files to Modify
- Update `lib/shopify/fragments/product.ts` to use composition
- Update `lib/shopify/fragments/cart.ts` if needed

#### Acceptance Criteria
- [ ] All fragments follow Shopify GraphQL schema
- [ ] Fragments are composable (import and use in queries)
- [ ] No duplicate field definitions across fragments
- [ ] TypeScript types align with fragments

---

### Task 2.1: Menu System Implementation
**Agent:** Menu System Agent
**Priority:** P0 (MVP Required)
**Duration:** 3-4 hours
**Dependencies:** Task 1.1

#### Objective
Implement Shopify Menu API integration for header and footer navigation.

#### Reference Implementation
See `/references/commerce/lib/shopify/queries/menu.ts` and `/references/commerce/components/layout/navbar/index.tsx`

#### Files to Create

1. **`lib/shopify/queries/menu.ts`**
```typescript
import menuFragment from '../fragments/menu';

export const getMenuQuery = /* GraphQL */ `
  query getMenu($handle: String!) {
    menu(handle: $handle) {
      ...menu
    }
  }
  ${menuFragment}
`;
```

2. **`components/layout/FooterMenu.tsx`**
```typescript
'use client';

import Link from 'next/link';
import type { Menu } from '@/types';

export default function FooterMenu({ menu }: { menu: Menu[] }) {
  if (!menu.length) return null;

  return (
    <nav className="flex flex-col gap-2">
      {menu.map((item) => (
        <Link
          key={item.title}
          href={item.path}
          className="text-bark/70 hover:text-fern transition-colors"
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
```

#### Files to Modify

1. **`lib/shopify/types.ts`** - Add types:
```typescript
export type Menu = {
  title: string;
  path: string;
};

export type ShopifyMenu = {
  items: Array<{
    title: string;
    url: string;
  }>;
};

export type ShopifyMenuOperation = {
  data: {
    menu?: ShopifyMenu;
  };
  variables: {
    handle: string;
  };
};
```

2. **`lib/shopify/index.ts`** - Add function:
```typescript
const reshapeMenu = (menu: ShopifyMenu, domain: string): Menu[] => {
  return menu.items.map((item) => ({
    title: item.title,
    path: item.url
      .replace(domain, '')
      .replace('/collections', '/search')
      .replace('/pages', '')
  }));
};

export async function getMenu(handle: string): Promise<Menu[]> {
  'use cache';
  cacheTag(TAGS.menus);
  cacheLife('days');

  const res = await shopifyFetch<ShopifyMenuOperation>({
    query: getMenuQuery,
    variables: { handle }
  });

  const domain = process.env.SHOPIFY_STORE_DOMAIN || '';
  return res.body?.data?.menu
    ? reshapeMenu(res.body.data.menu, `https://${domain}`)
    : [];
}
```

3. **`lib/constants.ts`** - Add cache tag:
```typescript
export const TAGS = {
  collections: 'collections',
  products: 'products',
  cart: 'cart',
  gallery: 'gallery',
  menus: 'menus',  // New
};
```

4. **`types/index.ts`** - Export Menu type:
```typescript
export type { Menu } from './menu';
```

5. **`components/layout/Header.tsx`** - Refactor to use Shopify menu:
```typescript
import { getMenu } from '@/lib/shopify';

export async function Header() {
  const menu = await getMenu('fern-fog-header-menu');

  return (
    <header>
      <nav>
        {menu.map((item) => (
          <Link key={item.title} href={item.path}>
            {item.title}
          </Link>
        ))}
      </nav>
    </header>
  );
}
```

6. **`components/layout/Footer.tsx`** - Refactor to use Shopify menu:
```typescript
import { getMenu } from '@/lib/shopify';
import FooterMenu from './FooterMenu';

export default async function Footer() {
  const menu = await getMenu('fern-fog-footer-menu');

  return (
    <footer>
      <FooterMenu menu={menu} />
    </footer>
  );
}
```

#### Shopify Admin Setup

**Navigation > Menus**

1. Create Header Menu:
   - Name: "Fern & Fog Header Menu"
   - Handle: `fern-fog-header-menu`
   - Items:
     - Home → `/`
     - Shop → `/products`
     - Gallery → `/gallery`
     - About → `/about`
     - Contact → `/contact`

2. Create Footer Menu:
   - Name: "Fern & Fog Footer Menu"
   - Handle: `fern-fog-footer-menu`
   - Items:
     - About Us → `/about`
     - Contact → `/contact`
     - Privacy Policy → `/privacy`
     - Terms of Service → `/terms`
     - Shipping & Returns → `/shipping`

#### Testing Checklist
- [ ] Header renders menu from Shopify
- [ ] Footer renders menu from Shopify
- [ ] Links have correct paths (domain removed)
- [ ] `/collections/*` URLs converted to `/search/*`
- [ ] `/pages/*` URLs converted to root paths
- [ ] Empty menu returns gracefully (no errors)
- [ ] Cache invalidation works (change menu in Shopify, see update)
- [ ] Mobile navigation includes menu items

#### Rollback Plan
If issues arise:
1. Revert Header.tsx to use hardcoded navigation
2. Revert Footer.tsx to use hardcoded links
3. Keep getMenu() function for future use

---

### Task 2.2: Page Metadata System
**Agent:** Metadata Agent
**Priority:** P0 (MVP Required)
**Duration:** 3-4 hours
**Dependencies:** Task 1.1

#### Objective
Create metaobject-based system for managing page metadata (SEO, OpenGraph).

#### Metaobject Definition

**Type:** `page_metadata`

| Field Key | Field Name | Type | Required | Description |
|-----------|------------|------|----------|-------------|
| `page_slug` | Page Slug | single_line_text_field | Yes | URL path (e.g., "about", "contact", "gallery") |
| `title` | Page Title | single_line_text_field | Yes | SEO title tag |
| `description` | Meta Description | multi_line_text_field | Yes | SEO description (150-160 chars) |
| `og_image_url` | OpenGraph Image | single_line_text_field | No | Full URL to OG image |
| `keywords` | Meta Keywords | single_line_text_field | No | Comma-separated keywords |
| `robots_index` | Allow Indexing | boolean | No | Default: true |
| `robots_follow` | Allow Following | boolean | No | Default: true |

#### Files to Create

1. **`scripts/setup-page-metadata.ts`**
```typescript
#!/usr/bin/env tsx

import { validateConnection, shopifyAdminRequest } from './lib/shopify-admin.js';

const DRY_RUN = process.argv.includes('--dry-run');

// Create metaobject definition
async function createPageMetadataDefinition() {
  const mutation = `
    mutation metaobjectDefinitionCreate($definition: MetaobjectDefinitionCreateInput!) {
      metaobjectDefinitionCreate(definition: $definition) {
        metaobjectDefinition {
          id
          type
          name
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    definition: {
      name: 'Page Metadata',
      type: 'page_metadata',
      fieldDefinitions: [
        {
          key: 'page_slug',
          name: 'Page Slug',
          type: 'single_line_text_field',
          required: true,
          description: 'URL path (e.g., "about", "contact")',
        },
        {
          key: 'title',
          name: 'Page Title',
          type: 'single_line_text_field',
          required: true,
          description: 'SEO title tag',
        },
        {
          key: 'description',
          name: 'Meta Description',
          type: 'multi_line_text_field',
          required: true,
          description: 'SEO description (150-160 characters)',
        },
        {
          key: 'og_image_url',
          name: 'OpenGraph Image URL',
          type: 'single_line_text_field',
          required: false,
          description: 'Full URL to OpenGraph image',
        },
        {
          key: 'keywords',
          name: 'Meta Keywords',
          type: 'single_line_text_field',
          required: false,
          description: 'Comma-separated keywords',
        },
        {
          key: 'robots_index',
          name: 'Allow Indexing',
          type: 'boolean',
          required: false,
          description: 'Allow search engines to index this page',
        },
        {
          key: 'robots_follow',
          name: 'Allow Following',
          type: 'boolean',
          required: false,
          description: 'Allow search engines to follow links',
        },
      ],
      displayNameKey: 'page_slug',
    },
  };

  if (DRY_RUN) {
    console.log('   [DRY RUN] Would create page_metadata definition');
    return 'dry-run-id';
  }

  const result = await shopifyAdminRequest<any>(mutation, variables);

  if (result.metaobjectDefinitionCreate.userErrors.length > 0) {
    throw new Error(
      result.metaobjectDefinitionCreate.userErrors.map((e: any) => e.message).join(', ')
    );
  }

  return result.metaobjectDefinitionCreate.metaobjectDefinition.id;
}

// Create default page metadata entries
async function createDefaultMetadata() {
  const pages = [
    {
      handle: 'homepage',
      slug: 'homepage',
      title: 'Handmade Coastal Crafts | Fern & Fog Creations',
      description: 'Discover unique handmade coastal treasures. Sea glass earrings, pressed flower resin art, and driftwood décor crafted with love.',
      robots_index: true,
      robots_follow: true,
    },
    {
      handle: 'about',
      slug: 'about',
      title: 'About Us | Fern & Fog Creations',
      description: 'Learn about our journey creating handmade coastal crafts from natural materials found along the shoreline.',
      robots_index: true,
      robots_follow: true,
    },
    {
      handle: 'contact',
      slug: 'contact',
      title: 'Contact Us | Fern & Fog Creations',
      description: 'Get in touch with questions about custom orders or commissioned pieces. We love to hear from you!',
      robots_index: true,
      robots_follow: true,
    },
    {
      handle: 'gallery',
      slug: 'gallery',
      title: 'Gallery of Past Work | Fern & Fog Creations',
      description: 'Browse our gallery of past handmade creations including sea glass jewelry, pressed flower art, and coastal home décor.',
      robots_index: true,
      robots_follow: true,
    },
  ];

  const mutation = `
    mutation metaobjectCreate($metaobject: MetaobjectCreateInput!) {
      metaobjectCreate(metaobject: $metaobject) {
        metaobject {
          id
          handle
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  for (const page of pages) {
    if (DRY_RUN) {
      console.log(`   [DRY RUN] Would create metadata for: ${page.slug}`);
      continue;
    }

    const variables = {
      metaobject: {
        type: 'page_metadata',
        handle: page.handle,
        fields: [
          { key: 'page_slug', value: page.slug },
          { key: 'title', value: page.title },
          { key: 'description', value: page.description },
          { key: 'robots_index', value: String(page.robots_index) },
          { key: 'robots_follow', value: String(page.robots_follow) },
        ],
      },
    };

    const result = await shopifyAdminRequest<any>(mutation, variables);

    if (result.metaobjectCreate.userErrors.length > 0) {
      console.error(`   ✗ Failed to create ${page.slug}:`,
        result.metaobjectCreate.userErrors.map((e: any) => e.message).join(', ')
      );
    } else {
      console.log(`   ✓ Created metadata for: ${page.slug}`);
    }
  }
}

async function setup() {
  console.log('\n🔧 Page Metadata Setup');
  console.log('━'.repeat(50));

  const connected = await validateConnection();
  if (!connected) {
    console.error('\n✗ Failed to connect to Shopify');
    process.exit(1);
  }
  console.log('✓ Connected to Shopify Admin API\n');

  console.log('📋 Step 1/2: Creating page_metadata definition...');
  await createPageMetadataDefinition();
  console.log('✓ Definition created\n');

  console.log('📝 Step 2/2: Creating default metadata entries...');
  await createDefaultMetadata();
  console.log('✓ Default metadata created\n');

  console.log('━'.repeat(50));
  console.log('✅ Setup Complete!\n');
  console.log('Next steps:');
  console.log('  1. Go to Shopify Admin > Content > Metaobjects');
  console.log('  2. Find "Page Metadata" entries');
  console.log('  3. Edit titles, descriptions, and OpenGraph images\n');
}

setup().catch((error) => {
  console.error('\n✗ Fatal error:', error);
  process.exit(1);
});
```

2. **`lib/shopify/queries/page-metadata.ts`**
```typescript
export const getPageMetadataQuery = /* GraphQL */ `
  query getPageMetadata($handle: String!) {
    metaobjectByHandle(handle: { type: "page_metadata", handle: $handle }) {
      id
      fields {
        key
        value
      }
    }
  }
`;
```

3. **`types/metadata.ts`**
```typescript
export interface PageMetadata {
  title: string;
  description: string;
  ogImageUrl?: string;
  keywords?: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
}
```

#### Files to Modify

1. **`lib/shopify/types.ts`** - Add operation type:
```typescript
export type ShopifyPageMetadataOperation = {
  data: {
    metaobjectByHandle: ShopifyMetaobject | null;
  };
};
```

2. **`lib/shopify/index.ts`** - Add function:
```typescript
export async function getPageMetadata(slug: string): Promise<PageMetadata> {
  'use cache';
  cacheTag(TAGS.metadata);
  cacheLife('days');

  const res = await shopifyFetch<ShopifyPageMetadataOperation>({
    query: getPageMetadataQuery,
    variables: { handle: slug }
  });

  const metaobject = res.body.data?.metaobjectByHandle;

  // Fallback to defaults if not found
  if (!metaobject) {
    console.warn(`Page metadata not found for: ${slug}, using defaults`);
    return {
      title: 'Fern & Fog Creations',
      description: 'Handmade coastal crafts with love',
      robotsIndex: true,
      robotsFollow: true,
    };
  }

  const getField = (key: string): string => {
    const field = metaobject.fields.find((f) => f.key === key);
    return field?.value || '';
  };

  return {
    title: getField('title'),
    description: getField('description'),
    ogImageUrl: getField('og_image_url') || undefined,
    keywords: getField('keywords') || undefined,
    robotsIndex: getField('robots_index') !== 'false',
    robotsFollow: getField('robots_follow') !== 'false',
  };
}
```

3. **`lib/constants.ts`** - Add cache tag:
```typescript
export const TAGS = {
  // ... existing tags
  metadata: 'metadata',  // New
};
```

4. **`app/page.tsx`** - Add dynamic metadata:
```typescript
import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/shopify';

export async function generateMetadata(): Promise<Metadata> {
  const metadata = await getPageMetadata('homepage');

  return {
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords,
    robots: {
      index: metadata.robotsIndex,
      follow: metadata.robotsFollow,
    },
    openGraph: metadata.ogImageUrl ? {
      images: [{ url: metadata.ogImageUrl }],
    } : undefined,
  };
}

export default function HomePage() {
  // ... existing code
}
```

5. **`app/about/page.tsx`** - Add dynamic metadata:
```typescript
import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/shopify';

export async function generateMetadata(): Promise<Metadata> {
  const metadata = await getPageMetadata('about');

  return {
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords,
    robots: {
      index: metadata.robotsIndex,
      follow: metadata.robotsFollow,
    },
    openGraph: metadata.ogImageUrl ? {
      images: [{ url: metadata.ogImageUrl }],
    } : undefined,
  };
}

export default function AboutPage() {
  // ... existing code
}
```

6. **`app/contact/page.tsx`** - Add dynamic metadata (same pattern)

7. **`app/gallery/page.tsx`** - Replace current metadata:
```typescript
import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/shopify';

export async function generateMetadata(): Promise<Metadata> {
  const metadata = await getPageMetadata('gallery');

  return {
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords,
    robots: {
      index: metadata.robotsIndex,
      follow: metadata.robotsFollow,
    },
    openGraph: metadata.ogImageUrl ? {
      images: [{ url: metadata.ogImageUrl }],
    } : undefined,
  };
}
```

8. **`package.json`** - Add scripts:
```json
{
  "scripts": {
    "setup:metadata": "tsx scripts/setup-page-metadata.ts",
    "setup:metadata:dry": "tsx scripts/setup-page-metadata.ts --dry-run"
  }
}
```

#### NPM Scripts to Run
```bash
# Test first
pnpm setup:metadata:dry

# Execute
pnpm setup:metadata
```

#### Testing Checklist
- [ ] Homepage metadata from Shopify
- [ ] About page metadata from Shopify
- [ ] Contact page metadata from Shopify
- [ ] Gallery page metadata from Shopify
- [ ] robots meta tags correct
- [ ] OpenGraph images render when provided
- [ ] Fallback metadata works when metaobject missing

---

### Task 2.3: Product SEO Enhancement
**Agent:** Product SEO Agent
**Priority:** P1 (Should Have)
**Duration:** 2-3 hours
**Dependencies:** Task 1.1

#### Objective
Use Shopify's native `seo` field for product metadata and add JSON-LD structured data.

#### Files to Modify

1. **`lib/shopify/fragments/product.ts`** - Add seo fragment:
```typescript
import imageFragment from './image';
import seoFragment from './seo';  // New

const productFragment = /* GraphQL */ `
  fragment product on Product {
    id
    handle
    title
    description
    descriptionHtml
    availableForSale
    priceRange { ... }
    featuredImage { ...image }
    images(first: 20) { ...image }
    seo { ...seo }  /* New */
    tags
    updatedAt
  }
  ${imageFragment}
  ${seoFragment}
`;
```

2. **`lib/shopify/types.ts`** - Ensure SEO type exists:
```typescript
export type SEO = {
  title: string;
  description: string;
};
```

3. **`app/product/[handle]/page.tsx`** - Enhance metadata:
```typescript
import type { Metadata } from 'next';
import { getProduct } from '@/lib/shopify';
import { notFound } from 'next/navigation';

const HIDDEN_PRODUCT_TAG = 'hidden'; // Products tagged 'hidden' won't be indexed

export async function generateMetadata(props: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const product = await getProduct(params.handle);

  if (!product) return notFound();

  const { url, width, height, altText: alt } = product.featuredImage || {};
  const indexable = !product.tags.includes(HIDDEN_PRODUCT_TAG);

  return {
    title: product.seo.title || product.title,
    description: product.seo.description || product.description,
    robots: {
      index: indexable,
      follow: indexable,
      googleBot: {
        index: indexable,
        follow: indexable,
      },
    },
    openGraph: url ? {
      title: product.seo.title || product.title,
      description: product.seo.description || product.description,
      images: [{
        url,
        width,
        height,
        alt,
      }],
    } : undefined,
  };
}

export default async function ProductPage(props: {
  params: Promise<{ handle: string }>;
}) {
  const params = await props.params;
  const product = await getProduct(params.handle);

  if (!product) return notFound();

  // JSON-LD Structured Data
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.featuredImage.url,
    offers: {
      '@type': 'AggregateOffer',
      availability: product.availableForSale
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      highPrice: product.priceRange.maxVariantPrice.amount,
      lowPrice: product.priceRange.minVariantPrice.amount,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd),
        }}
      />
      {/* Rest of product page */}
    </>
  );
}
```

4. **`lib/constants.ts`** - Add hidden tag constant:
```typescript
export const HIDDEN_PRODUCT_TAG = 'hidden';
```

#### Testing Checklist
- [ ] Product metadata uses Shopify seo field
- [ ] Fallback to product.title/description if seo empty
- [ ] JSON-LD schema validates (use Google Rich Results Test)
- [ ] Hidden products have noindex/nofollow
- [ ] OpenGraph images from featuredImage
- [ ] Currency and price display correctly in schema

---

### Task 2.4: Collection/Category Pages CMS
**Agent:** Collection CMS Agent
**Priority:** P2 (Nice to Have)
**Duration:** 2 hours
**Dependencies:** Task 1.1

#### Objective
Add metadata and descriptions for collection pages.

#### Files to Modify

1. **`lib/shopify/fragments/collection.ts`** - Add seo:
```typescript
import seoFragment from './seo';

const collectionFragment = /* GraphQL */ `
  fragment collection on Collection {
    id
    handle
    title
    description
    seo { ...seo }  /* New */
    updatedAt
  }
  ${seoFragment}
`;
```

2. **`app/products/[collection]/page.tsx`** - Add metadata:
```typescript
import type { Metadata } from 'next';
import { getCollection } from '@/lib/shopify';

export async function generateMetadata(props: {
  params: Promise<{ collection: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const collection = await getCollection(params.collection);

  if (!collection) {
    return {
      title: 'Collection Not Found',
      description: 'The collection you are looking for does not exist.',
    };
  }

  return {
    title: collection.seo.title || collection.title,
    description: collection.seo.description || collection.description,
    openGraph: {
      title: collection.seo.title || collection.title,
      description: collection.seo.description || collection.description,
    },
  };
}
```

#### Testing Checklist
- [ ] Collection metadata from Shopify
- [ ] Collection descriptions render
- [ ] SEO fallback to title/description works

---

### Task 3.1: Homepage Content Blocks
**Agent:** Homepage CMS Agent
**Priority:** P1 (Should Have)
**Duration:** 4-5 hours
**Dependencies:** None (can run parallel with Wave 2)

#### Objective
Make homepage hero and category sections fully editable via Shopify metaobjects.

#### Metaobject Definitions

**Type 1:** `homepage_hero`

| Field Key | Field Name | Type | Required |
|-----------|------------|------|----------|
| `heading` | Heading | single_line_text_field | Yes |
| `subheading` | Subheading | multi_line_text_field | Yes |
| `cta_primary_text` | Primary Button Text | single_line_text_field | Yes |
| `cta_primary_url` | Primary Button URL | single_line_text_field | Yes |
| `cta_secondary_text` | Secondary Button Text | single_line_text_field | No |
| `cta_secondary_url` | Secondary Button URL | single_line_text_field | No |
| `background_image` | Background Image | file_reference | Yes |

**Type 2:** `homepage_section`

| Field Key | Field Name | Type | Required |
|-----------|------------|------|----------|
| `section_type` | Section Type | single_line_text_field | Yes |
| `heading` | Heading | single_line_text_field | Yes |
| `description` | Description | multi_line_text_field | No |
| `sort_order` | Sort Order | number_integer | Yes |
| `enabled` | Enabled | boolean | Yes |

#### Files to Create

1. **`scripts/setup-homepage-metaobjects.ts`** (migration script)
2. **`lib/shopify/queries/homepage.ts`** (GraphQL queries)
3. **`types/homepage.ts`** (TypeScript types)

#### Files to Modify

1. **`app/page.tsx`** - Refactor to fetch from Shopify
2. **`components/HeroSection.tsx`** - Accept data props
3. **`components/CategorySection.tsx`** - Accept data props

#### Testing Checklist
- [ ] Hero section editable in Shopify
- [ ] Hero background image displays
- [ ] CTAs link correctly
- [ ] Category sections render from Shopify
- [ ] Section ordering by sort_order works
- [ ] Disabled sections don't render

---

### Task 3.2: About Page CMS
**Agent:** About Page Agent
**Priority:** P2 (Nice to Have)
**Duration:** 2-3 hours
**Dependencies:** Task 2.2

#### Objective
Make about page content editable via metaobjects.

#### Metaobject Definitions

**Type 1:** `about_page`

| Field Key | Field Name | Type | Required |
|-----------|------------|------|----------|
| `heading` | Page Heading | single_line_text_field | Yes |
| `intro_text` | Introduction Text | rich_text_field | Yes |
| `cta_text` | CTA Button Text | single_line_text_field | No |
| `cta_url` | CTA Button URL | single_line_text_field | No |

**Type 2:** `about_story_section`

| Field Key | Field Name | Type | Required |
|-----------|------------|------|----------|
| `title` | Section Title | single_line_text_field | Yes |
| `content` | Section Content | rich_text_field | Yes |
| `image` | Section Image | file_reference | No |
| `sort_order` | Sort Order | number_integer | Yes |

#### Files to Create

1. **`scripts/setup-about-page.ts`**
2. **`lib/shopify/queries/about.ts`**
3. **`types/about.ts`**

#### Files to Modify

1. **`app/about/page.tsx`** - Fetch from Shopify

---

### Task 3.3: Contact Page Enhancement
**Agent:** Contact Page Agent
**Priority:** P2 (Nice to Have)
**Duration:** 1-2 hours
**Dependencies:** Task 2.2

#### Objective
Make contact page content editable.

#### Metaobject Definition

**Type:** `contact_page`

| Field Key | Field Name | Type | Required |
|-----------|------------|------|----------|
| `heading` | Page Heading | single_line_text_field | Yes |
| `description` | Description Text | multi_line_text_field | Yes |
| `email_display` | Email Address | single_line_text_field | No |
| `phone_display` | Phone Number | single_line_text_field | No |
| `business_hours` | Business Hours | multi_line_text_field | No |

#### Files to Create

1. **`scripts/setup-contact-page.ts`**
2. **`lib/shopify/queries/contact.ts`**

---

### Task 4.1: Webhook Integration
**Agent:** Webhook Agent
**Priority:** P0 (MVP Required)
**Duration:** 2-3 hours
**Dependencies:** Tasks 2.1, 2.2, 2.3

#### Objective
Implement Shopify webhooks for automatic cache revalidation.

#### Reference
See `/references/commerce/app/api/revalidate/route.ts`

#### Files to Create

**`app/api/revalidate/route.ts`**
```typescript
import { revalidateTag } from 'next/cache';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { TAGS } from '@/lib/constants';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest): Promise<NextResponse> {
  const headersList = await headers();
  const topic = headersList.get('x-shopify-topic') || 'unknown';
  const secret = req.nextUrl.searchParams.get('secret');

  // Validate secret
  if (!secret || secret !== process.env.SHOPIFY_REVALIDATION_SECRET) {
    console.error('Invalid revalidation secret');
    return NextResponse.json({ status: 401, message: 'Unauthorized' });
  }

  console.log(`[Webhook] Received: ${topic}`);

  // Revalidate based on topic
  const topicMap: Record<string, string[]> = {
    'products/create': [TAGS.products],
    'products/update': [TAGS.products],
    'products/delete': [TAGS.products],
    'collections/create': [TAGS.collections],
    'collections/update': [TAGS.collections],
    'collections/delete': [TAGS.collections],
    // Add more as needed
  };

  const tagsToRevalidate = topicMap[topic];

  if (tagsToRevalidate) {
    tagsToRevalidate.forEach((tag) => {
      console.log(`[Webhook] Revalidating tag: ${tag}`);
      revalidateTag(tag);
    });
  }

  return NextResponse.json({
    status: 200,
    revalidated: true,
    topic,
    tags: tagsToRevalidate || [],
    now: Date.now(),
  });
}
```

#### Shopify Admin Configuration

**Settings > Notifications > Webhooks**

Create webhooks pointing to: `https://your-domain.com/api/revalidate?secret=YOUR_SECRET`

Webhooks to create:
- `products/create`
- `products/update`
- `products/delete`
- `collections/create`
- `collections/update`
- `collections/delete`

#### Environment Variables

Add to `.env.local`:
```bash
SHOPIFY_REVALIDATION_SECRET=your-random-secret-here
```

#### Testing Checklist
- [ ] Webhook endpoint responds with 401 for invalid secret
- [ ] Webhook endpoint responds with 200 for valid secret
- [ ] Product update triggers TAGS.products revalidation
- [ ] Collection update triggers TAGS.collections revalidation
- [ ] Cache actually updates (verify in browser)
- [ ] Webhook logs appear in Vercel/server logs

---

### Task 4.2: Error Handling Enhancement
**Agent:** Error Handling Agent
**Priority:** P1 (Should Have)
**Duration:** 2 hours
**Dependencies:** None

#### Objective
Improve error handling across Shopify API calls.

#### Files to Modify

1. **`lib/type-guards.ts`** - Enhance:
```typescript
export interface ShopifyErrorLike {
  status: number;
  message: Error;
  cause?: Error;
}

export const isShopifyError = (error: unknown): error is ShopifyErrorLike => {
  if (!error || typeof error !== 'object') return false;
  if (error instanceof Error) return true;

  return (
    'status' in error &&
    'message' in error &&
    typeof error.status === 'number'
  );
};
```

2. **`lib/shopify/index.ts`** - Improve shopifyFetch error handling
3. **`app/error.tsx`** - Add better error messages

#### Testing Checklist
- [ ] GraphQL errors logged with query context
- [ ] Network errors handled gracefully
- [ ] User-friendly error messages displayed
- [ ] Errors reported to Sentry (if configured)

---

### Task 4.3: Performance Optimization
**Agent:** Performance Agent
**Priority:** P1 (Should Have)
**Duration:** 2-3 hours
**Dependencies:** All Wave 2 & 3 tasks

#### Objective
Optimize cache strategies and query performance.

#### Tasks

1. **Cache Audit**
   - Review all cache tags
   - Ensure appropriate cache lifetimes
   - Remove unused cache entries

2. **Query Optimization**
   - Remove unused fields from GraphQL queries
   - Combine queries where possible
   - Implement pagination for large datasets

3. **Image Optimization**
   - Verify Next.js Image component usage
   - Implement blur placeholders
   - Lazy load below-fold images

4. **Prefetching**
   - Add `prefetch={true}` to critical navigation links
   - Implement route prefetching for menu items

#### Testing Checklist
- [ ] Lighthouse score ≥ 90 (Performance)
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3.5s
- [ ] No console warnings
- [ ] No unnecessary re-renders

---

### Task 5.1: Update Documentation
**Agent:** Documentation Agent
**Priority:** P0 (Required)
**Duration:** 2-3 hours
**Dependencies:** All previous tasks

#### Files to Create

1. **`docs/SHOPIFY_CMS_GUIDE.md`**
   - Overview of CMS capabilities
   - Business user guide for editing content
   - Screenshots of Shopify Admin

2. **`docs/MENU_MANAGEMENT.md`**
   - How to create/edit menus
   - Menu structure guidelines
   - Troubleshooting

3. **`docs/METADATA_MANAGEMENT.md`**
   - How to edit page metadata
   - SEO best practices
   - OpenGraph setup

#### Files to Modify

1. **`CLAUDE.md`** - Update with new patterns
2. **`README.md`** - Add CMS features section

---

### Task 5.2: End-to-End Testing
**Agent:** QA Agent
**Priority:** P0 (Required)
**Duration:** 2-3 hours
**Dependencies:** All previous tasks

#### Testing Matrix

| Feature | Desktop | Mobile | Test Status |
|---------|---------|--------|-------------|
| Header Menu | ☐ | ☐ | Pending |
| Footer Menu | ☐ | ☐ | Pending |
| Homepage Metadata | ☐ | ☐ | Pending |
| Product Metadata | ☐ | ☐ | Pending |
| Gallery Page | ☐ | ☐ | Pending |
| About Page | ☐ | ☐ | Pending |
| Contact Page | ☐ | ☐ | Pending |
| Cart Functionality | ☐ | ☐ | Pending |
| Checkout Flow | ☐ | ☐ | Pending |
| Search | ☐ | ☐ | Pending |
| Cache Revalidation | ☐ | ☐ | Pending |
| Error Handling | ☐ | ☐ | Pending |

---

## Shopify Configuration Required

### Menus
1. Navigate to **Navigation > Menus**
2. Create header menu (handle: `fern-fog-header-menu`)
3. Create footer menu (handle: `fern-fog-footer-menu`)

### Metaobjects
All metaobject definitions will be created via migration scripts:
- `page_metadata` (Task 2.2)
- `homepage_hero` (Task 3.1)
- `homepage_section` (Task 3.1)
- `about_page` (Task 3.2)
- `about_story_section` (Task 3.2)
- `contact_page` (Task 3.3)
- `gallery_page_settings` (Already exists)
- `gallery_category` (Already exists)
- `gallery_item` (Already exists)

### Webhooks
Navigate to **Settings > Notifications > Webhooks**

Configure webhooks for:
- `products/create`
- `products/update`
- `products/delete`
- `collections/create`
- `collections/update`
- `collections/delete`

Webhook URL: `https://your-domain.com/api/revalidate?secret=YOUR_SECRET`

---

## Testing Strategy

### Unit Testing
Each task should include:
- Component render tests
- Data reshaping tests
- Error handling tests

### Integration Testing
After each wave:
- Test data flow from Shopify to UI
- Verify cache behavior
- Check error states

### E2E Testing
Final comprehensive testing:
- Full user flows
- Cross-browser testing
- Mobile testing
- Performance testing

---

## Rollback Plan

### Per-Task Rollback
Each task should be implemented in a feature branch:
```bash
git checkout -b task/2.1-menu-system
# Make changes
git commit -m "feat: implement menu system"
# If issues arise:
git checkout main
git branch -D task/2.1-menu-system
```

### Emergency Rollback
If critical issues discovered in production:

1. **Disable caching** (immediate fix):
```typescript
// Comment out in affected functions
// 'use cache';
// cacheTag(TAGS.menus);
```

2. **Revert to hardcoded content** (if needed):
   - Keep old components in `components/legacy/`
   - Swap imports in layouts

3. **Disable webhooks** in Shopify Admin

---

## Success Metrics

### Business Impact
- ✅ Content update time: from hours (code deploy) to minutes (Shopify edit)
- ✅ Non-technical users can manage all content
- ✅ Reduced developer dependency for content changes

### Technical Metrics
- ✅ Page load time: ≤ current performance
- ✅ Lighthouse score: ≥ 90
- ✅ Cache hit rate: ≥ 80%
- ✅ Error rate: < 0.1%

### SEO Impact
- ✅ All pages have proper metadata
- ✅ Structured data validates
- ✅ OpenGraph tags present
- ✅ No broken links

---

## Task Assignment Template

When delegating to an AI agent, use this template:

```markdown
# Task Assignment: [Task Number and Name]

## Context
You are working on the Fern & Fog Creations e-commerce site, converting it to use Shopify as a full CMS.

## Your Task
[Copy relevant section from roadmap]

## Reference Files
- Read: `/references/commerce/[relevant files]`
- Modify: [list of files from roadmap]

## Dependencies
[List any tasks that must complete first]

## Acceptance Criteria
[Copy checklist from roadmap]

## Additional Context
- Project uses Next.js 16 App Router
- All Shopify data fetching uses Server Components
- Follow patterns from Next.js Commerce reference
- See CLAUDE.md for project conventions

## Deliverables
1. All code changes committed
2. Migration scripts tested (dry-run mode)
3. Documentation updated
4. Tests passing
```

---

## Appendix A: Environment Variables Reference

```bash
# Shopify Storefront API (required)
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-token

# Shopify Admin API (for migrations)
SHOPIFY_ADMIN_ACCESS_TOKEN=your-admin-token

# Webhook Secret (Task 4.1)
SHOPIFY_REVALIDATION_SECRET=your-random-secret

# Optional
NEXT_PUBLIC_SITE_NAME="Fern & Fog Creations"
NEXT_PUBLIC_COMPANY_NAME="Fern & Fog Creations"
```

---

## Appendix B: Shopify API Permissions Required

### Storefront API
- `read_products`
- `read_collections`
- `read_product_listings`
- `read_customer_tags`
- `read_metaobjects`  ← **Critical for CMS features**

### Admin API (for migration scripts)
- `write_metaobject_definitions`
- `write_metaobjects`
- `read_metaobjects`

---

## Questions or Issues?

If you encounter problems during implementation:

1. Check the Next.js Commerce reference: `/references/commerce`
2. Review existing patterns in `lib/shopify/index.ts`
3. Consult `CLAUDE.md` for project conventions
4. Check Shopify GraphQL documentation: https://shopify.dev/docs/api/storefront

---

**End of Roadmap**
Last Updated: [Current Date]
Version: 1.0

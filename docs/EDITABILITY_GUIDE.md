# Fern & Fog Creations Website Editability Guide

**Last Updated:** November 16, 2025
**Version:** 1.0

## Executive Summary

The Fern & Fog Creations website uses a **hybrid architecture** combining multiple content management tools:

- **Builder.io** - Visual CMS for marketing pages and landing pages
- **Shopify** - E-commerce platform for products, cart, and checkout
- **Jotform** - Third-party contact form service
- **Hardcoded React Components** - Custom page templates and layouts

This guide documents which parts of the website can be edited with each tool, and which parts require developer code changes.

---

## Quick Reference Table

| Website Section | Editing Tool | Ease Level | Business User Friendly? |
|----------------|--------------|------------|------------------------|
| **Products** | Shopify Admin Dashboard | ✅ Easy | Yes |
| **Contact Form Fields** | Jotform Dashboard | ✅ Easy | Yes |
| **New Marketing Pages** | Builder.io Visual Editor | ✅ Easy | Yes |
| **Homepage** | Builder.io (with fallback) | ✅ Easy | Yes (when configured) |
| **Navigation Links** | Code Editor (fallback active) | ⚠️ Medium | No (requires developer) |
| **Footer Links** | Code Editor (fallback active) | ⚠️ Medium | No (requires developer) |
| **Categories** | Code Editor + Local Data | ❌ Hard | No (requires developer) |
| **Gallery Content** | Code Editor + Local Data | ❌ Hard | No (requires developer) |
| **About Page** (`/about`) | Code Editor | ❌ Hard | No (requires developer) |
| **Policy Pages** | Code Editor | ❌ Hard | No (requires developer) |
| **Product Page Templates** | Code Editor | ❌ Hard | No (requires developer) |
| **Cart/Checkout** | Shopify (data only) | N/A | Managed by Shopify |

---

## Tool Overview

### 1. Builder.io (Visual CMS)

**What It Is:** A visual drag-and-drop page builder that allows non-technical users to create and edit marketing pages without code.

**Access:** https://builder.io/content
**Login:** Requires Builder.io account with API key configured

**What You CAN Edit:**
- Any custom marketing page (e.g., `/about-us`, `/our-story`, `/blog/post-name`)
- Homepage (`/`) when Builder.io content is created
- Landing pages for campaigns or promotions
- Content using Fern & Fog custom components (see Component Library below)

**What You CANNOT Edit:**
- E-commerce pages (`/products`, `/product/*`, `/cart`)
- Existing hardcoded pages (`/about`, `/gallery`, `/contact`)
- Navigation menus (not configured yet, using fallback)
- Product data (use Shopify Admin instead)

**Environment Variables Required:**
```bash
BUILDER_PUBLIC_KEY=your-api-key
NEXT_PUBLIC_BUILDER_PUBLIC_KEY=your-api-key  # Same value
```

### 2. Shopify Admin Dashboard

**What It Is:** Shopify's backend platform for managing e-commerce operations.

**Access:** `https://[your-store].myshopify.com/admin`
**Login:** Requires Shopify store owner/staff credentials

**What You CAN Edit:**
- Products (add, edit, delete)
- Product variants (sizes, colors, materials)
- Inventory levels and tracking
- Product prices and compare-at prices
- Product images and descriptions
- Product tags and organization
- Product availability (draft, active, archived)

**What You CANNOT Edit:**
- Product page layout/template design
- Site navigation or header/footer
- Marketing pages or homepage content
- Gallery or about pages

**Environment Variables Required:**
```bash
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-token
NEXT_PUBLIC_USE_SHOPIFY=true
```

**Important:** In production, always use `NEXT_PUBLIC_USE_SHOPIFY=true` to enable Shopify mode.

### 3. Jotform Dashboard

**What It Is:** Third-party form builder service with built-in spam protection and email notifications.

**Access:** https://www.jotform.com/myforms
**Login:** Requires Jotform account credentials

**What You CAN Edit:**
- Contact form fields (add, remove, reorder)
- Field validation rules
- Form styling and theme
- Email notification settings
- Auto-responder emails
- Form submission logic

**What You CAN View:**
- All form submissions in real-time
- Export submissions to CSV/Excel
- Analytics and completion rates

**What You CANNOT Edit:**
- Contact page layout/design (requires code changes)
- Form embed location on the site

**Environment Variables Required:**
```bash
NEXT_PUBLIC_JOTFORM_FORM_ID=your-form-id
```

**Free Tier Limits:** 100 submissions/month with CAPTCHA included

### 4. Code Editor (Developer Required)

**What It Is:** Direct editing of React/TypeScript source code files in the codebase.

**Access:** Code repository (Git)
**Deployment:** Requires commit → push → Vercel deployment

**When Required:**
- Editing hardcoded pages (about, gallery, policy pages)
- Modifying product page templates
- Changing category definitions
- Updating navigation menus (when not using Builder.io)
- Adding new features or functionality
- Updating gallery content

**Tools Needed:**
- Code editor (VS Code, etc.)
- Git knowledge
- Understanding of React/TypeScript
- Access to deployment pipeline

---

## Detailed Section-by-Section Analysis

### 1. Homepage (`/`)

**Current Implementation:** Builder.io with hardcoded fallback

**Behavior:**
1. Site checks if Builder.io content exists for path `/`
2. If YES → Renders Builder.io page content
3. If NO → Renders hardcoded fallback components

**Hardcoded Fallback Components:**
- `HeroSection` - Main hero with background image
- `CategorySection` - 4-column category grid
- `FeaturedSectionOne` - Features with icons
- `FeaturedSectionTwo` - Secondary feature section
- `CollectionSection` - Featured collection showcase

**How to Edit:**

**Option A: Builder.io (Recommended)**
1. Log into Builder.io dashboard
2. Create a new "page" content entry
3. Set URL path to `/`
4. Drag and drop Fern & Fog custom components
5. Configure component properties
6. Publish
7. Homepage will automatically use Builder.io content

**Level:** ✅ Easy (no code changes needed)

**Option B: Edit Hardcoded Fallback**
- **File:** `app/page.tsx`
- **Tool:** Code editor
- **Level:** ❌ Hard (requires developer)

**Current State:** Likely using fallback (no Builder.io homepage created yet)

**File Location:** `app/page.tsx`

---

### 2. Products System

**Current Implementation:** Dual-mode (Shopify OR Local Data)

**Data Source Control:**
```bash
NEXT_PUBLIC_USE_SHOPIFY=true   # Production mode (use Shopify)
NEXT_PUBLIC_USE_SHOPIFY=false  # Development mode (use local data)
```

**Production Mode (Shopify):**
- Products fetched from Shopify Storefront API
- Cart managed via Shopify
- Real inventory tracking
- Real checkout and payments

**Development Mode (Local Data):**
- Products defined in `/data/products.ts`
- 16 sample products for development/testing
- No real checkout capability

**How to Edit Products:**

**In Production (Shopify Mode):**
1. Log into Shopify Admin: `https://[your-store].myshopify.com/admin`
2. Navigate to "Products"
3. Add/edit/delete products
4. Changes appear on site immediately (with cache revalidation)

**Level:** ✅ Easy (no code changes needed)

**In Development (Local Mode):**
- **File:** `data/products.ts`
- **Tool:** Code editor
- **Level:** ❌ Hard (requires developer + deployment)

**Product Page Templates:**
- **Files:** `app/(store)/products/page.tsx`, `app/product/[handle]/page.tsx`
- **Edit:** Code editor (requires developer)
- **Note:** Layout/design changes require code modifications

**Product Listing Pages:**
- All products: `/products`
- By collection: `/products/[collection]`
- Both are hardcoded React components with filtering UI

**Product Detail Pages:**
- Individual product: `/product/[handle]`
- Hardcoded React component with variant selector

**Builder.io Integration:**
- `ProductGridBlock` component can display products on marketing pages
- **Limitation:** Products must be manually entered in Builder.io
- **NOT connected to:** Shopify product catalog (no automatic sync)

---

### 3. Categories System

**Current Implementation:** Local data file (NOT connected to Shopify Collections)

**Storage Location:** `data/products.ts` (lines 427-456)

**Categories Defined:**
```typescript
{
  id: 'earrings',
  name: 'Sea Glass Earrings',
  slug: 'earrings',
  description: 'Found along rocky shores, tumbled by the sea.',
  image: '/stock-assets/categories/earrings.jpg'
}
// Additional categories: resin, driftwood, wall-hangings
```

**Display Components:**
- `CategorySection.tsx` - Hardcoded homepage section (reads from local data)
- `CategoryGridBlock.tsx` - Builder.io component (requires manual input)

**How to Edit Categories:**

**Option A: Edit Local Data File (For Site-Wide Changes)**
- **File:** `data/products.ts`
- **Edit:** Modify the `categories` array
- **Tool:** Code editor
- **Level:** ❌ Hard (requires developer + deployment)
- **Effect:** Updates all pages that use category data

**Option B: Builder.io Component (For Individual Pages)**
- **Component:** `CategoryGridBlock`
- **Tool:** Builder.io visual editor
- **Level:** ✅ Easy (drag, drop, configure)
- **Limitation:** Data is manually entered and NOT synced with local data file
- **Effect:** Only updates the specific page where component is used

**Option C: Future Shopify Collections Integration (Not Implemented)**
- Would require code changes to fetch from Shopify Collections API
- **Status:** Not currently available

**Important:** Categories are NOT automatically synced between:
- Local data file (`data/products.ts`)
- Builder.io components (`CategoryGridBlock`)
- Shopify Collections

**Recommendation:** For now, edit `data/products.ts` for persistent changes, then manually update Builder.io components if used.

---

### 4. Gallery System

**Current Implementation:** Hardcoded page + local data file

**Gallery Page:** `app/gallery/page.tsx`
- Interactive client component
- Category filter tabs (All, Earrings, Resin, Driftwood, Wall Hangings)
- Lightbox image viewer
- Hover effects and animations
- **NOT editable via Builder.io** (dedicated route)

**Gallery Data:** `data/gallery.ts`
- 12 gallery items with stories
- Each item includes: title, materials, story, image path, category
- Example:
  ```typescript
  {
    id: 'sea-glass-earrings-1',
    title: 'Ocean Blue Teardrops',
    materials: ['Sea Glass', 'Sterling Silver'],
    story: 'Found along the shores of Cape Cod...',
    image: '/stock-assets/gallery/earrings/sea-glass-earrings-1.jpg',
    category: 'earrings'
  }
  ```

**Gallery Images:** `public/stock-assets/gallery/`
- Organized by category subdirectories
- 11 image files currently
- Categories: earrings, resin, driftwood, wall-hangings

**Builder.io Component:** `GalleryPreviewBlock`
- Can be used on any Builder.io page
- Shows a preview/teaser of gallery items
- Data is manually entered in Builder.io (NOT connected to gallery data file)

**How to Edit Gallery:**

**1. Gallery Content (Stories, Materials, Metadata):**
- **File:** `data/gallery.ts`
- **Tool:** Code editor
- **Level:** ❌ Hard (requires developer + deployment)
- **Cannot use:** Builder.io (not integrated)

**2. Gallery Page Layout/Design:**
- **File:** `app/gallery/page.tsx`
- **Tool:** Code editor
- **Level:** ❌ Hard (requires developer)
- **Cannot use:** Builder.io (dedicated hardcoded route)

**3. Gallery Images:**
- **Location:** `public/stock-assets/gallery/`
- **Tool:** File system / Git
- **Process:** Add images → commit → push → deploy
- **Level:** ❌ Hard (requires deployment)

**4. Gallery Preview on Marketing Pages:**
- **Component:** `GalleryPreviewBlock`
- **Tool:** Builder.io visual editor
- **Level:** ✅ Easy (drag, drop, configure)
- **Limitation:** Data is separate from main gallery data file

**Current State:** Gallery is fully hardcoded and not integrated with Builder.io.

---

### 5. About Pages

**Current Implementation:** Mixed (hardcoded + Builder.io capable)

**Existing Hardcoded Page:**
- **Path:** `/about`
- **File:** `app/about/page.tsx`
- **Content:** Full "About Fern & Fog" page with story, process, values
- **Level:** ❌ Hard (requires code editor to edit)
- **Reason:** Exists as a dedicated route file (not handled by Builder.io catch-all)

**Builder.io Capable Paths:**
- `/about-us` - CAN be created in Builder.io
- `/our-story` - CAN be created in Builder.io
- `/team` - CAN be created in Builder.io
- Any custom URL not in reserved list

**How to Edit:**

**Option A: Edit Existing Hardcoded Page (`/about`)**
- **File:** `app/about/page.tsx`
- **Tool:** Code editor
- **Level:** ❌ Hard (requires developer)
- **Pros:** Full control, existing page
- **Cons:** Not business-user friendly

**Option B: Create New Builder.io Pages**
- **Paths:** `/about-us`, `/our-story`, etc.
- **Tool:** Builder.io visual editor
- **Level:** ✅ Easy (drag, drop, configure)
- **Pros:** Easy to edit without code
- **Cons:** Would have duplicate content, old `/about` page still exists

**Recommendation:**
- **For developers:** Migrate `/about` content to Builder.io at `/about-us`, then redirect `/about` → `/about-us`
- **For business users:** Create new marketing pages at different URLs using Builder.io

**Current State:** One hardcoded about page exists. New marketing pages can be created in Builder.io.

---

### 6. Contact Form

**Current Implementation:** Jotform (third-party service)

**Contact Page:** `app/contact/page.tsx`
- React component that embeds Jotform iframe
- Form ID from environment variable
- Page layout is hardcoded

**Form Management Platform:** Jotform.com

**How to Edit Contact Form:**

**1. Form Fields/Layout/Logic:**
- **Tool:** Jotform dashboard
- **URL:** https://www.jotform.com/myforms
- **Login:** Required (business owner's Jotform account)
- **Level:** ✅ Easy (no code changes needed)
- **Can Edit:**
  - Add/remove/reorder fields
  - Field validation rules
  - Form styling and theme
  - Email notification settings
  - Auto-responder emails
  - Conditional logic

**2. Contact Page Content (Heading/Description):**
- **File:** `app/contact/page.tsx`
- **Tool:** Code editor
- **Level:** ❌ Hard (requires developer + deployment)

**3. View Submissions:**
- **Tool:** Jotform dashboard
- **Features:**
  - Real-time submission view
  - Export to CSV/Excel
  - Email notifications (configurable)
  - Analytics and completion rates
- **Level:** ✅ Easy (no code needed)

**Form Features:**
- Built-in CAPTCHA/spam protection
- Email notifications (configured in Jotform)
- Submission management dashboard
- Free tier: 100 submissions/month

**Environment Variable:**
```bash
NEXT_PUBLIC_JOTFORM_FORM_ID=your-form-id
```

**Setup Guide:** See `GO_LIVE.md` for complete Jotform setup tutorial

---

### 7. Navigation & Footer

**Current Implementation:** Builder.io with hardcoded fallback

**Header Navigation:** `components/layout/HeaderWrapper.tsx`
- Fetches navigation from Builder.io via `getNavigation()`
- Falls back to default navigation if not configured

**Footer Navigation:** `components/layout/FooterWrapper.tsx`
- Fetches footer navigation from Builder.io via `getFooterNavigation()`
- Falls back to default navigation if not configured

**Navigation Config File:** `lib/builder/navigation.ts`

**Default Header Navigation:**
```typescript
[
  { name: 'Home', href: '/' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Shop', href: '/products' },
  { name: 'Contact', href: '/contact' },
  { name: 'About', href: '/about' },
]
```

**Default Footer Navigation:**
- **Shop Section:** Products, categories
- **About Section:** Story, gallery, contact
- **Policies Section:** Shipping, returns, privacy, terms

**How to Edit Navigation:**

**Option A: Builder.io (When Configured)**
- **Tool:** Builder.io dashboard
- **Model:** Create "navigation" content with ID "main-navigation"
- **Level:** ✅ Easy (no code changes needed)
- **Current State:** Likely NOT configured (using fallback)

**Option B: Edit Hardcoded Fallback (Current Method)**
- **File:** `lib/builder/navigation.ts`
- **Edit:** Modify default navigation arrays
- **Level:** ❌ Hard (requires developer)

**How to Edit Footer:**

**Option A: Builder.io (When Configured)**
- **Tool:** Builder.io dashboard
- **Model:** Create "footer" content with ID "main-footer"
- **Level:** ✅ Easy (no code changes needed)
- **Current State:** Likely NOT configured (using fallback)

**Option B: Edit Hardcoded Fallback (Current Method)**
- **File:** `lib/builder/navigation.ts`
- **Edit:** Modify default footer navigation object
- **Level:** ❌ Hard (requires developer)

**Current State:** Both navigation and footer support Builder.io management but are currently using hardcoded fallbacks.

**Recommendation:** Configure Builder.io navigation models to enable easy editing by business users.

---

### 8. Policy Pages

**Current Implementation:** Hardcoded static JSX

**Policy Pages:**
- Shipping Policy: `app/policies/shipping/page.tsx`
- Returns Policy: `app/policies/returns/page.tsx`
- Privacy Policy: `app/policies/privacy/page.tsx`
- Terms of Service: `app/policies/terms/page.tsx`

**Content:** Static placeholder text rendered as JSX

**Code Comment (from privacy/page.tsx):**
```typescript
// CURRENT IMPLEMENTATION: Static placeholder content rendered from JSX.
// MAINTENANCE: To update this policy, manually edit this file and commit changes.
// TODO: Integrate with Shopify Legal Pages API for dynamic content management.
```

**How to Edit Policy Pages:**

**Current Method:**
- **Files:** Individual policy page files in `app/policies/`
- **Tool:** Code editor
- **Level:** ❌ Hard (requires developer + deployment)
- **Not editable by:** Business users, Builder.io, Shopify Admin

**Future Option (Not Currently Implemented):**
- Shopify Admin has a "Policies" section
- Shopify Legal Pages API can provide policy content
- Would require code changes to integrate

**Current State:** Policy pages are completely hardcoded and require code changes to update.

**Recommendation:** Either:
1. Integrate with Shopify Legal Pages API (requires developer)
2. Migrate policy pages to Builder.io (requires developer to remove dedicated routes)
3. Continue manual code editing for infrequent updates

---

### 9. Cart & Checkout

**Current Implementation:** Shopify (fully managed)

**Cart Page:** `app/cart/page.tsx`
- Displays cart contents from Shopify
- Layout is hardcoded React component

**Checkout:**
- Managed entirely by Shopify
- Redirects to Shopify checkout URL
- No customization available without Shopify Plus

**How to Edit:**

**Cart/Checkout Functionality:**
- **Platform:** Shopify
- **Tool:** Shopify Admin dashboard
- **What You Can Configure:**
  - Shipping rates and zones
  - Payment methods
  - Tax settings
  - Checkout customizations (Shopify Plus only)

**Cart Page Layout:**
- **File:** `app/cart/page.tsx`
- **Tool:** Code editor
- **Level:** ❌ Hard (requires developer)

**Current State:** Cart data managed by Shopify, cart page template is hardcoded.

---

## Builder.io Custom Component Library

Fern & Fog Creations has 7 custom components registered in Builder.io's visual editor. These components maintain the coastal/woodland brand theme and are fully configurable without code.

### Available Components

#### 1. HeroBlock
**Purpose:** Full-width hero sections with background image and dual CTAs

**Configurable Properties:**
- Background image URL
- Heading text
- Description text
- Primary button (label + link)
- Secondary button (label + link)

**File:** `components/builder/blocks/HeroBlock.tsx`

**Use Cases:** Homepage hero, landing page hero, campaign headers

---

#### 2. CategoryGridBlock
**Purpose:** 4-column responsive category showcase grid

**Configurable Properties:**
- Section heading
- Section subheading
- Categories array (for each category):
  - Name
  - Slug
  - Description
  - Image URL
- "View All" link

**File:** `components/builder/blocks/CategoryGridBlock.tsx`

**Important:** Category data must be manually entered in Builder.io. NOT connected to `data/products.ts` categories.

**Use Cases:** Product category overview, shop navigation, collection showcases

---

#### 3. FeatureGridBlock
**Purpose:** 3-column feature grid with emoji icons

**Configurable Properties:**
- Section heading
- Section subheading
- Background color
- Features array (for each feature):
  - Name
  - Description
  - Emoji icon

**File:** `components/builder/blocks/FeatureGridBlock.tsx`

**Use Cases:** Product benefits, company values, process steps, why choose us

---

#### 4. ProductGridBlock
**Purpose:** Featured product grid display

**Configurable Properties:**
- Section heading
- Section subheading
- Products array (for each product):
  - Manual product data entry

**File:** `components/builder/blocks/ProductGridBlock.tsx`

**Important:** Products must be manually entered in Builder.io. NOT connected to Shopify product catalog.

**Use Cases:** Featured products, curated collections, product highlights

**Limitation:** No automatic Shopify sync - products must be manually updated

---

#### 5. GalleryPreviewBlock
**Purpose:** Gallery preview section with featured stories

**Configurable Properties:**
- Section heading
- Gallery items array (for each item):
  - Image URL
  - Title
  - Materials
  - Story text

**File:** `components/builder/blocks/GalleryPreviewBlock.tsx`

**Important:** Gallery data must be manually entered in Builder.io. NOT connected to `data/gallery.ts`.

**Use Cases:** Homepage gallery teaser, landing page gallery section

**Limitation:** Separate from main gallery page data

---

#### 6. TextBlock
**Purpose:** Flexible rich text content block

**Configurable Properties:**
- Section heading
- Rich text content (full WYSIWYG editor)
- Text alignment (left, center, right)
- Background color
- Max width constraint

**File:** `components/builder/blocks/TextBlock.tsx`

**Use Cases:** Long-form content, about sections, blog posts, policy excerpts

---

#### 7. CTABlock
**Purpose:** Call-to-action section with buttons

**Configurable Properties:**
- Section heading
- Description text
- Background color
- Primary button (label + link)
- Secondary button (label + link)

**File:** `components/builder/blocks/CTABlock.tsx`

**Use Cases:** Newsletter signups, shop now sections, contact CTAs, promotional offers

---

### Component Registration

All components are registered in: `components/builder/register-components.tsx`

**To Add New Components:**
1. Create component file in `components/builder/blocks/`
2. Register in `register-components.tsx`
3. Configure Builder.io inputs for editable properties
4. Deploy to make available in Builder.io visual editor

---

## Builder.io Protected Routes

Builder.io's catch-all route (`app/[...page]/page.tsx`) **excludes** these reserved paths. These routes will NEVER be handled by Builder.io:

### E-commerce Routes
- `/products` - Product listing page
- `/products/*` - All product collection pages
- `/product` - Product detail base
- `/product/*` - All individual product pages
- `/cart` - Shopping cart page
- `/checkout` - Checkout flow (if implemented)
- `/account` - User account pages (if implemented)

### System Routes
- `/api/*` - All API routes
- `/_next/*` - Next.js internal routes
- `/favicon.ico` - Favicon

### Configuration
**File:** `lib/builder/config.ts`

**Route Protection Logic:** `app/[...page]/page.tsx`

**Important:** You cannot create Builder.io pages at these paths. They are permanently reserved for e-commerce and system functionality.

---

## Environment Variables Reference

### Required for Production

**Builder.io:**
```bash
BUILDER_PUBLIC_KEY=your-api-key
NEXT_PUBLIC_BUILDER_PUBLIC_KEY=your-api-key  # Same value
```

**Shopify:**
```bash
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-token
NEXT_PUBLIC_USE_SHOPIFY=true  # Enable Shopify mode
```

**Jotform:**
```bash
NEXT_PUBLIC_JOTFORM_FORM_ID=your-form-id
```

### Optional Services

**Analytics:**
```bash
NEXT_PUBLIC_GA_ID=your-google-analytics-id
NEXT_PUBLIC_GTM_ID=your-google-tag-manager-id
```

**Error Tracking (Sentry):**
```bash
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
SENTRY_AUTH_TOKEN=your-auth-token
```

**Rate Limiting (Upstash Redis):**
```bash
UPSTASH_REDIS_REST_URL=your-upstash-url
UPSTASH_REDIS_REST_TOKEN=your-upstash-token
```

**Note:** Optional services gracefully disable if not configured. Site works normally without them.

---

## Recommendations for Improving Editability

### Short-Term (No Code Changes Required)

1. **Create Builder.io Homepage**
   - Create Builder.io page content for path `/`
   - Replace hardcoded fallback with visual editor content
   - **Impact:** Makes homepage editable by business users

2. **Create About Pages in Builder.io**
   - Create pages at `/about-us`, `/our-story`
   - Migrate content from hardcoded `/about` page
   - **Impact:** Makes about content editable without code

3. **Document Shopify Product Workflow**
   - Create guide for adding/editing products in Shopify Admin
   - **Impact:** Empowers business users to manage products

4. **Document Jotform Workflow**
   - Create guide for editing contact form in Jotform dashboard
   - **Impact:** Empowers business users to modify forms

### Medium-Term (Moderate Code Changes)

1. **Configure Builder.io Navigation**
   - Set up Builder.io "navigation" and "footer" models
   - Create content entries with IDs "main-navigation" and "main-footer"
   - **Impact:** Makes nav/footer editable without code

2. **Migrate Policy Pages to Builder.io**
   - Remove dedicated route files
   - Create Builder.io pages for each policy
   - **Impact:** Makes policies editable by business users

3. **Integrate Gallery with Builder.io**
   - Create Builder.io model for gallery items
   - Connect gallery page to fetch from Builder.io
   - **Impact:** Makes gallery editable without code

### Long-Term (Significant Code Changes)

1. **Connect Categories to Shopify Collections**
   - Replace `data/products.ts` categories with Shopify Collections API
   - Update `CategoryGridBlock` to fetch from Shopify
   - **Impact:** Single source of truth for categories in Shopify

2. **Integrate Product Grid with Shopify**
   - Update `ProductGridBlock` to fetch products from Shopify by tags/collection
   - Enable automatic product sync
   - **Impact:** Products automatically update on marketing pages

3. **Migrate About Page to Builder.io**
   - Remove `app/about/page.tsx` dedicated route
   - Allow Builder.io to handle `/about` path
   - Set up redirect if needed
   - **Impact:** Makes about page fully editable

4. **Integrate with Shopify Legal Pages API**
   - Fetch policy content from Shopify Admin "Policies" section
   - Remove hardcoded policy pages
   - **Impact:** Policies editable in Shopify Admin

---

## File Location Reference

### Builder.io Integration
- **Config:** `lib/builder/config.ts`
- **Content Resolver:** `lib/builder/resolve-content.ts`
- **Client Wrapper:** `components/builder/BuilderComponentClient.tsx`
- **SDK Init:** `components/builder/BuilderInit.tsx`
- **Component Registration:** `components/builder/register-components.tsx`
- **Cart Adapter:** `lib/builder/cart-adapter.ts`
- **Catch-All Route:** `app/[...page]/page.tsx`

### Custom Builder.io Components
- **HeroBlock:** `components/builder/blocks/HeroBlock.tsx`
- **CategoryGridBlock:** `components/builder/blocks/CategoryGridBlock.tsx`
- **FeatureGridBlock:** `components/builder/blocks/FeatureGridBlock.tsx`
- **ProductGridBlock:** `components/builder/blocks/ProductGridBlock.tsx`
- **GalleryPreviewBlock:** `components/builder/blocks/GalleryPreviewBlock.tsx`
- **TextBlock:** `components/builder/blocks/TextBlock.tsx`
- **CTABlock:** `components/builder/blocks/CTABlock.tsx`

### Hardcoded Pages
- **Homepage:** `app/page.tsx`
- **About:** `app/about/page.tsx`
- **Gallery:** `app/gallery/page.tsx`
- **Contact:** `app/contact/page.tsx`
- **Products:** `app/(store)/products/page.tsx`
- **Product Detail:** `app/product/[handle]/page.tsx`
- **Cart:** `app/cart/page.tsx`
- **Policies:** `app/policies/[policy]/page.tsx`

### Data Files
- **Products:** `data/products.ts`
- **Categories:** `data/products.ts` (lines 427-456)
- **Gallery:** `data/gallery.ts`

### Navigation
- **Header:** `components/layout/HeaderWrapper.tsx`
- **Footer:** `components/layout/FooterWrapper.tsx`
- **Navigation Config:** `lib/builder/navigation.ts`

### Shopify Integration
- **Main API:** `lib/shopify/index.ts`
- **Queries:** `lib/shopify/queries/`
- **Mutations:** `lib/shopify/mutations/`
- **Fragments:** `lib/shopify/fragments/`
- **Types:** `lib/shopify/types.ts`

---

## Deployment Requirements

### Code Changes
**Process:** Edit → Commit → Push → Vercel Deploy

**Requires Deployment:**
- Editing hardcoded pages (about, gallery, policies)
- Modifying data files (categories, gallery items)
- Updating navigation (if using fallback)
- Changing product page templates
- Adding new features

**Deployment Time:** ~2-5 minutes (Vercel automatic deployment)

### Builder.io Changes
**Process:** Edit in visual editor → Publish

**No Deployment Required:**
- Creating/editing Builder.io pages
- Updating Builder.io components
- Changing Builder.io content

**Update Time:** Instant (live immediately)

### Shopify Changes
**Process:** Edit in Shopify Admin → Save

**No Deployment Required:**
- Adding/editing products
- Updating inventory
- Changing prices
- Managing variants

**Update Time:** Instant (with cache revalidation, ~1-2 minutes)

### Jotform Changes
**Process:** Edit in Jotform dashboard → Save

**No Deployment Required:**
- Modifying form fields
- Updating email notifications
- Changing form logic

**Update Time:** Instant (live immediately)

---

## Support & Resources

### Builder.io Documentation
- **Official Docs:** https://www.builder.io/c/docs
- **Component Registration:** https://www.builder.io/c/docs/custom-components
- **Setup Guide:** See `docs/BUILDER_IO_SETUP.md`

### Shopify Documentation
- **Shopify Admin:** https://help.shopify.com/
- **Storefront API:** https://shopify.dev/docs/api/storefront
- **Product Management:** https://help.shopify.com/en/manual/products

### Jotform Documentation
- **Help Center:** https://www.jotform.com/help/
- **Form Builder Guide:** https://www.jotform.com/help/how-to-use-jotform/
- **Setup Guide:** See `GO_LIVE.md`

### Codebase Documentation
- **Project Overview:** `CLAUDE.md`
- **Go Live Checklist:** `GO_LIVE.md`
- **Content Management:** `docs/CONTENT_MANAGEMENT_GUIDE.md`
- **Builder.io Setup:** `docs/BUILDER_IO_SETUP.md`

---

## Changelog

### Version 1.0 (November 16, 2025)
- Initial documentation created
- Comprehensive analysis of all website sections
- Tool-by-tool capability breakdown
- Builder.io component library documentation
- Environment variables reference
- Recommendations for improving editability

---

**Document Maintained By:** Development Team
**Last Review Date:** November 16, 2025
**Next Review Date:** January 16, 2026

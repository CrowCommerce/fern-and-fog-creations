# Shopify 2.0 Liquid Theme Conversion Design

**Date:** 2026-01-19
**Status:** Approved
**Goal:** Convert Next.js headless storefront to Shopify 2.0 Liquid theme while maintaining exact aesthetics

---

## Motivation

Three equally important drivers:

1. **Client self-service** — Edit content, images, and layout through Shopify's theme editor without developer help
2. **App compatibility** — Integrate with Shopify apps (reviews, email/SMS marketing) that don't work well with headless
3. **Reduced maintenance** — Eliminate separate Next.js deployment and infrastructure complexity

---

## Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| CSS Framework | Tailwind CSS (with build process) | Reuse existing classes, faster conversion |
| JavaScript | Alpine.js | Lightweight, pairs with Tailwind, declarative like React |
| Filtering | Hybrid (Shopify native + Alpine UX) | App compatibility + polished UX |
| Content Management | Section-based (not metaobjects) | Single editing location for client |
| Rollout | Big bang | Complete build, test, then switch |

**Target app integrations:**
- Reviews (Judge.me, Loox, Stamped, etc.)
- Email/SMS marketing (Klaviyo, Omnisend)

---

## Theme Architecture

```
fern-and-fog-theme/
├── assets/
│   ├── application.css          # Compiled Tailwind + custom styles
│   ├── application.js           # Alpine.js + custom scripts
│   └── fonts/                   # Cormorant Garamond, Inter
├── config/
│   ├── settings_schema.json     # Theme settings (colors, fonts, etc.)
│   └── settings_data.json       # Default values
├── layout/
│   └── theme.liquid             # Base layout (head, header, footer)
├── sections/
│   ├── header.liquid            # Sticky header with nav, search, cart
│   ├── footer.liquid            # Footer with links, newsletter
│   ├── hero.liquid              # Homepage hero (full CMS control)
│   ├── featured-collection.liquid
│   ├── collection-filters.liquid
│   └── ...                      # One per major UI block
├── snippets/
│   ├── product-card.liquid      # Reusable product card
│   ├── price.liquid             # Price display with variants
│   ├── cart-drawer.liquid       # Slide-out cart
│   ├── search-modal.liquid      # Search dialog
│   └── icon-*.liquid            # SVG icons
├── templates/
│   ├── index.json               # Homepage
│   ├── collection.json
│   ├── product.json
│   ├── page.about.json
│   ├── page.contact.json
│   ├── page.gallery.json
│   └── cart.json
├── src/                         # Source files (not deployed)
│   ├── tailwind.css
│   └── scripts/
│       ├── alpine-init.js
│       ├── cart.js
│       ├── filters.js
│       └── search.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── locales/
    └── en.default.json
```

---

## Tailwind Configuration

```js
// tailwind.config.js
module.exports = {
  content: ['./**/*.liquid', './src/**/*.js'],
  theme: {
    extend: {
      colors: {
        moss: '#33593D',
        fern: '#4F7942',
        parchment: '#F5F0E6',
        bark: '#5B4636',
        mist: '#E6ECE8',
        gold: '#C5A05A',
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
}
```

---

## Sections & Settings

### Homepage (`templates/index.json`)

| Section | Editable Settings |
|---------|-------------------|
| `hero.liquid` | Heading, description, background image, CTA buttons (text + URLs), overlay opacity |
| `featured-collection.liquid` | Collection picker, heading, product count, layout (grid/carousel) |
| `category-section.liquid` | Heading, description, collection cards with images |
| `spotlight-card.liquid` | Image, heading, text, link |

### Collection Page (`templates/collection.json`)

| Section | Editable Settings |
|---------|-------------------|
| `collection-banner.liquid` | Show/hide banner, overlay color |
| `collection-filters.liquid` | Enable/disable filter types, price range toggle, layout |
| `product-grid.liquid` | Products per row (mobile/desktop), pagination style |

### Product Page (`templates/product.json`)

| Section | Editable Settings |
|---------|-------------------|
| `product-gallery.liquid` | Thumbnail position, zoom behavior, aspect ratio |
| `product-info.liquid` | Show/hide elements (vendor, SKU, materials) |
| `product-recommendations.liquid` | Heading, product count |
| `app-block-container.liquid` | Container for reviews apps |

### Custom Pages

| Template | Sections |
|----------|----------|
| `page.about.json` | about-hero, about-story, about-values |
| `page.contact.json` | contact-info, contact-form |
| `page.gallery.json` | gallery-grid (with category filtering) |

---

## Alpine.js Components

| Current (React) | Liquid + Alpine.js |
|-----------------|-------------------|
| `ShoppingCartDrawer.tsx` | `snippets/cart-drawer.liquid` with `x-show`, `x-transition` |
| `Header.tsx` mobile menu | `sections/header.liquid` with `x-data="{ mobileOpen: false }"` |
| `SearchDialog.tsx` | `snippets/search-modal.liquid` with predictive search API |
| `MobileFilterDrawer.tsx` | `snippets/filter-drawer.liquid` |
| `Lightbox.tsx` | `snippets/lightbox.liquid` with keyboard navigation |
| `VariantDropdown.tsx` | Native `<select>` styled with Tailwind or Alpine dropdown |

Cart updates use Shopify's AJAX Cart API (`/cart/add.js`, `/cart/change.js`).

---

## Filtering (Hybrid Approach)

**Shopify Native (backend):**
- Price range
- Availability
- Product options (size, color)
- Metafields (materials, etc.)

**Alpine.js (frontend UX):**
- `x-model` bindings for instant visual feedback
- URL updates via `history.pushState`
- Debounced fetch for smooth transitions
- Animated product grid swap
- Mobile filter drawer
- Active filter pills with "Clear all"

---

## Header & Footer

**Header settings:**
- Logo image (optional, falls back to text)
- Menu picker (Shopify native menu system)
- Sticky toggle
- Background color override

**Footer settings:**
- Multiple menu pickers (columns)
- Newsletter signup toggle + heading
- Social media links (blocks)
- Copyright text
- Tagline toggle

Newsletter includes hook point for Klaviyo/Omnisend injection.

---

## Development Workflow

**Scripts:**
```json
{
  "scripts": {
    "css:build": "tailwindcss -i src/tailwind.css -o assets/application.css --minify",
    "css:watch": "tailwindcss -i src/tailwind.css -o assets/application.css --watch",
    "js:build": "esbuild src/scripts/*.js --bundle --outfile=assets/application.js --minify",
    "js:watch": "esbuild src/scripts/*.js --bundle --outfile=assets/application.js --watch",
    "dev": "npm-run-all --parallel css:watch js:watch",
    "build": "npm-run-all css:build js:build"
  }
}
```

**Development flow:**
1. Terminal 1: `npm run dev` (watches CSS/JS)
2. Terminal 2: `shopify theme dev` (syncs to Shopify, opens preview)
3. Edit Liquid → instant preview refresh
4. Edit CSS/JS → rebuild → preview refreshes

**Deployment:** Run `npm run build`, commit assets, push to theme.

---

## Conversion Phases

### Phase 1: Foundation
- Theme scaffold via Shopify CLI
- Tailwind setup (config, build process)
- Base layout (`layout/theme.liquid`)
- Font loading

### Phase 2: Core Components
- Header section
- Footer section
- Cart drawer snippet
- Search modal snippet
- Product card snippet

### Phase 3: Page Templates
- Homepage (`templates/index.json`)
- Collection page (`templates/collection.json`)
- Product page (`templates/product.json`)
- About page (`templates/page.about.json`)
- Contact page (`templates/page.contact.json`)
- Gallery page (`templates/page.gallery.json`)
- Cart page (`templates/cart.json`)
- Policy pages (`templates/policy.json`)

### Phase 4: Polish
- Predictive search functionality
- Filter UX enhancements
- App block containers for reviews
- Cross-device testing

---

## File Mapping Reference

| Next.js | Shopify |
|---------|---------|
| `app/layout.tsx` | `layout/theme.liquid` |
| `app/page.tsx` | `templates/index.json` |
| `app/(store)/products/` | `templates/collection.json` |
| `app/product/[handle]/` | `templates/product.json` |
| `app/about/` | `templates/page.about.json` |
| `app/contact/` | `templates/page.contact.json` |
| `app/gallery/` | `templates/page.gallery.json` |
| `app/cart/` | `templates/cart.json` |
| `app/policies/*` | `templates/policy.json` |
| `components/layout/Header.tsx` | `sections/header.liquid` |
| `components/layout/Footer.tsx` | `sections/footer.liquid` |
| `components/HeroSection.tsx` | `sections/hero.liquid` |
| `components/layout/ShoppingCartDrawer.tsx` | `snippets/cart-drawer.liquid` |
| `components/search/SearchDialog.tsx` | `snippets/search-modal.liquid` |
| `globals.css` | `tailwind.config.js` + `src/tailwind.css` |

---

## What Stays the Same

- Exact visual design (colors, typography, spacing, components)
- UX patterns (cart drawer, search modal, filter behavior)
- Mobile responsiveness
- All current pages and functionality

## What Improves

- Client can edit without developer
- Any Shopify app works out of the box
- No separate hosting/deployment to manage
- Native Shopify checkout (always up to date)

# Fern & Fog Creations - Shopify Theme

A modern Shopify 2.0 theme converted from Next.js + TailwindUI, maintaining pixel-perfect visual parity with Tailwind CSS styling preserved.

## 🎨 Design Tokens

This theme uses the following brand colors from the original Next.js application:

| Color Name | Hex Code | Usage |
|------------|----------|--------|
| Moss | `#33593D` | Dark green - primary accent |
| Fern | `#4F7942` | Medium green - hover states |
| Parchment | `#F5F0E6` | Background - warm off-white |
| Bark | `#5B4636` | Text - brown |
| Mist | `#E6ECE8` | Light gray - secondary backgrounds |
| Gold | `#C5A05A` | Accent - CTAs and highlights |

### Typography
- **Heading Font**: Cormorant Garamond (via Shopify font picker)
- **Body Font**: Inter (via Shopify font picker)

All colors and fonts are customizable through Shopify theme settings.

## 📁 Theme Structure

```
shopify-theme-tailwindui/
├── assets/
│   ├── theme.css          # Compiled Tailwind CSS
│   └── theme.js           # Vanilla JS for interactions
├── config/
│   ├── settings_schema.json  # Theme customization settings
│   └── settings_data.json    # Default values
├── layout/
│   └── theme.liquid       # Main layout template
├── locales/
│   └── en.default.json    # Translations
├── sections/
│   ├── header.liquid      # Header with navigation & cart
│   ├── footer.liquid      # Footer with links
│   ├── cart-drawer.liquid # Slide-out cart panel
│   ├── hero.liquid        # Homepage hero section
│   └── featured-collection.liquid  # Product grid
├── snippets/
│   ├── meta-tags.liquid   # SEO & social meta
│   ├── price.liquid       # Product price display
│   ├── product-card.liquid    # Product card component
│   └── add-to-cart-button.liquid  # Add to cart button
├── templates/
│   ├── index.json         # Homepage
│   ├── product.json       # Product pages
│   ├── collection.json    # Collection pages
│   └── cart.json          # Cart page
├── src/
│   └── tailwind-source.css    # Source CSS for Tailwind
├── package.json
└── tailwind.config.js
```

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or pnpm
- Shopify CLI (`npm install -g @shopify/cli @shopify/theme`)
- A Shopify development store

### Installation

1. **Navigate to the theme directory:**
   ```bash
   cd shopify-theme-tailwindui
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Shopify store connection:**

   Create a `.env` file in the theme root:
   ```bash
   cp .env.example .env
   ```

   Then edit `.env` and add your store URL:
   ```
   SHOPIFY_FLAG_STORE=your-store.myshopify.com
   ```

4. **Build Tailwind CSS:**
   ```bash
   npm run tailwind:build
   ```
   This compiles `src/tailwind-source.css` → `assets/theme.css`

### Development

**Option 1: Full development mode (Tailwind + Shopify)**
```bash
npm run dev
```
This runs both:
- `tailwindcss --watch` (rebuilds CSS on changes)
- `shopify theme dev` (syncs theme to dev store)

**Option 2: Tailwind only (if you're working on styles)**
```bash
npm run dev:css
```
Just watches and rebuilds Tailwind CSS without starting Shopify dev server.

**Option 3: Manual workflow**
```bash
# Terminal 1: Watch Tailwind
npm run tailwind:watch

# Terminal 2: Shopify dev server
npm run shopify:dev
```

**Option 4: Without .env file**
```bash
# Pass store directly as flag
shopify theme dev --store=your-store.myshopify.com
```

### Building for Production

```bash
npm run build
```
Compiles and minifies Tailwind CSS with PurgeCSS enabled.

### Deployment

```bash
npm run deploy
```
Builds CSS and pushes theme to your Shopify store.

## 🎯 Tailwind Configuration

### Purge Paths
The `tailwind.config.js` scans:
- `layout/**/*.liquid`
- `sections/**/*.liquid`
- `snippets/**/*.liquid`
- `templates/**/*.{liquid,json}`
- `assets/**/*.js`

### Safelisted Classes
The following dynamic classes are safelisted to prevent purging:
- All brand color utilities (`bg-moss`, `text-fern`, etc.)
- Hover states (`hover:bg-moss`, `hover:text-gold`)
- Font families (`font-display`, `font-sans`)

### Custom Utilities
Additional utilities defined in `src/tailwind-source.css`:
- `.ring-brand` - Custom focus ring
- `.parchment-texture` - Textured background
- `.leaf-divider` - Decorative divider
- `.skip-to-content` - Accessibility skip link

## 🧩 Key Features

### Shopify 2.0 Compliant
- ✅ JSON templates
- ✅ Section-based architecture
- ✅ Dynamic blocks support
- ✅ Schema-based customization
- ✅ App blocks ready

### Component Features
- **Header**: Sticky navigation, mobile menu, cart count indicator
- **Cart Drawer**: AJAX add-to-cart, quantity updates, slide-out panel
- **Product Cards**: Sale badges, sold-out indicators, responsive images
- **Hero Section**: Full-width banner with overlay, dual CTAs
- **Featured Collections**: Configurable product grids

### JavaScript Functionality
All interactivity uses vanilla JavaScript (no React runtime):
- Mobile menu toggle with animations
- Cart drawer open/close
- AJAX cart operations (add, update, remove)
- Add to cart form handling
- Variant selection (framework in place)

## 🛠 Customization

### Theme Settings
Merchants can customize via Shopify admin:
- Brand colors (6 color pickers)
- Typography (2 font pickers + base size)
- Page width (narrow/default/wide)
- Sticky header (on/off)
- Cart type (drawer/page)
- Product display options
- Social media links

### Adding Sections
Create new `.liquid` files in `/sections/` with schema:

```liquid
{% schema %}
{
  "name": "My Section",
  "settings": [
    {
      "type": "text",
      "id": "heading",
      "label": "Heading"
    }
  ],
  "presets": [{"name": "My Section"}]
}
{% endschema %}
```

## 📝 Design Token Mapping

| Next.js (CSS Variable) | Shopify Setting | Tailwind Class |
|------------------------|-----------------|----------------|
| `--moss` | `settings.color_moss` | `bg-moss` / `text-moss` |
| `--fern` | `settings.color_fern` | `bg-fern` / `text-fern` |
| `--parchment` | `settings.color_parchment` | `bg-parchment` / `text-parchment` |
| `--bark` | `settings.color_bark` | `bg-bark` / `text-bark` |
| `--mist` | `settings.color_mist` | `bg-mist` / `text-mist` |
| `--gold` | `settings.color_gold` | `bg-gold` / `text-gold` |
| `--font-cormorant` | `settings.font_heading` | `font-display` |
| `--font-inter` | `settings.font_body` | `font-sans` |

## 🧪 Testing & Validation

### Theme Check
```bash
npm run theme:check
```
Runs Shopify's official theme validator.

### Manual Testing Checklist
- [ ] Mobile menu opens/closes smoothly
- [ ] Cart drawer shows/updates items correctly
- [ ] Add to cart from product pages
- [ ] Product filtering and sorting
- [ ] Responsive layout on mobile/tablet/desktop
- [ ] Keyboard navigation and focus states
- [ ] Screen reader accessibility

## 📦 Metafields & Dynamic Content

This theme supports Shopify metafields for:
- Product additional info (materials, dimensions)
- Collection featured images
- Page custom content blocks

Add metafields via Shopify admin > Settings > Custom Data.

## 🔧 Troubleshooting

### CSS not updating
```bash
rm assets/theme.css
npm run tailwind:build
```

### Cart drawer not opening
Check browser console for JavaScript errors. Ensure `theme.js` is loaded.

### Colors not matching
Verify color values in:
1. Shopify admin > Theme settings > Colors
2. `config/settings_data.json`
3. `src/tailwind-source.css` CSS variables

## 📚 Resources

- [Shopify Theme Development](https://shopify.dev/docs/themes)
- [Shopify CLI Reference](https://shopify.dev/docs/themes/tools/cli)
- [Liquid Reference](https://shopify.dev/docs/api/liquid)
- [TailwindCSS Docs](https://tailwindcss.com/docs)

## 🎨 Original Next.js Stack

This theme was converted from:
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4
- **UI Components**: TailwindUI + Headless UI
- **Icons**: Heroicons

## 📄 License

MIT License - © 2024 Fern & Fog Creations

---

## 🚧 Missing Sections (To Be Implemented)

The following sections from the original Next.js app still need conversion:

- `main-product.liquid` - Full product detail page
- `related-products.liquid` - Related/recommended products
- `collection-banner.liquid` - Collection page header
- `main-collection.liquid` - Collection product grid with filters
- `main-cart.liquid` - Full cart page
- `cart-footer.liquid` - Cart totals and checkout

These can be added by following the patterns established in existing sections.

## 🎯 Performance Tips

1. **Image Optimization**: Use Shopify's `image_url` filter with appropriate widths
2. **Lazy Loading**: Images use `loading="lazy"` attribute
3. **CSS Purging**: Production builds remove unused Tailwind classes
4. **Minification**: Enable Shopify's asset minification in admin

## 🤝 Contributing

When adding new components:
1. Maintain Tailwind utility classes from original Next.js
2. Use Liquid templating for dynamic content
3. Add translations to `locales/en.default.json`
4. Test on mobile, tablet, and desktop
5. Run `shopify theme check` before committing

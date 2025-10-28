# Changelog

All notable changes to Fern & Fogs Creation.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.0.0] - 2025-10-21

### 🎉 Major Feature Release

This release adds advanced e-commerce features ported from Next.js Commerce TailwindUI template while preserving Fern & Fogs' unique brand identity.

### ✨ Added

#### Product Variants
- Product variant selector with real-time availability checking
- Support for multiple product options (Color, Size, Material, Chain Length, etc.)
- Visual indication of out-of-stock variants
- URL synchronization for shareable product+variant links
- Price range display for products with variants
- Variant-specific images (optional)
- Two sample products with full variant data:
  - Seafoam Glass Earrings (Color × Size = 6 variants)
  - Amber Wildflower Pendant (Chain Length × Finish = 6 variants)

#### Advanced Filtering
- Desktop sidebar filter panel
- Mobile slide-out filter drawer
- Category filter with product counts
- Price range filter with dual-handle slider
- Materials filter with auto-detected options
- URL parameter synchronization (shareable filter links)
- "Clear all filters" functionality
- Live result count updates
- Browser back/forward navigation support

#### Sorting
- Featured (default)
- Price: Low to High
- Price: High to Low
- Name: A-Z
- Newest First

#### Enhanced Cart
- Optimistic UI updates for instant feedback
- Undo functionality (last 5 actions)
- Loading states during transitions
- Variant information display in cart drawer
- Backward-compatible cart item structure
- History management (5-action limit)

#### UI Components
- `VariantSelector` - Interactive option selector
- `FilterPanel` - Desktop filter sidebar
- `MobileFilterDrawer` - Mobile filter drawer with Headless UI
- `CheckboxFilter` - Multi-select checkbox groups
- `PriceRangeFilter` - Dual-handle price slider

#### Custom Hooks
- `useVariantSelection` - Variant logic and availability checking
- `useFilters` - Filter state management and product filtering

#### Utility Functions
- `getVariantFromOptions` - Find variant by selected options
- `getAvailableOptionsForSelection` - Get available option values
- `formatPriceRange` - Format price range for display
- `getPriceRangeFromVariants` - Calculate price range
- `isSelectionAvailable` - Check variant availability
- `getCheapestVariant` - Find lowest-priced variant
- `formatVariantTitle` - Format variant title string

#### Type System
- `ProductVariant` type
- `ProductOption` type
- `PriceRange` type
- `FilterFacet` type
- `ActiveFilters` type
- `SortOption` type
- Enhanced `CartItem` type with variant support

#### Styles
- Custom animations: `animate-pulse-subtle`
- Transition utilities: `transition-opacity-fast`
- Focus ring utilities: `focus-ring-fern`
- Documented dynamic Tailwind classes for production builds

### 🔧 Changed

#### Cart Context
- Added `optimisticItems` property for instant UI updates
- Added `isPending` property for loading states
- Added `undoLastAction` method
- Added `canUndo` property
- Maintained 100% backward compatibility with existing API

#### Product Data Schema
- Added optional `variants` field
- Added optional `options` field
- Added optional `priceRange` field
- Existing products continue to work without modification

#### Products Page (`/products`)
- Complete redesign with filter sidebar (desktop) and drawer (mobile)
- Sort dropdown in header
- URL parameter integration
- Empty state with "Clear filters" button
- Mobile-responsive layout (1-col mobile, 4-col desktop)

#### Product Detail Page (`/products/[slug]`)
- Variant selector integration
- Dynamic pricing based on selected variant
- Availability checking per variant
- Variant information added to cart items
- Price range display

#### Cart Drawer
- Undo button appears after modifications
- Loading overlay during optimistic updates
- Variant title display for each item
- Improved empty state

### 📚 Documentation
- `FEATURES_ADDED.md` - Comprehensive feature documentation
- `MIGRATION_GUIDE.md` - Usage examples and migration steps
- `CHANGELOG.md` - This file
- Updated code comments throughout

### 🎨 Design
- Maintained Fern & Fogs brand colors (moss, fern, parchment, bark, mist, gold)
- Preserved existing typography (Cormorant Garamond + Inter)
- Consistent with existing component styling
- Mobile-first responsive design
- Accessibility-first approach

### ♿ Accessibility
- ARIA labels on all interactive elements
- ARIA live regions for cart updates
- Keyboard navigation support (Tab, Arrow keys, Enter/Space, Escape)
- Screen reader announcements for availability states
- Focus management in modals and drawers
- Minimum 48px tap targets on mobile

### ⚡ Performance
- Code-split filter components (only loaded on products page)
- Memoized filter computations with `useMemo`
- Optimistic updates reduce perceived latency
- URL updates use `scroll: false` to prevent jumps
- Build size increase: +2-3.5 kB per affected route

### ✅ Quality
- TypeScript strict mode compliance
- ESLint warnings fixed
- Build succeeds without errors
- 100% backward compatibility
- No breaking changes

---

## [1.0.0] - 2024-10-XX

### Initial Release
- Next.js 15 + React 19 + TypeScript
- Tailwind CSS v4
- Shopify GraphQL integration
- Cart with localStorage persistence
- Product catalog with 16 items
- Gallery with 12 portfolio items
- Contact form
- Basic routing structure

---

## Future Releases

### [2.1.0] - Planned
- Unit tests (Vitest + React Testing Library)
- E2E tests (Playwright)
- More products with variants
- Image optimization with next/image

### [3.0.0] - Under Consideration
- User authentication
- Account area (orders, addresses, profile)
- Real payment processing (Stripe)
- Server-side cart persistence
- Product reviews
- Wishlist functionality
- Email notifications

---

## Version Numbering

- **Major** (X.0.0): Breaking changes or major feature additions
- **Minor** (0.X.0): New features, backward compatible
- **Patch** (0.0.X): Bug fixes and minor improvements

---

## Links

- [Repository](https://github.com/yourusername/fern-and-fog-creations)
- [Documentation](./FEATURES_ADDED.md)
- [Migration Guide](./MIGRATION_GUIDE.md)

---

**Maintained by**: Claude Code + itsjusteric
**License**: MIT

# Stock Assets

This directory contains all static assets for the Fern & Fog Creations website, organized by type and category.

## Directory Structure

```
stock-assets/
├── hero/                      # Hero section background images
├── products/                  # Product images organized by category
│   ├── earrings/
│   ├── resin/
│   ├── driftwood/
│   └── wall-hangings/
├── gallery/                   # Gallery images organized by category
│   ├── earrings/
│   ├── resin/
│   ├── driftwood/
│   └── wall-hangings/
├── categories/                # Category preview images
└── icons/                     # SVG icons used throughout the site
```

## Asset Sources

All images were originally sourced from Unsplash and downloaded for local hosting. This ensures:
- Faster load times
- No external dependencies
- Consistent availability
- Ability to migrate to Shopify easily

## Notes

- **Woodland Memory Shadow Box**: The original Unsplash image (photo-1513519245088) was returning a 404 error, so it was replaced with an alternative woodland-themed image (photo-1516734212186).
- All images are optimized JPEGs at 800px width
- SVG icons are preserved from the original `/public/icons/` directory

## Usage

All files in this directory are referenced using absolute paths starting with `/stock-assets/` in:
- `src/data/products.ts` - Product images and category images
- `src/data/gallery.ts` - Gallery item images  
- `src/components/HeroSection.tsx` - Hero background image


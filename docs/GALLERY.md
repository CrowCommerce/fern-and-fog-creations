# Gallery System Documentation

**Last Updated:** November 16, 2025
**Version:** 2.0 (Consolidated)

---

## Table of Contents

### For Business Users
1. [Quick Start Guide](#quick-start-guide)
2. [Managing Gallery Items](#managing-gallery-items)
3. [Managing Categories](#managing-categories)
4. [Image Guidelines](#image-guidelines)
5. [Best Practices](#best-practices)

### For Developers
6. [Architecture Overview](#architecture-overview)
7. [Metaobject Schema](#metaobject-schema)
8. [Data Flow & Implementation](#data-flow--implementation)
9. [Migration Scripts](#migration-scripts)
10. [Adding New Fields](#adding-new-fields)

### Reference
11. [Migration History](#migration-history)
12. [Troubleshooting](#troubleshooting)

---

# For Business Users

## Quick Start Guide

The Gallery section showcases past handmade creations that have found their homes. You can manage everything through Shopify Admin—no coding required!

### What You Can Do
- ✅ Add new gallery items
- ✅ Edit existing items (photos, descriptions, materials)
- ✅ Delete items
- ✅ Create and manage categories
- ✅ Organize items for easy browsing

### Accessing Gallery Management

1. Log into Shopify Admin: `https://your-store.myshopify.com/admin`
2. Click **Content** in left sidebar
3. Click **Metaobjects**
4. Choose:
   - **Gallery Items** - to manage individual pieces
   - **Gallery Categories** - to manage category organization

---

## Managing Gallery Items

### Adding a New Gallery Item

#### Step 1: Create New Entry

1. Go to **Content → Metaobjects → Gallery Items**
2. Click **Add entry** (top right)

#### Step 2: Fill Out the Form

**Title** (Required)
- Display name for the piece
- Example: "Ocean Waves Resin Pendant"

**Category** (Required)
Choose from dropdown:
- **Earrings** - Sea glass, wire-wrapped, jewelry designs
- **Resin** - Pressed flowers, botanical art, pendants
- **Driftwood** - Carved driftwood, signs, wood art
- **Wall Hangings** - Woven pieces, tapestries, mounted art

**Image** (Required)
- Click **Add file** to upload
- See [Image Guidelines](#image-guidelines) below

**Materials** (Optional)
- Comma-separated list
- Example: `Sea glass, Copper wire, Vintage beads`

**Story** (Optional)
- Backstory or inspiration
- Keep personal and authentic
- Example: "Created from glass found on a foggy morning at Cannon Beach..."

**Created Date** (Optional)
- Format: YYYY-MM-DD (e.g., `2024-03-15`)
- Used for chronological organization

**Legacy ID** (Optional)
- Leave blank for new items
- Used for internal tracking only

#### Step 3: Save

1. Click **Save** (top right)
2. Item appears on website immediately (within ~1 minute)
3. View at: `your-website.com/gallery`

---

### Editing an Existing Gallery Item

1. Go to **Content → Metaobjects → Gallery Items**
2. Find and click the item
3. Make changes
4. Click **Save**

Changes appear within ~1 minute.

---

### Deleting a Gallery Item

1. Go to **Content → Metaobjects → Gallery Items**
2. Click the item
3. Click **Delete** button
4. Confirm deletion

⚠️ **Warning:** Deletions are permanent and cannot be undone.

---

## Managing Categories

Categories are fully editable—no developer needed!

### Accessing Categories

1. Go to **Content → Metaobjects → Gallery Categories**
2. You'll see: Earrings, Resin, Driftwood, Wall Hangings

### Adding a New Category

#### Step 1: Create Entry

1. Click **Add entry**
2. Fill out category form

#### Step 2: Fill Out Fields

**Name** (Required)
- Display name
- Example: "Sea Glass Jewelry"

**Slug** (Required)
- URL-friendly identifier (lowercase, no spaces)
- Example: "sea-glass-jewelry"
- Must be unique

**Description** (Optional)
- Brief description
- Example: "Handcrafted jewelry from natural sea glass"

**Sort Order** (Optional)
- Display order (1 = first)
- Leave blank to add at end

**Icon** (Optional)
- Emoji to represent category
- Example: 💎, 🌸, 🪵, 🧵

#### Step 3: Save

1. Click **Save**
2. Category appears immediately in filter dropdown

---

### Editing a Category

1. Go to **Content → Metaobjects → Gallery Categories**
2. Click the category
3. Update fields
4. Click **Save**

**Note:** Editing updates it for ALL gallery items using that category.

---

### Deleting a Category

⚠️ **Warning:** Cannot delete categories currently in use.

**To delete:**
1. Reassign all gallery items to different category
2. Go to **Content → Metaobjects → Gallery Categories**
3. Click category
4. Click **Delete**
5. Confirm

---

### Reordering Categories

Categories appear by **Sort Order**:

1. Edit each category
2. Set Sort Order number (1 = first, 2 = second, etc.)
3. Save
4. Filter dropdown auto-reorders

**Example:**
- Earrings: Sort Order = 1
- Resin: Sort Order = 2
- Driftwood: Sort Order = 3
- Wall Hangings: Sort Order = 4

---

## Image Guidelines

### Recommended Specifications

- **Format:** JPG or PNG
- **Size:** 1200x1200 pixels (square)
- **File Size:** Under 2 MB
- **Aspect Ratio:** 1:1 (square) preferred
- **Quality:** High resolution for clarity

### Tips for Great Photos

**Lighting**
- Use natural light
- Avoid harsh shadows
- Soft, diffused light shows detail

**Background**
- Clean, neutral backgrounds
- White, light gray, or wooden surfaces
- Avoid busy/distracting backgrounds

**Composition**
- Center piece in frame
- Fill most of frame with creation
- Shoot from directly above for flat items

**Editing**
- Crop to square (1:1 ratio)
- Adjust brightness if needed
- Keep colors natural and true-to-life

### Before Uploading

1. Resize to 1200x1200px
2. Compress to reduce file size (use TinyPNG.com)
3. Check that details are clear

---

## Best Practices

### Writing Stories

**Do:**
- ✅ Be personal and authentic
- ✅ Share inspiration or moment
- ✅ Keep brief (1-3 sentences)
- ✅ Use emotional, evocative language

**Don't:**
- ❌ Write long paragraphs
- ❌ Include pricing/sales info
- ❌ Use generic descriptions
- ❌ Forget to proofread

**Examples:**

✅ **Good:** "Found during a misty morning walk at Cannon Beach. The frosted aqua glass seemed to glow with its own light."

❌ **Not as Good:** "This is a pair of earrings made from sea glass. I made them last year."

---

### Material Lists

**Do:**
- ✅ List prominent materials first
- ✅ Be specific ("Copper wire" not "Wire")
- ✅ Use commas to separate
- ✅ Capitalize proper names

**Example:**
`Sea glass, Copper wire, Vintage brass beads, Sterling silver hooks`

---

### Titles

**Do:**
- ✅ Be descriptive and evocative
- ✅ Include key materials/theme
- ✅ Keep under 60 characters
- ✅ Use title case

**Examples:**
- "Ocean Whispers Resin Pendant"
- "Storm-Weathered Driftwood Sign"
- "Seafoam Sea Glass Earrings"

---

### Workflow Examples

#### Adding a New Piece

1. Take photos (good lighting, plain background)
2. Edit and crop to square (1200x1200px)
3. Log into Shopify Admin
4. Go to **Content → Metaobjects → Gallery Items**
5. Click "Add entry"
6. Fill in all fields
7. Click Save
8. View on website to confirm

#### Updating a Photo

1. Take new photo
2. Edit and optimize
3. Find item in Gallery Items
4. Click "Change" in Image field
5. Upload new photo
6. Save

#### Seasonal Refresh

Every 6 months:
1. Review all items
2. Delete items not representing current work
3. Add 3-5 new recent pieces
4. Update stories if needed
5. Ensure photo quality

---

# For Developers

## Architecture Overview

The gallery system uses Shopify Metaobjects as a headless CMS, allowing business users to manage content through Shopify Admin without code changes.

### System Diagram

```
┌─────────────────────────────────────────────┐
│         Shopify Admin Interface             │
│  (Business users manage gallery items)      │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│       Shopify Metaobjects API               │
│  (Stores gallery_item metaobjects)          │
└────────────────┬────────────────────────────┘
                 │
                 ▼ GraphQL Storefront API
┌─────────────────────────────────────────────┐
│         Next.js Server Component            │
│  (app/gallery/page.tsx - fetches data)      │
└────────────────┬────────────────────────────┘
                 │
                 ▼ Props
┌─────────────────────────────────────────────┐
│         Next.js Client Component            │
│  (GalleryClient.tsx - renders UI/filters)   │
└─────────────────────────────────────────────┘
```

### File Structure

```
lib/shopify/
├── index.ts                    # getGalleryItems(), reshaping
├── queries/gallery.ts          # GraphQL queries
└── types.ts                    # Shopify-specific types

types/
└── gallery.ts                  # GalleryItem, category types

app/gallery/
├── page.tsx                    # Server component
└── GalleryClient.tsx           # Client component

data/
└── gallery.ts                  # Legacy local data (reference)

scripts/
├── migrate-gallery.ts          # Main migration
├── migrate-gallery-categories.ts  # Category migration
├── fix-gallery-categories.ts   # Emergency fix
├── rollback-gallery.ts         # Rollback script
└── lib/
    ├── shopify-admin.ts        # Admin API client
    ├── upload-image.ts         # Image upload
    └── metaobject-operations.ts # CRUD operations
```

---

## Metaobject Schema

### Gallery Item Definition

**Type:** `gallery_item`
**Display Name:** Gallery Item
**Display Name Key:** `title`
**Storefront Access:** PUBLIC_READ

#### Field Definitions

| Field Key | Field Name | Type | Required | Description |
|-----------|------------|------|----------|-------------|
| `title` | Title | Single line text | Yes | Display name |
| `category` | Category | Metaobject reference | Yes | Reference to gallery_category |
| `image` | Image | File reference | Yes | Main image (MediaImage) |
| `materials` | Materials | Single line text | No | JSON array of materials |
| `story` | Story | Multi-line text | No | Backstory/inspiration |
| `for_sale` | For Sale | Boolean | No | Not used in UI |
| `created_date` | Created Date | Date | No | ISO date (YYYY-MM-DD) |
| `legacy_id` | Legacy ID | Single line text | No | Original data/gallery.ts ID |

---

### Gallery Category Definition

**Type:** `gallery_category`
**Display Name:** Gallery Category
**Display Name Key:** `name`
**Storefront Access:** PUBLIC_READ

#### Field Definitions

| Field Key | Field Name | Type | Required | Description |
|-----------|------------|------|----------|-------------|
| `name` | Name | Single line text | Yes | Display name |
| `slug` | Slug | Single line text | Yes | URL-friendly ID |
| `description` | Description | Multi-line text | No | Category description |
| `sort_order` | Sort Order | Number (integer) | No | Display order (1 = first) |

**Default Categories:**
- Earrings (slug: `earrings`, sort: 1)
- Resin (slug: `resin`, sort: 2)
- Driftwood (slug: `driftwood`, sort: 3)
- Wall Hangings (slug: `wall-hangings`, sort: 4)

---

## Data Flow & Implementation

### 1. Server Component Fetches Data

**File:** `app/gallery/page.tsx`

```typescript
export default async function GalleryPage() {
  const items = await getGalleryItems();
  const pageSettings = await getGalleryPageSettings();
  return <GalleryClient items={items} pageSettings={pageSettings} />;
}
```

---

### 2. Shopify Fetch Function

**File:** `lib/shopify/index.ts`

```typescript
export async function getGalleryItems(): Promise<GalleryItem[]> {
  // TEMP: Disable cache for debugging
  // 'use cache';
  // cacheTag(TAGS.gallery);
  // cacheLife('days');

  const res = await shopifyFetch<ShopifyGalleryItemsOperation>({
    query: getGalleryItemsQuery,
    variables: { first: 100 }
  });

  // Add null safety
  if (!res.body.data?.metaobjects?.nodes) {
    console.error('Gallery items query returned invalid data:', res.body);
    return [];
  }

  return reshapeGalleryItems(res.body.data.metaobjects.nodes);
}
```

---

### 3. GraphQL Query

**File:** `lib/shopify/queries/gallery.ts`

```graphql
query getGalleryItems($first: Int!) {
  metaobjects(type: "gallery_item", first: $first) {
    nodes {
      id
      handle
      fields {
        key
        value
        reference {
          ... on MediaImage {
            image {
              url
              altText
              width
              height
            }
          }
          ... on Metaobject {
            id
            handle
            type
            fields {
              key
              value
            }
          }
        }
      }
    }
  }
}
```

---

### 4. Reshaping Functions

**Converts Shopify format → Application format**

```typescript
const reshapeGalleryItem = (metaobject: ShopifyMetaobject): GalleryItem | null => {
  const getField = (key: string): string => {
    const field = metaobject.fields.find((f) => f.key === key);
    return field?.value || '';
  };

  const getImageField = (key: string): string => {
    const field = metaobject.fields.find((f) => f.key === key);
    return field?.reference?.image?.url || '';
  };

  const getMetaobjectReference = (key: string) => {
    const field = metaobject.fields.find((f) => f.key === key);
    return field?.reference?.__typename === 'Metaobject'
      ? field.reference
      : null;
  };

  // Parse materials
  const materialsString = getField('materials');
  let materials: string[] = [];
  if (materialsString) {
    try {
      materials = JSON.parse(materialsString);
    } catch {
      materials = materialsString.split(',').map(m => m.trim()).filter(Boolean);
    }
  }

  // Extract category metaobject reference
  const categoryRef = getMetaobjectReference('category');
  if (!categoryRef || !categoryRef.fields) {
    console.warn(`No category reference for gallery item ${metaobject.id}`);
    return null;
  }

  const getCategoryField = (key: string): string => {
    const field = categoryRef.fields?.find((f) => f.key === key);
    return field?.value || '';
  };

  const category: GalleryCategory = {
    id: categoryRef.id || '',
    name: getCategoryField('name'),
    slug: getCategoryField('slug'),
    description: getCategoryField('description'),
    sortOrder: getCategoryField('sort_order')
      ? parseInt(getCategoryField('sort_order'))
      : undefined,
  };

  // Validate category
  if (!category.name || !category.slug) {
    console.warn(`Invalid category reference for ${metaobject.id}`);
    return null;
  }

  const image = getImageField('image');
  if (!image) {
    console.warn(`No image for gallery item ${metaobject.id}`);
    return null;
  }

  return {
    id: metaobject.id,
    title: getField('title'),
    category,
    image,
    materials,
    story: getField('story'),
    forSale: false,
    createdDate: getField('created_date'),
  };
};
```

---

### 5. Type Definitions

**File:** `types/gallery.ts`

```typescript
export interface GalleryCategory {
  id: string;           // Shopify GID
  name: string;         // Display name
  slug: string;         // URL slug
  description?: string; // Category description
  sortOrder?: number;   // Display order
}

export interface GalleryItem {
  id: string;              // Shopify GID
  title: string;           // Display name
  category: GalleryCategory; // Full category object
  image: string;           // CDN URL
  materials: string[];     // Array of materials
  story: string;           // Backstory
  forSale: false;          // Always false
  createdDate: string;     // ISO date
}

export type GalleryCategoryFilter = 'all' | string;

export interface GalleryPageSettings {
  heading: string;
  description: string;
}
```

---

## Migration Scripts

### Gallery Items Migration

**Script:** `scripts/migrate-gallery.ts`

Migrates gallery data from `data/gallery.ts` to Shopify Metaobjects.

#### Usage

```bash
# Test first
pnpm migrate:gallery:dry

# Execute
pnpm migrate:gallery

# Rollback if needed
pnpm rollback:gallery
```

#### Process

1. Create `gallery_item` metaobject definition
2. Upload images to Shopify CDN
3. Create metaobject entries for each item
4. Save migration log for rollback

---

### Gallery Categories Migration

**Script:** `scripts/migrate-gallery-categories.ts`

Converts text-based categories to editable metaobject references.

#### Usage

```bash
# Test first
pnpm migrate:gallery:categories:dry

# Execute
pnpm migrate:gallery:categories
```

#### What It Does

1. **Creates `gallery_category` Definition**
   - Fields: name, slug, description, sort_order

2. **Creates Default Categories**
   - Earrings, Resin, Driftwood, Wall Hangings

3. **Updates `gallery_item` Definition**
   - **IMPORTANT:** Uses TWO separate mutations
   - Mutation 1: DELETE old text-based category field
   - Mutation 2: CREATE new metaobject_reference field
   - Cannot combine in one mutation (Shopify limitation)

4. **Migrates Existing Items**
   - Reads items BEFORE deleting field (critical!)
   - Maps text categories to metaobject IDs
   - Updates each item with category reference

#### Running Order

```bash
# 1. Ensure gallery items exist
pnpm migrate:gallery

# 2. Run category migration
pnpm migrate:gallery:categories
```

---

### Emergency Category Fix

**Script:** `scripts/fix-gallery-categories.ts`

Fixes gallery items that lost category references.

#### Usage

```bash
pnpm fix:gallery:categories
```

#### What It Does

Uses original `data/gallery.ts` as source of truth to restore correct category references for all items.

---

## Adding New Fields

### Step 1: Update Metaobject Definition

1. Shopify Admin → Settings → Custom data → Metaobjects
2. Click "Gallery Item"
3. Click "Add field"
4. Configure field
5. Save

### Step 2: Update Types

**File:** `types/gallery.ts`

```typescript
export interface GalleryItem {
  // ... existing fields
  newField?: string;  // Add new field
}
```

### Step 3: Update Reshaping Function

**File:** `lib/shopify/index.ts`

```typescript
const reshapeGalleryItem = (metaobject: ShopifyMetaobject): GalleryItem | null => {
  // ... existing code

  return {
    // ... existing fields
    newField: getField('new_field'),  // Add new field
  };
};
```

### Step 4: Update UI

**File:** `app/gallery/GalleryClient.tsx`

```typescript
// Render new field
<p className="mt-2">{item.newField}</p>
```

---

## Caching Strategy

### Next.js 16 Cache Directives

```typescript
export async function getGalleryItems(): Promise<GalleryItem[]> {
  'use cache';                // Enable caching
  cacheTag(TAGS.gallery);     // Tag for revalidation
  cacheLife('days');          // Cache for 1 day

  // Fetch data...
}
```

### Cache Tags

**File:** `lib/constants.ts`

```typescript
export const TAGS = {
  collections: 'collections',
  products: 'products',
  cart: 'cart',
  gallery: 'gallery'
};
```

### Revalidation

**Manual:**
```typescript
import { revalidateTag } from 'next/cache';
revalidateTag(TAGS.gallery);
```

**Automatic:**
- Cache expires after 1 day
- On-demand via API route
- Webhooks from Shopify (if configured)

**Current Status:**
- Caching temporarily disabled for debugging
- Re-enable by uncommenting directives in `lib/shopify/index.ts`

---

## Security Considerations

### API Access

**Storefront API Token:**
- Read-only operations
- Safe to expose in frontend
- Limited to public data

**Admin API Token:**
- ONLY in migration scripts
- NEVER in frontend code
- Store in `.env.local` (gitignored)
- Has write permissions

### Content Validation

**Category validation:**
```typescript
if (!category.name || !category.slug) {
  return null; // Skip invalid items
}
```

**Image validation:**
```typescript
if (!image) {
  console.warn(`No image for item ${metaobject.id}`);
  return null;
}
```

---

# Reference

## Migration History

### November 16, 2025 - Category Migration Fix

#### Problem

1. **Initial Migration Error**
   - Script failed at Step 3 with field definition error
   - Attempted to change field type via update (not allowed)
   - Must use delete + create instead

2. **Gallery Page Blank**
   - Items had text categories, code expected metaobject references
   - All items returned null
   - No items displayed

#### Solution

1. **Fixed Migration Script**
   - Split field update into TWO mutations:
     - Mutation 1: DELETE old field
     - Mutation 2: CREATE new field
   - Critical: Read items BEFORE deleting field

2. **Added Null Safety**
   - Added checks in `getGalleryItems()`
   - Returns empty array if data missing
   - Prevents page crashes

3. **Fixed Query**
   - Changed from `metaobjectByHandle` to `metaobjects`
   - Storefront API doesn't support `metaobjectByHandle`

4. **Created Emergency Fix Script**
   - Uses original `data/gallery.ts` data
   - Restores correct category references
   - Command: `pnpm fix:gallery:categories`

---

## Troubleshooting

### Business Users

#### Changes not showing on website

**Solutions:**
- Wait 1-2 minutes for cache
- Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
- Clear browser cache

#### Image looks blurry

**Solutions:**
- Upload higher resolution (≥1200x1200px)
- Don't over-compress
- Upload original, not screenshot

#### Can't find Gallery Items section

**Solutions:**
- Check **Content → Metaobjects** (not Products)
- Contact developer if missing

#### Accidentally deleted item

**Solutions:**
- Deletions are permanent
- Must re-create manually
- Contact developer if backup exists

#### Category filter not working

**Solutions:**
- Ensure category selected when creating item
- Verify category exists
- Hard refresh page
- Check category has valid slug

#### Can't delete category

**Solutions:**
- Can't delete categories in use
- Reassign all items to different category first
- Then delete category

---

### Developers

#### GraphQL Errors

**Error:** `Field 'metaobjects' doesn't exist on type 'QueryRoot'`

**Cause:** API version doesn't support metaobjects

**Solution:** Update API version in `lib/constants.ts`:
```typescript
export const SHOPIFY_GRAPHQL_API_ENDPOINT = '/api/2024-01/graphql.json';
```

---

#### Empty Gallery

**Debugging:**
1. Check metaobjects exist in Shopify
2. Verify `gallery_item` definition created
3. Check browser console
4. Verify `SHOPIFY_STORE_DOMAIN` env var

**Test query:**
```bash
curl -X POST \
  https://your-store.myshopify.com/api/2024-01/graphql.json \
  -H "Content-Type: application/json" \
  -H "X-Shopify-Storefront-Access-Token: ${TOKEN}" \
  -d '{"query":"{ metaobjects(type: \"gallery_item\", first: 10) { nodes { id } } }"}'
```

---

#### Image Not Displaying

**Causes:**
1. Image URL not public
2. Image reference not populated
3. Remote pattern not configured

**Solution:** Add Shopify CDN to `next.config.ts`:
```typescript
images: {
  remotePatterns: [
    { hostname: 'cdn.shopify.com' }
  ]
}
```

---

#### Materials Not Parsing

**Cause:** Invalid JSON in metaobject field

**Solution:** Ensure field contains valid JSON:
```json
["Sea glass","Copper wire","Vintage beads"]
```

**Fallback:** Split by comma:
```typescript
materials = str.split(',').map(m => m.trim()).filter(Boolean);
```

---

#### Caching Issues

**Problem:** Changes not appearing on site

**Solutions:**

1. Wait for cache expiration
2. Manual revalidation:
   ```bash
   curl -X POST http://localhost:3000/api/revalidate?tag=gallery&secret=${SECRET}
   ```
3. Clear Next.js cache:
   ```bash
   rm -rf .next/cache
   pnpm dev
   ```

---

## Environment Requirements

### Required

```bash
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-token
```

### For Migrations

```bash
SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_xxxxx...
```

**Required Scopes:**
- `write_metaobject_definitions`
- `write_metaobjects`
- `write_files`

---

## Performance Considerations

### Query Optimization

**Current:** Fetches all items (up to 100)

**Future:** Implement pagination for >100 items:
```graphql
query getGalleryItems($first: Int!, $after: String) {
  metaobjects(type: "gallery_item", first: $first, after: $after) {
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes { ... }
  }
}
```

### Image Optimization

- Upload at 1200x1200px
- Use JPG for photos, PNG for graphics
- Compress before upload (<2MB)
- Shopify auto-generates WebP variants

### Caching Recommendations

- **Development:** `cacheLife('seconds')` for testing
- **Production:** `cacheLife('days')` to reduce API calls
- **High traffic:** Consider CDN caching (Vercel Edge)

---

## Support & Resources

### For Business Users
- This documentation
- Shopify Help Center: https://help.shopify.com
- Shopify 24/7 support chat

### For Developers
- `CLAUDE.md` - Project conventions
- `SHOPIFY_CMS_CONVERSION_ROADMAP.md` - Future enhancements
- Shopify API Docs: https://shopify.dev/docs/api/storefront

---

**Document Version:** 2.0 (Consolidated)
**Created:** November 16, 2025
**Next Review:** May 2026

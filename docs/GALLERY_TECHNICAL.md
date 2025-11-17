# Gallery Technical Documentation

**For Developers**
**Last Updated:** November 16, 2025

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Metaobject Schema](#metaobject-schema)
3. [GraphQL Queries](#graphql-queries)
4. [Data Flow](#data-flow)
5. [Type Definitions](#type-definitions)
6. [Caching Strategy](#caching-strategy)
7. [Migration Script](#migration-script)
8. [Adding New Fields](#adding-new-fields)
9. [Troubleshooting](#troubleshooting)

---

## Architecture Overview

The gallery system uses Shopify Metaobjects as a headless CMS for managing gallery items. This allows business users to manage content through Shopify Admin without code changes.

### Key Components

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
├── index.ts                    # getGalleryItems(), reshaping functions
├── queries/gallery.ts          # GraphQL query definition
└── types.ts                    # Shopify-specific types

types/
└── gallery.ts                  # GalleryItem interface, category types

app/gallery/
├── page.tsx                    # Server component (data fetching)
└── GalleryClient.tsx           # Client component (UI/interactivity)

data/
└── gallery.ts                  # Legacy local data (kept as reference)

scripts/
├── migrate-gallery.ts          # Migration script
├── rollback-gallery.ts         # Rollback script
└── lib/
    ├── shopify-admin.ts        # Admin API client
    ├── upload-image.ts         # Image upload handler
    └── metaobject-operations.ts # Metaobject CRUD
```

---

## Metaobject Schema

The gallery system uses two metaobject types:
1. **`gallery_item`** - Individual gallery pieces
2. **`gallery_category`** - Category taxonomy (editable by business users)

---

### Gallery Item Definition

**Type:** `gallery_item`
**Display Name:** Gallery Item
**Display Name Key:** `title`
**Storefront Access:** PUBLIC_READ

#### Field Definitions

| Field Key | Field Name | Type | Required | Description |
|-----------|------------|------|----------|-------------|
| `title` | Title | Single line text | Yes | Display name of the gallery item |
| `category` | Category | Metaobject reference | Yes | Reference to gallery_category metaobject |
| `image` | Image | File reference | Yes | Main image (MediaImage type) |
| `materials` | Materials | List of single line text | No | Array of materials used |
| `story` | Story | Multi-line text | No | Backstory or inspiration |
| `for_sale` | For Sale | Boolean | No | Always false (not implemented in UI) |
| `created_date` | Created Date | Date | No | ISO date string (YYYY-MM-DD) |
| `legacy_id` | Legacy ID | Single line text | No | Original ID from data/gallery.ts |

**Note:** The `category` field was migrated from `single_line_text_field` with validation choices to `metaobject_reference` to enable user-editable categories.

---

### Gallery Category Definition

**Type:** `gallery_category`
**Display Name:** Gallery Category
**Display Name Key:** `name`
**Storefront Access:** PUBLIC_READ

#### Field Definitions

| Field Key | Field Name | Type | Required | Description |
|-----------|------------|------|----------|-------------|
| `name` | Name | Single line text | Yes | Display name (e.g., "Earrings", "Resin Art") |
| `slug` | Slug | Single line text | Yes | URL-friendly identifier (e.g., "earrings", "resin") |
| `description` | Description | Multi-line text | No | Description of what this category includes |
| `sort_order` | Sort Order | Number (integer) | No | Display order (1 = first) |
| `icon` | Icon | Single line text | No | Emoji or icon for the category |

**Default Categories:**
- Earrings (slug: `earrings`, sort order: 1, icon: 💎)
- Resin (slug: `resin`, sort order: 2, icon: 🌸)
- Driftwood (slug: `driftwood`, sort order: 3, icon: 🪵)
- Wall Hangings (slug: `wall-hangings`, sort order: 4, icon: 🧵)

### Creating the Definition Programmatically

The migration script (`scripts/lib/metaobject-operations.ts`) creates the definition automatically:

```typescript
const variables = {
  definition: {
    name: 'Gallery Item',
    type: 'gallery_item',
    fieldDefinitions: [
      {
        key: 'title',
        name: 'Title',
        type: 'single_line_text_field',
        required: true,
      },
      {
        key: 'category',
        name: 'Category',
        type: 'single_line_text_field',
        required: true,
        validations: [
          {
            name: 'choices',
            value: JSON.stringify(['earrings', 'resin', 'driftwood', 'wall-hangings']),
          },
        ],
      },
      // ... other fields
    ],
    displayNameKey: 'title',
  },
};
```

---

## GraphQL Queries

### Fetching Gallery Items

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
        }
      }
    }
  }
}
```

### Field Structure

Metaobject fields are returned as an array with this structure:

```typescript
{
  key: string;        // Field identifier (e.g., "title", "category")
  value: string | null; // Field value (null for file references)
  reference?: {       // Present for file_reference fields
    image?: {
      url: string;
      altText: string;
      width: number;
      height: number;
    }
  }
}
```

### Example Response

```json
{
  "data": {
    "metaobjects": {
      "nodes": [
        {
          "id": "gid://shopify/Metaobject/123456",
          "handle": "first-light-sea-glass-collection",
          "fields": [
            { "key": "title", "value": "First Light Sea Glass Collection" },
            { "key": "category", "value": "earrings" },
            {
              "key": "image",
              "value": null,
              "reference": {
                "image": {
                  "url": "https://cdn.shopify.com/s/files/1/...",
                  "altText": "First Light Sea Glass Collection",
                  "width": 1200,
                  "height": 1200
                }
              }
            },
            { "key": "materials", "value": "[\"Sea glass\",\"Copper wire\",\"Vintage beads\"]" },
            { "key": "story", "value": "My very first collection..." },
            { "key": "created_date", "value": "2021-03-15" }
          ]
        }
      ]
    }
  }
}
```

---

## Data Flow

### 1. Server Component Fetches Data

**File:** `app/gallery/page.tsx`

```typescript
export default async function GalleryPage() {
  const items = await getGalleryItems();
  return <GalleryClient items={items} />;
}
```

### 2. Shopify Fetch Function

**File:** `lib/shopify/index.ts`

```typescript
export async function getGalleryItems(): Promise<GalleryItem[]> {
  'use cache';
  cacheTag(TAGS.gallery);
  cacheLife('days');

  const res = await shopifyFetch<ShopifyGalleryItemsOperation>({
    query: getGalleryItemsQuery,
    variables: { first: 100 }
  });

  return reshapeGalleryItems(res.body.data.metaobjects.nodes);
}
```

### 3. Reshaping Functions

**Convert Shopify format → Application format:**

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

  // Parse materials from JSON string
  const materialsString = getField('materials');
  let materials: string[] = [];
  if (materialsString) {
    try {
      materials = JSON.parse(materialsString);
    } catch {
      materials = materialsString.split(',').map((m) => m.trim()).filter(Boolean);
    }
  }

  const category = getField('category') as GalleryItem['category'];

  // Validate category
  if (!['earrings', 'resin', 'driftwood', 'wall-hangings'].includes(category)) {
    console.warn(`Invalid category for gallery item ${metaobject.id}: ${category}`);
    return null;
  }

  const image = getImageField('image');
  if (!image) {
    console.warn(`No image found for gallery item ${metaobject.id}`);
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

### 4. Client Component Renders UI

**File:** `app/gallery/GalleryClient.tsx`

```typescript
export default function GalleryClient({ items }: { items: GalleryItem[] }) {
  const [activeFilter, setActiveFilter] = useState<GalleryCategoryFilter>('all');

  const filteredItems = useMemo(() => {
    if (activeFilter === 'all') return items;
    return items.filter((item) => item.category === activeFilter);
  }, [items, activeFilter]);

  // Render filtered items with lightbox functionality
}
```

---

## Type Definitions

### GalleryItem

**File:** `types/gallery.ts`

```typescript
export interface GalleryItem {
  id: string;                 // Shopify GID or local ID
  title: string;              // Display name
  category: 'earrings' | 'resin' | 'driftwood' | 'wall-hangings';
  image: string;              // CDN URL or local path
  materials: string[];        // Array of material names
  story: string;              // Backstory/description
  forSale: false;             // Always false (showcase only)
  createdDate: string;        // ISO date (YYYY-MM-DD)
}

export type GalleryCategoryFilter = 'all' | 'earrings' | 'resin' | 'driftwood' | 'wall-hangings';

export const GALLERY_CATEGORIES = {
  all: 'All Items',
  earrings: 'Earrings',
  resin: 'Resin',
  driftwood: 'Driftwood',
  'wall-hangings': 'Wall Hangings',
} as const;
```

### Shopify Types

**File:** `lib/shopify/types.ts`

```typescript
export type ShopifyMetaobjectField = {
  key: string;
  value: string | null;
  reference?: {
    image?: Image;
  };
};

export type ShopifyMetaobject = {
  id: string;
  handle: string;
  fields: ShopifyMetaobjectField[];
};

export type ShopifyGalleryItemsOperation = {
  data: {
    metaobjects: {
      nodes: ShopifyMetaobject[];
    };
  };
  variables: {
    first: number;
  };
};
```

---

## Caching Strategy

### Next.js 16 Cache Directives

```typescript
export async function getGalleryItems(): Promise<GalleryItem[]> {
  'use cache';                    // Enable caching
  cacheTag(TAGS.gallery);         // Tag for selective revalidation
  cacheLife('days');              // Cache for 1 day

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
  gallery: 'gallery'  // Gallery cache tag
};
```

### Revalidation

**Manual revalidation:**

```typescript
import { revalidateTag } from 'next/cache';

// Revalidate gallery cache
revalidateTag(TAGS.gallery, 'max');
```

**Automatic revalidation:**
- Cache expires after 1 day
- On-demand revalidation via API route (if implemented)
- Webhooks from Shopify (if configured)

---

## Migration Scripts

### Gallery Items Migration

The gallery items migration script automates transferring gallery data from `data/gallery.ts` to Shopify Metaobjects.

#### Usage

```bash
# Test without making changes
pnpm migrate:gallery:dry

# Execute migration
pnpm migrate:gallery

# Rollback if needed
pnpm rollback:gallery
```

---

### Gallery Categories Migration

The category migration script converts text-based categories to editable metaobject references.

#### Usage

```bash
# Test without making changes
pnpm migrate:gallery:categories:dry

# Execute migration
pnpm migrate:gallery:categories
```

#### What It Does

1. **Creates `gallery_category` Metaobject Definition**
   - Defines schema for category metaobjects
   - Fields: name, slug, description, sort_order, icon

2. **Creates Default Category Metaobjects**
   - Earrings (slug: `earrings`)
   - Resin (slug: `resin`)
   - Driftwood (slug: `driftwood`)
   - Wall Hangings (slug: `wall-hangings`)

3. **Updates `gallery_item` Definition**
   - Changes `category` field from `single_line_text_field` to `metaobject_reference`
   - Validates reference points to `gallery_category` type

4. **Migrates Existing Gallery Items**
   - Finds all gallery items with text-based categories
   - Maps text values to corresponding category metaobjects
   - Updates each item to reference the category metaobject

#### Safety Features

- Dry-run mode for testing
- Checks for existing categories before creating
- Validates category references
- Detailed console output for each step

#### Running the Migration

**Important:** Run this migration AFTER the initial gallery migration.

```bash
# 1. First, ensure gallery items exist
pnpm migrate:gallery

# 2. Test category migration
pnpm migrate:gallery:categories:dry

# 3. Execute category migration
pnpm migrate:gallery:categories
```

---

### Gallery Items Migration Process

### Process

1. **Create Metaobject Definition**
   - Checks if `gallery_item` definition exists
   - Creates definition if not found

2. **Upload Images**
   - Reads images from `public/stock-assets/gallery/`
   - Stages upload via `stagedUploadsCreate` mutation
   - Uploads to Shopify CDN via HTTP POST
   - Creates file asset via `fileCreate` mutation

3. **Create Metaobject Entries**
   - For each gallery item in `data/gallery.ts`:
     - Generate URL-friendly handle
     - Create metaobject with all fields
     - Link uploaded image via file ID

4. **Save Migration Log**
   - Stores metaobject IDs in `logs/migration-{timestamp}.json`
   - Used for rollback if needed

### Environment Requirements

```bash
SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_xxxxx...  # Required
```

**Required Scopes:**
- `write_metaobject_definitions`
- `write_metaobjects`
- `write_files`

---

## Adding New Fields

### Step 1: Update Metaobject Definition in Shopify

1. Go to Shopify Admin → Settings → Custom data → Metaobjects
2. Click on "Gallery Item"
3. Click "Add field"
4. Configure field (name, type, validation)
5. Save definition

### Step 2: Update GraphQL Query

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
            image { url altText width height }
          }
        }
      }
    }
  }
}
```

Note: No changes needed - query fetches all fields dynamically.

### Step 3: Update TypeScript Types

**File:** `types/gallery.ts`

```typescript
export interface GalleryItem {
  // ... existing fields
  newField?: string;  // Add new field
}
```

### Step 4: Update Reshaping Function

**File:** `lib/shopify/index.ts`

```typescript
const reshapeGalleryItem = (metaobject: ShopifyMetaobject): GalleryItem | null => {
  const getField = (key: string): string => {
    const field = metaobject.fields.find((f) => f.key === key);
    return field?.value || '';
  };

  return {
    id: metaobject.id,
    title: getField('title'),
    category: getField('category') as GalleryItem['category'],
    image: getImageField('image'),
    materials: JSON.parse(getField('materials') || '[]'),
    story: getField('story'),
    forSale: false,
    createdDate: getField('created_date'),
    newField: getField('new_field'),  // Add new field
  };
};
```

### Step 5: Update UI Components

**File:** `app/gallery/GalleryClient.tsx`

```typescript
// Render new field in gallery grid
<p className="mt-2 text-sm text-bark/70">
  {item.newField}
</p>
```

---

## Troubleshooting

### GraphQL Errors

**Issue:** `Field 'metaobjects' doesn't exist on type 'QueryRoot'`

**Cause:** Shopify Storefront API version doesn't support metaobjects

**Solution:** Update API version in `lib/constants.ts`:

```typescript
export const SHOPIFY_GRAPHQL_API_ENDPOINT = '/api/2024-01/graphql.json';
```

### Empty Gallery

**Issue:** No items display on gallery page

**Debugging:**

1. Check if metaobjects exist in Shopify Admin
2. Verify `gallery_item` definition is created
3. Check browser console for errors
4. Verify environment variable: `SHOPIFY_STORE_DOMAIN`

**Test query directly:**

```bash
curl -X POST \
  https://your-store.myshopify.com/api/2024-01/graphql.json \
  -H "Content-Type: application/json" \
  -H "X-Shopify-Storefront-Access-Token: ${SHOPIFY_STOREFRONT_ACCESS_TOKEN}" \
  -d '{"query":"{ metaobjects(type: \"gallery_item\", first: 10) { nodes { id } } }"}'
```

### Image Not Displaying

**Issue:** Image field shows broken image icon

**Possible Causes:**
1. Image URL not public (check Storefront access on metaobject definition)
2. Image reference field not populated
3. Remote pattern not configured in `next.config.ts`

**Solution:** Add Shopify CDN to allowed image domains:

```typescript
// next.config.ts
images: {
  remotePatterns: [
    { hostname: 'cdn.shopify.com' }
  ]
}
```

### Materials Not Parsing

**Issue:** Materials show as JSON string instead of array

**Cause:** Reshaping function not parsing JSON correctly

**Solution:** Check materials field in metaobject - ensure it's valid JSON:

```json
["Sea glass","Copper wire","Vintage beads"]
```

**Fallback:** If not JSON, split by comma:

```typescript
materials = materialsString.split(',').map((m) => m.trim()).filter(Boolean);
```

### Caching Issues

**Issue:** Changes in Shopify Admin not appearing on website

**Solutions:**

1. **Wait for cache expiration** (up to 1 day)
2. **Manual revalidation:**
   ```bash
   curl -X POST http://localhost:3000/api/revalidate?tag=gallery&secret=${SHOPIFY_REVALIDATION_SECRET}
   ```
3. **Clear Next.js cache:**
   ```bash
   rm -rf .next/cache
   pnpm dev
   ```

---

## Performance Considerations

### Query Optimization

**Current:** Fetches all gallery items (up to 100)

**Future optimization:** Implement pagination if gallery exceeds 100 items:

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

**Current:** Images served from Shopify CDN

**Best practices:**
- Upload images at 1200x1200px
- Use JPG for photos, PNG for graphics
- Compress before upload (< 2 MB)
- Shopify automatically generates WebP variants

### Caching Recommendations

- **Development:** Set `cacheLife('seconds')` for faster testing
- **Production:** Use `cacheLife('days')` to reduce API calls
- **High traffic:** Consider adding CDN caching layer (Vercel Edge Network)

---

## Security Considerations

### API Access

**Storefront API Access Token:**
- Used for read-only operations
- Safe to expose in frontend code
- Limited to public data only

**Admin API Access Token:**
- Used ONLY in migration scripts
- Never expose in frontend code
- Store in `.env.local` (gitignored)
- Has write permissions - keep secure

### Content Validation

**Category validation:**
```typescript
if (!['earrings', 'resin', 'driftwood', 'wall-hangings'].includes(category)) {
  return null; // Skip invalid items
}
```

**Image validation:**
```typescript
if (!image) {
  console.warn(`No image found for gallery item ${metaobject.id}`);
  return null;
}
```

### Input Sanitization

**Materials field:** Safely parse JSON with try/catch
**Story field:** Rendered as plain text (not HTML) in UI
**Title field:** Escaped by React automatically

---

## Future Enhancements

### Potential Features

1. **Pagination:** Handle galleries with 100+ items
2. **Search:** Full-text search across titles and stories
3. **Filtering by materials:** Filter by specific materials used
4. **Date sorting:** Sort by creation date
5. **Tags system:** Add flexible tagging beyond categories
6. **Related items:** Show similar pieces based on materials/category
7. **Admin preview:** Preview changes before publishing

### Technical Improvements

1. **Image lazy loading:** Use Next.js Image component
2. **Incremental static regeneration:** Cache at CDN edge
3. **GraphQL fragments:** Reduce query complexity
4. **Error boundaries:** Graceful error handling
5. **Loading states:** Skeleton screens while fetching
6. **Optimistic updates:** Instant UI feedback (if write operations added)

---

**Document Version:** 1.0
**Created:** November 16, 2025
**Maintainer:** Development Team
**Next Review:** May 2026

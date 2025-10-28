# Shopify Testing Guide

Complete guide for testing and verifying your Shopify integration with Fern & Fog Creations storefront.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Testing Product Data Connection](#testing-product-data-connection)
4. [Testing Cart Integration](#testing-cart-integration)
5. [Recommended Sample Data Apps](#recommended-sample-data-apps)
6. [Migration Workflows](#migration-workflows)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Shopify Development Store Setup

1. **Create Development Store**
   - Go to https://partners.shopify.com
   - Navigate to **Stores** → **Add store**
   - Select **Development store**
   - Fill in store details and create

2. **Create Custom App** (for API access)
   - In your Shopify Admin: **Settings** → **Apps and sales channels**
   - Click **Develop apps**
   - Click **Create an app**
   - Name it "Headless Storefront" or similar

3. **Configure API Scopes**

   **For Storefront API** (product fetching, cart operations):
   - `unauthenticated_read_product_listings`
   - `unauthenticated_write_checkouts`
   - `unauthenticated_read_checkouts`
   - `unauthenticated_read_product_inventory`

   **For Admin API** (product migration, image upload):
   - `write_products`
   - `read_products`
   - `write_files`
   - `read_files`

4. **Install App and Get Tokens**
   - Click **Install app**
   - Copy **Storefront Access Token** (for frontend)
   - Copy **Admin API Access Token** (for migration scripts)

---

## Environment Setup

### Required Environment Variables

Create or update `.env.local`:

```bash
# ============================================================================
# Shopify Configuration
# ============================================================================

# Your Shopify store domain (without https://)
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com

# Storefront API Access Token (for product fetching and cart)
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_access_token_here

# Webhook secret for cache revalidation (optional)
SHOPIFY_REVALIDATION_SECRET=your_secret_here

# Admin API Access Token (for migration scripts only)
SHOPIFY_ADMIN_ACCESS_TOKEN=your_admin_access_token_here

# ============================================================================
# Dual-Mode Toggle
# ============================================================================

# Set to 'true' to fetch from Shopify, 'false' or unset for local data
NEXT_PUBLIC_USE_SHOPIFY=false  # Change to 'true' when testing Shopify

```

### Verify Configuration

Run this command to check your setup:

```bash
pnpm dev
```

Check the browser console on `/products` page. You should see:
```
Data source: 💾 Local
```

When you set `NEXT_PUBLIC_USE_SHOPIFY=true`, it should show:
```
Data source: 🛍️ Shopify
```

---

## Testing Product Data Connection

### Step 1: Verify Shopify Has Products

Before testing the connection, ensure your Shopify store has products:

**Option A: Add Sample Data** (recommended for testing)
- See [Recommended Sample Data Apps](#recommended-sample-data-apps) section below

**Option B: Manual Product Creation**
- Shopify Admin → **Products** → **Add product**
- Create at least 2-3 test products

**Option C: Import via CSV**
- Run: `pnpm export:csv`
- Import `exports/products.csv` via Shopify Admin → Products → Import

### Step 2: Enable Shopify Mode

Update `.env.local`:
```bash
NEXT_PUBLIC_USE_SHOPIFY=true
```

Restart dev server:
```bash
pnpm dev
```

### Step 3: Check Network Requests

1. Open **Chrome DevTools** → **Network** tab
2. Navigate to http://localhost:3000/products
3. Filter by **Fetch/XHR**
4. Look for requests to:
   - `https://your-store.myshopify.com/api/.../graphql.json`

**Expected Response:**
```json
{
  "data": {
    "products": {
      "edges": [
        {
          "node": {
            "id": "gid://shopify/Product/...",
            "title": "Product Name",
            "handle": "product-slug",
            ...
          }
        }
      ]
    }
  }
}
```

### Step 4: Verify Product Display

Products should now display on `/products` page with:
- ✅ Product titles from Shopify
- ✅ Product images from Shopify CDN
- ✅ Correct prices
- ✅ Filtering and sorting still works

---

## Testing Cart Integration

### Step 1: Enable Shopify Cart Sync

The cart adapter is already integrated. When `NEXT_PUBLIC_USE_SHOPIFY=true`, cart operations will sync to Shopify automatically.

### Step 2: Test Add to Cart

1. Navigate to a product detail page
2. Click **Add to Basket**
3. Open **Network** tab
4. Look for GraphQL mutation request:

**Expected Request:**
```graphql
mutation {
  cartLinesAdd(
    cartId: "..."
    lines: [{ merchandiseId: "...", quantity: 1 }]
  ) {
    cart {
      id
      lines { ... }
    }
  }
}
```

**Expected Response:**
```json
{
  "data": {
    "cartLinesAdd": {
      "cart": {
        "id": "gid://shopify/Cart/...",
        "lines": { ... }
      }
    }
  }
}
```

### Step 3: Check Browser Console

You should see logs like:
```
Syncing cart to Shopify...
✅ Cart synced successfully
```

If sync fails, you'll see:
```
⚠️  Failed to sync cart to Shopify: [error message]
```

**Note**: Cart still works locally even if Shopify sync fails.

### Step 4: Verify Cart Cookie

1. Open **DevTools** → **Application** tab → **Cookies**
2. Look for `cartId` cookie
3. Value should be: `gid://shopify/Cart/...`

---

## Recommended Sample Data Apps

### Free Shopify Apps for Test Products

#### 1. **Shopify's Built-in Demo Products** (Recommended)
- **How to Enable:**
  - Shopify Admin → **Settings** → **Store details**
  - Scroll to **Store testing** section
  - Click **Add sample products**
- **What You Get:** 10-15 products with professional images
- **Cost:** Free
- **Pros:** Official Shopify app, high-quality images, realistic data
- **Cons:** Limited to ~15 products

#### 2. **Fake Products Generator by DevIT**
- **Install:** https://apps.shopify.com/fake-products-generator
- **What You Get:** Generate unlimited test products
- **Cost:** Free tier available (up to 50 products)
- **Pros:** Customizable, good for stress testing
- **Cons:** Generic product descriptions

#### 3. **Product Sample**
- **Install:** https://apps.shopify.com/product-sample
- **What You Get:** Pre-made product collections
- **Cost:** Free
- **Pros:** Organized by category
- **Cons:** May require manual cleanup

### Creating Realistic Test Data

For jewelry/handmade products like Fern & Fog, consider:

1. **Manual Creation** (5 products):
   - Create 5 products manually with variants
   - Use free stock images from:
     - Unsplash (https://unsplash.com)
     - Pexels (https://pexels.com)

2. **Import Your Local Data**:
   ```bash
   # Option A: CSV Import
   pnpm export:csv
   # Then import exports/products.csv via Shopify Admin

   # Option B: Automated Script (requires Admin API token)
   pnpm migrate:shopify
   ```

---

## Migration Workflows

### Workflow 1: CSV Import (Manual, Safe)

**Best for:** First-time migration, careful review before import

```bash
# Step 1: Generate CSV
pnpm export:csv

# Step 2: Review generated files
# - exports/products.csv (product data)
# - exports/images.csv (image reference)

# Step 3: Upload images to public URL (if needed)
# - Use Shopify Files section
# - Or external CDN

# Step 4: Update image URLs in products.csv

# Step 5: Import via Shopify Admin
# Shopify Admin → Products → Import → Choose products.csv
```

**Timeline:** 30-60 minutes (includes manual review)

### Workflow 2: Automated Script (Fast)

**Best for:** Development stores, bulk imports

```bash
# Step 1: Set up Admin API token in .env.local
SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_...

# Step 2: Run migration script
pnpm migrate:shopify

# Step 3: Upload images separately (for local files)
pnpm upload-images <product-handle> <image-path>
```

**Timeline:** 5-10 minutes (automated)

**Note:** Automated script skips local image files. Use `upload-images` script or host images externally.

### Workflow 3: Hybrid Approach (Recommended)

1. **Export CSV** for review: `pnpm export:csv`
2. **Import CSV** via Shopify Admin
3. **Upload images** using script: `pnpm upload-images`
4. **Verify** products in Shopify Admin
5. **Enable Shopify mode**: Set `NEXT_PUBLIC_USE_SHOPIFY=true`
6. **Test** on localhost

**Timeline:** 20-30 minutes

---

## Troubleshooting

### Issue 1: "No products found"

**Symptoms:**
- `/products` page shows "No products found"
- Network tab shows successful GraphQL response

**Possible Causes:**
1. Products are unpublished
2. Products have `hidden` tag
3. Products are in wrong publication channel

**Solution:**
```bash
# Check product visibility in Shopify Admin
# Products → Click product → Check "Sales channels and apps" section
# Ensure product is published to "Online Store" channel
```

### Issue 2: Images not loading

**Symptoms:**
- Products display but images are broken
- Console shows CORS errors

**Possible Causes:**
1. Image URLs are local file paths (e.g., `/public/...`)
2. Image URLs are not publicly accessible

**Solution:**
```bash
# Option A: Upload images to Shopify
pnpm upload-images <product-handle> <image-path>

# Option B: Use external CDN
# - Upload to Cloudinary, Imgur, or S3
# - Update product image URLs in Shopify
```

### Issue 3: Cart sync failing

**Symptoms:**
- Console error: "Failed to sync cart to Shopify"
- Cart works locally but doesn't appear in Shopify

**Possible Causes:**
1. Missing Storefront API scopes
2. Invalid cart ID cookie
3. Variant ID vs Product ID mismatch

**Solution:**
```bash
# Check Storefront API scopes
# Shopify Admin → Apps → Your app → API credentials
# Ensure these scopes are enabled:
# - unauthenticated_write_checkouts
# - unauthenticated_read_checkouts

# Clear cart cookie and retry
# DevTools → Application → Cookies → Delete "cartId"
```

### Issue 4: "merchandiseId is required"

**Symptoms:**
- Error when adding product to cart
- Message: "merchandiseId is required"

**Possible Causes:**
- Product has variants but no `variantId` selected
- Cart adapter receiving `productId` instead of `variantId`

**Solution:**
```typescript
// Ensure variant selector is used on product page
// And variantId is passed to addItem():
addItem({
  productId: product.id,
  slug: product.slug,
  name: product.name,
  price: displayPrice,
  image: product.images[0],
  variantId: selectedVariant?.id,  // ← This is required!
  variantTitle: selectedVariant?.title,
  selectedOptions: selectedVariant?.selectedOptions
}, quantity)
```

### Issue 5: GraphQL rate limiting

**Symptoms:**
- Error: "Throttled"
- Requests failing intermittently

**Possible Causes:**
- Too many requests in short time
- Migration script running too fast

**Solution:**
```bash
# Add delay in migration script (already included)
# Or reduce concurrent requests

# For manual testing:
# Wait 1-2 seconds between requests
```

---

## Verification Checklist

Before going to production, verify:

### Product Data
- [ ] Products display correctly on `/products`
- [ ] Product images load from Shopify CDN
- [ ] Variant selector works (if products have variants)
- [ ] Filtering and sorting still functional
- [ ] Product detail pages load correctly

### Cart Integration
- [ ] Can add products to cart
- [ ] Cart syncs to Shopify (check Network tab)
- [ ] Cart persists across page refreshes
- [ ] Cart drawer shows correct items
- [ ] Variant information displays in cart

### Performance
- [ ] Page load time < 3 seconds
- [ ] No console errors
- [ ] Lighthouse score > 85

### Dual Mode
- [ ] Works with `NEXT_PUBLIC_USE_SHOPIFY=false` (local data)
- [ ] Works with `NEXT_PUBLIC_USE_SHOPIFY=true` (Shopify data)
- [ ] Can toggle between modes easily

---

## Support Resources

### Shopify Documentation
- **Storefront API**: https://shopify.dev/api/storefront
- **Admin API**: https://shopify.dev/api/admin-graphql
- **GraphQL Explorer**: https://shopify.dev/graphiql/storefront-api

### Tools
- **GraphQL Playground**: Use Shopify's GraphiQL explorer to test queries
- **Shopify CLI**: Install with `npm i -g @shopify/cli @shopify/theme`

### Common GraphQL Queries

**Test Product Fetching:**
```graphql
{
  products(first: 5) {
    edges {
      node {
        id
        title
        handle
        images(first: 1) {
          edges {
            node {
              url
            }
          }
        }
      }
    }
  }
}
```

**Test Cart Creation:**
```graphql
mutation {
  cartCreate {
    cart {
      id
    }
  }
}
```

---

## Next Steps

Once testing is complete:

1. **Update Production Environment Variables**
   ```bash
   # On Vercel/Netlify, set:
   NEXT_PUBLIC_USE_SHOPIFY=true
   SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
   SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_token
   ```

2. **Deploy**
   ```bash
   git push origin main
   # Triggers automatic deployment
   ```

3. **Monitor**
   - Check error logs
   - Monitor API usage in Shopify Analytics
   - Track cart abandonment rates

---

**Last Updated:** October 2025
**Maintained by:** Claude Code + itsjusteric

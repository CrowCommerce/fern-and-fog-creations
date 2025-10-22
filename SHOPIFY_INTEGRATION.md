# Shopify Integration Guide

## Current Status

### ✅ What Works Out of the Box

1. **Product Variants from Shopify** - The existing Shopify integration already fetches variants:
   ```typescript
   // src/lib/shopify/types.ts (lines 82-91)
   export type ProductVariant = {
     id: string;                    // Shopify variant ID
     title: string;                 // e.g., "Blue / Medium"
     availableForSale: boolean;
     selectedOptions: {
       name: string;
       value: string;
     }[];
     price: Money;                  // { amount: "42.00", currencyCode: "USD" }
   };
   ```

2. **Variant Selector Component** - Works with both:
   - Local product data (for development/demo)
   - Shopify product data (when env vars configured)

3. **Filter Components** - Work with any product source

### ⚠️ What Needs an Adapter

**Problem**: Cart operations need variant IDs in Shopify's format.

**Current Gap**:
- My cart stores: `variantId` (optional field)
- Shopify expects: `merchandiseId` (required for cart mutations)

---

## Solution: Cart-to-Shopify Adapter

### Option 1: Quick Fix (5 minutes)

Add this adapter function to connect your cart to Shopify:

```typescript
// src/lib/shopify-cart-adapter.ts (NEW FILE)

import { addToCart as shopifyAddToCart } from '@/lib/shopify';
import type { CartItem } from '@/types/cart';

/**
 * Convert local cart items to Shopify cart lines
 */
export function cartItemsToShopifyLines(items: CartItem[]) {
  return items.map(item => ({
    merchandiseId: item.variantId || item.productId,  // Use variant ID if available
    quantity: item.quantity
  }));
}

/**
 * Add items to Shopify cart (wrapper around local cart)
 */
export async function syncCartToShopify(items: CartItem[]) {
  try {
    const lines = cartItemsToShopifyLines(items);
    const shopifyCart = await shopifyAddToCart(lines);
    return shopifyCart;
  } catch (error) {
    console.error('Failed to sync cart to Shopify:', error);
    throw error;
  }
}
```

**Usage in Cart Context**:

```typescript
// src/context/CartContext.tsx

import { syncCartToShopify } from '@/lib/shopify-cart-adapter';

const addItem = (item: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
  saveToHistory();
  startTransition(async () => {
    // Optimistic update (instant UI)
    addOptimistic({ type: 'add', payload: { item, quantity } });

    // Update local state
    setItems(currentItems => {
      const updated = /* ... existing logic ... */;

      // Sync to Shopify (if env vars configured)
      if (process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN) {
        syncCartToShopify(updated).catch(console.error);
      }

      return updated;
    });
  });
};
```

---

### Option 2: Server Actions (Recommended for Production)

For a more robust solution, use Server Actions:

```typescript
// src/app/actions/cart.ts (NEW FILE)

'use server';

import { addToCart as shopifyAddToCart } from '@/lib/shopify';
import { revalidateTag } from 'next/cache';

export async function addToCartAction(
  variantId: string,
  quantity: number = 1
) {
  try {
    const cart = await shopifyAddToCart([
      { merchandiseId: variantId, quantity }
    ]);

    revalidateTag('cart');
    return { success: true, cart };
  } catch (error) {
    console.error('Add to cart failed:', error);
    return { success: false, error: String(error) };
  }
}
```

**Usage**:

```typescript
// src/app/products/[slug]/page.tsx

import { addToCartAction } from '@/app/actions/cart';

const handleAddToCart = async () => {
  // Add to local cart (optimistic)
  addItem(itemToAdd, quantity);

  // Sync to Shopify
  if (selectedVariant?.id) {
    const result = await addToCartAction(selectedVariant.id, quantity);
    if (!result.success) {
      console.error('Shopify sync failed:', result.error);
      // Optionally: show error to user
    }
  }
};
```

---

## Field Mapping Reference

### Local Product Variant → Shopify Product Variant

| Local Field | Shopify Field | Notes |
|-------------|---------------|-------|
| `id` | `id` | ✅ Same |
| `title` | `title` | ✅ Same |
| `price` (number) | `price.amount` (string) | ⚠️ Convert: `parseFloat(price.amount)` |
| `availableForSale` | `availableForSale` | ✅ Same |
| `selectedOptions` | `selectedOptions` | ✅ Same structure |
| `sku` | N/A in types | ℹ️ Can add to Shopify fragment |
| `quantityAvailable` | N/A in types | ℹ️ Can add to Shopify fragment |
| `image` | N/A in types | ℹ️ Can add to Shopify fragment |

### Extending Shopify Fragment for More Data

To get `sku`, `quantityAvailable`, and `image` from Shopify:

```typescript
// src/lib/shopify/fragments/product.ts

const productFragment = /* GraphQL */ `
  fragment product on Product {
    id
    handle
    availableForSale
    title
    description
    descriptionHtml
    options {
      id
      name
      values
    }
    priceRange {
      maxVariantPrice {
        amount
        currencyCode
      }
      minVariantPrice {
        amount
        currencyCode
      }
    }
    variants(first: 250) {
      edges {
        node {
          id
          title
          availableForSale
          selectedOptions {
            name
            value
          }
          price {
            amount
            currencyCode
          }
          # ADD THESE:
          sku
          quantityAvailable
          image {
            url
            altText
            width
            height
          }
        }
      }
    }
    # ... rest of fragment
  }
`;
```

Then update the TypeScript type:

```typescript
// src/lib/shopify/types.ts

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: {
    name: string;
    value: string;
  }[];
  price: Money;
  sku?: string;              // ADD
  quantityAvailable?: number; // ADD
  image?: Image;             // ADD
};
```

---

## Environment Setup

### Required Environment Variables

```bash
# .env.local

SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_access_token_here
SHOPIFY_REVALIDATION_SECRET=your_webhook_secret_here
```

### How to Get Shopify Credentials

1. **Shopify Admin** → Settings → Apps and sales channels
2. **Develop apps** → Create an app
3. **Configure Storefront API scopes**:
   - ✅ `unauthenticated_read_product_listings`
   - ✅ `unauthenticated_write_checkouts`
   - ✅ `unauthenticated_read_checkouts`
4. **Install app** → Copy the Storefront Access Token

---

## Testing Shopify Integration

### Step 1: Configure Environment

```bash
# .env.local
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_token_here
```

### Step 2: Test Product Fetching

```bash
pnpm dev

# Visit: http://localhost:3000/products
# Products should load from Shopify (not local data)
```

### Step 3: Test Variant Selection

```bash
# Visit a product page
# Select different variants
# Check browser console for any errors
```

### Step 4: Test Cart Operations

```bash
# Add item to cart
# Check browser Network tab for Shopify GraphQL requests
# Should see: cartCreate, cartLinesAdd mutations
```

---

## Migration Path: Local → Shopify

### Phase 1: Dual Mode (Current)
✅ Works with local data (demo/development)
✅ Works with Shopify data (production)
⚠️ Cart is local-only (localStorage)

### Phase 2: Add Cart Adapter (15 mins)
✅ Local cart syncs to Shopify
✅ Checkout redirects to Shopify
⚠️ Cart not persisted across devices

### Phase 3: Full Shopify Cart (30 mins)
✅ Cart stored in Shopify (server-side)
✅ Cart persists across devices
✅ Cart ID stored in cookies
✅ Full checkout integration

---

## Code Examples

### Example 1: Using Shopify Products

```typescript
// src/app/products/page.tsx

// When SHOPIFY_STORE_DOMAIN is set, this fetches from Shopify:
import { getProducts } from '@/lib/shopify';

export default async function ProductsPage() {
  const products = await getProducts({ sortKey: 'RELEVANCE' });

  // Your variant selector and filters work with Shopify data!
  return <ProductGrid products={products} />;
}
```

### Example 2: Add to Shopify Cart

```typescript
// src/components/AddToCartButton.tsx

'use client';

import { addToCartAction } from '@/app/actions/cart';
import { useCart } from '@/context/CartContext';

export function AddToCartButton({ variantId, ...item }) {
  const { addItem } = useCart();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);

    // Optimistic: Update UI immediately
    addItem(item);

    // Server: Sync to Shopify
    await addToCartAction(variantId, 1);

    setLoading(false);
  };

  return (
    <button onClick={handleClick} disabled={loading}>
      {loading ? 'Adding...' : 'Add to Cart'}
    </button>
  );
}
```

---

## Compatibility Matrix

| Feature | Local Data | Shopify Data | Notes |
|---------|------------|--------------|-------|
| Product Variants | ✅ | ✅ | Fully compatible |
| Variant Selector | ✅ | ✅ | Works with both |
| Filters | ✅ | ✅ | Client-side filtering |
| Sort Options | ✅ | ✅ | Works with both |
| Cart (localStorage) | ✅ | ⚠️ | Need adapter for sync |
| Cart (Shopify) | N/A | ✅ | With adapter/Server Actions |
| Optimistic Updates | ✅ | ✅ | UI pattern works with both |
| Undo Functionality | ✅ | ⚠️ | Local only (by design) |
| Checkout | ❌ | ✅ | Shopify checkout URL |

---

## Recommended Approach

### For Development/Demo
✅ **Use local data** (current setup)
- No API calls
- Fast development
- Full feature testing

### For Production
✅ **Use Shopify data + cart adapter**
1. Add environment variables
2. Implement cart adapter (Option 1 above)
3. Products automatically load from Shopify
4. Cart syncs to Shopify on add/remove
5. Redirect to Shopify checkout

### Time Estimate
- **Option 1** (Quick adapter): 15-30 minutes
- **Option 2** (Server Actions): 30-60 minutes
- **Testing**: 15-30 minutes

---

## Common Issues & Solutions

### Issue 1: "merchandiseId is required"

**Error**: GraphQL mutation fails with missing merchandiseId

**Solution**: Use variant ID, not product ID:
```typescript
// ❌ Wrong
addToCart([{ merchandiseId: product.id, quantity: 1 }])

// ✅ Correct
addToCart([{ merchandiseId: selectedVariant.id, quantity: 1 }])
```

### Issue 2: Price shows as object

**Error**: Price displays as `[object Object]`

**Solution**: Extract amount from Money object:
```typescript
// Shopify returns: { amount: "42.00", currencyCode: "USD" }
const displayPrice = parseFloat(variant.price.amount)
```

### Issue 3: Variants not appearing

**Error**: VariantSelector doesn't show even though product has variants

**Solution**: Check product has both `variants` AND `options`:
```typescript
{product.variants && product.options && (
  <VariantSelector ... />
)}
```

---

## Next Steps

1. **Add cart adapter** (copy Option 1 code above)
2. **Test with Shopify sandbox store**
3. **Update cart operations** to call adapter
4. **Test checkout flow** (redirect to Shopify)
5. **Deploy to production**

---

## Summary

**Bottom Line**:
- ✅ New features are **Shopify-compatible**
- ✅ Product variants work with Shopify data
- ✅ Filters work with Shopify products
- ⚠️ Cart needs **15-min adapter** for full Shopify integration
- ✅ Everything else works out of the box

The variant structure I created mirrors Shopify's design, so integration is straightforward. The only gap is connecting the local cart state to Shopify's cart API, which the adapter code above solves.

---

**Questions?** Check the existing Shopify integration in `src/lib/shopify/` - it's comprehensive and ready to use!

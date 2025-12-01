# Analytics Guide

This document covers the analytics implementation for Fern & Fog Creations, including architecture, events, and configuration.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Configuration](#configuration)
- [Event Reference](#event-reference)
- [Implementation Details](#implementation-details)
- [Adding New Events](#adding-new-events)
- [Testing Analytics](#testing-analytics)

---

## Architecture Overview

The analytics system uses a **dual-tracking pattern** that sends events to multiple destinations:

```
┌─────────────────────────────────────────────────────────────────┐
│                        Event Triggered                          │
└─────────────────────────────────────────────────────────────────┘
                               │
              ┌────────────────┴────────────────┐
              │                                 │
              ▼                                 ▼
    ┌─────────────────┐              ┌─────────────────┐
    │ Client-Side     │              │ Server-Side     │
    │ (tracker.ts)    │              │ (server-tracker)│
    └─────────────────┘              └─────────────────┘
              │                                 │
    ┌─────────┴─────────┐                       │
    │                   │                       │
    ▼                   ▼                       ▼
┌────────┐      ┌──────────┐            ┌────────────┐
│ Vercel │      │   GTM    │            │   Vercel   │
│Analytics│     │ (if set) │            │  Analytics │
└────────┘      └──────────┘            └────────────┘
                    │
          ┌────────┴────────┐
          ▼                 ▼
    ┌──────────┐     ┌──────────┐
    │   GA4    │     │ Meta/FB  │
    │          │     │ (CAPI)   │
    └──────────┘     └──────────┘
```

### Analytics Providers

| Provider | Status | Purpose |
|----------|--------|---------|
| **Vercel Analytics** | Always enabled | Privacy-friendly, GDPR-compliant page views and custom events |
| **Google Analytics (GA4)** | Optional | Full Google Analytics tracking |
| **Google Tag Manager (GTM)** | Optional | Tag management for GA4, Meta CAPI, etc. |

### Key Files

| File | Purpose |
|------|---------|
| `components/analytics/Analytics.tsx` | Provider initialization in root layout |
| `lib/analytics/types.ts` | TypeScript event definitions |
| `lib/analytics/tracker.ts` | Client-side tracking (`'use client'`) |
| `lib/analytics/server-tracker.ts` | Server-side tracking (Server Actions) |

---

## Configuration

### Environment Variables

```bash
# Vercel Analytics - No config needed (auto-enabled)

# Google Analytics (GA4) - Optional
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Google Tag Manager - Optional (use instead of GA4 for advanced setups)
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

### How It Works

The `<Analytics />` component in `app/layout.tsx` conditionally loads providers:

```tsx
// components/analytics/Analytics.tsx
export function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <>
      <VercelAnalytics />                          {/* Always on */}
      {gaId && <GoogleAnalytics gaId={gaId} />}    {/* If GA4 ID set */}
      {gtmId && <GoogleTagManager gtmId={gtmId} />} {/* If GTM ID set */}
    </>
  );
}
```

---

## Event Reference

### E-Commerce Events

| Event | Trigger | Location | Tracking |
|-------|---------|----------|----------|
| `product_view` | Product page loads | `app/product/[handle]/ProductDetailContent.tsx` | Client |
| `view_item_list` | Products page loads | `app/(store)/products/ProductsClient.tsx` | Client |
| `view_cart` | Cart drawer opens | `components/layout/ShoppingCartDrawer.tsx` | Client |
| `add_to_cart` | Item added to cart | `components/cart/actions.ts` | Server |
| `remove_from_cart` | Item removed from cart | `components/cart/actions.ts` | Server |
| `update_cart_quantity` | Cart quantity changed | `components/cart/actions.ts` | Server |
| `checkout_initiated` | Checkout button clicked | `components/cart/actions.ts` | Server |

#### Event Properties

**`product_view`**
```typescript
{
  product_id: string;      // Shopify product GID
  product_title: string;   // Product name
  price: number;           // Product price
  collection?: string;     // Category/collection name
}
```

**`view_item_list`**
```typescript
{
  item_list_id: string;    // Collection handle or 'all-products'
  item_list_name: string;  // Display name
  items_count: number;     // Number of products shown
}
```

**`view_cart`**
```typescript
{
  cart_total: number;
  item_count: number;
  items: Array<{
    item_id: string;
    item_name: string;
    price: number;
    quantity: number;
  }>;
}
```

**`add_to_cart`**
```typescript
{
  product_id: string;
  variant_id: string;
  product_title: string;
  price: number;
}
```

**`remove_from_cart`**
```typescript
{
  product_id: string;
  variant_id: string;
  product_title: string;
}
```

**`update_cart_quantity`**
```typescript
{
  product_id: string;
  variant_id: string;
  product_title: string;
  old_quantity: number;
  new_quantity: number;
}
```

**`checkout_initiated`**
```typescript
{
  cart_total: number;
  item_count: number;
}
```

---

### Search Events

| Event | Trigger | Location | Tracking |
|-------|---------|----------|----------|
| `search_performed` | Search query submitted | `components/search/actions.ts` | Server |

**`search_performed`**
```typescript
{
  query: string;         // Search query
  results_count: number; // Number of results
}
```

---

### Form Events

| Event | Trigger | Location | Tracking |
|-------|---------|----------|----------|
| `contact_form_submitted` | Form submitted successfully | `app/actions/contact.ts` | Server |
| `contact_form_error` | Form submission failed | `app/actions/contact.ts` | Server |

**`contact_form_submitted`**
```typescript
{
  has_phone: boolean;  // Whether phone was provided
}
```

**`contact_form_error`**
```typescript
{
  error_code: string;     // Error identifier
  error_message: string;  // Human-readable message
}
```

---

### Gallery Events

| Event | Trigger | Location | Tracking |
|-------|---------|----------|----------|
| `gallery_filter` | Filter category changed | `app/gallery/GalleryClient.tsx` | Client |
| `gallery_item_click` | Gallery item clicked | `app/gallery/GalleryClient.tsx` | Client |
| `gallery_lightbox_navigate` | Lightbox navigation | `app/gallery/GalleryClient.tsx` | Client |

**`gallery_filter`**
```typescript
{
  filter_id: string;      // New filter ID
  filter_name: string;    // New filter display name
  previous_filter: string; // Previous filter ID
}
```

**`gallery_item_click`**
```typescript
{
  item_id: string;
  item_title: string;
  category: string;
  index: number;  // Position in grid
}
```

**`gallery_lightbox_navigate`**
```typescript
{
  direction: 'previous' | 'next';
  from_index: number;
  to_index: number;
  item_title: string;  // New item title
}
```

---

## Implementation Details

### Client-Side Tracking

Use for events triggered by user interactions in React components:

```typescript
// In a 'use client' component
import { analytics } from '@/lib/analytics/tracker';

// Fire event
analytics.productView({
  product_id: product.id,
  product_title: product.name,
  price: product.price,
  collection: product.category,
});
```

Events are sent to:
1. **Vercel Analytics** - Always
2. **GTM** - If `NEXT_PUBLIC_GTM_ID` is set

### Server-Side Tracking

Use for events in Server Actions or API routes:

```typescript
// In a Server Action
import { serverAnalytics } from '@/lib/analytics/server-tracker';

export async function addItem(cartId: string, lines: CartLine[]) {
  // ... add item logic

  serverAnalytics.addToCart({
    product_id: productId,
    variant_id: variantId,
    product_title: title,
    price: price,
  });
}
```

Server events only go to **Vercel Analytics** (GTM requires client-side JavaScript).

---

## Adding New Events

### Step 1: Define Types

Add to `lib/analytics/types.ts`:

```typescript
// 1. Add to AnalyticsEventName union
export type AnalyticsEventName =
  | 'product_view'
  | 'your_new_event'  // Add here
  // ...

// 2. Create properties interface
export interface YourNewEventProperties {
  property_one: string;
  property_two: number;
}

// 3. Add to AnalyticsEvent union
export type AnalyticsEvent =
  | { name: 'product_view'; properties: ProductViewProperties }
  | { name: 'your_new_event'; properties: YourNewEventProperties }  // Add here
  // ...
```

### Step 2: Add Convenience Method

**For client-side events** (`lib/analytics/tracker.ts`):

```typescript
export const analytics = {
  // ... existing methods

  yourNewEvent: (props: EventProperties<'your_new_event'>) =>
    trackEvent('your_new_event', props),
};
```

**For server-side events** (`lib/analytics/server-tracker.ts`):

```typescript
export const serverAnalytics = {
  // ... existing methods

  yourNewEvent: (props: ServerYourNewEventProps) =>
    track('your_new_event', props as unknown as AnalyticsRecord),
};
```

### Step 3: Fire the Event

```typescript
// Client component
analytics.yourNewEvent({
  property_one: 'value',
  property_two: 123,
});

// Server Action
serverAnalytics.yourNewEvent({
  property_one: 'value',
  property_two: 123,
});
```

---

## Testing Analytics

### Vercel Analytics

1. Deploy to Vercel (or use `vercel dev`)
2. Go to your Vercel dashboard → Analytics
3. Custom events appear in the Events tab

### Google Tag Manager

1. Install [GTM Preview Mode](https://tagmanager.google.com/)
2. Open your site with GTM debug mode
3. Check the Tag Assistant for fired events

### Local Development

Events fire in development but may not appear in dashboards:
- Vercel Analytics requires deployment to Vercel
- GTM works locally if configured

**Debug tip:** Add console logging temporarily:

```typescript
// lib/analytics/tracker.ts
export function trackEvent<T extends AnalyticsEventName>(
  name: T,
  properties: EventProperties<T>
): void {
  console.log('[Analytics]', name, properties); // Debug

  vercelTrack(name, properties as unknown as Record<string, string | number | boolean>);
  // ...
}
```

---

## Events NOT Implemented (Handled by Shopify)

The following GA4 e-commerce events are intentionally **not** implemented in the application code. They are tracked via **Shopify Web Pixel** after checkout:

| Event | Reason |
|-------|--------|
| `add_shipping_info` | Occurs in Shopify checkout |
| `add_payment_info` | Occurs in Shopify checkout |
| `purchase` | Occurs after Shopify checkout completes |

Configure these in your Shopify admin under **Settings → Customer Events**.

---

## GA4 Event Mapping

For GTM users, here's how custom events map to GA4 recommended events:

| Our Event | GA4 Recommended Event |
|-----------|----------------------|
| `product_view` | `view_item` |
| `view_item_list` | `view_item_list` |
| `view_cart` | `view_cart` |
| `add_to_cart` | `add_to_cart` |
| `remove_from_cart` | `remove_from_cart` |
| `checkout_initiated` | `begin_checkout` |
| `search_performed` | `search` |

Create GTM triggers matching these event names, then fire corresponding GA4 tags with mapped parameters.

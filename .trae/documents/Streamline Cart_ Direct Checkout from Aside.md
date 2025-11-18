## Overview
- Remove the intermediate `/cart` page and drive checkout from the cart aside (drawer).
- Keep all current cart item management in the aside (quantity, remove) and preserve Shopify checkout flow.
- Add robust validation, error handling, and clear UI feedback during transition.

## Key Changes
### Remove Cart Route
- Delete `app/cart/page.tsx` (entire file). Current checkout button lives at app/cart/page.tsx:206–213 and would be removed with the page.
- Keep `CartProvider` usage as is (`app/layout.tsx:64`).
- Leave `app/robots.ts` disallow list as-is (already includes `/checkout` and `/cart`); optional cleanup can remove `/cart` later.

### Cart Aside: Direct Checkout
- Update `components/layout/ShoppingCartDrawer.tsx`:
  - Replace “View Cart” link (`components/layout/ShoppingCartDrawer.tsx:224–231`) with a “Checkout” button.
  - Validation: block checkout if `displayItems.length === 0` and show inline error message in the footer area.
  - Optional customer info collection: inline email input next to the checkout button; require a valid email format before proceeding, show inline error if missing.
  - Redirect flow: on click, set processing state, disable controls, then navigate directly to `/checkout` using `next/navigation` router.
  - UX feedback: show “Processing…” text and/or spinner overlay while isProcessing is true; preserve existing optimistic updates and darken content during processing.

### New Checkout Page
- Add `app/checkout/page.tsx` as a lightweight client page that immediately redirects the user to Shopify checkout.
  - On mount, call a server action `getCheckoutUrl()` inside `useTransition`.
  - Success: `router.replace(checkoutUrl)` (external Shopify URL).
  - Failure: render a friendly error state with retry and a “Back to Shop” CTA.
  - Page copy: “Redirecting to secure checkout…” with accessible loading state.

### Server Actions: Safer Checkout
- Extend `components/cart/actions.ts`:
  - Keep existing quantity/remove actions.
  - Add `export async function getCheckoutUrl()` that:
    - Calls `getCart()` and validates `cart.totalQuantity > 0`; if empty, return `{ ok: false, code: 'empty_cart', message: 'Your basket is empty' }`.
    - Validates `cart.checkoutUrl` presence; map connectivity errors using `lib/shopify/error-handler.ts` to friendly messages (rate limits, network, unknown), returning `{ ok: false, code, message }`.
    - Returns `{ ok: true, checkoutUrl }` on success.
  - Avoid using `redirect()` here to allow client-side control over navigation and error display.
  - Existing `redirectToCheckout()` at `components/cart/actions.ts:101–104` can remain for any legacy callers; new drawer uses `getCheckoutUrl()`.

### Update References
- Replace all code references to `/cart`:
  - `components/layout/ShoppingCartDrawer.tsx:224–231` to new checkout button.
  - Remove `app/cart/page.tsx` import/usage paths (none elsewhere).
  - Confirm there are no other runtime references; robots can remain unchanged.

## Error Handling
- Empty cart: drawer blocks checkout and shows inline message; checkout page shows “Your basket is empty” with “Continue Shopping” link.
- Missing customer info: drawer requires email when empty; shows inline validation message. This is optional gating to meet the spec; Shopify will still collect details during checkout.
- Payment connectivity: `getCheckoutUrl()` catches and classifies errors via `lib/shopify/error-handler.ts`, returning user-friendly messages. Drawer shows error inline; checkout page renders a retry CTA.

## UI Feedback
- Disable drawer controls and show processing state while resolving checkout URL; keep animations smooth.
- Checkout page displays a loading message and spinner until navigation or error.

## Verification
- Manual: add an item → open drawer → press Checkout → observe immediate redirect to Shopify checkout.
- Edge: empty cart → drawer Checkout disabled with message; checkout page shows empty state.
- Network simulation: force `shopifyFetch` failures to confirm friendly error messaging and retry flows.
- Regression: validate quantity updates and remove actions still work in the drawer (components/layout/ShoppingCartDrawer.tsx:44–60).

## Notes
- No changes to payment gateway behavior; we continue using Shopify `checkoutUrl` for final payment.
- All existing checkout functionality remains intact; we simply move initiation from `/cart` to the aside.
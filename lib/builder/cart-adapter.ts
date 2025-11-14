/**
 * Builder.io Cart Integration Adapter
 *
 * Provides hooks for Builder.io components to interact with the Shopify cart.
 * This adapter allows Builder.io content to trigger cart actions while
 * maintaining separation of concerns.
 */

'use client';

import { useCart } from '@/components/cart/cart-context';
import { addItem } from '@/components/cart/actions';
import { useActionState } from 'react';

/**
 * Hook for adding items to cart from Builder.io components
 *
 * Returns a form action and message state for handling cart additions.
 * Use this in Builder.io components that need "Add to Cart" functionality.
 *
 * @returns { addToCartAction, message } - Form action and status message
 *
 * @example
 * ```tsx
 * const { addToCartAction, message } = useAddToCart();
 *
 * <form action={addToCartAction}>
 *   <input type="hidden" name="variantId" value={productVariantId} />
 *   <button type="submit">Add to Cart</button>
 * </form>
 * ```
 */
export function useAddToCart() {
  const [message, formAction] = useActionState(addItem, null);
  return {
    addToCartAction: formAction,
    message,
  };
}

/**
 * Hook for accessing cart state from Builder.io components
 *
 * Provides read-only access to cart information including:
 * - Full cart object
 * - Item count
 * - Empty state
 * - Total amount
 * - Formatted total
 *
 * @returns Cart state object
 *
 * @example
 * ```tsx
 * const { itemCount, totalAmount, isEmpty, formattedTotal } = useCartState();
 *
 * <div>
 *   <p>Items in cart: {itemCount}</p>
 *   <p>Total: {formattedTotal}</p>
 * </div>
 * ```
 */
export function useCartState() {
  const { cart } = useCart();

  const itemCount =
    cart?.lines.reduce((sum, line) => sum + line.quantity, 0) || 0;

  const isEmpty = itemCount === 0;

  const totalAmount = cart?.cost?.totalAmount
    ? parseFloat(cart.cost.totalAmount.amount)
    : 0;

  const formattedTotal = cart?.cost?.totalAmount
    ? `${cart.cost.totalAmount.currencyCode} ${totalAmount.toFixed(2)}`
    : '$0.00';

  return {
    cart,
    itemCount,
    isEmpty,
    totalAmount,
    formattedTotal,
  };
}

/**
 * Combined hook for full cart access
 *
 * Provides both cart state and cart actions in a single hook.
 * Useful for Builder.io components that need full cart integration.
 *
 * @returns Combined cart state and actions
 *
 * @example
 * ```tsx
 * const {
 *   cart,
 *   itemCount,
 *   isEmpty,
 *   addToCartAction,
 *   message
 * } = useBuilderCart();
 * ```
 */
export function useBuilderCart() {
  const cartState = useCartState();
  const { addToCartAction, message } = useAddToCart();

  return {
    ...cartState,
    addToCartAction,
    message,
  };
}

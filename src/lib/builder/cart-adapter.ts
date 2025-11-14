'use client';

/**
 * Cart Adapter for Builder.io Components
 *
 * This adapter provides hooks that wrap Fern & Fog's Server Actions
 * so Builder.io components can interact with the cart system.
 *
 * The existing cart system uses:
 * - React Server Actions (addItem, removeItem, updateItemQuantity)
 * - useCart() hook from CartProvider
 * - Optimistic UI updates
 *
 * This adapter makes cart functionality available to Builder.io components
 * registered in the visual editor.
 */

import { useActionState } from 'react';
import { useCart } from '@/components/cart/cart-context';
import { addItem, removeItem } from '@/components/cart/actions';
import type { Product } from '@/data/products';
import type { ProductVariant } from '@/types/product';

/**
 * Hook to add items to cart
 *
 * Wraps the addItem Server Action for use in Builder.io components.
 * Provides form action for form-based adds.
 *
 * For programmatic adds with type safety, use useCart() hook directly
 * and handle type conversion as needed (see ProductDetailContent.tsx for example).
 *
 * @example
 * const { addToCartAction, message } = useAddToCart();
 *
 * // Form-based usage
 * <form action={addToCartAction}>
 *   <input type="hidden" name="variantId" value={variant.id} />
 *   <button type="submit">Add to Cart</button>
 * </form>
 */
export function useAddToCart() {
  const [message, formAction] = useActionState(addItem, null);

  return {
    /** Form action for form-based adds */
    addToCartAction: formAction,
    /** Server action result message */
    message,
  };
}

/**
 * Hook to remove items from cart
 *
 * Wraps the removeItem Server Action.
 *
 * @example
 * const { removeFromCart } = useRemoveFromCart();
 * <button onClick={() => removeFromCart(merchandiseId)}>Remove</button>
 */
export function useRemoveFromCart() {
  const [message, formAction] = useActionState(removeItem, null);
  const { updateCartItem } = useCart();

  /**
   * Remove item from cart programmatically
   * Uses optimistic update for instant UI feedback
   */
  const removeFromCart = (merchandiseId: string) => {
    updateCartItem(merchandiseId, 'delete');
  };

  return {
    /** Programmatic remove from cart function */
    removeFromCart,
    /** Form action for form-based removes */
    removeFromCartAction: formAction,
    /** Server action result message */
    message,
  };
}

/**
 * Hook to update cart item quantities
 *
 * @example
 * const { updateQuantity } = useUpdateCartQuantity();
 * <button onClick={() => updateQuantity(merchandiseId, 'plus')}>+</button>
 * <button onClick={() => updateQuantity(merchandiseId, 'minus')}>-</button>
 */
export function useUpdateCartQuantity() {
  const { updateCartItem } = useCart();

  /**
   * Update cart item quantity
   * Uses optimistic update for instant UI feedback
   */
  const updateQuantity = (
    merchandiseId: string,
    operation: 'plus' | 'minus' | 'delete'
  ) => {
    updateCartItem(merchandiseId, operation);
  };

  return {
    updateQuantity,
  };
}

/**
 * Hook to access cart state
 *
 * Provides read-only access to current cart state for Builder.io components.
 *
 * @example
 * const { cart, itemCount, isEmpty } = useCartState();
 * <div>You have {itemCount} items in your cart</div>
 */
export function useCartState() {
  const { cart } = useCart();

  const itemCount = cart?.lines.reduce((sum, line) => sum + line.quantity, 0) || 0;
  const isEmpty = itemCount === 0;
  const totalAmount = cart?.cost?.totalAmount
    ? parseFloat(cart.cost.totalAmount.amount)
    : 0;

  return {
    /** Full cart object */
    cart,
    /** Total number of items in cart */
    itemCount,
    /** Whether cart is empty */
    isEmpty,
    /** Total cart amount (number) */
    totalAmount,
    /** Formatted total amount */
    formattedTotal: cart?.cost?.totalAmount
      ? `${cart.cost.totalAmount.currencyCode} ${totalAmount.toFixed(2)}`
      : '$0.00',
  };
}

/**
 * Combined cart hook for Builder.io components
 *
 * Provides all cart functionality in a single hook.
 *
 * @example
 * const cart = useBuilderCart();
 * <form action={cart.addToCartAction}>
 *   <input type="hidden" name="variantId" value={variant.id} />
 *   <button type="submit">Add to Cart</button>
 * </form>
 * <div>Items: {cart.itemCount}</div>
 */
export function useBuilderCart() {
  const { addToCartAction, message: addMessage } = useAddToCart();
  const { removeFromCart, removeFromCartAction, message: removeMessage } = useRemoveFromCart();
  const { updateQuantity } = useUpdateCartQuantity();
  const cartState = useCartState();

  return {
    ...cartState,
    addToCartAction,
    removeFromCart,
    removeFromCartAction,
    updateQuantity,
    addMessage,
    removeMessage,
  };
}

/**
 * Shopify Cart Adapter
 *
 * Maps local cart items to Shopify's cart format and provides
 * wrapper functions for cart operations.
 *
 * Key mapping: cartItem.variantId → Shopify's merchandiseId
 */

import { addToCart, removeFromCart, updateCart, createCart } from '@/lib/shopify'
import type { CartItem } from '@/types/cart'
import type { Cart } from '@/lib/shopify/types'

/**
 * Convert local cart item to Shopify cart line format
 */
export function cartItemToShopifyLine(item: CartItem): {
  merchandiseId: string
  quantity: number
} {
  // Use variantId if available, fallback to productId
  // Note: In production, all products with variants should have variantId selected
  const merchandiseId = item.variantId || item.productId

  if (!merchandiseId) {
    throw new Error(`Cart item "${item.name}" is missing both variantId and productId`)
  }

  return {
    merchandiseId,
    quantity: item.quantity
  }
}

/**
 * Convert multiple cart items to Shopify cart lines
 */
export function cartItemsToShopifyLines(
  items: CartItem[]
): Array<{ merchandiseId: string; quantity: number }> {
  return items.map(cartItemToShopifyLine)
}

/**
 * Sync entire local cart to Shopify
 * Creates a new Shopify cart with all items
 */
export async function syncCartToShopify(items: CartItem[]): Promise<Cart> {
  try {
    // Create new cart
    const cart = await createCart()

    // If cart has items, add them
    if (items.length > 0) {
      const lines = cartItemsToShopifyLines(items)
      const updatedCart = await addToCart(lines)
      return updatedCart
    }

    return cart
  } catch (error) {
    console.error('Failed to sync cart to Shopify:', error)
    throw new Error('Cart sync failed. Please try again.')
  }
}

/**
 * Add single item to Shopify cart
 */
export async function addItemToShopifyCart(
  item: CartItem
): Promise<Cart> {
  try {
    const line = cartItemToShopifyLine(item)
    const cart = await addToCart([line])
    return cart
  } catch (error) {
    console.error('Failed to add item to Shopify cart:', error)
    throw new Error('Failed to add item to cart. Please try again.')
  }
}

/**
 * Remove item from Shopify cart
 * Note: Requires Shopify line ID, not local product ID
 */
export async function removeItemFromShopifyCart(
  lineId: string
): Promise<Cart> {
  try {
    const cart = await removeFromCart([lineId])
    return cart
  } catch (error) {
    console.error('Failed to remove item from Shopify cart:', error)
    throw new Error('Failed to remove item from cart. Please try again.')
  }
}

/**
 * Update item quantity in Shopify cart
 * Note: Requires Shopify line ID and merchandiseId
 */
export async function updateItemInShopifyCart(
  lineId: string,
  merchandiseId: string,
  quantity: number
): Promise<Cart> {
  try {
    const cart = await updateCart([
      {
        id: lineId,
        merchandiseId,
        quantity
      }
    ])
    return cart
  } catch (error) {
    console.error('Failed to update item in Shopify cart:', error)
    throw new Error('Failed to update cart. Please try again.')
  }
}

/**
 * Check if Shopify cart sync is enabled
 */
export function isShopifyCartEnabled(): boolean {
  return (
    process.env.NEXT_PUBLIC_USE_SHOPIFY === 'true' &&
    !!process.env.SHOPIFY_STORE_DOMAIN &&
    !!process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN
  )
}

/**
 * Validate cart items before syncing to Shopify
 * Returns array of validation errors (empty if valid)
 */
export function validateCartItemsForShopify(items: CartItem[]): string[] {
  const errors: string[] = []

  for (const item of items) {
    if (!item.variantId && !item.productId) {
      errors.push(`Item "${item.name}" is missing both variantId and productId`)
    }
  }

  return errors
}

/**
 * Helper: Map Shopify cart back to local cart items
 * Useful for keeping local state in sync with Shopify
 */
export function shopifyCartToLocalItems(shopifyCart: Cart): CartItem[] {
  return shopifyCart.lines.map(line => ({
    productId: line.merchandise.product.id,
    slug: line.merchandise.product.handle,
    name: line.merchandise.product.title,
    price: parseFloat(line.cost.totalAmount.amount) / line.quantity, // Get unit price
    quantity: line.quantity,
    image: line.merchandise.product.featuredImage?.url || '',
    variantId: line.merchandise.id,
    variantTitle: line.merchandise.title,
    selectedOptions: line.merchandise.selectedOptions
  }))
}

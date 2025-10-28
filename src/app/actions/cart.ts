'use server'

/**
 * Server Actions for Shopify Cart Operations
 *
 * These actions provide a robust, server-side interface for cart operations
 * with proper error handling, validation, and cache revalidation.
 */

import { revalidateTag } from 'next/cache'
import { TAGS } from '@/lib/constants'
import {
  addItemToShopifyCart,
  removeItemFromShopifyCart,
  updateItemInShopifyCart,
  syncCartToShopify,
  isShopifyCartEnabled,
  validateCartItemsForShopify
} from '@/lib/shopify-cart-adapter'
import type { CartItem } from '@/types/cart'
import type { Cart } from '@/lib/shopify/types'

/**
 * Server Action result type
 */
type ActionResult<T> = {
  success: boolean
  data?: T
  error?: string
}

/**
 * Add item to Shopify cart
 */
export async function addToCartAction(
  item: CartItem
): Promise<ActionResult<Cart>> {
  try {
    // Check if Shopify cart is enabled
    if (!isShopifyCartEnabled()) {
      return {
        success: false,
        error: 'Shopify cart is not enabled. Using local cart only.'
      }
    }

    // Validate item
    const errors = validateCartItemsForShopify([item])
    if (errors.length > 0) {
      return {
        success: false,
        error: errors.join(', ')
      }
    }

    // Add to Shopify cart
    const cart = await addItemToShopifyCart(item)

    // Revalidate cart cache
    revalidateTag(TAGS.cart)

    return {
      success: true,
      data: cart
    }
  } catch (error) {
    console.error('Add to cart action failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to add item to cart'
    }
  }
}

/**
 * Remove item from Shopify cart
 */
export async function removeFromCartAction(
  lineId: string
): Promise<ActionResult<Cart>> {
  try {
    if (!isShopifyCartEnabled()) {
      return {
        success: false,
        error: 'Shopify cart is not enabled'
      }
    }

    const cart = await removeItemFromShopifyCart(lineId)

    revalidateTag(TAGS.cart)

    return {
      success: true,
      data: cart
    }
  } catch (error) {
    console.error('Remove from cart action failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to remove item from cart'
    }
  }
}

/**
 * Update item quantity in Shopify cart
 */
export async function updateCartItemAction(
  lineId: string,
  merchandiseId: string,
  quantity: number
): Promise<ActionResult<Cart>> {
  try {
    if (!isShopifyCartEnabled()) {
      return {
        success: false,
        error: 'Shopify cart is not enabled'
      }
    }

    // Validate quantity
    if (quantity < 0) {
      return {
        success: false,
        error: 'Quantity must be greater than or equal to 0'
      }
    }

    const cart = await updateItemInShopifyCart(lineId, merchandiseId, quantity)

    revalidateTag(TAGS.cart)

    return {
      success: true,
      data: cart
    }
  } catch (error) {
    console.error('Update cart item action failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update cart item'
    }
  }
}

/**
 * Sync entire local cart to Shopify
 * Useful for initial sync or cart recovery
 */
export async function syncCartAction(
  items: CartItem[]
): Promise<ActionResult<Cart>> {
  try {
    if (!isShopifyCartEnabled()) {
      return {
        success: false,
        error: 'Shopify cart is not enabled'
      }
    }

    // Validate all items
    const errors = validateCartItemsForShopify(items)
    if (errors.length > 0) {
      return {
        success: false,
        error: `Validation failed: ${errors.join(', ')}`
      }
    }

    const cart = await syncCartToShopify(items)

    revalidateTag(TAGS.cart)

    return {
      success: true,
      data: cart
    }
  } catch (error) {
    console.error('Sync cart action failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to sync cart'
    }
  }
}

/**
 * Get Shopify cart status
 * Returns whether Shopify cart integration is active
 */
export async function getCartStatusAction(): Promise<{
  enabled: boolean
  configured: boolean
}> {
  return {
    enabled: process.env.NEXT_PUBLIC_USE_SHOPIFY === 'true',
    configured: !!(
      process.env.SHOPIFY_STORE_DOMAIN &&
      process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN
    )
  }
}

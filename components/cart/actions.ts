'use server';

import { TAGS } from '@/lib/constants';
import {
  addToCart,
  createCart,
  getCart,
  removeFromCart,
  updateCart
} from '@/lib/shopify';
import { revalidatePath, revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { serverAnalytics } from '@/lib/analytics/server-tracker';

export async function addItem(
  prevState: any,
  selectedVariantId: string | undefined
) {
  if (!selectedVariantId) {
    return 'Error adding item to cart';
  }

  try {
    await addToCart([{ merchandiseId: selectedVariantId, quantity: 1 }]);

    // Track add to cart event
    const cart = await getCart();
    const lineItem = cart?.lines.find(
      (line) => line.merchandise.id === selectedVariantId
    );
    if (lineItem) {
      serverAnalytics.addToCart({
        product_id: lineItem.merchandise.product.id,
        variant_id: selectedVariantId,
        product_title: lineItem.merchandise.product.title,
        price: parseFloat(lineItem.cost.totalAmount.amount),
      });
    }

    revalidateTag(TAGS.cart, 'max');
    revalidatePath('/', 'layout');
  } catch (e) {
    return 'Error adding item to cart';
  }
}

export async function removeItem(prevState: any, merchandiseId: string) {
  try {
    const cart = await getCart();

    if (!cart) {
      return 'Error fetching cart';
    }

    const lineItem = cart.lines.find(
      (line) => line.merchandise.id === merchandiseId
    );

    if (lineItem && lineItem.id) {
      // Track remove from cart event before removal
      serverAnalytics.removeFromCart({
        product_id: lineItem.merchandise.product.id,
        variant_id: merchandiseId,
        product_title: lineItem.merchandise.product.title,
      });

      await removeFromCart([lineItem.id]);
      revalidateTag(TAGS.cart, 'max');
      revalidatePath('/', 'layout');
    } else {
      return 'Item not found in cart';
    }
  } catch (e) {
    return 'Error removing item from cart';
  }
}

export async function updateItemQuantity(
  prevState: any,
  payload: {
    merchandiseId: string;
    quantity: number;
  }
) {
  const { merchandiseId, quantity } = payload;

  try {
    const cart = await getCart();

    if (!cart) {
      return 'Error fetching cart';
    }

    const lineItem = cart.lines.find(
      (line) => line.merchandise.id === merchandiseId
    );

    if (lineItem && lineItem.id) {
      const oldQuantity = lineItem.quantity;

      // Track quantity update
      serverAnalytics.updateCartQuantity({
        product_id: lineItem.merchandise.product.id,
        variant_id: merchandiseId,
        product_title: lineItem.merchandise.product.title,
        old_quantity: oldQuantity,
        new_quantity: quantity,
      });

      if (quantity === 0) {
        await removeFromCart([lineItem.id]);
      } else {
        await updateCart([
          {
            id: lineItem.id,
            merchandiseId,
            quantity
          }
        ]);
      }
    } else if (quantity > 0) {
      // If the item doesn't exist in the cart and quantity > 0, add it
      await addToCart([{ merchandiseId, quantity }]);
    }

    revalidateTag(TAGS.cart, 'max');
    revalidatePath('/', 'layout');
  } catch (e) {
    console.error(e);
    return 'Error updating item quantity';
  }
}

export async function redirectToCheckout() {
  let cart = await getCart();

  // Track checkout initiated
  if (cart) {
    serverAnalytics.checkoutInitiated({
      cart_total: parseFloat(cart.cost.totalAmount.amount),
      item_count: cart.lines.reduce((sum, line) => sum + line.quantity, 0),
    });
  }

  redirect(cart!.checkoutUrl);
}

export async function createCartAndSetCookie() {
  let cart = await createCart();
  (await cookies()).set('cartId', cart.id!);
}

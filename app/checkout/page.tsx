'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useCart } from '@/components/cart/cart-context'
import { redirectToCheckout } from '@/components/cart/actions'

export default function CheckoutPage() {
  const { cart } = useCart()
  const items = cart?.lines || []

  useEffect(() => {
    // If cart has items and a checkout URL, redirect to Shopify checkout
    if (cart?.checkoutUrl) {
      window.location.href = cart.checkoutUrl
    }
  }, [cart])

  if (items.length === 0) {
    return (
      <div className="bg-parchment min-h-screen flex items-center justify-center py-24">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-3xl font-display font-bold text-bark mb-4">
            Your Basket is Empty
          </h1>
          <p className="text-lg text-bark/60 mb-8">
            Add some items to your basket before checking out.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center px-6 py-3 bg-fern text-parchment font-medium rounded-md hover:bg-moss transition-colors"
          >
            Browse Shop
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-parchment min-h-screen flex items-center justify-center py-24">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="flex justify-center mb-6">
          <div className="animate-spin h-12 w-12 border-4 border-fern border-t-transparent rounded-full"></div>
        </div>
        <h1 className="text-2xl font-display font-bold text-bark mb-4">
          Redirecting to Checkout...
        </h1>
        <p className="text-bark/60">
          You'll be redirected to complete your purchase securely.
        </p>
      </div>
    </div>
  )
}

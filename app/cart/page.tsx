'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/components/cart/cart-context'
import { MinusIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { removeItem, updateItemQuantity, redirectToCheckout } from '@/components/cart/actions'
import { useTransition } from 'react'

export default function CartPage() {
  const { cart, updateCartItem } = useCart()
  const [isPending, startTransition] = useTransition()

  const items = cart?.lines || []
  const total = cart?.cost.totalAmount.amount ? parseFloat(cart.cost.totalAmount.amount) : 0

  const handleUpdateQuantity = (merchandiseId: string, currentQuantity: number, change: number) => {
    const newQuantity = currentQuantity + change

    // Optimistic update
    updateCartItem(merchandiseId, change > 0 ? 'plus' : 'minus')

    // Server action
    startTransition(async () => {
      await updateItemQuantity(null, { merchandiseId, quantity: newQuantity })
    })
  }

  const handleRemove = (merchandiseId: string) => {
    // Optimistic update
    updateCartItem(merchandiseId, 'delete')

    // Server action
    startTransition(async () => {
      await removeItem(null, merchandiseId)
    })
  }

  const handleCheckout = () => {
    startTransition(async () => {
      await redirectToCheckout()
    })
  }

  if (items.length === 0) {
    return (
      <div className="bg-parchment min-h-screen flex items-center justify-center py-24">
        <div className="text-center max-w-md mx-auto px-4">
          <svg
            className="mx-auto h-16 w-16 text-bark/30 mb-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          <h1 className="text-3xl font-display font-bold text-bark mb-4">
            Your Basket is Empty
          </h1>
          <p className="text-lg text-bark/60 mb-8">
            Start filling it with handmade treasures from the coast.
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
    <div className="bg-parchment min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <h1 className="text-4xl font-display font-bold text-bark mb-12">
          Your Basket
        </h1>

        <div className={`lg:grid lg:grid-cols-12 lg:gap-x-12 ${isPending ? 'opacity-60 pointer-events-none' : ''}`}>
          {/* Cart Items */}
          <div className="lg:col-span-7">
            <ul role="list" className="divide-y divide-bark/10">
              {items.map((item) => {
                const image = item.merchandise.product.featuredImage
                const price = parseFloat(item.cost.totalAmount.amount) / item.quantity
                const lineTotal = parseFloat(item.cost.totalAmount.amount)

                return (
                  <li key={item.id} className="flex py-8">
                    <div className="size-32 shrink-0 overflow-hidden rounded-lg ring-1 ring-bark/20">
                      {image ? (
                        <Image
                          src={image.url}
                          alt={item.merchandise.title}
                          width={image.width || 128}
                          height={image.height || 128}
                          className="size-full object-cover"
                        />
                      ) : (
                        <div className="size-full bg-mist" />
                      )}
                    </div>

                    <div className="ml-6 flex flex-1 flex-col">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-bark">
                            <Link
                              href={`/products/${item.merchandise.product.handle}`}
                              className="hover:text-fern transition-colors"
                            >
                              {item.merchandise.product.title}
                            </Link>
                          </h3>
                          <p className="mt-1 text-sm text-bark/60">
                            ${price.toFixed(2)} each
                          </p>
                          {/* Show variant info if not default */}
                          {item.merchandise.title !== 'Default Title' && (
                            <p className="mt-1 text-sm text-bark/60 capitalize">{item.merchandise.title}</p>
                          )}
                        </div>
                        <p className="text-lg font-display font-semibold text-bark">
                          ${lineTotal.toFixed(2)}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleUpdateQuantity(item.merchandise.id, item.quantity, -1)}
                            disabled={isPending}
                            className="p-2 text-bark hover:text-fern hover:bg-mist rounded-md transition-colors disabled:opacity-50"
                            aria-label="Decrease quantity"
                          >
                            <MinusIcon className="h-4 w-4" />
                          </button>
                          <span className="text-bark font-medium px-4 py-2 bg-mist rounded-md min-w-[3rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(item.merchandise.id, item.quantity, 1)}
                            disabled={isPending}
                            className="p-2 text-bark hover:text-fern hover:bg-mist rounded-md transition-colors disabled:opacity-50"
                            aria-label="Increase quantity"
                          >
                            <PlusIcon className="h-4 w-4" />
                          </button>
                        </div>

                        <button
                          onClick={() => handleRemove(item.merchandise.id)}
                          disabled={isPending}
                          className="flex items-center text-sm font-medium text-fern hover:text-moss transition-colors disabled:opacity-50"
                        >
                          <XMarkIcon className="h-5 w-5 mr-1" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Order Summary */}
          <div className="mt-16 lg:col-span-5 lg:mt-0">
            <div className="bg-mist rounded-lg p-6 ring-1 ring-bark/10">
              <h2 className="text-lg font-display font-semibold text-bark mb-6">
                Order Summary
              </h2>

              <dl className="space-y-4 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-bark/70">Subtotal</dt>
                  <dd className="font-medium text-bark">${total.toFixed(2)}</dd>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-bark/10">
                  <dt className="text-bark/70">Shipping</dt>
                  <dd className="font-medium text-bark">Calculated at checkout</dd>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-bark/10">
                  <dt className="text-base font-display font-semibold text-bark">
                    Total
                  </dt>
                  <dd className="text-xl font-display font-semibold text-fern">
                    ${total.toFixed(2)}
                  </dd>
                </div>
              </dl>

              <div className="mt-8 space-y-3">
                <button
                  onClick={handleCheckout}
                  disabled={isPending}
                  className="block w-full text-center px-6 py-3 bg-fern text-parchment font-medium rounded-md hover:bg-moss transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPending ? 'Processing...' : 'Proceed to Checkout'}
                </button>
                <Link
                  href="/products"
                  className="block w-full text-center px-6 py-3 bg-transparent text-fern font-medium rounded-md ring-1 ring-fern hover:bg-fern/10 transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>

              <div className="mt-6 text-center text-xs text-bark/60">
                <p>Handmade items • Ships with care • Packaged beautifully</p>
              </div>
            </div>

            {/* Info Section */}
            <div className="mt-8 p-6 bg-white/50 rounded-lg">
              <h3 className="text-sm font-medium text-bark mb-4">Why Shop With Us</h3>
              <ul className="space-y-3 text-sm text-bark/70">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-fern mt-0.5 mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Each piece is one-of-a-kind
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-fern mt-0.5 mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Sustainably sourced materials
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-fern mt-0.5 mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Carefully packaged for shipping
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

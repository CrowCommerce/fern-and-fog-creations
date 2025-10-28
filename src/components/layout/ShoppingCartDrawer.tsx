'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { XMarkIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline'
import { useCart } from '@/components/cart/cart-context'
import { removeItem, updateItemQuantity } from '@/components/cart/actions'
import { useTransition } from 'react'

interface ShoppingCartDrawerProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export default function ShoppingCartDrawer({ open, setOpen }: ShoppingCartDrawerProps) {
  const { cart, updateCartItem } = useCart()
  const [isPending, startTransition] = useTransition()

  const displayItems = cart?.lines || []
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

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-[60]">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-moss/75 transition-opacity duration-500 ease-in-out data-closed:opacity-0"
      />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
            <DialogPanel
              transition
              className="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out data-closed:translate-x-full sm:duration-700"
            >
              <div className="flex h-full flex-col overflow-y-auto bg-parchment shadow-xl">
                <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                  <div className="flex items-start justify-between">
                    <DialogTitle className="text-lg font-display font-semibold text-bark">
                      Your Basket
                    </DialogTitle>
                    <div className="ml-3 flex h-7 items-center">
                      <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="relative -m-2 p-2 text-bark hover:text-fern transition-colors"
                      >
                        <span className="absolute -inset-0.5" />
                        <span className="sr-only">Close panel</span>
                        <XMarkIcon aria-hidden="true" className="size-6" />
                      </button>
                    </div>
                  </div>

                  <div className={`mt-8 ${isPending ? 'relative' : ''}`}>
                    {/* Loading overlay during transitions */}
                    {isPending && (
                      <div className="absolute inset-0 bg-parchment/60 flex items-center justify-center z-10 rounded-lg">
                        <div className="flex flex-col items-center gap-2">
                          <div className="animate-spin h-6 w-6 border-2 border-fern border-t-transparent rounded-full" />
                          <span className="text-xs text-bark/70">Updating...</span>
                        </div>
                      </div>
                    )}

                    {displayItems.length === 0 ? (
                      <div className="text-center py-12">
                        <svg
                          className="mx-auto h-12 w-12 text-bark/30"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                          />
                        </svg>
                        <h3 className="mt-4 text-sm font-medium text-bark">Your basket is empty</h3>
                        <p className="mt-2 text-sm text-bark/60">
                          Start adding handmade treasures to your collection.
                        </p>
                        <div className="mt-6">
                          <Link
                            href="/products"
                            onClick={() => setOpen(false)}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-parchment bg-fern hover:bg-moss transition-colors rounded-md"
                          >
                            Browse Shop
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div className="flow-root">
                        <ul role="list" className="-my-6 divide-y divide-bark/10">
                          {displayItems.map((item) => {
                            const image = item.merchandise.product.featuredImage
                            const price = parseFloat(item.cost.totalAmount.amount) / item.quantity

                            return (
                              <li key={item.id} className="flex py-6">
                                <div className="size-24 shrink-0 overflow-hidden rounded-md ring-1 ring-bark/20">
                                  {image ? (
                                    <Image
                                      alt={item.merchandise.title}
                                      src={image.url}
                                      width={image.width || 96}
                                      height={image.height || 96}
                                      className="size-full object-cover"
                                    />
                                  ) : (
                                    <div className="size-full bg-mist" />
                                  )}
                                </div>

                                <div className="ml-4 flex flex-1 flex-col">
                                  <div>
                                    <div className="flex justify-between text-base font-medium text-bark">
                                      <h3>
                                        <Link
                                          href={`/products/${item.merchandise.product.handle}`}
                                          onClick={() => setOpen(false)}
                                          className="hover:text-fern transition-colors"
                                        >
                                          {item.merchandise.product.title}
                                        </Link>
                                      </h3>
                                      <p className="ml-4">${price.toFixed(2)}</p>
                                    </div>
                                    {/* Show variant info if not default */}
                                    {item.merchandise.title !== 'Default Title' && (
                                      <p className="mt-1 text-sm text-bark/60">{item.merchandise.title}</p>
                                    )}
                                  </div>
                                  <div className="flex flex-1 items-end justify-between text-sm">
                                    <div className="flex items-center space-x-2">
                                      <button
                                        type="button"
                                        onClick={() => handleUpdateQuantity(item.merchandise.id, item.quantity, -1)}
                                        className="p-1 text-bark hover:text-fern transition-colors"
                                        aria-label="Decrease quantity"
                                      >
                                        <MinusIcon className="h-4 w-4" />
                                      </button>
                                      <span className="text-bark font-medium w-8 text-center">
                                        {item.quantity}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => handleUpdateQuantity(item.merchandise.id, item.quantity, 1)}
                                        className="p-1 text-bark hover:text-fern transition-colors"
                                        aria-label="Increase quantity"
                                      >
                                        <PlusIcon className="h-4 w-4" />
                                      </button>
                                    </div>

                                    <div className="flex">
                                      <button
                                        type="button"
                                        onClick={() => handleRemove(item.merchandise.id)}
                                        className="font-medium text-fern hover:text-moss transition-colors"
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            )
                          })}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {displayItems.length > 0 && (
                  <div className="border-t border-bark/20 px-4 py-6 sm:px-6">
                    <div className="flex justify-between text-base font-medium text-bark">
                      <p>Subtotal</p>
                      <p className="font-display">${total.toFixed(2)}</p>
                    </div>
                    <p className="mt-0.5 text-sm text-bark/60">
                      Shipping calculated at checkout.
                    </p>
                    <div className="mt-6">
                      <Link
                        href="/cart"
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-center rounded-md border-2 border-fern bg-fern px-6 py-3 text-base font-medium text-parchment hover:bg-moss hover:border-moss transition-colors"
                      >
                        View Cart
                      </Link>
                    </div>
                    <div className="mt-6 flex justify-center text-center text-sm text-bark/60">
                      <p>
                        or{' '}
                        <button
                          type="button"
                          onClick={() => setOpen(false)}
                          className="font-medium text-fern hover:text-moss transition-colors"
                        >
                          Continue Shopping
                          <span aria-hidden="true"> &rarr;</span>
                        </button>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  )
}

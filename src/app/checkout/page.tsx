'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, clearCart } = useCart()
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    console.log('Order submitted:', { ...formData, items, total })
    clearCart()
    
    // Redirect to success (for now, just homepage)
    router.push('/?checkout=success')
  }

  return (
    <div className="bg-parchment min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <h1 className="text-4xl font-display font-bold text-bark mb-2">
          Checkout
        </h1>
        <p className="text-bark/60 mb-12">
          For demo purposes—no payment processing
        </p>

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
          {/* Form */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h2 className="text-xl font-display font-semibold text-bark mb-6">
                  Shipping Information
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-bark mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-bark/20 rounded-md text-bark focus:outline-none focus:ring-2 focus:ring-fern"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-bark mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-bark/20 rounded-md text-bark focus:outline-none focus:ring-2 focus:ring-fern"
                    />
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-bark mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-bark/20 rounded-md text-bark focus:outline-none focus:ring-2 focus:ring-fern"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-bark mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-bark/20 rounded-md text-bark focus:outline-none focus:ring-2 focus:ring-fern"
                      />
                    </div>

                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-bark mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        id="state"
                        required
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-bark/20 rounded-md text-bark focus:outline-none focus:ring-2 focus:ring-fern"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-bark mb-2">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      required
                      value={formData.zipCode}
                      onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-bark/20 rounded-md text-bark focus:outline-none focus:ring-2 focus:ring-fern"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 bg-fern text-parchment font-medium rounded-md hover:bg-moss transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Processing...' : 'Place Order (Demo)'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="mt-16 lg:col-span-5 lg:mt-0">
            <div className="bg-mist rounded-lg p-6 ring-1 ring-bark/10">
              <h2 className="text-lg font-display font-semibold text-bark mb-6">
                Order Summary
              </h2>

              <ul className="space-y-4 mb-6">
                {items.map((item) => (
                  <li key={item.productId} className="flex items-start space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-md object-cover ring-1 ring-bark/20"
                    />
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-bark">{item.name}</h3>
                      <p className="text-sm text-bark/60">Qty: {item.quantity}</p>
                      <p className="text-sm font-semibold text-bark">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <dl className="space-y-4 text-sm border-t border-bark/10 pt-6">
                <div className="flex items-center justify-between">
                  <dt className="text-bark/70">Subtotal</dt>
                  <dd className="font-medium text-bark">${total.toFixed(2)}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-bark/70">Shipping</dt>
                  <dd className="font-medium text-bark">TBD</dd>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

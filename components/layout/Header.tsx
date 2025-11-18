'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
} from '@headlessui/react'
import { Bars3Icon, ShoppingBagIcon, XMarkIcon } from '@heroicons/react/24/outline'
import ShoppingCartDrawer from './ShoppingCartDrawer'
import { useCart } from '@/components/cart/cart-context'
import { SearchButton } from '@/components/search/SearchButton'
import type { Menu } from '@/lib/shopify/types'

interface HeaderProps {
  navigation: Menu[];
}

export default function Header({ navigation }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const { cart } = useCart()
  const itemCount = cart?.totalQuantity || 0

  return (
    <div className="bg-parchment">
      {/* Shopping Cart Drawer */}
      <ShoppingCartDrawer open={cartOpen} setOpen={setCartOpen} />

      {/* Mobile menu */}
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="relative z-[60] lg:hidden">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-moss/50 transition-opacity duration-300 ease-linear data-closed:opacity-0"
        />
        <div className="fixed inset-0 z-40 flex">
          <DialogPanel
            transition
            className="relative flex w-full max-w-xs transform flex-col overflow-y-auto bg-parchment pb-12 shadow-xl transition duration-300 ease-in-out data-closed:-translate-x-full"
          >
            <div className="flex px-4 pt-5 pb-2">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-bark hover:text-moss cursor-pointer"
              >
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="size-6" />
              </button>
            </div>

            {/* Mobile Navigation Links */}
            <div className="mt-8 space-y-2 px-4">
              {navigation.map((item) => (
                <Link
                  key={item.title}
                  href={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-md px-3 py-3 text-base font-medium text-bark hover:bg-mist hover:text-moss transition-colors"
                  prefetch={true}
                >
                  {item.title}
                </Link>
              ))}
            </div>

            {/* Mobile Divider */}
            <div className="mt-8 border-t border-bark/20 px-4 pt-8">
              <p className="text-sm text-bark/60 font-display italic">
                Handmade with care on the coast
              </p>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      <header className="sticky top-0 z-50 bg-parchment border-b-2 border-bark/20">
        <nav aria-label="Top" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between lg:grid lg:grid-cols-3 lg:gap-8">
            {/* Mobile menu button and search */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="-ml-2 rounded-md p-2 text-bark hover:text-moss cursor-pointer"
              >
                <span className="sr-only">Open menu</span>
                <Bars3Icon aria-hidden="true" className="size-6" />
              </button>
              <SearchButton className="rounded-md p-2 text-bark hover:text-moss cursor-pointer transition-colors" />
            </div>

            {/* Desktop Navigation - Left side */}
            <div className="hidden lg:flex lg:items-center lg:space-x-8">
              {navigation.slice(0, 2).map((item) => (
                <Link
                  key={item.title}
                  href={item.path}
                  className="text-sm font-medium text-bark hover:text-fern transition-colors"
                  prefetch={true}
                >
                  {item.title}
                </Link>
              ))}
            </div>

            {/* Logo/Wordmark - Center */}
            <Link href="/" className="flex items-center space-x-2 justify-center" prefetch={true}>
              <svg className="h-6 w-6 text-fern" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
              </svg>
              <span className="font-display text-2xl font-semibold text-bark">
                Fern & Fog Creations
              </span>
            </Link>

            {/* Desktop Navigation - Right side */}
            <div className="hidden lg:flex lg:items-center lg:justify-end lg:space-x-8">
              {navigation.slice(2).map((item) => (
                <Link
                  key={item.title}
                  href={item.path}
                  className="text-sm font-medium text-bark hover:text-fern transition-colors"
                  prefetch={true}
                >
                  {item.title}
                </Link>
              ))}

              {/* Search */}
              <SearchButton className="rounded-md p-2 text-bark hover:text-fern cursor-pointer transition-colors" />

              {/* Cart */}
              <button
                type="button"
                onClick={() => setCartOpen(true)}
                className="group -m-2 flex items-center p-2 cursor-pointer"
              >
                <ShoppingBagIcon
                  aria-hidden="true"
                  className="size-6 shrink-0 text-bark group-hover:text-fern transition-colors"
                />
                {itemCount > 0 && (
                  <span className="ml-2 text-sm font-medium text-bark group-hover:text-fern transition-colors">
                    {itemCount}
                  </span>
                )}
                <span className="sr-only">items in cart, view bag</span>
              </button>
            </div>

            {/* Mobile Cart Icon */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setCartOpen(true)}
                className="group -mr-2 flex items-center p-2 cursor-pointer"
              >
                <ShoppingBagIcon
                  aria-hidden="true"
                  className="size-6 shrink-0 text-bark group-hover:text-fern"
                />
                {itemCount > 0 && (
                  <span className="ml-2 text-sm font-medium text-bark group-hover:text-fern">
                    {itemCount}
                  </span>
                )}
                <span className="sr-only">items in cart, view bag</span>
              </button>
            </div>
          </div>
        </nav>
      </header>
    </div>
  )
}

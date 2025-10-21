import Link from 'next/link'

const footerNavigation = {
  shop: [
    { name: 'All Products', href: '/products' },
    { name: 'Earrings', href: '/products?category=earrings' },
    { name: 'Resin Art', href: '/products?category=resin' },
    { name: 'Driftwood', href: '/products?category=driftwood' },
    { name: 'Wall Hangings', href: '/products?category=wall-hangings' },
  ],
  about: [
    { name: 'Our Story', href: '/about' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Contact', href: '/contact' },
  ],
  policies: [
    { name: 'Shipping', href: '#' },
    { name: 'Returns', href: '#' },
    { name: 'Privacy', href: '#' },
  ],
}

export default function Footer() {
  return (
    <footer aria-labelledby="footer-heading" className="bg-moss border-t-2 border-fern">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-16 lg:py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Brand Section */}
            <div className="col-span-1 md:col-span-3 lg:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <svg className="h-6 w-6 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
                  <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
                </svg>
                <span className="font-display text-xl font-semibold text-parchment">
                  Fern & Fog Creations
                </span>
              </div>
              <p className="text-sm text-mist leading-relaxed">
                Handmade coastal and woodland treasures. Each piece is crafted with care using natural materials gathered from the Pacific Northwest shores.
              </p>
              <p className="mt-4 text-sm text-gold/80 italic">
                Handmade on the coast • Est. 2021
              </p>
            </div>

            {/* Shop Links */}
            <div>
              <h3 className="text-sm font-medium text-parchment font-display">Shop</h3>
              <ul role="list" className="mt-4 space-y-3">
                {footerNavigation.shop.map((item) => (
                  <li key={item.name} className="text-sm">
                    <Link href={item.href} className="text-mist hover:text-gold transition-colors">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* About & Policies */}
            <div className="grid grid-cols-2 gap-8 md:grid-cols-1 md:gap-0 md:space-y-12">
              <div>
                <h3 className="text-sm font-medium text-parchment font-display">About</h3>
                <ul role="list" className="mt-4 space-y-3">
                  {footerNavigation.about.map((item) => (
                    <li key={item.name} className="text-sm">
                      <Link href={item.href} className="text-mist hover:text-gold transition-colors">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-medium text-parchment font-display">Policies</h3>
                <ul role="list" className="mt-4 space-y-3">
                  {footerNavigation.policies.map((item) => (
                    <li key={item.name} className="text-sm">
                      <Link href={item.href} className="text-mist hover:text-gold transition-colors">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-fern/30 py-8">
          <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
            <p className="text-sm text-mist/80">
              &copy; {new Date().getFullYear()} Fern & Fog Creations. All rights reserved.
            </p>
            <p className="text-xs text-mist/60 italic">
              Each piece tells a story • Gathered, crafted, treasured
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

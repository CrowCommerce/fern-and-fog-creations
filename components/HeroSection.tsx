import Link from 'next/link'
import Image from 'next/image'

export default function HeroSection() {
  return (
    <div className="relative bg-moss">
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
        <Image
          alt=""
          src="/stock-assets/hero/coastal-shells.jpg"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
          quality={90}
        />
      </div>
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-moss/70 via-moss/50 to-moss/70" />

      <div className="relative mx-auto flex max-w-4xl flex-col items-center px-6 py-32 text-center sm:py-48 lg:py-64 lg:px-0">
        <h1 className="text-5xl font-display font-bold tracking-tight text-parchment lg:text-7xl drop-shadow-lg">
          Handmade Coastal & Woodland Treasures
        </h1>
        <p className="mt-6 text-xl text-mist max-w-2xl leading-relaxed">
          Sea glass earrings, pressed flower resin, driftwood décor—crafted in small batches with materials gathered from the Pacific Northwest shores.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link
            href="/gallery"
            className="inline-block rounded-md border-2 border-parchment bg-transparent px-8 py-3 text-base font-medium text-parchment hover:bg-parchment/10 transition-colors"
          >
            View Gallery
          </Link>
          <Link
            href="/products"
            className="inline-block rounded-md border-2 border-gold bg-gold px-8 py-3 text-base font-medium text-moss hover:bg-gold/90 transition-colors"
          >
            Shop New Arrivals
          </Link>
        </div>
        
        {/* Decorative Divider */}
        <div className="mt-16 flex items-center space-x-4 text-gold/40">
          <div className="h-px w-12 bg-gold/40"></div>
          <span className="text-2xl">❖</span>
          <div className="h-px w-12 bg-gold/40"></div>
        </div>
      </div>
    </div>
  )
}


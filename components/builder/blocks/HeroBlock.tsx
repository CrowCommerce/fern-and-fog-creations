'use client';

/**
 * HeroBlock - Builder.io wrapper for HeroSection
 *
 * Configurable full-width hero with coastal theming.
 * Allows Builder.io users to customize:
 * - Background image
 * - Heading and description
 * - Two CTA buttons
 */

import Link from 'next/link';

export interface HeroBlockProps {
  backgroundImage?: string;
  heading?: string;
  description?: string;
  primaryCTA?: {
    label: string;
    href: string;
  };
  secondaryCTA?: {
    label: string;
    href: string;
  };
}

export default function HeroBlock({
  backgroundImage = '/stock-assets/hero/coastal-shells.jpg',
  heading = 'Handmade Coastal & Woodland Treasures',
  description = 'Sea glass earrings, pressed flower resin, driftwood décor—crafted in small batches with materials gathered from the Pacific Northwest shores.',
  primaryCTA = { label: 'View Gallery', href: '/gallery' },
  secondaryCTA = { label: 'Shop New Arrivals', href: '/products' },
}: HeroBlockProps) {
  return (
    <div className="relative bg-moss">
      {/* Background Image */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
        <img
          alt=""
          src={backgroundImage}
          className="size-full object-cover object-center"
        />
      </div>

      {/* Gradient Overlay */}
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-moss/70 via-moss/50 to-moss/70" />

      {/* Content */}
      <div className="relative mx-auto flex max-w-4xl flex-col items-center px-6 py-32 text-center sm:py-48 lg:py-64 lg:px-0">
        <h1 className="text-5xl font-display font-bold tracking-tight text-parchment lg:text-7xl drop-shadow-lg">
          {heading}
        </h1>
        <p className="mt-6 text-xl text-mist max-w-2xl leading-relaxed">
          {description}
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          {primaryCTA && (
            <Link
              href={primaryCTA.href}
              className="inline-block rounded-md border-2 border-parchment bg-transparent px-8 py-3 text-base font-medium text-parchment hover:bg-parchment/10 transition-colors"
            >
              {primaryCTA.label}
            </Link>
          )}
          {secondaryCTA && (
            <Link
              href={secondaryCTA.href}
              className="inline-block rounded-md border-2 border-gold bg-gold px-8 py-3 text-base font-medium text-moss hover:bg-gold/90 transition-colors"
            >
              {secondaryCTA.label}
            </Link>
          )}
        </div>

        {/* Decorative Divider */}
        <div className="mt-16 flex items-center space-x-4 text-gold/40">
          <div className="h-px w-12 bg-gold/40"></div>
          <span className="text-2xl">❖</span>
          <div className="h-px w-12 bg-gold/40"></div>
        </div>
      </div>
    </div>
  );
}

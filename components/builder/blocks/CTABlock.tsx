'use client';

/**
 * CTABlock - Call-to-action section with brand styling
 *
 * Perfect for conversion-focused sections.
 */

import Link from 'next/link';

export interface CTABlockProps {
  heading?: string;
  description?: string;
  primaryButtonLabel?: string;
  primaryButtonHref?: string;
  secondaryButtonLabel?: string;
  secondaryButtonHref?: string;
  backgroundColor?: 'moss' | 'fern' | 'gold' | 'parchment';
}

export default function CTABlock({
  heading = 'Ready to Start Your Collection?',
  description = 'Discover unique, handcrafted pieces that tell a story.',
  primaryButtonLabel = 'Shop Now',
  primaryButtonHref = '/products',
  secondaryButtonLabel,
  secondaryButtonHref,
  backgroundColor = 'moss',
}: CTABlockProps) {
  const bgClass = {
    moss: 'bg-moss',
    fern: 'bg-fern',
    gold: 'bg-gold',
    parchment: 'bg-parchment',
  }[backgroundColor];

  const isDark = backgroundColor === 'moss' || backgroundColor === 'fern';
  const textColor = isDark ? 'text-parchment' : 'text-bark';
  const subtextColor = isDark ? 'text-mist' : 'text-bark/70';

  return (
    <section className={`${bgClass} py-24 sm:py-32`}>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className={`text-4xl font-display font-bold tracking-tight ${textColor} mb-6`}>
          {heading}
        </h2>
        <p className={`text-xl ${subtextColor} mb-10 max-w-2xl mx-auto`}>
          {description}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {primaryButtonLabel && (
            <Link
              href={primaryButtonHref}
              className={`inline-block rounded-md border-2 ${
                isDark
                  ? 'border-gold bg-gold text-moss hover:bg-gold/90'
                  : 'border-moss bg-moss text-parchment hover:bg-moss/90'
              } px-8 py-3 text-base font-medium transition-colors`}
            >
              {primaryButtonLabel}
            </Link>
          )}
          {secondaryButtonLabel && secondaryButtonHref && (
            <Link
              href={secondaryButtonHref}
              className={`inline-block rounded-md border-2 ${
                isDark
                  ? 'border-parchment bg-transparent text-parchment hover:bg-parchment/10'
                  : 'border-bark bg-transparent text-bark hover:bg-bark/10'
              } px-8 py-3 text-base font-medium transition-colors`}
            >
              {secondaryButtonLabel}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

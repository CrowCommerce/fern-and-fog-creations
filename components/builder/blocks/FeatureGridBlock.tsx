'use client';

/**
 * FeatureGridBlock - Builder.io wrapper for FeaturedSectionOne/Two
 *
 * Configurable 3-column feature grid with icons.
 * Perfect for "Why Choose Us", "Our Values", etc.
 */

export interface Feature {
  name: string;
  description: string;
  iconEmoji?: string; // Simple emoji icon (e.g., "🌿", "🐚", "🌊")
}

export interface FeatureGridBlockProps {
  heading?: string;
  subheading?: string;
  features?: Feature[];
  backgroundColor?: 'mist' | 'parchment' | 'white';
}

export default function FeatureGridBlock({
  heading = 'Why Handmade Matters',
  subheading = 'Every piece tells a story of the land, the maker, and the moment of creation',
  features = [],
  backgroundColor = 'mist',
}: FeatureGridBlockProps) {
  // If no features provided, show placeholder
  if (features.length === 0) {
    return (
      <section
        aria-labelledby="features-heading"
        className={`bg-${backgroundColor} py-24 sm:py-32`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-bark/60">
              No features configured. Add features in Builder.io to display them here.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const bgClass = backgroundColor === 'mist' ? 'bg-mist' : backgroundColor === 'parchment' ? 'bg-parchment' : 'bg-white';

  return (
    <section
      aria-labelledby="features-heading"
      className={`${bgClass} py-24 sm:py-32`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 id="features-heading" className="text-4xl font-display font-bold tracking-tight text-bark">
            {heading}
          </h2>
          <p className="mt-4 text-lg text-bark/70 max-w-2xl mx-auto">
            {subheading}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.name} className="flex flex-col items-center text-center">
              {/* Icon */}
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-fern/10 ring-2 ring-fern/20">
                {feature.iconEmoji ? (
                  <span className="text-3xl">{feature.iconEmoji}</span>
                ) : (
                  <svg className="h-8 w-8 text-fern" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
                    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
                  </svg>
                )}
              </div>

              {/* Feature Content */}
              <h3 className="mt-6 text-xl font-display font-semibold text-bark">
                {feature.name}
              </h3>
              <p className="mt-3 text-base text-bark/70 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Decorative Divider */}
        <div className="mt-20 flex items-center justify-center space-x-4 text-fern/30">
          <div className="h-px w-24 bg-fern/30"></div>
          <span className="text-2xl">❖</span>
          <div className="h-px w-24 bg-fern/30"></div>
        </div>
      </div>
    </section>
  );
}

'use client';

import Link from 'next/link';

interface GalleryPreviewBlockProps {
  heading?: string;
  subheading?: string;
  items?: {
    id: string;
    title: string;
    image: string;
    materials: string[];
    story: string;
  }[];
  ctaLabel?: string;
  ctaHref?: string;
  backgroundColor?: 'moss' | 'fern' | 'parchment';
}

export default function GalleryPreviewBlock({
  heading = 'Stories in Every Piece',
  subheading = 'Each creation begins with a moment—a walk along the shore, a discovery in the forest, a spark of inspiration',
  items = [
    {
      id: '1',
      title: 'Coastal Morning',
      image: '/stock-assets/gallery/gallery-1.jpg',
      materials: ['Sea Glass', 'Driftwood', 'Sterling Silver'],
      story: 'Found on a misty morning walk, these pieces of weathered glass tell stories of journeys across the sea.',
    },
    {
      id: '2',
      title: 'Forest Treasures',
      image: '/stock-assets/gallery/gallery-2.jpg',
      materials: ['Pressed Flowers', 'Resin', 'Gold Leaf'],
      story: 'Wildflowers preserved in time, capturing the fleeting beauty of a woodland spring.',
    },
    {
      id: '3',
      title: 'Driftwood Dreams',
      image: '/stock-assets/gallery/gallery-3.jpg',
      materials: ['Driftwood', 'Copper Wire', 'Natural Fiber'],
      story: 'Shaped by wind and waves, this wood carries the spirit of the Pacific Northwest coast.',
    },
  ],
  ctaLabel = 'View Full Gallery',
  ctaHref = '/gallery',
  backgroundColor = 'moss',
}: GalleryPreviewBlockProps) {
  const bgClass = {
    moss: 'bg-moss',
    fern: 'bg-fern',
    parchment: 'bg-parchment',
  }[backgroundColor];

  const isDark = backgroundColor === 'moss' || backgroundColor === 'fern';

  return (
    <section className={`${bgClass} py-24 sm:py-32`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {(heading || subheading) && (
          <div className="text-center mb-16">
            {heading && (
              <h2 className={`text-4xl font-display font-bold tracking-tight ${isDark ? 'text-parchment' : 'text-bark'}`}>
                {heading}
              </h2>
            )}
            {subheading && (
              <p className={`mt-4 text-lg max-w-2xl mx-auto ${isDark ? 'text-mist' : 'text-bark/70'}`}>
                {subheading}
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item.id} className="group">
              <div className="aspect-square overflow-hidden rounded-lg ring-2 ring-gold/30">
                <img
                  alt={item.title}
                  src={item.image}
                  className="size-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="mt-4">
                <h3 className={`text-xl font-display font-semibold ${isDark ? 'text-parchment' : 'text-bark'}`}>
                  {item.title}
                </h3>
                <p className={`mt-2 text-sm ${isDark ? 'text-mist/80' : 'text-bark/60'}`}>
                  {item.materials.join(' • ')}
                </p>
                <p className={`mt-3 text-sm leading-relaxed italic line-clamp-3 ${isDark ? 'text-mist' : 'text-bark/70'}`}>
                  &quot;{item.story}&quot;
                </p>
              </div>
            </div>
          ))}
        </div>

        {ctaLabel && ctaHref && (
          <div className="mt-12 text-center">
            <Link
              href={ctaHref}
              className="inline-flex items-center px-6 py-3 rounded-md border-2 border-gold text-gold font-medium hover:bg-gold hover:text-moss transition-colors"
            >
              {ctaLabel}
              <span aria-hidden="true" className="ml-2">&rarr;</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

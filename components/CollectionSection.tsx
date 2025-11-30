import Link from 'next/link';
import { cacheLife, cacheTag } from 'next/cache';
import { PhotoIcon } from '@heroicons/react/24/outline';
import { TAGS } from '@/lib/constants';
import { getGalleryItems } from '@/lib/shopify';
import { isShopifyEnabled, isShopifyConfigured } from '@/lib/data-source';
import SpotlightCard from '@/components/SpotlightCard';
import type { GalleryItem } from '@/types/gallery';

/**
 * Fetch gallery preview items with caching
 */
async function getPreviewItems(): Promise<GalleryItem[]> {
  'use cache';
  cacheTag(TAGS.gallery);
  cacheLife('days');

  if (isShopifyEnabled() && isShopifyConfigured()) {
    try {
      const items = await getGalleryItems();
      return items.slice(0, 3);
    } catch (error) {
      console.error('Failed to fetch gallery items from Shopify:', error);
    }
  }

  return [];
}

export default async function CollectionSection() {
  const previewItems = await getPreviewItems();

  if (previewItems.length === 0) {
    return (
      <section aria-labelledby="gallery-heading" className="bg-moss py-24 sm:py-32">
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="bg-parchment/20 p-6 rounded-full mb-6">
            <PhotoIcon className="w-12 h-12 text-gold/60" />
          </div>
          <h2 id="gallery-heading" className="text-2xl font-display text-parchment mb-3">
            Gallery Coming Soon
          </h2>
          <p className="text-mist/70 max-w-md mx-auto">
            The store owner needs to add gallery items in Shopify Admin &rarr; Content &rarr; Gallery Item.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="gallery-heading"
      className="bg-moss py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 id="gallery-heading" className="text-4xl font-display font-bold tracking-tight text-parchment">
            Stories in Every Piece
          </h2>
          <p className="mt-4 text-lg text-mist max-w-2xl mx-auto">
            Each creation begins with a moment—a walk along the shore, a discovery in the forest, a spark of inspiration
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {previewItems.map((item) => (
            <SpotlightCard key={item.id} className="p-6">
              <Link href="/gallery" className="group block" prefetch={true}>
                <div className="aspect-square overflow-hidden rounded-lg ring-2 ring-gold/30">
                  <img
                    alt={item.title}
                    src={item.image}
                    className="size-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="mt-4">
                  <h3 className="text-xl font-display font-semibold text-bark">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-bark/60">
                    {item.materials.join(' \u2022 ')}
                  </p>
                  <p className="mt-3 text-sm text-bark/80 leading-relaxed italic line-clamp-3">
                    &quot;{item.story}&quot;
                  </p>
                </div>
              </Link>
            </SpotlightCard>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/gallery"
            className="inline-flex items-center px-6 py-3 rounded-md border-2 border-gold text-gold font-medium hover:bg-gold hover:text-moss transition-colors"
            prefetch={true}
          >
            View Full Gallery
            <span aria-hidden="true" className="ml-2">&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

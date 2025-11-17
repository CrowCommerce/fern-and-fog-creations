import type { Metadata } from 'next';
import { getGalleryItems, getGalleryPageSettings } from '@/lib/shopify';
import GalleryClient from './GalleryClient';

export const metadata: Metadata = {
  title: 'Gallery of Past Work | Fern & Fog Creations',
  description:
    'A collection of handmade treasures that have found their homes. Browse sea glass earrings, pressed flower resin, driftwood art, and coastal wall hangings crafted with love.',
  openGraph: {
    title: 'Gallery of Past Work | Fern & Fog Creations',
    description:
      'Explore past handmade creations including sea glass jewelry, pressed flower resin art, and coastal home décor.',
    type: 'website',
  },
};

export default async function GalleryPage() {
  // Fetch gallery items and page settings in parallel
  const [items, pageSettings] = await Promise.all([
    getGalleryItems(),
    getGalleryPageSettings(),
  ]);

  return <GalleryClient items={items} pageSettings={pageSettings} />;
}

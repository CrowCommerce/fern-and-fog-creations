import type { Metadata } from 'next';
import { getGalleryItems, getGalleryPageSettings, getPageMetadata } from '@/lib/shopify';
import GalleryClient from './GalleryClient';

export async function generateMetadata(): Promise<Metadata> {
  const metadata = await getPageMetadata('gallery');

  return {
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords,
    robots: {
      index: metadata.robotsIndex,
      follow: metadata.robotsFollow,
    },
    openGraph: metadata.ogImageUrl
      ? {
          images: [{ url: metadata.ogImageUrl }],
          type: 'website',
        }
      : {
          type: 'website',
        },
  };
}

export default async function GalleryPage() {
  // Fetch gallery items and page settings in parallel
  const [items, pageSettings] = await Promise.all([
    getGalleryItems(),
    getGalleryPageSettings(),
  ]);

  return <GalleryClient items={items} pageSettings={pageSettings} />;
}

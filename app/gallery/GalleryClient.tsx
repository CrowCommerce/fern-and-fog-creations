'use client';

import { useState, useMemo, useRef } from 'react';
import Lightbox from '@/components/Lightbox';
import { analytics } from '@/lib/analytics/tracker';
import type { GalleryItem, GalleryCategory, GalleryCategoryFilter, GalleryPageSettings } from '@/types/gallery';

interface GalleryClientProps {
  items: GalleryItem[];
  pageSettings: GalleryPageSettings;
}

export default function GalleryClient({ items, pageSettings }: GalleryClientProps) {
  const [activeFilter, setActiveFilter] = useState<GalleryCategoryFilter>('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const previousFilterRef = useRef<GalleryCategoryFilter>('all');

  // Extract unique categories from items and sort by sortOrder
  const categories = useMemo(() => {
    const uniqueCategories = new Map<string, GalleryCategory>();

    items.forEach((item) => {
      if (!uniqueCategories.has(item.category.slug)) {
        uniqueCategories.set(item.category.slug, item.category);
      }
    });

    return Array.from(uniqueCategories.values()).sort(
      (a, b) => (a.sortOrder || 999) - (b.sortOrder || 999)
    );
  }, [items]);

  // Build filter options with 'All Items' as first option
  const filters = useMemo(() => {
    return [
      { id: 'all' as GalleryCategoryFilter, name: 'All Items' },
      ...categories.map((cat) => ({
        id: cat.slug,
        name: cat.name,
      })),
    ];
  }, [categories]);

  // Filter items based on active category
  const filteredItems = useMemo(() => {
    if (activeFilter === 'all') {
      return items;
    }
    return items.filter((item) => item.category.slug === activeFilter);
  }, [items, activeFilter]);

  // Prepare images for lightbox
  const lightboxImages = filteredItems.map((item) => ({
    src: item.image,
    alt: item.title,
    title: item.title,
  }));

  // Helper to get filter name by id
  const getFilterName = (id: GalleryCategoryFilter): string => {
    const filter = filters.find((f) => f.id === id);
    return filter?.name || id;
  };

  // Handle filter change with analytics
  const handleFilterChange = (filterId: GalleryCategoryFilter) => {
    if (filterId !== activeFilter) {
      analytics.galleryFilter({
        filter_id: filterId,
        filter_name: getFilterName(filterId),
        previous_filter: previousFilterRef.current,
      });
      previousFilterRef.current = filterId;
    }
    setActiveFilter(filterId);
  };

  const openLightbox = (index: number) => {
    const item = filteredItems[index];
    if (item) {
      analytics.galleryItemClick({
        item_id: item.id,
        item_title: item.title,
        category: item.category.name,
        index,
      });
    }
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handlePrevious = () => {
    setLightboxIndex((prev) => {
      const newIndex = prev === 0 ? filteredItems.length - 1 : prev - 1;
      const item = filteredItems[newIndex];
      if (item) {
        analytics.galleryLightboxNavigate({
          direction: 'previous',
          from_index: prev,
          to_index: newIndex,
          item_title: item.title,
        });
      }
      return newIndex;
    });
  };

  const handleNext = () => {
    setLightboxIndex((prev) => {
      const newIndex = prev === filteredItems.length - 1 ? 0 : prev + 1;
      const item = filteredItems[newIndex];
      if (item) {
        analytics.galleryLightboxNavigate({
          direction: 'next',
          from_index: prev,
          to_index: newIndex,
          item_title: item.title,
        });
      }
      return newIndex;
    });
  };

  return (
    <div className="bg-parchment min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        {/* Header - Editable via Shopify Admin */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold tracking-tight text-bark sm:text-5xl">
            {pageSettings.heading}
          </h1>
          <p className="mt-4 text-lg text-bark/70 max-w-2xl mx-auto">
            {pageSettings.description}
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => handleFilterChange(filter.id)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                activeFilter === filter.id
                  ? 'bg-fern text-parchment ring-2 ring-fern'
                  : 'bg-mist text-bark hover:bg-fern/20 ring-1 ring-bark/20'
              }`}
            >
              {filter.name}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item, index) => (
            <article
              key={item.id}
              className="group cursor-pointer"
              onClick={() => openLightbox(index)}
            >
              <div className="aspect-square overflow-hidden rounded-lg ring-1 ring-bark/20 group-hover:ring-fern transition-all">
                <img
                  src={item.image}
                  alt={item.title}
                  className="size-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-display font-semibold text-bark group-hover:text-fern transition-colors">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm text-bark/60">{item.materials.join(' • ')}</p>
                {item.story && (
                  <p className="mt-2 text-sm text-bark/70 italic line-clamp-2">
                    &quot;{item.story}&quot;
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-bark/60">No items found in this category.</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <Lightbox
        images={lightboxImages}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />
    </div>
  );
}

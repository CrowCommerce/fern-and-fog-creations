'use client'

import { useState } from 'react'
import { getGalleryItemsByCategory } from '@/data/gallery'
import Lightbox from '@/components/Lightbox'

const filters = [
  { id: 'all', name: 'All' },
  { id: 'earrings', name: 'Earrings' },
  { id: 'resin', name: 'Resin' },
  { id: 'driftwood', name: 'Driftwood' },
  { id: 'wall-hangings', name: 'Wall Hangings' },
]

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'earrings' | 'resin' | 'driftwood' | 'wall-hangings'>('all')
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const filteredItems = getGalleryItemsByCategory(activeFilter)

  const lightboxImages = filteredItems.map(item => ({
    src: item.image,
    alt: item.title,
    title: item.title,
  }))

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  const handlePrevious = () => {
    setLightboxIndex((prev) => (prev === 0 ? filteredItems.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setLightboxIndex((prev) => (prev === filteredItems.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="bg-parchment min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold tracking-tight text-bark sm:text-5xl">
            Gallery of Past Work
          </h1>
          <p className="mt-4 text-lg text-bark/70 max-w-2xl mx-auto">
            A collection of treasures that have found their homes. Each piece represents a moment in time, a story preserved in natural materials.
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id as 'all' | 'earrings' | 'resin' | 'driftwood' | 'wall-hangings')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
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
                <p className="mt-1 text-sm text-bark/60">
                  {item.materials.join(' • ')}
                </p>
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
  )
}


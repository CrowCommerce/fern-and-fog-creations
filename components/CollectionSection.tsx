import Link from 'next/link'
import { galleryItems } from '@/data/gallery'

export default function CollectionSection() {
  // Get first 3 gallery items
  const previewItems = galleryItems.slice(0, 3)

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
            <div key={item.id} className="group">
              <div className="aspect-square overflow-hidden rounded-lg ring-2 ring-gold/30">
                <img
                  alt={item.title}
                  src={item.image}
                  className="size-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="mt-4">
                <h3 className="text-xl font-display font-semibold text-parchment">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-mist/80">
                  {item.materials.join(' • ')}
                </p>
                <p className="mt-3 text-sm text-mist leading-relaxed italic line-clamp-3">
                  &quot;{item.story}&quot;
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/gallery"
            className="inline-flex items-center px-6 py-3 rounded-md border-2 border-gold text-gold font-medium hover:bg-gold hover:text-moss transition-colors"
          >
            View Full Gallery
            <span aria-hidden="true" className="ml-2">&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  )
}

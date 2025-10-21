import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About | Fern & Fog Creations',
  description: 'Learn about Heather and the story behind Fern & Fog Creations—handmade coastal and woodland crafts.',
}

export default function AboutPage() {
  return (
    <div className="bg-parchment">
      {/* Hero Section */}
      <div className="relative bg-moss py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-display font-bold text-parchment sm:text-5xl lg:text-6xl">
              About Fern & Fog
            </h1>
            <p className="mt-6 text-xl text-mist max-w-3xl mx-auto">
              Where coastal treasures meet woodland wonders
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Story */}
          <div>
            <h2 className="text-3xl font-display font-bold text-bark mb-6">
              The Story
            </h2>
            <div className="space-y-4 text-bark/70 leading-relaxed">
              <p>
                Fern & Fog Creations was born from countless walks along the Oregon coast, where the mist meets the shore and treasures reveal themselves to those who pause to look.
              </p>
              <p>
                I'm Heather, a maker and gatherer who believes that the most beautiful things come from nature itself. Every piece in my collection begins with a moment of discovery—a perfectly frosted piece of sea glass, a delicate wildflower pressed between pages, a piece of driftwood shaped by years of waves and weather.
              </p>
              <p>
                What started as a personal practice of collecting and preserving these moments has grown into Fern & Fog Creations, where I transform these found treasures into wearable art and home décor that carry the spirit of the Pacific Northwest.
              </p>
              <p>
                Each piece is one-of-a-kind, crafted by hand in small batches. No two items are exactly alike—because no two pieces of sea glass, no two ferns, no two pieces of driftwood are the same.
              </p>
            </div>
          </div>

          {/* Image Placeholder */}
          <div className="relative">
            <div className="aspect-square rounded-lg overflow-hidden ring-2 ring-bark/20">
              <img
                src="https://images.unsplash.com/photo-1509937528035-ad76254b0356?w=800&q=80"
                alt="Crafting workspace with natural materials"
                className="size-full object-cover"
              />
            </div>
            <div className="mt-6 p-6 bg-mist rounded-lg">
              <p className="text-sm italic text-bark/70">
                "I believe that when you wear or display something made from the natural world, you carry a piece of that world with you—its stories, its journeys, its quiet beauty."
              </p>
              <p className="mt-2 text-sm font-medium text-bark">— Heather</p>
            </div>
          </div>
        </div>

        {/* Process Section */}
        <div className="mt-24">
          <h2 className="text-3xl font-display font-bold text-bark text-center mb-12">
            The Making Process
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-fern/10 rounded-full mb-4">
                <svg className="w-8 h-8 text-fern" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
                  <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
                </svg>
              </div>
              <h3 className="text-xl font-display font-semibold text-bark mb-3">
                1. Gathered
              </h3>
              <p className="text-bark/70">
                Materials are mindfully collected from Pacific Northwest beaches, forests, and meadows—always with respect for the environment.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-fern/10 rounded-full mb-4">
                <svg className="w-8 h-8 text-fern" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M12 21c-1.74 0-3.33-.6-4.5-1.5L12 4.5l4.5 15c-1.17.9-2.76 1.5-4.5 1.5Z"/>
                  <path d="M7.5 19.5c-1.5-1.26-2.5-3.1-2.5-5.19V3"/>
                  <path d="M19 3v11.31c0 2.09-1 3.93-2.5 5.19"/>
                </svg>
              </div>
              <h3 className="text-xl font-display font-semibold text-bark mb-3">
                2. Crafted
              </h3>
              <p className="text-bark/70">
                Each piece is handmade with care and attention to detail, using traditional and modern techniques to preserve and enhance natural beauty.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-fern/10 rounded-full mb-4">
                <svg className="w-8 h-8 text-fern" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
                  <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
                </svg>
              </div>
              <h3 className="text-xl font-display font-semibold text-bark mb-3">
                3. Treasured
              </h3>
              <p className="text-bark/70">
                Your piece becomes part of your story, carrying with it the memory of the place it came from and the hands that crafted it.
              </p>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="mt-24 p-8 bg-mist rounded-lg">
          <h2 className="text-2xl font-display font-bold text-bark text-center mb-8">
            What I Believe
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-bark/70">
            <div>
              <h3 className="font-semibold text-bark mb-2">Ethical Sourcing</h3>
              <p>All materials are gathered with permission and respect for the environment. I never take from protected areas and always follow Leave No Trace principles.</p>
            </div>
            <div>
              <h3 className="font-semibold text-bark mb-2">Quality Over Quantity</h3>
              <p>Each piece takes time. I create in small batches to ensure every item receives the attention it deserves.</p>
            </div>
            <div>
              <h3 className="font-semibold text-bark mb-2">Sustainable Practice</h3>
              <p>Packaging is minimal and eco-friendly. Materials are natural and biodegradable whenever possible.</p>
            </div>
            <div>
              <h3 className="font-semibold text-bark mb-2">One-of-a-Kind</h3>
              <p>Because I work with natural materials, no two pieces are identical. Your item is truly unique.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-24 text-center">
          <h2 className="text-3xl font-display font-bold text-bark mb-4">
            Ready to Find Your Treasure?
          </h2>
          <p className="text-lg text-bark/70 mb-8">
            Explore the collection or get in touch about a custom piece
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="inline-flex items-center px-8 py-3 bg-fern text-parchment font-medium rounded-md hover:bg-moss transition-colors"
            >
              Browse Shop
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-3 bg-transparent text-fern font-medium rounded-md ring-2 ring-fern hover:bg-fern/10 transition-colors"
            >
              Commission a Custom Piece
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}


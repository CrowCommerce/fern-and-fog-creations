import HeroSection from '@/components/HeroSection'
import CategorySection from '@/components/CategorySection'
import FeaturedSectionOne from '@/components/FeaturedSectionOne'
import CollectionSection from '@/components/CollectionSection'
import FeaturedSectionTwo from '@/components/FeaturedSectionTwo'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Fern & Fog Creations | Handmade Coastal Crafts',
  description: 'Sea glass earrings, pressed flower resin, driftwood décor—crafted in small batches on the coast.',
}

export default function Home() {
  return (
    <div className="bg-parchment">
      <HeroSection />
      <CategorySection />
      <FeaturedSectionOne />
      <FeaturedSectionTwo />
      <CollectionSection />
    </div>
  )
}

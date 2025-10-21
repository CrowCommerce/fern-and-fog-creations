export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  category: 'earrings' | 'resin' | 'driftwood' | 'wall-hangings';
  images: string[];
  materials: string[];
  description: string;
  forSale: boolean;
  featured?: boolean;
  externalUrl?: string;
  story?: string;
  variants?: ProductVariant[];
}

export interface ProductVariant {
  id: string;
  name: string;
  options: string[];
}

export const products: Product[] = [
  {
    id: '1',
    slug: 'seafoam-glass-earrings',
    name: 'Seafoam Glass Earrings',
    price: 38.00,
    category: 'earrings',
    images: [
      '/stock-assets/products/earrings/sea-glass-earrings.jpg',
      '/stock-assets/products/earrings/sea-glass-earrings-2.jpg'
    ],
    materials: ['Sea glass', 'Sterling silver hooks', 'Natural findings'],
    description: 'Delicate seafoam green sea glass pieces, tumbled smooth by the Pacific. Each piece is unique with its own character and history from the shore.',
    forSale: true,
    featured: true,
    story: 'Found along the rocky shores of the Oregon coast during an early morning walk. The mist was rolling in as these beautiful pieces caught the light.'
  },
  {
    id: '2',
    slug: 'amber-resin-pendant',
    name: 'Amber Wildflower Pendant',
    price: 45.00,
    category: 'resin',
    images: [
      '/stock-assets/products/resin/wildflower-pendant.jpg',
      '/stock-assets/products/resin/wildflower-pendant-2.jpg'
    ],
    materials: ['Pressed wildflowers', 'Clear resin', 'Gold-plated chain'],
    description: 'Tiny wildflowers preserved in crystal-clear resin, capturing a moment in time. The golden flowers seem to glow when held up to light.',
    forSale: true,
    featured: true
  },
  {
    id: '3',
    slug: 'driftwood-herb-garden-markers',
    name: 'Driftwood Garden Markers (Set of 6)',
    price: 32.00,
    category: 'driftwood',
    images: [
      '/stock-assets/products/driftwood/driftwood-markers.jpg',
      '/stock-assets/products/driftwood/driftwood-markers-2.jpg'
    ],
    materials: ['Driftwood', 'Natural twine', 'Hand-painted labels'],
    description: 'Sun-bleached driftwood pieces transformed into charming garden markers. Set includes: Basil, Rosemary, Thyme, Sage, Mint, and Lavender.',
    forSale: true,
    featured: true
  },
  {
    id: '4',
    slug: 'cobalt-blue-glass-drops',
    name: 'Cobalt Blue Glass Drop Earrings',
    price: 42.00,
    category: 'earrings',
    images: [
      '/stock-assets/products/earrings/sea-glass-earrings.jpg'
    ],
    materials: ['Cobalt blue sea glass', 'Sterling silver', 'Handmade wire wrapping'],
    description: 'Deep cobalt blue sea glass, rare and beautiful. Wire-wrapped by hand with sterling silver for an elegant drop.',
    forSale: true,
    featured: false
  },
  {
    id: '5',
    slug: 'fern-pressed-bookmark',
    name: 'Pressed Fern Resin Bookmark',
    price: 28.00,
    category: 'resin',
    images: [
      '/stock-assets/products/resin/fern-bookmark.jpg'
    ],
    materials: ['Pressed fern leaves', 'Clear resin', 'Silk ribbon'],
    description: 'Delicate fern fronds preserved in a clear resin bookmark. Perfect for nature lovers and book enthusiasts.',
    forSale: true
  },
  {
    id: '6',
    slug: 'shell-wind-chime',
    name: 'Coastal Shell Wind Chime',
    price: 65.00,
    category: 'wall-hangings',
    images: [
      '/stock-assets/products/wall-hangings/shell-wind-chime.jpg'
    ],
    materials: ['Scallop shells', 'Driftwood', 'Natural hemp cord', 'Glass beads'],
    description: 'Gentle sounds of the sea. Hand-collected shells and driftwood come together in this peaceful wind chime.',
    forSale: true,
    featured: true
  },
  {
    id: '7',
    slug: 'lavender-resin-coasters',
    name: 'Lavender Resin Coaster Set',
    price: 52.00,
    category: 'resin',
    images: [
      '/stock-assets/products/resin/lavender-coasters.jpg'
    ],
    materials: ['Dried lavender', 'Resin', 'Cork backing'],
    description: 'Set of 4 coasters featuring preserved lavender sprigs. Each coaster is unique with its own arrangement of purple blooms.',
    forSale: true
  },
  {
    id: '8',
    slug: 'white-beach-glass-studs',
    name: 'White Beach Glass Stud Earrings',
    price: 35.00,
    category: 'earrings',
    images: [
      '/stock-assets/products/earrings/sea-glass-earrings.jpg'
    ],
    materials: ['White sea glass', 'Sterling silver posts', 'Hypoallergenic backs'],
    description: 'Simple, elegant studs made from frosted white sea glass. Perfect for everyday wear.',
    forSale: true
  },
  {
    id: '9',
    slug: 'moss-terrarium-magnet-trio',
    name: 'Mini Moss Terrarium Magnets (Set of 3)',
    price: 38.00,
    category: 'driftwood',
    images: [
      '/stock-assets/products/driftwood/moss-terrarium.jpg'
    ],
    materials: ['Preserved moss', 'Small glass vials', 'Strong magnets', 'Cork stoppers'],
    description: 'Tiny living worlds captured in glass. These miniature terrariums bring a touch of woodland magic to your fridge or workspace.',
    forSale: true
  },
  {
    id: '10',
    slug: 'sunset-macrame-hanging',
    name: 'Sunset Macramé Wall Hanging',
    price: 78.00,
    category: 'wall-hangings',
    images: [
      '/stock-assets/products/wall-hangings/macrame-hanging.jpg'
    ],
    materials: ['Natural cotton cord', 'Driftwood rod', 'Hand-dyed fibers in sunset tones'],
    description: 'Warm golden and amber tones cascade down in this handwoven macramé piece. Each knot is tied with intention.',
    forSale: true,
    featured: true
  },
  {
    id: '11',
    slug: 'rose-quartz-shell-earrings',
    name: 'Rose Quartz & Shell Earrings',
    price: 44.00,
    category: 'earrings',
    images: [
      '/stock-assets/products/earrings/sea-glass-earrings.jpg'
    ],
    materials: ['Rose quartz beads', 'Small shell pieces', 'Gold-filled wire'],
    description: 'Soft pink rose quartz paired with tiny iridescent shell fragments. A touch of seaside romance.',
    forSale: true
  },
  {
    id: '12',
    slug: 'woodland-shadow-box',
    name: 'Woodland Memory Shadow Box',
    price: 95.00,
    category: 'wall-hangings',
    images: [
      '/stock-assets/products/wall-hangings/woodland-shadow-box.jpg'
    ],
    materials: ['Reclaimed wood frame', 'Pressed ferns', 'Moss', 'Acorns', 'Feathers'],
    description: 'A curated collection of woodland treasures arranged in a deep shadow box. Each element tells part of a forest story.',
    forSale: true,
    featured: true
  },
  {
    id: '13',
    slug: 'custom-pet-portrait-resin',
    name: 'Custom Pet Portrait Resin Piece',
    price: 125.00,
    category: 'resin',
    images: [
      '/stock-assets/products/resin/custom-pet-portrait.jpg'
    ],
    materials: ['Your photo', 'Preserved flowers', 'Premium resin', 'Wood base'],
    description: 'Commission a custom memorial or celebration piece featuring your beloved pet. Includes flowers of your choice arranged around their photo.',
    forSale: true,
    externalUrl: 'https://www.etsy.com/shop/fernandfo' // Example external link
  },
  {
    id: '14',
    slug: 'driftwood-key-holder',
    name: 'Driftwood Key Holder',
    price: 48.00,
    category: 'driftwood',
    images: [
      '/stock-assets/products/driftwood/driftwood-markers.jpg'
    ],
    materials: ['Large driftwood piece', 'Brass hooks', 'Mounting hardware'],
    description: 'Functional art for your entryway. This weathered driftwood has been fitted with brass hooks for keys, leashes, or small items.',
    forSale: true
  },
  {
    id: '15',
    slug: 'baby-breath-resin-ring',
    name: "Baby's Breath Resin Ring",
    price: 36.00,
    category: 'resin',
    images: [
      '/stock-assets/products/resin/baby-breath-ring.jpg'
    ],
    materials: ["Pressed baby's breath", 'Clear resin', 'Adjustable silver band'],
    description: "Delicate white baby's breath flowers frozen in time. The adjustable band ensures a perfect fit.",
    forSale: true
  },
  {
    id: '16',
    slug: 'triple-shell-mobile',
    name: 'Triple Strand Shell Mobile',
    price: 58.00,
    category: 'wall-hangings',
    images: [
      '/stock-assets/products/wall-hangings/shell-wind-chime.jpg'
    ],
    materials: ['Assorted shells', 'Driftwood crossbar', 'Linen thread', 'Small bells'],
    description: 'Three cascading strands of shells create gentle movement and soft sounds. Perfect for a nursery or meditation space.',
    forSale: true
  }
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find(product => product.slug === slug);
}

export function getProductsByCategory(category: Product['category']): Product[] {
  return products.filter(product => product.category === category && product.forSale);
}

export function getFeaturedProducts(): Product[] {
  return products.filter(product => product.featured && product.forSale);
}

export function getRelatedProducts(product: Product, limit: number = 6): Product[] {
  return products
    .filter(p => p.id !== product.id && p.category === product.category && p.forSale)
    .slice(0, limit);
}

export const categories = [
  {
    id: 'earrings',
    name: 'Sea Glass Earrings',
    slug: 'earrings',
    description: 'Found along rocky shores, tumbled by the sea.',
    image: '/stock-assets/categories/earrings.jpg'
  },
  {
    id: 'resin',
    name: 'Pressed Flower Resin',
    slug: 'resin',
    description: 'Tiny botanicals preserved in crystal-clear resin.',
    image: '/stock-assets/categories/resin.jpg'
  },
  {
    id: 'driftwood',
    name: 'Driftwood Magnets',
    slug: 'driftwood',
    description: 'Sun-bleached, sea-worn, and one-of-a-kind.',
    image: '/stock-assets/categories/driftwood.jpg'
  },
  {
    id: 'wall-hangings',
    name: 'Wall Hangings',
    slug: 'wall-hangings',
    description: 'Natural textures for cozy, story-filled spaces.',
    image: '/stock-assets/categories/wall-hangings.jpg'
  }
];


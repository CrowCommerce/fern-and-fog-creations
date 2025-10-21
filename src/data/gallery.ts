export interface GalleryItem {
  id: string;
  title: string;
  category: 'earrings' | 'resin' | 'driftwood' | 'wall-hangings';
  image: string;
  materials: string[];
  story: string;
  forSale: false;
  createdDate: string;
}

export const galleryItems: GalleryItem[] = [
  {
    id: 'g1',
    title: 'First Light Sea Glass Collection',
    category: 'earrings',
    image: '/stock-assets/gallery/earrings/first-light-collection.jpg',
    materials: ['Sea glass', 'Copper wire', 'Vintage beads'],
    story: 'My very first collection, made from glass found on a foggy morning at Cannon Beach. Each piece seemed to glow with its own inner light.',
    forSale: false,
    createdDate: '2021-03-15'
  },
  {
    id: 'g2',
    title: 'Meadow Memory Pendant',
    category: 'resin',
    image: '/stock-assets/gallery/resin/meadow-memory-pendant.jpg',
    materials: ['Wild forget-me-nots', 'Resin', 'Silver chain'],
    story: 'Created from flowers picked during a spring hike in the Cascades. The blues remind me of that perfect alpine sky.',
    forSale: false,
    createdDate: '2021-05-22'
  },
  {
    id: 'g3',
    title: 'Storm-Tossed Welcome Sign',
    category: 'driftwood',
    image: '/stock-assets/gallery/driftwood/storm-tossed-sign.jpg',
    materials: ['Large driftwood plank', 'Carved letters', 'Natural oil finish'],
    story: 'This piece washed up after a particularly fierce winter storm. The grain patterns looked like waves, so I carved "Welcome" following their flow.',
    forSale: false,
    createdDate: '2021-11-08'
  },
  {
    id: 'g4',
    title: 'Autumn Forest Wall Tapestry',
    category: 'wall-hangings',
    image: '/stock-assets/gallery/wall-hangings/autumn-forest-tapestry.jpg',
    materials: ['Natural wool', 'Hand-dyed yarns', 'Maple branch'],
    story: 'Inspired by the changing colors of the Pacific Northwest autumn. Each thread was dyed with natural materials: walnut husks, madder root, and goldenrod.',
    forSale: false,
    createdDate: '2021-10-05'
  },
  {
    id: 'g5',
    title: 'Tidepool Treasure Earrings',
    category: 'earrings',
    image: '/stock-assets/gallery/earrings/first-light-collection.jpg',
    materials: ['Green sea glass', 'Tiny shells', 'Bronze findings'],
    story: 'Made for a dear friend who loves tidepool exploring. The green glass reminded us both of the kelp forests we explored together.',
    forSale: false,
    createdDate: '2022-01-14'
  },
  {
    id: 'g6',
    title: 'Bride\'s Bouquet Preservation Box',
    category: 'resin',
    image: '/stock-assets/gallery/resin/bride-bouquet-box.jpg',
    materials: ['Preserved wedding bouquet flowers', 'Deep-pour resin', 'Shadow box frame'],
    story: 'A commission to preserve a bride\'s bouquet from her coastal wedding. It was an honor to help capture such a special memory.',
    forSale: false,
    createdDate: '2022-06-18'
  },
  {
    id: 'g7',
    title: 'Weathered Poetry Stones',
    category: 'driftwood',
    image: '/stock-assets/gallery/driftwood/poetry-stones.jpg',
    materials: ['Beach stones', 'Gold leaf', 'Poetry excerpts'],
    story: 'Each smooth stone was hand-lettered with a line from Mary Oliver\'s poems. A meditation on nature and words.',
    forSale: false,
    createdDate: '2022-04-22'
  },
  {
    id: 'g8',
    title: 'Moon Phase Wall Hanging',
    category: 'wall-hangings',
    image: '/stock-assets/gallery/wall-hangings/moon-phase-hanging.jpg',
    materials: ['Driftwood', 'Clay moon phases', 'Black linen'],
    story: 'Crafted during a series of full moons. Each phase was shaped from natural clay and hung on foraged driftwood.',
    forSale: false,
    createdDate: '2022-08-30'
  },
  {
    id: 'g9',
    title: 'Wildflower Year Collection',
    category: 'resin',
    image: '/stock-assets/gallery/resin/wildflower-year-collection.jpg',
    materials: ['12 types of wildflowers', 'Resin pendants', 'Display case'],
    story: 'A full year of collecting and pressing wildflowers, one for each month. From January snowdrops to December holly berries.',
    forSale: false,
    createdDate: '2022-12-31'
  },
  {
    id: 'g10',
    title: 'Kelp Forest Chandelier',
    category: 'wall-hangings',
    image: '/stock-assets/gallery/wall-hangings/kelp-forest-chandelier.jpg',
    materials: ['Dried bull kelp', 'Sea glass', 'Copper wire', 'LED lights'],
    story: 'My most ambitious piece. The kelp was collected after a big storm and carefully dried for months. When lit, it casts shadows like underwater light.',
    forSale: false,
    createdDate: '2023-03-12'
  },
  {
    id: 'g11',
    title: 'Rose Gold Beach Glass Set',
    category: 'earrings',
    image: '/stock-assets/gallery/earrings/rose-gold-set.jpg',
    materials: ['Pink-tinged sea glass', 'Rose gold wire', 'Matching bracelet'],
    story: 'The pink glass is extremely rare. I found three pieces over two years and finally had enough to make this set.',
    forSale: false,
    createdDate: '2023-05-07'
  },
  {
    id: 'g12',
    title: 'Grandmother\'s Garden Remembrance',
    category: 'resin',
    image: '/stock-assets/gallery/resin/grandmother-garden.jpg',
    materials: ['Flowers from a memorial garden', 'Resin', 'Antique locket frame'],
    story: 'Made using flowers from my grandmother\'s garden after she passed. Her favorites: roses, lavender, and sweet peas.',
    forSale: false,
    createdDate: '2023-07-20'
  }
];

export function getGalleryItemsByCategory(category: GalleryItem['category'] | 'all'): GalleryItem[] {
  if (category === 'all') {
    return galleryItems;
  }
  return galleryItems.filter(item => item.category === category);
}


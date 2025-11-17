/**
 * Gallery Item Type Definitions
 *
 * Defines the structure for gallery items used throughout the application.
 * Gallery items represent past handmade creations that are not for sale,
 * showcasing the artisan's work and creative journey.
 */

/**
 * Gallery category object
 * Categories are now managed as separate metaobjects in Shopify,
 * allowing business users to edit them without developer intervention.
 */
export interface GalleryCategory {
  /**
   * Unique identifier for the category
   * Shopify GID format (e.g., "gid://shopify/Metaobject/123456")
   */
  id: string;

  /**
   * Display name for the category
   * Example: "Earrings", "Resin Art"
   */
  name: string;

  /**
   * URL-friendly slug for filtering and routing
   * Example: "earrings", "resin", "wall-hangings"
   */
  slug: string;

  /**
   * Description of what this category includes
   * Example: "Sea glass earrings, wire-wrapped designs, handmade jewelry for ears"
   */
  description?: string;

  /**
   * Sort order for category display (1 = first)
   */
  sortOrder?: number;
}

export interface GalleryItem {
  /**
   * Unique identifier for the gallery item
   * When from Shopify: GID format (e.g., "gid://shopify/Metaobject/123456")
   * When from local data: Simple string (e.g., "g1", "g2")
   */
  id: string;

  /**
   * Display title of the gallery item
   * Example: "First Light Sea Glass Collection"
   */
  title: string;

  /**
   * Category object with full category details
   * Fetched from category metaobject reference in Shopify
   */
  category: GalleryCategory;

  /**
   * Image URL for the gallery item
   * When from Shopify: Full CDN URL (e.g., "https://cdn.shopify.com/...")
   * When from local data: Relative path (e.g., "/stock-assets/gallery/...")
   */
  image: string;

  /**
   * List of materials used in creating the item
   * Example: ["Sea glass", "Copper wire", "Vintage beads"]
   */
  materials: string[];

  /**
   * Narrative description or backstory of the creation
   * Provides context and personal connection to the piece
   */
  story: string;

  /**
   * Indicates whether the item is available for purchase
   * Currently always false as gallery items are showcase pieces only
   */
  forSale: false;

  /**
   * ISO date string indicating when the item was created
   * Format: YYYY-MM-DD (e.g., "2021-03-15")
   */
  createdDate: string;
}

/**
 * Gallery page settings object
 * Allows business users to edit page heading and description via Shopify Admin
 */
export interface GalleryPageSettings {
  /**
   * Main heading displayed at top of gallery page
   * Example: "Gallery of Past Work"
   */
  heading: string;

  /**
   * Introductory paragraph below heading
   * Example: "A collection of treasures that have found their homes..."
   */
  description: string;
}

/**
 * Category labels for display in UI (legacy support)
 * Note: These are now managed dynamically via Shopify metaobjects
 * This constant is kept for backward compatibility with hardcoded filters
 */
export const GALLERY_CATEGORIES = {
  all: 'All Items',
  earrings: 'Earrings',
  resin: 'Resin',
  driftwood: 'Driftwood',
  'wall-hangings': 'Wall Hangings',
} as const;

/**
 * Type for gallery category filter values
 * Supports 'all' for showing all items, or a category slug for filtering
 */
export type GalleryCategoryFilter = 'all' | string;

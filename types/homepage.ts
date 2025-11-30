/**
 * Homepage Types
 *
 * TypeScript interfaces for homepage content managed via Shopify metaobjects
 */

export interface HomepageHero {
  heading: string;
  description: string;
  backgroundImageUrl: string;
  ctaPrimaryText: string;
  ctaPrimaryUrl: string;
  ctaSecondaryText?: string;
  ctaSecondaryUrl?: string;
}

/**
 * Homepage Category (for CategorySection)
 * Displays product categories on the homepage
 */
export interface HomepageCategory {
  id: string;
  handle: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  sortOrder: number;
}

/**
 * Homepage Feature (for FeaturedSectionOne "Why Handmade Matters")
 * Displays the Gathered/Crafted/Treasured philosophy
 */
export interface HomepageFeature {
  id: string;
  handle: string;
  name: string;
  description: string;
  iconType: 'gathered' | 'crafted' | 'treasured';
  sortOrder: number;
}

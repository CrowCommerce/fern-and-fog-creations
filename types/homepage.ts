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

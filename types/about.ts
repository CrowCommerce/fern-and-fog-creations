/**
 * About Page Types
 *
 * TypeScript interfaces for about page content managed via Shopify metaobjects
 */

export interface AboutPage {
  heroHeading: string;
  heroIntro: string;
  storyHeading: string;
  storyContent: string;
  quoteText?: string;
  quoteAttribution?: string;
  quoteImageUrl?: string;
  processHeading: string;
  valuesHeading: string;
  ctaHeading: string;
  ctaDescription: string;
  ctaPrimaryText: string;
  ctaPrimaryUrl: string;
  ctaSecondaryText?: string;
  ctaSecondaryUrl?: string;
}

export interface AboutProcessStep {
  title: string;
  description: string;
  iconType: 'gathered' | 'crafted' | 'treasured';
  sortOrder: number;
}

export interface AboutValue {
  title: string;
  description: string;
  sortOrder: number;
}

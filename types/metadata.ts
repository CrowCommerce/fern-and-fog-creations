/**
 * Page Metadata Types
 *
 * Defines the structure for page metadata fetched from Shopify metaobjects.
 * This metadata controls SEO tags, OpenGraph images, and robots directives.
 */

export interface PageMetadata {
  title: string;
  description: string;
  ogImageUrl?: string;
  keywords?: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
}

/**
 * Contact Page Types
 *
 * TypeScript interfaces for contact page content managed via Shopify metaobjects
 */

export interface ContactPage {
  heading: string;
  description: string;
  emailDisplay?: string;
  phoneDisplay?: string;
  businessHours?: string;
  responseTime?: string;
}

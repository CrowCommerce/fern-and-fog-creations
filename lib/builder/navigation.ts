/**
 * Builder.io Navigation Helpers
 *
 * Functions for fetching navigation and footer content from Builder.io
 */

import { resolveBuilderContent } from './resolve-content';

export interface NavigationItem {
  name: string;
  href: string;
}

export interface NavigationData {
  items: NavigationItem[];
}

export interface FooterNavigationData {
  shop: NavigationItem[];
  about: NavigationItem[];
  policies: NavigationItem[];
}

/**
 * Fetch navigation items from Builder.io
 * Falls back to default navigation if content doesn't exist
 */
export async function getNavigation(): Promise<NavigationItem[]> {
  const defaultNavigation: NavigationItem[] = [
    { name: 'Home', href: '/' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Shop', href: '/products' },
    { name: 'Contact', href: '/contact' },
    { name: 'About', href: '/about' },
  ];

  try {
    const content = await resolveBuilderContent('navigation', {
      userAttributes: { id: 'main-navigation' },
    });

    if (content?.data?.items) {
      return content.data.items as NavigationItem[];
    }
  } catch (error) {
    console.error('[Builder.io] Error fetching navigation:', error);
  }

  return defaultNavigation;
}

/**
 * Fetch footer navigation from Builder.io
 * Falls back to default footer navigation if content doesn't exist
 */
export async function getFooterNavigation(): Promise<FooterNavigationData> {
  const defaultFooter: FooterNavigationData = {
    shop: [
      { name: 'All Products', href: '/products' },
      { name: 'Earrings', href: '/products/earrings' },
      { name: 'Resin Art', href: '/products/resin' },
      { name: 'Driftwood', href: '/products/driftwood' },
      { name: 'Wall Hangings', href: '/products/wall-hangings' },
    ],
    about: [
      { name: 'Our Story', href: '/about' },
      { name: 'Gallery', href: '/gallery' },
      { name: 'Contact', href: '/contact' },
    ],
    policies: [
      { name: 'Shipping', href: '/policies/shipping' },
      { name: 'Returns', href: '/policies/returns' },
      { name: 'Privacy', href: '/policies/privacy' },
      { name: 'Terms', href: '/policies/terms' },
    ],
  };

  try {
    const content = await resolveBuilderContent('footer', {
      userAttributes: { id: 'main-footer' },
    });

    if (content?.data) {
      return {
        shop: content.data.shop || defaultFooter.shop,
        about: content.data.about || defaultFooter.about,
        policies: content.data.policies || defaultFooter.policies,
      };
    }
  } catch (error) {
    console.error('[Builder.io] Error fetching footer navigation:', error);
  }

  return defaultFooter;
}

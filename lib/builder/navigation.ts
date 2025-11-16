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
 * Type guard to validate NavigationItem
 */
function isValidNavigationItem(item: unknown): item is NavigationItem {
  return (
    typeof item === 'object' &&
    item !== null &&
    'name' in item &&
    'href' in item &&
    typeof (item as NavigationItem).name === 'string' &&
    typeof (item as NavigationItem).href === 'string' &&
    (item as NavigationItem).name.trim().length > 0 &&
    (item as NavigationItem).href.trim().length > 0
  );
}

/**
 * Filter an input value to produce only valid navigation items.
 *
 * @param items - The value to validate; expected to be an array of potential navigation items.
 * @returns An array containing only valid NavigationItem objects; returns an empty array if `items` is not an array or contains no valid entries.
 */
function validateNavigationItems(items: unknown): NavigationItem[] {
  if (!Array.isArray(items)) {
    return [];
  }

  return items.filter(isValidNavigationItem);
}

/**
 * Load site navigation items from Builder.io with a default fallback.
 *
 * Attempts to load the main navigation content and return its validated items.
 * If Builder.io content is missing, invalid, or yields no valid items, returns the built-in default navigation.
 *
 * @returns Validated navigation items from Builder.io when available; default navigation otherwise.
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
      const validatedItems = validateNavigationItems(content.data.items);
      return validatedItems.length > 0 ? validatedItems : defaultNavigation;
    }
  } catch (error) {
    console.error('[Builder.io] Error fetching navigation:', error);
  }

  return defaultNavigation;
}

/**
 * Load footer navigation data from Builder.io and return the footer sections.
 *
 * Uses validated navigation arrays from Builder.io for the `shop`, `about`, and `policies` sections. If a section is missing or contains no valid items, the function falls back to the corresponding default section. On error while fetching content, the default footer data is returned.
 *
 * @returns The footer navigation grouped into `shop`, `about`, and `policies` sections, each populated with validated Builder.io items when available or with default items otherwise.
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
      const validatedShop = validateNavigationItems(content.data.shop);
      const validatedAbout = validateNavigationItems(content.data.about);
      const validatedPolicies = validateNavigationItems(content.data.policies);

      return {
        shop: validatedShop.length > 0 ? validatedShop : defaultFooter.shop,
        about: validatedAbout.length > 0 ? validatedAbout : defaultFooter.about,
        policies: validatedPolicies.length > 0 ? validatedPolicies : defaultFooter.policies,
      };
    }
  } catch (error) {
    console.error('[Builder.io] Error fetching footer navigation:', error);
  }

  return defaultFooter;
}
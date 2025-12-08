#!/usr/bin/env tsx
/**
 * Checkout Branding Setup Script
 *
 * Applies Fern & Fog brand colors to Shopify checkout.
 * Uses the Admin API checkoutBrandingUpsert mutation.
 *
 * Usage:
 *   pnpm setup:checkout           # Execute branding update
 *   pnpm setup:checkout:dry       # Dry-run mode (preview changes)
 */

import { validateConnection, shopifyAdminRequest } from './lib/shopify-admin.js';

const DRY_RUN = process.argv.includes('--dry-run');

/**
 * Fern & Fog Brand Colors
 * From app/globals.css
 */
const BRAND_COLORS = {
  moss: '#33593D',      // Primary green - buttons, brand
  fern: '#4F7942',      // Accent green - links, focus states
  parchment: '#F5F0E6', // Cream background
  bark: '#5B4636',      // Brown text
  mist: '#E6ECE8',      // Light gray-green
  gold: '#C5A05A',      // Decorative accent
};

interface CheckoutProfile {
  id: string;
  name: string;
  isPublished: boolean;
}

interface CheckoutProfilesResponse {
  checkoutProfiles: {
    nodes: CheckoutProfile[];
  };
}

interface CheckoutBrandingUpsertResponse {
  checkoutBrandingUpsert: {
    checkoutBranding: {
      designSystem: {
        colors: unknown;
        cornerRadius: unknown;
      };
    } | null;
    userErrors: Array<{ field?: string[]; message: string; code?: string }>;
  };
}

/**
 * Get the default checkout profile ID
 */
async function getCheckoutProfileId(): Promise<string> {
  const query = `
    query getCheckoutProfiles {
      checkoutProfiles(first: 10) {
        nodes {
          id
          name
          isPublished
        }
      }
    }
  `;

  const response = await shopifyAdminRequest<CheckoutProfilesResponse>(query);

  // Prefer the published profile, fallback to first available
  const profiles = response.checkoutProfiles.nodes;
  const publishedProfile = profiles.find(p => p.isPublished);
  const profile = publishedProfile || profiles[0];

  if (!profile) {
    throw new Error('No checkout profiles found. Please create one in Shopify admin.');
  }

  console.log(`  Using checkout profile: ${profile.name} (${profile.isPublished ? 'published' : 'draft'})`);
  return profile.id;
}

/**
 * Apply brand colors to checkout
 */
async function applyCheckoutBranding(checkoutProfileId: string): Promise<void> {
  const mutation = `
    mutation checkoutBrandingUpsert($checkoutProfileId: ID!, $checkoutBrandingInput: CheckoutBrandingInput!) {
      checkoutBrandingUpsert(checkoutProfileId: $checkoutProfileId, checkoutBrandingInput: $checkoutBrandingInput) {
        checkoutBranding {
          designSystem {
            colors {
              global {
                brand
                accent
              }
            }
            cornerRadius {
              base
              small
              large
            }
          }
        }
        userErrors {
          field
          message
          code
        }
      }
    }
  `;

  const checkoutBrandingInput = {
    designSystem: {
      colors: {
        global: {
          brand: BRAND_COLORS.moss,      // Primary buttons
          accent: BRAND_COLORS.fern,     // Links, focus states
          decorative: BRAND_COLORS.gold, // Highlights
        },
        schemes: {
          // Scheme 1: Main checkout area
          scheme1: {
            base: {
              background: BRAND_COLORS.parchment,
              text: BRAND_COLORS.bark,
              border: BRAND_COLORS.mist,
              accent: BRAND_COLORS.fern,
              decorative: BRAND_COLORS.gold,
            },
            primaryButton: {
              background: BRAND_COLORS.moss,
              text: BRAND_COLORS.parchment,
              hover: {
                background: BRAND_COLORS.fern,
                text: BRAND_COLORS.parchment,
              },
            },
            secondaryButton: {
              background: BRAND_COLORS.mist,
              text: BRAND_COLORS.bark,
              border: BRAND_COLORS.bark,
              hover: {
                background: BRAND_COLORS.parchment,
                text: BRAND_COLORS.moss,
              },
            },
            control: {
              background: '#FFFFFF',
              text: BRAND_COLORS.bark,
              border: BRAND_COLORS.mist,
              accent: BRAND_COLORS.fern,
            },
          },
          // Scheme 2: Order summary sidebar
          scheme2: {
            base: {
              background: BRAND_COLORS.mist,
              text: BRAND_COLORS.bark,
              border: BRAND_COLORS.parchment,
              accent: BRAND_COLORS.fern,
            },
          },
        },
      },
      cornerRadius: {
        small: 4,
        base: 8,
        large: 12,
      },
    },
  };

  console.log('\n  Applying branding:');
  console.log(`    Brand color (buttons):  ${BRAND_COLORS.moss}`);
  console.log(`    Accent color (links):   ${BRAND_COLORS.fern}`);
  console.log(`    Background:             ${BRAND_COLORS.parchment}`);
  console.log(`    Text:                   ${BRAND_COLORS.bark}`);
  console.log(`    Decorative:             ${BRAND_COLORS.gold}`);
  console.log(`    Corner radius:          4px / 8px / 12px`);

  if (DRY_RUN) {
    console.log('\n  [DRY RUN] Would apply the above branding settings');
    return;
  }

  const response = await shopifyAdminRequest<CheckoutBrandingUpsertResponse>(
    mutation,
    { checkoutProfileId, checkoutBrandingInput }
  );

  if (response.checkoutBrandingUpsert.userErrors.length > 0) {
    console.error('\n  Errors applying branding:');
    response.checkoutBrandingUpsert.userErrors.forEach((err) => {
      console.error(`    - ${err.message} (${err.field?.join('.') || 'unknown field'})`);
    });
    throw new Error('Failed to apply checkout branding');
  }

  console.log('\n  Branding applied successfully!');
}

/**
 * Main execution
 */
async function main() {
  console.log('');
  console.log('  Checkout Branding Setup');
  console.log('  Fern & Fog Creations');
  console.log('');

  if (DRY_RUN) {
    console.log('  [DRY RUN MODE - No changes will be made]\n');
  }

  try {
    // Validate Shopify connection
    await validateConnection();

    // Get checkout profile ID
    console.log('\n  Finding checkout profile...');
    const checkoutProfileId = await getCheckoutProfileId();

    // Apply branding
    await applyCheckoutBranding(checkoutProfileId);

    console.log('\n  Setup complete!');
    console.log('  Preview at: Shopify Admin -> Settings -> Checkout -> Customize');

    if (DRY_RUN) {
      console.log('\n  Run without --dry-run to apply changes');
    }

    console.log('');
  } catch (error) {
    console.error('\n  Setup failed:', error);
    process.exit(1);
  }
}

main();

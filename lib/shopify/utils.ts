/**
 * Shopify Metaobject Utilities
 *
 * Helper functions for extracting and transforming metaobject field values
 */

import type { ShopifyMetaobject } from './types';

/**
 * Extract a string field value from a metaobject
 */
export function extractField(
  metaobject: ShopifyMetaobject,
  key: string
): string {
  const field = metaobject.fields.find((f) => f.key === key);
  return field?.value || '';
}

/**
 * Extract a boolean field value from a metaobject
 * Shopify stores booleans as strings: "true" or "false"
 */
export function extractBooleanField(
  metaobject: ShopifyMetaobject,
  key: string,
  defaultValue: boolean = false
): boolean {
  const value = extractField(metaobject, key);
  if (!value) return defaultValue;
  return value === 'true' || value === '1';
}

/**
 * Extract a number field value from a metaobject
 */
export function extractNumberField(
  metaobject: ShopifyMetaobject,
  key: string,
  defaultValue: number = 0
): number {
  const value = extractField(metaobject, key);
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Extract an optional field (returns undefined if not present)
 */
export function extractOptionalField(
  metaobject: ShopifyMetaobject,
  key: string
): string | undefined {
  const value = extractField(metaobject, key);
  return value || undefined;
}

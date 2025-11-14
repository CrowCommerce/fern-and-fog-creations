/**
 * Utility functions for working with product variants
 */

import type { ProductVariant, PriceRange } from '@/types/product';

/**
 * Find variant that matches the given options
 */
export function getVariantFromOptions(
  variants: ProductVariant[],
  selectedOptions: Record<string, string>
): ProductVariant | undefined {
  return variants.find((variant) =>
    variant.selectedOptions.every(
      (opt) => selectedOptions[opt.name] === opt.value
    )
  );
}

/**
 * Get available option values for current selection
 * Returns only values that have at least one available variant
 */
export function getAvailableOptionsForSelection(
  variants: ProductVariant[],
  currentSelection: Record<string, string>
): Record<string, string[]> {
  const availableOptions: Record<string, string[]> = {};

  // Get all unique option names
  const optionNames = new Set<string>();
  variants.forEach((variant) => {
    variant.selectedOptions.forEach((opt) => {
      optionNames.add(opt.name);
    });
  });

  // For each option, find values that are available
  optionNames.forEach((optionName) => {
    const availableValues = new Set<string>();

    variants.forEach((variant) => {
      if (!variant.availableForSale) return;

      // Check if variant matches current selection (excluding the option we're checking)
      const matches = variant.selectedOptions.every((opt) => {
        if (opt.name === optionName) return true;
        return !currentSelection[opt.name] || currentSelection[opt.name] === opt.value;
      });

      if (matches) {
        const optValue = variant.selectedOptions.find((opt) => opt.name === optionName);
        if (optValue) {
          availableValues.add(optValue.value);
        }
      }
    });

    availableOptions[optionName] = Array.from(availableValues);
  });

  return availableOptions;
}

/**
 * Format price range for display
 */
export function formatPriceRange(range: PriceRange): string {
  if (range.min === range.max) {
    return `$${range.min.toFixed(2)}`;
  }
  return `$${range.min.toFixed(2)} - $${range.max.toFixed(2)}`;
}

/**
 * Get price range from variants
 */
export function getPriceRangeFromVariants(variants: ProductVariant[]): PriceRange {
  const prices = variants.map((v) => v.price);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
}

/**
 * Check if all selected options result in an available variant
 */
export function isSelectionAvailable(
  variants: ProductVariant[],
  selectedOptions: Record<string, string>
): boolean {
  const variant = getVariantFromOptions(variants, selectedOptions);
  return variant?.availableForSale ?? false;
}

/**
 * Get cheapest available variant
 */
export function getCheapestVariant(variants: ProductVariant[]): ProductVariant | undefined {
  const available = variants.filter((v) => v.availableForSale);
  if (available.length === 0) return undefined;

  return available.reduce((cheapest, current) =>
    current.price < cheapest.price ? current : cheapest
  );
}

/**
 * Format variant title for display
 */
export function formatVariantTitle(variant: ProductVariant): string {
  return variant.selectedOptions.map((opt) => opt.value).join(' / ');
}

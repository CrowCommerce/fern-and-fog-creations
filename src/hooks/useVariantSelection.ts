/**
 * Hook for managing product variant selection logic
 * Handles availability checking, URL sync, and option combinations
 */

import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { ProductVariant, ProductOption } from '@/types/product';

interface UseVariantSelectionProps {
  variants: ProductVariant[];
  options: ProductOption[];
  defaultVariant?: ProductVariant | null;
  onVariantChange?: (variant: ProductVariant | null) => void;
}

export function useVariantSelection({
  variants,
  options,
  defaultVariant = null,
  onVariantChange,
}: UseVariantSelectionProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(defaultVariant);

  // Initialize from URL params or default variant
  useEffect(() => {
    const initialOptions: Record<string, string> = {};

    // Try to get from URL params first
    options.forEach((option) => {
      const paramValue = searchParams?.get(option.name.toLowerCase());
      if (paramValue && option.values.includes(paramValue)) {
        initialOptions[option.name] = paramValue;
      }
    });

    // If no URL params, use default variant's options
    if (Object.keys(initialOptions).length === 0 && defaultVariant) {
      defaultVariant.selectedOptions.forEach((opt) => {
        initialOptions[opt.name] = opt.value;
      });
    }

    // If still no options, select first available option for each
    if (Object.keys(initialOptions).length === 0) {
      options.forEach((option) => {
        if (option.values.length > 0) {
          initialOptions[option.name] = option.values[0];
        }
      });
    }

    setSelectedOptions(initialOptions);
  }, [searchParams, options, defaultVariant]);

  // Find matching variant when options change
  useEffect(() => {
    const variant = findVariantByOptions(variants, selectedOptions);
    setSelectedVariant(variant);
    onVariantChange?.(variant);
  }, [selectedOptions, variants, onVariantChange]);

  // Update option selection
  const selectOption = useCallback(
    (optionName: string, value: string) => {
      const newOptions = { ...selectedOptions, [optionName]: value };
      setSelectedOptions(newOptions);

      // Update URL params
      const params = new URLSearchParams(searchParams?.toString() || '');
      params.set(optionName.toLowerCase(), value);

      // Add variant ID if found
      const variant = findVariantByOptions(variants, newOptions);
      if (variant) {
        params.set('variant', variant.id);
      } else {
        params.delete('variant');
      }

      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [selectedOptions, searchParams, router, variants]
  );

  // Check if an option value is available given current selections
  const isOptionAvailable = useCallback(
    (optionName: string, value: string): boolean => {
      const testOptions = { ...selectedOptions, [optionName]: value };
      return variants.some(
        (variant) =>
          variant.availableForSale &&
          matchesOptions(variant, testOptions)
      );
    },
    [selectedOptions, variants]
  );

  // Get all available values for a given option
  const getAvailableValues = useCallback(
    (optionName: string): string[] => {
      const option = options.find((opt) => opt.name === optionName);
      if (!option) return [];

      return option.values.filter((value) => isOptionAvailable(optionName, value));
    },
    [options, isOptionAvailable]
  );

  return {
    selectedOptions,
    selectedVariant,
    selectOption,
    isOptionAvailable,
    getAvailableValues,
  };
}

// Helper: Find variant that matches selected options
function findVariantByOptions(
  variants: ProductVariant[],
  selectedOptions: Record<string, string>
): ProductVariant | null {
  return (
    variants.find((variant) => matchesOptions(variant, selectedOptions)) || null
  );
}

// Helper: Check if variant matches selected options
function matchesOptions(
  variant: ProductVariant,
  selectedOptions: Record<string, string>
): boolean {
  return variant.selectedOptions.every(
    (opt) => selectedOptions[opt.name] === opt.value
  );
}

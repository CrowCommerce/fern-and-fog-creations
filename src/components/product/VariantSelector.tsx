/**
 * Product variant selector component
 * Renders interactive UI for selecting product options (size, color, etc.)
 * with availability checking and URL synchronization
 */

'use client';

import React from 'react';
import { useVariantSelection } from '@/hooks/useVariantSelection';
import VariantDropdown from './VariantDropdown';
import type { ProductVariant, ProductOption } from '@/types/product';

interface VariantSelectorProps {
  options: ProductOption[];
  variants: ProductVariant[];
  defaultVariant?: ProductVariant | null;
  onVariantChange?: (variant: ProductVariant | null) => void;
}

export function VariantSelector({
  options,
  variants,
  defaultVariant = null,
  onVariantChange,
}: VariantSelectorProps) {
  const {
    selectedOptions,
    selectedVariant,
    selectOption,
    isOptionAvailable,
  } = useVariantSelection({
    variants,
    options,
    defaultVariant,
    onVariantChange,
  });

  if (!options || options.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {options.map((option) => (
        <div key={option.id}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-bark">{option.name}</h3>
            {selectedOptions[option.name] && (
              <span className="text-sm text-bark/70 capitalize">
                {selectedOptions[option.name]}
              </span>
            )}
          </div>

          {/* Single option: Radio buttons */}
          {option.values.length <= 4 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {option.values.map((value) => {
                const isSelected = selectedOptions[option.name] === value;
                const isAvailable = isOptionAvailable(option.name, value);

                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => isAvailable && selectOption(option.name, value)}
                    disabled={!isAvailable}
                    aria-label={`Select ${option.name}: ${value}`}
                    aria-pressed={isSelected}
                    className={`
                      relative px-4 py-3 rounded-md text-sm font-medium transition-all
                      focus:outline-none focus:ring-2 focus:ring-fern focus:ring-offset-2
                      ${
                        isSelected
                          ? 'bg-moss text-parchment ring-2 ring-moss'
                          : isAvailable
                          ? 'bg-parchment text-bark border border-mist hover:border-fern hover:bg-mist'
                          : 'bg-mist/50 text-bark/40 cursor-not-allowed line-through'
                      }
                    `}
                  >
                    <span className="capitalize">{value}</span>
                    {!isAvailable && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="sr-only">Out of stock</span>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            /* Many options: Styled Dropdown */
            <VariantDropdown
              option={option}
              value={selectedOptions[option.name] || ''}
              onChange={(value) => selectOption(option.name, value)}
              isOptionAvailable={(value) => isOptionAvailable(option.name, value)}
            />
          )}
        </div>
      ))}

      {/* Availability indicator */}
      {selectedVariant && (
        <div className="pt-4 border-t border-mist">
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${
                selectedVariant.availableForSale ? 'bg-fern' : 'bg-bark/40'
              }`}
              aria-hidden="true"
            />
            <span className="text-sm text-bark/70">
              {selectedVariant.availableForSale
                ? selectedVariant.quantityAvailable
                  ? `${selectedVariant.quantityAvailable} in stock`
                  : 'In stock'
                : 'Out of stock'}
            </span>
          </div>
          {selectedVariant.sku && (
            <p className="text-xs text-bark/50 mt-1">SKU: {selectedVariant.sku}</p>
          )}
        </div>
      )}
    </div>
  );
}

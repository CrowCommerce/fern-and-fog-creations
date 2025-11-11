/**
 * Desktop filter panel component
 * Displays all available filters in a sidebar layout
 */

'use client';

import React from 'react';
import type { ActiveFilters, FilterFacet } from '@/types/filter';
import { CheckboxFilter } from './CheckboxFilter';
import { PriceRangeFilter } from './PriceRangeFilter';

interface FilterPanelProps {
  facets: FilterFacet[];
  activeFilters: ActiveFilters;
  onFilterChange: (filters: ActiveFilters) => void;
  resultCount: number;
}

export function FilterPanel({
  facets,
  activeFilters,
  onFilterChange,
  resultCount,
}: FilterPanelProps) {
  const hasActiveFilters =
    Object.keys(activeFilters).filter(
      (key) =>
        activeFilters[key as keyof ActiveFilters] !== undefined &&
        activeFilters[key as keyof ActiveFilters] !== null &&
        (Array.isArray(activeFilters[key as keyof ActiveFilters])
          ? (activeFilters[key as keyof ActiveFilters] as unknown[]).length > 0
          : true)
    ).length > 0;

  const clearAllFilters = () => {
    onFilterChange({});
  };

  return (
    <div className="sticky top-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-display font-semibold text-bark">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-fern hover:text-moss transition-colors underline cursor-pointer"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="space-y-6 border-t border-mist pt-6">
        {facets.map((facet) => {
          if (facet.type === 'range') {
            return (
              <PriceRangeFilter
                key={facet.id}
                min={facet.min ?? 0}
                max={facet.max ?? 100}
                value={activeFilters.priceRange}
                onChange={(range) =>
                  onFilterChange({ ...activeFilters, priceRange: range })
                }
              />
            );
          }

          if (facet.type === 'checkbox') {
            return (
              <CheckboxFilter
                key={facet.id}
                label={facet.name}
                options={facet.options}
                selected={
                  (activeFilters[facet.id as keyof ActiveFilters] as string[]) ||
                  []
                }
                onChange={(selected) =>
                  onFilterChange({
                    ...activeFilters,
                    [facet.id]: selected.length > 0 ? selected : undefined,
                  })
                }
              />
            );
          }

          return null;
        })}
      </div>

      {/* Result count */}
      <div className="border-t border-mist pt-4">
        <p className="text-sm text-bark/70">
          {resultCount} {resultCount === 1 ? 'product' : 'products'} found
        </p>
      </div>
    </div>
  );
}

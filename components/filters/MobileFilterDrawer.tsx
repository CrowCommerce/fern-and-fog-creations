/**
 * Mobile filter drawer component
 * Displays filters in a slide-out drawer on mobile devices
 */

'use client';

import React, { useState } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { XMarkIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import type { ActiveFilters, FilterFacet } from '@/types/filter';
import { CheckboxFilter } from './CheckboxFilter';
import { PriceRangeFilter } from './PriceRangeFilter';

interface MobileFilterDrawerProps {
  facets: FilterFacet[];
  activeFilters: ActiveFilters;
  onFilterChange: (filters: ActiveFilters) => void;
  resultCount: number;
}

export function MobileFilterDrawer({
  facets,
  activeFilters,
  onFilterChange,
  resultCount,
}: MobileFilterDrawerProps) {
  const [open, setOpen] = useState(false);

  const hasActiveFilters = Object.keys(activeFilters).filter(
    (key) =>
      activeFilters[key as keyof ActiveFilters] !== undefined &&
      (Array.isArray(activeFilters[key as keyof ActiveFilters])
        ? (activeFilters[key as keyof ActiveFilters] as unknown[]).length > 0
        : true)
  ).length;

  const clearAllFilters = () => {
    onFilterChange({});
  };

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-bark bg-parchment border border-mist rounded-md hover:bg-mist transition-colors cursor-pointer"
      >
        <AdjustmentsHorizontalIcon className="h-5 w-5" />
        Filters
        {hasActiveFilters > 0 && (
          <span className="ml-1 px-2 py-0.5 text-xs bg-fern text-parchment rounded-full">
            {hasActiveFilters}
          </span>
        )}
      </button>

      {/* Drawer */}
      <Dialog open={open} onClose={setOpen} className="relative z-50 lg:hidden">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-moss/75 transition-opacity duration-300 ease-in-out data-closed:opacity-0"
        />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <DialogPanel
                transition
                className="pointer-events-auto w-screen max-w-md transform transition duration-300 ease-in-out data-closed:translate-x-full"
              >
                <div className="flex h-full flex-col overflow-y-auto bg-parchment shadow-xl">
                  {/* Header */}
                  <div className="flex items-start justify-between px-4 py-6 border-b border-mist">
                    <DialogTitle className="text-lg font-display font-semibold text-bark">
                      Filters
                    </DialogTitle>
                    <div className="ml-3 flex h-7 items-center">
                      <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="relative -m-2 p-2 text-bark hover:text-fern transition-colors"
                      >
                        <span className="sr-only">Close panel</span>
                        <XMarkIcon aria-hidden="true" className="size-6" />
                      </button>
                    </div>
                  </div>

                  {/* Filters */}
                  <div className="flex-1 overflow-y-auto px-4 py-6">
                    <div className="space-y-6">
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
                  </div>

                  {/* Footer */}
                  <div className="border-t border-mist px-4 py-6 space-y-3">
                    <div className="flex items-center justify-between text-sm text-bark/70">
                      <span>
                        {resultCount} {resultCount === 1 ? 'product' : 'products'}
                      </span>
                      {hasActiveFilters > 0 && (
                        <button
                          onClick={clearAllFilters}
                          className="text-fern hover:text-moss transition-colors underline cursor-pointer"
                        >
                          Clear all
                        </button>
                      )}
                    </div>
                    <button
                      onClick={() => setOpen(false)}
                      className="w-full px-4 py-3 text-sm font-medium text-parchment bg-moss hover:bg-fern transition-colors rounded-md cursor-pointer"
                    >
                      View Results
                    </button>
                  </div>
                </div>
              </DialogPanel>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}

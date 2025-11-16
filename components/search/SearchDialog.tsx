'use client';

import { useState, useEffect, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
} from '@headlessui/react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useSearchContext } from './SearchProvider';
import { useSearch } from './useSearch';
import { ProductResult } from './ProductResult';

export function SearchDialog() {
  const router = useRouter();
  const { isOpen, closeSearch, toggleSearch } = useSearchContext();
  const [query, setQuery] = useState('');
  const { results, totalCount, loading } = useSearch(query, isOpen);

  // Keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggleSearch();
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [toggleSearch]);

  // Reset query when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setQuery('');
    }
  }, [isOpen]);

  const handleSelect = (value: string | null) => {
    if (!value) return;

    if (value.startsWith('search:')) {
      // Navigate to search page
      const searchQuery = value.replace('search:', '');
      closeSearch();
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    } else {
      // Navigate to product page
      closeSearch();
      router.push(`/product/${value}`);
    }
  };

  const clearSearch = () => {
    setQuery('');
  };

  const showResults = query.length > 0;
  const hasResults = results.length > 0;
  const showSeeAll = hasResults && totalCount > results.length;

  return (
    <Dialog
      open={isOpen}
      onClose={closeSearch}
      className="relative z-50"
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-bark/25 backdrop-blur-sm transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto p-4 sm:p-6 md:p-20">
        <DialogPanel
          transition
          className="mx-auto max-w-2xl transform overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-bark/5 transition-all data-[closed]:scale-95 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        >
          <Combobox onChange={handleSelect}>
            <div className="relative">
              {/* Search Icon */}
              <MagnifyingGlassIcon
                className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-bark/40"
                aria-hidden="true"
              />

              {/* Search Input */}
              <ComboboxInput
                autoFocus
                className="h-12 w-full border-0 bg-transparent pl-11 pr-11 text-bark placeholder:text-bark/40 focus:ring-0 sm:text-sm"
                placeholder="Search products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />

              {/* Clear Button */}
              {query && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-4 top-3.5 text-bark/40 hover:text-bark"
                >
                  <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                  <span className="sr-only">Clear search</span>
                </button>
              )}
            </div>

            {/* Results */}
            {showResults && (
              <ComboboxOptions
                static
                className="max-h-80 scroll-py-2 divide-y divide-bark/5 overflow-y-auto"
              >
                {/* Loading State */}
                {loading && (
                  <div className="px-6 py-14 text-center text-sm text-bark/60">
                    Searching...
                  </div>
                )}

                {/* No Results */}
                {!loading && !hasResults && (
                  <div className="px-6 py-14 text-center sm:px-14">
                    <p className="text-sm text-bark/60">
                      No products found for &quot;{query}&quot;
                    </p>
                    <p className="mt-2 text-xs text-bark/40">
                      Press <kbd className="rounded bg-mist px-1.5 py-0.5 text-xs font-semibold text-bark">Enter</kbd> to search all products
                    </p>
                  </div>
                )}

                {/* Product Results */}
                {!loading && hasResults && (
                  <div className="p-2">
                    <div className="mb-2 px-3 text-xs font-semibold text-bark/60">
                      Products
                    </div>
                    {results.map((product) => (
                      <ComboboxOption key={product.id} value={product.slug} as={Fragment}>
                        {({ active }) => (
                          <ProductResult product={product} active={active} />
                        )}
                      </ComboboxOption>
                    ))}

                    {/* See All Results */}
                    {showSeeAll && (
                      <ComboboxOption value={`search:${query}`} as={Fragment}>
                        {({ active }) => (
                          <div
                            className={`mt-2 cursor-pointer select-none rounded-lg px-3 py-2 text-center text-sm font-medium transition-colors ${
                              active
                                ? 'bg-fern text-white'
                                : 'bg-mist text-bark hover:bg-fern/10'
                            }`}
                          >
                            See all {totalCount} results
                          </div>
                        )}
                      </ComboboxOption>
                    )}
                  </div>
                )}
              </ComboboxOptions>
            )}

            {/* Footer Hint */}
            <div className="border-t border-bark/5 px-6 py-3 text-center">
              <p className="text-xs text-bark/40">
                <kbd className="rounded bg-mist px-1.5 py-0.5 text-xs font-semibold text-bark">
                  {navigator.platform.toLowerCase().includes('mac') ? '⌘' : 'Ctrl'}K
                </kbd>{' '}
                to open search
                {showResults && (
                  <>
                    {' • '}
                    <kbd className="rounded bg-mist px-1.5 py-0.5 text-xs font-semibold text-bark">ESC</kbd>{' '}
                    to close
                  </>
                )}
              </p>
            </div>
          </Combobox>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

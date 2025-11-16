'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchContext } from './SearchProvider';

interface SearchButtonProps {
  className?: string;
}

export function SearchButton({ className = '' }: SearchButtonProps) {
  const { openSearch } = useSearchContext();

  return (
    <button
      type="button"
      onClick={openSearch}
      className={className}
      aria-label="Search products"
    >
      <MagnifyingGlassIcon className="h-6 w-6" aria-hidden="true" />
    </button>
  );
}

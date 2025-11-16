'use client';

import { useState, useEffect } from 'react';
import type { Product } from '@/types';
import { searchProducts } from './actions';

export function useSearch(query: string, enabled: boolean) {
  const [results, setResults] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query || !enabled) {
      setResults([]);
      setTotalCount(0);
      setLoading(false);
      return;
    }

    setLoading(true);

    // Debounce for 300ms to avoid excessive API calls
    const timer = setTimeout(async () => {
      try {
        const { results: products, totalCount: count } = await searchProducts(query);
        setResults(products);
        setTotalCount(count);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [query, enabled]);

  return { results, totalCount, loading };
}

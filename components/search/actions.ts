'use server';

import { getProducts } from '@/lib/data-source';
import type { Product } from '@/types';
import { serverAnalytics } from '@/lib/analytics/server-tracker';

export async function searchProducts(
  query: string,
): Promise<{ results: Product[]; totalCount: number }> {
  try {
    if (!query || query.trim() === '') {
      return { results: [], totalCount: 0 };
    }

    const products = await getProducts({
      query: query.trim(),
      sortKey: 'RELEVANCE',
      reverse: false,
    });

    // Track search performed
    serverAnalytics.searchPerformed({
      query: query.trim(),
      results_count: products.length,
    });

    return {
      results: products.slice(0, 8), // Limit to 8 results in modal
      totalCount: products.length,
    };
  } catch (error) {
    console.error('Search error:', error);
    return { results: [], totalCount: 0 };
  }
}

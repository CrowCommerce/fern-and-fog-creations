'use server';

import { getProducts } from '@/lib/data-source';
import type { Product } from '@/types';

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

    return {
      results: products.slice(0, 8), // Limit to 8 results in modal
      totalCount: products.length,
    };
  } catch (error) {
    console.error('Search error:', error);
    return { results: [], totalCount: 0 };
  }
}

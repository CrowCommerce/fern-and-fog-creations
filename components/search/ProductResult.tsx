'use client';

import { forwardRef, useRef, useEffect } from 'react';
import type { Product } from '@/types';
import { ChevronRightIcon } from '@heroicons/react/20/solid';

interface ProductResultProps {
  product: Product;
  active: boolean;
}

export const ProductResult = forwardRef<HTMLDivElement, ProductResultProps>(
  ({ product, active, ...props }, ref) => {
    const itemRef = useRef<HTMLDivElement>(null);

    // Combine refs
    const setRef = (node: HTMLDivElement | null) => {
      itemRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    // Auto-scroll active item into view
    useEffect(() => {
      if (active && itemRef.current) {
        itemRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'nearest',
        });
      }
    }, [active]);

    const price = product.priceRange
      ? `$${product.priceRange.min}${product.priceRange.min !== product.priceRange.max ? ` - $${product.priceRange.max}` : ''}`
      : `$${product.price}`;

    return (
      <div
        ref={setRef}
        className={`flex cursor-pointer select-none items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
          active
            ? 'bg-moss text-white'
            : 'bg-parchment text-bark hover:bg-mist'
        }`}
        {...props}
      >
        {/* Product Image */}
        <div className="flex-shrink-0">
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-16 w-16 rounded-md border border-bark/10 object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium truncate ${active ? 'text-white' : 'text-bark'}`}>
            {product.name}
          </p>
          <p className={`text-sm ${active ? 'text-parchment/90' : 'text-bark/60'}`}>
            {price}
          </p>
        </div>

        {/* Arrow Indicator */}
        {active && (
          <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-white" />
        )}
      </div>
    );
  }
);

ProductResult.displayName = 'ProductResult';

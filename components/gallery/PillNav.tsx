/**
 * Simplified PillNav component for gallery filters
 * Replaces complex GSAP animations with simple CSS transitions
 * Maintains coastal brand aesthetic and full accessibility
 */

'use client';

import React, { useRef, useEffect } from 'react';

export type PillNavItem = {
  id: string;
  label: string;
};

export interface PillNavProps {
  items: PillNavItem[];
  activeId?: string;
  onFilterChange: (id: string) => void;
  className?: string;
}

const PillNav: React.FC<PillNavProps> = ({
  items,
  activeId,
  onFilterChange,
  className = '',
}) => {
  const navRef = useRef<HTMLDivElement>(null);

  // Arrow key navigation for better accessibility
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const buttons = Array.from(nav.querySelectorAll('button'));
      const currentIndex = buttons.findIndex((btn) => btn === document.activeElement);

      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIndex = currentIndex <= 0 ? buttons.length - 1 : currentIndex - 1;
        (buttons[prevIndex] as HTMLButtonElement)?.focus();
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIndex = currentIndex >= buttons.length - 1 ? 0 : currentIndex + 1;
        (buttons[nextIndex] as HTMLButtonElement)?.focus();
      }
    };

    nav.addEventListener('keydown', handleKeyDown);
    return () => nav.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <nav
      ref={navRef}
      className={`flex justify-center ${className}`}
      aria-label="Gallery filter"
    >
      <div className="inline-flex flex-wrap items-center justify-center gap-2 p-2 bg-parchment rounded-full ring-1 ring-bark/10 shadow-sm md:gap-3 md:p-3">
        {items.map((item) => {
          const isActive = activeId === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onFilterChange(item.id)}
              aria-pressed={isActive}
              aria-label={`Filter by ${item.label}`}
              className={`
                relative px-5 py-2.5 rounded-full font-medium text-sm uppercase tracking-wide
                transition-all duration-200 ease-in-out
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fern focus-visible:ring-offset-2
                hover:scale-[1.02] active:scale-[0.98]
                ${
                  isActive
                    ? 'bg-fern text-parchment shadow-md hover:bg-fern/90'
                    : 'bg-parchment text-bark border border-transparent hover:border-fern hover:bg-fern/5'
                }
              `}
            >
              {item.label}
              {isActive && (
                <span
                  className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-fern rounded-full shadow-sm"
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default PillNav;

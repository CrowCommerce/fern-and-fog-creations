/**
 * Checkbox filter component for multi-select filtering
 */

'use client';

import React from 'react';
import type { FilterOption } from '@/types/filter';

interface CheckboxFilterProps {
  label: string;
  options: FilterOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export function CheckboxFilter({
  label,
  options,
  selected,
  onChange,
}: CheckboxFilterProps) {
  const handleToggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div>
      <h3 className="text-sm font-medium text-bark mb-3">{label}</h3>
      <div className="space-y-2">
        {options.map((option) => {
          const isChecked = selected.includes(option.value);
          return (
            <label
              key={option.value}
              className="flex items-center gap-3 cursor-pointer group"
            >
              {/* Native checkbox - hidden but accessible */}
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => handleToggle(option.value)}
                className="sr-only"
              />

              {/* Custom checkbox visual */}
              <div
                className={`
                  relative flex items-center justify-center w-[18px] h-[18px] rounded-md border-2
                  transition-all duration-200 flex-shrink-0
                  ${isChecked
                    ? 'bg-fern border-fern scale-100'
                    : 'bg-parchment border-mist group-hover:border-fern group-hover:bg-mist'
                  }
                  group-focus-within:ring-2 group-focus-within:ring-fern group-focus-within:ring-offset-2
                `}
              >
                {/* Checkmark SVG */}
                <svg
                  className={`
                    w-3 h-3 text-parchment transition-all duration-200
                    ${isChecked ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}
                  `}
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 3L4.5 8.5L2 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <span className="text-sm text-bark group-hover:text-fern transition-colors flex-1">
                {option.label}
              </span>
              {option.count !== undefined && (
                <span className="text-xs text-bark/70 font-medium">({option.count})</span>
              )}
            </label>
          );
        })}
      </div>
    </div>
  );
}

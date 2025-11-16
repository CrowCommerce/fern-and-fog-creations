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
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <input
              type="checkbox"
              checked={selected.includes(option.value)}
              onChange={() => handleToggle(option.value)}
              className="h-4 w-4 rounded border-mist text-fern focus:ring-2 focus:ring-fern focus:ring-offset-0 cursor-pointer"
            />
            <span className="text-sm text-bark group-hover:text-fern transition-colors flex-1">
              {option.label}
            </span>
            {option.count !== undefined && (
              <span className="text-xs text-bark/70 font-medium">({option.count})</span>
            )}
          </label>
        ))}
      </div>
    </div>
  );
}

/**
 * Price range filter component with dual-handle slider
 */

'use client';

import React, { useState, useEffect } from 'react';

interface PriceRangeFilterProps {
  min: number;
  max: number;
  value?: { min: number; max: number };
  onChange: (range: { min: number; max: number }) => void;
}

export function PriceRangeFilter({
  min,
  max,
  value,
  onChange,
}: PriceRangeFilterProps) {
  const [localMin, setLocalMin] = useState(value?.min ?? min);
  const [localMax, setLocalMax] = useState(value?.max ?? max);

  useEffect(() => {
    if (value) {
      setLocalMin(value.min);
      setLocalMax(value.max);
    }
  }, [value]);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = parseInt(e.target.value);
    setLocalMin(newMin);
    if (newMin <= localMax) {
      onChange({ min: newMin, max: localMax });
    }
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = parseInt(e.target.value);
    setLocalMax(newMax);
    if (newMax >= localMin) {
      onChange({ min: localMin, max: newMax });
    }
  };

  return (
    <div>
      <h3 className="text-sm font-medium text-bark mb-3">Price Range</h3>

      <div className="space-y-4">
        {/* Display selected range */}
        <div className="flex items-center justify-between text-sm text-bark font-medium">
          <span>${localMin}</span>
          <span className="text-sm text-bark/80">to</span>
          <span>${localMax}</span>
        </div>

        {/* Slider inputs */}
        <div className="relative pt-1">
          <input
            type="range"
            min={min}
            max={max}
            step={5}
            value={localMin}
            onChange={handleMinChange}
            className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-fern [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-fern [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
            style={{ zIndex: localMin > max - 20 ? 5 : 3 }}
          />
          <input
            type="range"
            min={min}
            max={max}
            step={5}
            value={localMax}
            onChange={handleMaxChange}
            className="relative w-full h-2 bg-mist rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-moss [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-moss [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
            style={{ zIndex: 4 }}
          />
        </div>

        {/* Number inputs for precise control */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="min-price" className="sr-only">
              Minimum price
            </label>
            <input
              id="min-price"
              type="number"
              min={min}
              max={localMax}
              value={localMin}
              onChange={handleMinChange}
              className="w-full px-3 py-2 text-sm border border-mist rounded-md focus:outline-none focus:ring-2 focus:ring-fern"
            />
          </div>
          <div>
            <label htmlFor="max-price" className="sr-only">
              Maximum price
            </label>
            <input
              id="max-price"
              type="number"
              min={localMin}
              max={max}
              value={localMax}
              onChange={handleMaxChange}
              className="w-full px-3 py-2 text-sm border border-mist rounded-md focus:outline-none focus:ring-2 focus:ring-fern"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Price range filter component with simple dual-handle slider
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';

interface PriceRangeFilterProps {
  min: number;
  max: number;
  value?: { min: number; max: number };
  onChange: (range: { min: number; max: number }) => void;
}

const STEP = 5;

export function PriceRangeFilter({
  min,
  max,
  value,
  onChange,
}: PriceRangeFilterProps) {
  const [localMin, setLocalMin] = useState(value?.min ?? min);
  const [localMax, setLocalMax] = useState(value?.max ?? max);
  const [activeHandle, setActiveHandle] = useState<'min' | 'max' | null>(null);

  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      setLocalMin(value.min);
      setLocalMax(value.max);
    }
  }, [value]);

  const valueToPosition = (val: number): number => {
    const percentage = ((val - min) / (max - min)) * 100;
    return percentage;
  };

  const positionToValue = (clientXPos: number): number => {
    if (!sliderRef.current) return min;
    const { left, width } = sliderRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(100, ((clientXPos - left) / width) * 100));
    const rawValue = min + (percentage / 100) * (max - min);
    return Math.round(rawValue / STEP) * STEP;
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>, handle: 'min' | 'max') => {
    e.preventDefault();
    setActiveHandle(handle);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (activeHandle && sliderRef.current) {
      const newValue = positionToValue(e.clientX);

      if (activeHandle === 'min' && newValue <= localMax) {
        setLocalMin(newValue);
        onChange({ min: newValue, max: localMax });
      } else if (activeHandle === 'max' && newValue >= localMin) {
        setLocalMax(newValue);
        onChange({ min: localMin, max: newValue });
      }
    }
  };

  const handlePointerUp = () => {
    setActiveHandle(null);
  };

  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = parseInt(e.target.value) || min;
    setLocalMin(newMin);
    if (newMin <= localMax) {
      onChange({ min: newMin, max: localMax });
    }
  };

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = parseInt(e.target.value) || max;
    setLocalMax(newMax);
    if (newMax >= localMin) {
      onChange({ min: localMin, max: newMax });
    }
  };

  const minPosition = valueToPosition(localMin);
  const maxPosition = valueToPosition(localMax);

  return (
    <div>
      <h3 className="text-sm font-medium text-bark mb-3">Price Range</h3>

      <div className="space-y-4">
        {/* Display selected range */}
        <div className="flex items-center justify-between text-sm text-bark font-medium">
          <span>${localMin}</span>
          <span className="text-xs text-bark/60">to</span>
          <span>${localMax}</span>
        </div>

        {/* Simple dual-handle slider */}
        <div className="w-full touch-none select-none py-4">
          <div
            ref={sliderRef}
            className="relative w-full touch-none select-none"
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >
            {/* Track container */}
            <div className="relative w-full h-1">
              {/* Background track */}
              <div className="absolute inset-0 bg-mist rounded-full" />

              {/* Filled range between handles */}
              <div
                className="absolute h-full bg-fern rounded-full transition-all duration-150"
                style={{
                  left: `${minPosition}%`,
                  width: `${maxPosition - minPosition}%`,
                }}
              />
            </div>

            {/* Min handle */}
            <div
              onPointerDown={(e) => handlePointerDown(e, 'min')}
              style={{
                left: `${minPosition}%`,
              }}
              className={`
                absolute top-1/2 -translate-y-1/2 -translate-x-1/2
                w-3.5 h-3.5 bg-fern rounded-full border-2 border-white shadow-sm
                cursor-grab active:cursor-grabbing z-10
                transition-transform duration-150
                ${activeHandle === 'min' ? 'scale-125' : 'hover:scale-110'}
              `}
              role="slider"
              aria-label="Minimum price"
              aria-valuemin={min}
              aria-valuemax={localMax}
              aria-valuenow={localMin}
              tabIndex={0}
            />

            {/* Max handle */}
            <div
              onPointerDown={(e) => handlePointerDown(e, 'max')}
              style={{
                left: `${maxPosition}%`,
              }}
              className={`
                absolute top-1/2 -translate-y-1/2 -translate-x-1/2
                w-3.5 h-3.5 bg-fern rounded-full border-2 border-white shadow-sm
                cursor-grab active:cursor-grabbing z-10
                transition-transform duration-150
                ${activeHandle === 'max' ? 'scale-125' : 'hover:scale-110'}
              `}
              role="slider"
              aria-label="Maximum price"
              aria-valuemin={localMin}
              aria-valuemax={max}
              aria-valuenow={localMax}
              tabIndex={0}
            />
          </div>
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
              step={STEP}
              value={localMin}
              onChange={handleMinInputChange}
              className="w-full px-3 py-2 text-sm border border-mist rounded-md focus:outline-none focus:ring-2 focus:ring-fern bg-parchment text-bark"
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
              step={STEP}
              value={localMax}
              onChange={handleMaxInputChange}
              className="w-full px-3 py-2 text-sm border border-mist rounded-md focus:outline-none focus:ring-2 focus:ring-fern bg-parchment text-bark"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

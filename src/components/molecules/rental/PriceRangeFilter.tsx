'use client';

import React, { useState, useEffect } from 'react';
import { FilterGroup } from './FilterGroup';
import { PriceInput } from '../../atoms/rental/PriceInput';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { updatePriceRange } from '@/store/slices/filtersSlice';

export interface PriceRangeFilterProps {
  title?: string;
  className?: string;
}

export const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({
  title = "Khoảng giá (VNĐ/ngày)",
  className = '',
}) => {
  const dispatch = useAppDispatch();
  const priceRange = useAppSelector((state) => state.filters.priceRange);
  
  const [minValue, setMinValue] = useState(priceRange[0].toString());
  const [maxValue, setMaxValue] = useState(priceRange[1].toString());

  useEffect(() => {
    setMinValue(priceRange[0].toString());
    setMaxValue(priceRange[1].toString());
  }, [priceRange]);

  const handleMinChange = (value: string) => {
    setMinValue(value);
    const numValue = parseInt(value.replace(/,/g, '')) || 0;
    if (numValue <= priceRange[1]) {
      dispatch(updatePriceRange([numValue, priceRange[1]]));
    }
  };

  const handleMaxChange = (value: string) => {
    setMaxValue(value);
    const numValue = parseInt(value.replace(/,/g, '')) || 10000000;
    if (numValue >= priceRange[0]) {
      dispatch(updatePriceRange([priceRange[0], numValue]));
    }
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString('vi-VN');
  };

  const minPercent = (priceRange[0] / 10000000) * 100;
  const maxPercent = (priceRange[1] / 10000000) * 100;

  return (
    <FilterGroup title={title} className={className}>
      <div className="space-y-4">
        {/* Price Range Slider Visual */}
        <div className="h-4 bg-white overflow-hidden rounded">
          <div className="h-2 bg-gray-300 mt-1 rounded-full relative">
            <div 
              className="absolute top-0 h-2 bg-zinc-900 rounded-full"
              style={{
                left: `${minPercent}%`,
                width: `${maxPercent - minPercent}%`
              }}
            ></div>
          </div>
        </div>
        
        {/* Price Range Display */}
        <div className="text-center text-sm text-gray-600">
          {formatNumber(priceRange[0])}đ - {formatNumber(priceRange[1])}đ
        </div>
        
        {/* Min/Max Input Fields */}
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-xs text-gray-600 mb-1">Tối thiểu</label>
            <PriceInput
              value={minValue}
              onChange={handleMinChange}
              placeholder="10,000"
              className="text-xs"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-gray-600 mb-1">Tối đa</label>
            <PriceInput
              value={maxValue}
              onChange={handleMaxChange}
              placeholder="10,000,000"
              className="text-xs"
            />
          </div>
        </div>

        {/* Quick Price Ranges */}
        <div className="space-y-2">
          <div className="text-xs text-gray-600 mb-2">Khoảng giá phổ biến:</div>
          <div className="grid grid-cols-2 gap-2">
            {[
              [0, 100000],
              [100000, 500000],
              [500000, 1000000],
              [1000000, 5000000],
            ].map(([min, max]) => (
              <button
                key={`${min}-${max}`}
                onClick={() => dispatch(updatePriceRange([min, max]))}
                className={`text-xs px-2 py-1 rounded border transition-colors ${
                  priceRange[0] === min && priceRange[1] === max
                    ? 'bg-zinc-900 text-white border-zinc-900'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                }`}
              >
                {formatNumber(min)}đ - {formatNumber(max)}đ
              </button>
            ))}
          </div>
        </div>
      </div>
    </FilterGroup>
  );
};
'use client';

import React from 'react';
import { useAppDispatch } from '@/store/hooks';
import { clearFilters } from '@/store/slices/filtersSlice';
import { CategoryFilter } from '../../molecules/rental/CategoryFilter';
import { BrandFilter } from '../../molecules/rental/BrandFilter';
import { PriceRangeFilter } from '../../molecules/rental/PriceRangeFilter';
import { AvailabilityFilter } from '../../molecules/rental/AvailabilityFilter';
import { RatingFilter } from '../../molecules/rental/RatingFilter';

export interface FilterSidebarProps {
  className?: string;
  categories: Array<{
    categoryId: number;
    categoryName: string | null;
    equipmentCount?: number;
  }>;
  brands: string[];
  loading?: boolean;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  className = '',
  categories,
  brands,
  loading = false,
}) => {
  const dispatch = useAppDispatch();

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  return (
    <div className={`w-72 h-fit bg-white rounded-lg shadow-[0px_4px_6px_0px_rgba(0,0,0,0.10)] p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-extrabold text-zinc-800 leading-relaxed">
          Bộ lọc
        </h2>
        <button
          onClick={handleClearFilters}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Xóa tất cả
        </button>
      </div>

      {/* Filters */}
      <div className="space-y-6">
        {/* Category Filter */}
        <CategoryFilter 
          categories={categories}
          loading={loading}
        />

        {/* Brand Filter */}
        <BrandFilter 
          brands={brands}
          loading={loading}
        />

        {/* Price Range Filter */}
        <PriceRangeFilter />

        {/* Availability Filter */}
        <AvailabilityFilter />

        {/* Rating Filter */}
        <RatingFilter />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-8">
        <button className="flex-1 h-9 bg-zinc-900 rounded text-white text-xs font-medium hover:bg-zinc-800 transition-colors">
          Áp dụng
        </button>
        <button 
          onClick={handleClearFilters}
          className="flex-1 h-9 bg-transparent rounded border border-gray-500 text-zinc-800 text-xs font-medium hover:bg-gray-50 transition-colors"
        >
          Xóa bộ lọc
        </button>
      </div>
    </div>
  );
};
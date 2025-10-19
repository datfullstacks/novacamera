'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useAppDispatch } from '@/store/hooks';
import { clearFilters } from '@/store/slices/filtersSlice';
import { CategoryFilter } from '../../molecules/rental/CategoryFilter';
import { BrandFilter } from '../../molecules/rental/BrandFilter';
import { PriceRangeFilter } from '../../molecules/rental/PriceRangeFilter';
import { AvailabilityFilter } from '../../molecules/rental/AvailabilityFilter';
import { RatingFilter } from '../../molecules/rental/RatingFilter';

export interface FilterSidebarProps {
  className?: string;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  className = '',
}) => {
  const t = useTranslations('rental.filters');
  const dispatch = useAppDispatch();

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  return (
    <div className={`w-full lg:w-72 h-fit bg-white  rounded-lg shadow-[0px_4px_6px_0px_rgba(0,0,0,0.10)] p-4 md:p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h2 className="text-base md:text-lg font-extrabold text-zinc-800 dark:text-white leading-relaxed">
          {t('title')}
        </h2>
        <button
          onClick={handleClearFilters}
          className="text-xs md:text-sm text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-700 font-medium transition-colors"
        >
          Xóa tất cả
        </button>
      </div>

      {/* Filters */}
      <div className="space-y-4 md:space-y-6">
        {/* Category Filter */}
        <CategoryFilter />

        {/* Brand Filter */}
        <BrandFilter />

        {/* Price Range Filter */}
        <PriceRangeFilter />

        {/* Availability Filter */}
        <AvailabilityFilter />

        {/* Rating Filter */}
        <RatingFilter />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 md:gap-4 mt-6 md:mt-8">
        <button className="flex-1 h-9 md:h-10 bg-zinc-900 dark:bg-white rounded text-white dark:text-black text-xs md:text-sm font-medium hover:bg-zinc-800 dark:hover:bg-gray-200 transition-colors">
          Áp dụng
        </button>
        <button 
          onClick={handleClearFilters}
          className="flex-1 h-9 md:h-10 bg-transparent rounded border border-gray-500 dark:border-gray-400 text-zinc-800 dark:text-gray-200 text-xs md:text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Xóa bộ lọc
        </button>
      </div>
    </div>
  );
};
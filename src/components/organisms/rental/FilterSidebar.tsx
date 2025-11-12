"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useAppDispatch } from "@/store/hooks";
import { clearFilters } from "@/store/slices/filtersSlice";
import { CategoryFilter } from "../../molecules/rental/CategoryFilter";
import { BrandFilter } from "../../molecules/rental/BrandFilter";
import { PriceRangeFilter } from "../../molecules/rental/PriceRangeFilter";
import { AvailabilityFilter } from "../../molecules/rental/AvailabilityFilter";
import { RatingFilter } from "../../molecules/rental/RatingFilter";

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
  className = "",
  categories,
  brands,
  loading = false,
}) => {
  const t = useTranslations("rental.filters");
  const dispatch = useAppDispatch();

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  return (
    <div
      className={`w-full lg:w-72 h-fit bg-white  rounded-lg shadow-[0px_4px_6px_0px_rgba(0,0,0,0.10)] p-4 md:p-6 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h2 className="text-base md:text-lg font-bold text-gray-900">
          {t("title")}
        </h2>
        <button
          onClick={handleClearFilters}
          className="text-xs md:text-sm text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold transition-colors"
        >
          Xóa tất cả
        </button>
      </div>

      {/* Filters */}
      <div className="space-y-4 md:space-y-6">
        {/* Category Filter */}
        <CategoryFilter categories={categories} loading={loading} />

        {/* Brand Filter */}
        <BrandFilter brands={brands} loading={loading} />

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
          className="flex-1 h-9 md:h-10 bg-transparent rounded border border-red-500 text-red-600 hover:bg-red-50 dark:border-red-400 dark:text-red-400 dark:hover:bg-red-900 text-xs md:text-sm font-medium transition-colors"
        >
          Xóa bộ lọc
        </button>
      </div>
    </div>
  );
};

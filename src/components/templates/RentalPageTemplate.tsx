'use client';

import React from 'react';
import { FilterSidebar } from '../organisms/rental/FilterSidebar';
import { ProductListSection } from '../organisms/rental/ProductListSection';
import { SearchBar } from '../molecules/rental/SearchBar';
import { useFiltersData } from '@/hooks/useFiltersData';
import Breadcrumb from '@/components/atoms/ui/Breadcrumb';
import PageFooter from '@/components/molecules/common/PageFooter';

export interface RentalPageTemplateProps {
  className?: string;
}

export const RentalPageTemplate: React.FC<RentalPageTemplateProps> = ({
  className = '',
}) => {
  // Load Categories & Brands BEFORE Products (prevents CORS errors)
  const filtersData = useFiltersData();

  console.log('🔄 RentalPageTemplate - Filters state:', {
    loading: filtersData.loading,
    isReady: filtersData.isReady,
    categoriesCount: filtersData.categories.length,
    brandsCount: filtersData.brands.length,
  });
  
  return (
    <div className={`min-h-screen bg-neutral-50  overflow-hidden ${className}`}>
      <div className="w-full max-w-[1487px] mx-auto relative">
        {/* Breadcrumb */}
        <div className="px-4 md:px-6 mb-6 pt-4 md:pt-6 py-4 bg-neutral-50">
          <Breadcrumb className="text-sm" />
        </div>

        {/* Search Bar */}
        <div className="flex px-4 md:px-6 mb-4 md:mb-6">
          <SearchBar className="max-w-2xl" />
        </div>

        {/* Main Content Container - Responsive Layout */}
        <div className="flex flex-col lg:flex-row gap-4 md:gap-6 px-4 md:px-6 pb-16 md:pb-20">
          {/* Filter Sidebar - Full width on mobile, sidebar on desktop */}
          <div className="w-full lg:w-auto lg:flex-shrink-0">
            <FilterSidebar 
              categories={filtersData.categories}
              brands={filtersData.brands}
              loading={filtersData.loading}
            />
          </div>

          {/* Product List Section - Full width on mobile */}
          <div className="flex-1 w-full lg:max-w-none">
            <ProductListSection 
              filtersReady={filtersData.isReady}
            />
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <PageFooter />
    </div>
  );
};
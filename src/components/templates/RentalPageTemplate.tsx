'use client';

import React from 'react';
import { FilterSidebar } from '../organisms/rental/FilterSidebar';
import { ProductListSection } from '../organisms/rental/ProductListSection';
import { SearchBar } from '../molecules/rental/SearchBar';

export interface RentalPageTemplateProps {
  className?: string;
}

export const RentalPageTemplate: React.FC<RentalPageTemplateProps> = ({
  className = '',
}) => {
  // Note: Category filtering from URL params is handled by CategoryFilter component
  
  return (
    <div className={`min-h-screen bg-neutral-50  overflow-hidden ${className}`}>
      <div className="w-full max-w-[1487px] mx-auto pt-8 md:pt-16 relative">
        {/* Search Bar */}
        <div className="px-4 md:px-6 mb-4 md:mb-6">
          <SearchBar className="max-w-2xl" />
        </div>

        {/* Main Content Container - Responsive Layout */}
        <div className="flex flex-col lg:flex-row gap-4 md:gap-6 px-4 md:px-6">
          {/* Filter Sidebar - Full width on mobile, sidebar on desktop */}
          <div className="w-full lg:w-auto lg:flex-shrink-0">
            <FilterSidebar />
          </div>

          {/* Product List Section - Full width on mobile */}
          <div className="flex-1 w-full lg:max-w-none">
            <ProductListSection />
          </div>
        </div>
      </div>
    </div>
  );
};
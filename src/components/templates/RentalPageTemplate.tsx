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
  return (
    <div className={`min-h-screen bg-neutral-50 overflow-hidden ${className}`}>
      <div className="w-full max-w-[1487px] mx-auto pt-16 relative">
        {/* Search Bar */}
        <div className="px-4 mb-6">
          <SearchBar className="max-w-2xl" />
        </div>

        {/* Main Content Container */}
        <div className="flex gap-6 p-4">
          {/* Filter Sidebar */}
          <div className="flex-shrink-0">
            <FilterSidebar />
          </div>

          {/* Product List Section */}
          <div className="flex-1 max-w-[851px]">
            <ProductListSection />
          </div>
        </div>
      </div>
    </div>
  );
};
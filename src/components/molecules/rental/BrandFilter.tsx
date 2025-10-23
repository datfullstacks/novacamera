'use client';

import React, { useState, useEffect } from 'react';
import { FilterGroup } from './FilterGroup';
import { Checkbox } from '../../atoms/rental/Checkbox';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { toggleBrand } from '@/store/slices/filtersSlice';

export interface BrandFilterProps {
  title?: string;
  className?: string;
  brands: string[];
  loading?: boolean;
}

export const BrandFilter: React.FC<BrandFilterProps> = ({
  title = "Thương hiệu",
  className = '',
  brands: externalBrands,
  loading: externalLoading = false,
}) => {
  const dispatch = useAppDispatch();
  const selectedBrands = useAppSelector((state) => state.filters.brands);
  const [brands, setBrands] = useState<Array<{id: string; name: string; equipmentCount: number}>>([]);

  // Map external brands to internal format
  useEffect(() => {
    console.log('🔍 BrandFilter - externalBrands:', externalBrands);
    if (externalBrands && externalBrands.length > 0) {
      const mapped = externalBrands.map((brandName: string) => ({
        id: brandName, // Use exact brand name as ID (not lowercase)
        name: brandName,
        equipmentCount: 0 // API doesn't provide equipment count
      }));
      setBrands(mapped);
      console.log('✅ BrandFilter received brands:', mapped.length, mapped);
    } else {
      console.log('⚠️ BrandFilter - No brands received');
      setBrands([]);
    }
  }, [externalBrands]);

  const handleBrandChange = (brandName: string) => {
    // Dispatch the exact brand name (e.g., "Canon", not "canon")
    dispatch(toggleBrand(brandName));
    console.log('🔄 Toggle brand:', brandName, 'Selected brands:', selectedBrands);
  };

  if (externalLoading) {
    return (
      <FilterGroup title={title} className={className}>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </FilterGroup>
    );
  }

  return (
    <FilterGroup title={title} className={className}>
      <div className="space-y-3">
        {brands.length === 0 ? (
          <p className="text-sm text-gray-500">Không có thương hiệu</p>
        ) : (
          brands.map((brand) => (
            <Checkbox
              key={brand.id}
              id={brand.id}
              label={`${brand.name} (${brand.equipmentCount})`}
              checked={selectedBrands.includes(brand.id)}
              onChange={() => handleBrandChange(brand.id)}
              className="w-full"
            />
          ))
        )}
      </div>
    </FilterGroup>
  );
};
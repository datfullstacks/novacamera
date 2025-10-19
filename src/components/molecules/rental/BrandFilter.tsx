'use client';

import React, { useState, useEffect } from 'react';
import { FilterGroup } from './FilterGroup';
import { Checkbox } from '../../atoms/rental/Checkbox';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { toggleBrand } from '@/store/slices/filtersSlice';
import { equipmentService } from '@/lib/api/services';

export interface BrandFilterProps {
  title?: string;
  className?: string;
}

export const BrandFilter: React.FC<BrandFilterProps> = ({
  title = "Thương hiệu",
  className = '',
}) => {
  const dispatch = useAppDispatch();
  const selectedBrands = useAppSelector((state) => state.filters.brands);
  const [brands, setBrands] = useState<Array<{id: string; name: string; equipmentCount: number}>>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBrands = async () => {
      setLoading(true);
      try {
        const response = await equipmentService.getBrands();
        
        console.log('✅ Brands API Response:', response);
        
        if (response.statusCode === 200 && response.data) {
          // Map string array to component format with equipmentCount
          const mappedBrands = response.data.map((brandName) => ({
            id: brandName.toLowerCase(),
            name: brandName,
            equipmentCount: 0 // API doesn't provide count, will be 0
          }));
          setBrands(mappedBrands);
        }
      } catch (error) {
        console.error('❌ Failed to fetch brands:', error);
        // Fallback to mock data
        setBrands([
          { id: 'canon', name: 'Canon', equipmentCount: 15 },
          { id: 'sony', name: 'Sony', equipmentCount: 12 },
          { id: 'nikon', name: 'Nikon', equipmentCount: 10 },
          { id: 'panasonic', name: 'Panasonic', equipmentCount: 8 },
          { id: 'fujifilm', name: 'Fujifilm', equipmentCount: 6 },
          { id: 'olympus', name: 'Olympus', equipmentCount: 5 },
          { id: 'dji', name: 'DJI', equipmentCount: 4 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  const handleBrandChange = (brandId: string) => {
    dispatch(toggleBrand(brandId));
  };

  if (loading) {
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
        {brands.map((brand) => (
          <Checkbox
            key={brand.id}
            id={brand.id}
            label={`${brand.name} (${brand.equipmentCount})`}
            checked={selectedBrands.includes(brand.id)}
            onChange={() => handleBrandChange(brand.id)}
            className="w-full"
          />
        ))}
      </div>
    </FilterGroup>
  );
};
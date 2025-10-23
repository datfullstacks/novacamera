'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { FilterGroup } from './FilterGroup';
import { Checkbox } from '../../atoms/rental/Checkbox';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { toggleCategory } from '@/store/slices/filtersSlice';

export interface CategoryFilterProps {
  title?: string;
  className?: string;
  categories: Array<{
    categoryId: number;
    categoryName: string | null;
    equipmentCount?: number;
  }>;
  loading?: boolean;
}

// Mapping slug -> categoryName for URL params
const CATEGORY_SLUG_MAP: Record<string, string> = {
  'camera': 'Máy ảnh',
  'lens': 'Ống kính',
  'lighting': 'Đèn chiếu sáng',
  'tripod': 'Chân máy',
  'accessories': 'Phụ kiện',
  'audio': 'Thiết bị âm thanh',
  'video': 'Thiết bị quay phim',
  'drone': 'Flycam/Drone',
};

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  title = "Danh mục",
  className = '',
  categories: externalCategories,
  loading: externalLoading = false,
}) => {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const selectedCategories = useAppSelector((state) => state.filters.categories);
  const [categories, setCategories] = useState<Array<{id: string; name: string; equipmentCount: number}>>([]);
  const [initialized, setInitialized] = useState(false);

  // Map external categories to internal format
  useEffect(() => {
    if (externalCategories && externalCategories.length > 0) {
      const mapped = externalCategories.map(cat => ({
        id: cat.categoryId.toString(),
        name: cat.categoryName || '',
        equipmentCount: cat.equipmentCount || 0
      }));
      setCategories(mapped);
      console.log('✅ CategoryFilter received categories:', mapped.length);
    }
  }, [externalCategories]);

  // Auto-select category from URL params - convert slug to categoryId
  useEffect(() => {
    if (!initialized && categories.length > 0) {
      const categorySlug = searchParams.get('category');
      if (categorySlug) {
        // Convert slug to categoryName, then find matching categoryId
        const categoryName = CATEGORY_SLUG_MAP[categorySlug];
        if (categoryName) {
          const matchingCategory = categories.find(cat => cat.name === categoryName);
          if (matchingCategory && !selectedCategories.includes(matchingCategory.id)) {
            dispatch(toggleCategory(matchingCategory.id));
            console.log('✅ Auto-selected category:', categorySlug, '→', matchingCategory.id, '('+matchingCategory.name+')');
          }
        }
      }
      setInitialized(true);
    }
  }, [initialized, categories, searchParams, selectedCategories, dispatch]);

  const handleCategoryChange = (categoryId: string) => {
    dispatch(toggleCategory(categoryId));
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
        {categories.map((category) => (
          <Checkbox
            key={category.id}
            id={category.id}
            label={`${category.name} (${category.equipmentCount})`}
            checked={selectedCategories.includes(category.id)}
            onChange={() => handleCategoryChange(category.id)}
            className="w-full"
          />
        ))}
      </div>
    </FilterGroup>
  );
};
'use client';

import React, { useState, useEffect } from 'react';
import { FilterGroup } from './FilterGroup';
import { Checkbox } from '../../atoms/rental/Checkbox';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { toggleCategory } from '@/store/slices/filtersSlice';
import { equipmentService } from '@/lib/api/equipmentService';

export interface CategoryFilterProps {
  title?: string;
  className?: string;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  title = "Danh mục",
  className = '',
}) => {
  const dispatch = useAppDispatch();
  const selectedCategories = useAppSelector((state) => state.filters.categories);
  const [categories, setCategories] = useState<Array<{id: string; name: string; equipmentCount: number}>>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await equipmentService.getCategories();
        if (response.success) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        // Fallback to mock data
        setCategories([
          { id: 'camera', name: 'Máy ảnh', equipmentCount: 25 },
          { id: 'lens', name: 'Ống kính', equipmentCount: 18 },
          { id: 'lighting', name: 'Đèn chiếu sáng', equipmentCount: 12 },
          { id: 'audio', name: 'Thiết bị âm thanh', equipmentCount: 8 },
          { id: 'video', name: 'Thiết bị quay phim', equipmentCount: 15 },
          { id: 'drone', name: 'Flycam/Drone', equipmentCount: 6 },
          { id: 'accessories', name: 'Phụ kiện', equipmentCount: 30 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryChange = (categoryId: string) => {
    dispatch(toggleCategory(categoryId));
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
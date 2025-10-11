'use client';

import React from 'react';
import { FilterGroup } from './FilterGroup';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { updateRating } from '@/store/slices/filtersSlice';

export interface RatingFilterProps {
  title?: string;
  className?: string;
}

export const RatingFilter: React.FC<RatingFilterProps> = ({
  title = "Đánh giá",
  className = '',
}) => {
  const dispatch = useAppDispatch();
  const selectedRating = useAppSelector((state) => state.filters.rating);

  const ratingOptions = [
    { value: 4, label: '4 sao trở lên', stars: 4 },
    { value: 3, label: '3 sao trở lên', stars: 3 },
    { value: 2, label: '2 sao trở lên', stars: 2 },
    { value: 1, label: '1 sao trở lên', stars: 1 },
  ];

  const handleRatingChange = (rating: number) => {
    if (selectedRating === rating) {
      dispatch(updateRating(0)); // Unselect if already selected
    } else {
      dispatch(updateRating(rating));
    }
  };

  const renderStars = (count: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${
              i < count ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <FilterGroup title={title} className={className}>
      <div className="space-y-3">
        {ratingOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => handleRatingChange(option.value)}
            className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors ${
              selectedRating === option.value
                ? 'bg-blue-50 border border-blue-200'
                : 'hover:bg-gray-50'
            }`}
          >
            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
              selectedRating === option.value
                ? 'bg-blue-600 border-blue-600'
                : 'border-gray-300'
            }`}>
              {selectedRating === option.value && (
                <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="flex items-center gap-2">
              {renderStars(option.stars)}
              <span className="text-sm text-gray-700">{option.label}</span>
            </div>
          </button>
        ))}
      </div>
    </FilterGroup>
  );
};
'use client';

import React from 'react';
import { Star } from 'lucide-react';

export interface RatingStarsProps {
  rating: number;
  reviewCount?: number;
  size?: 'sm' | 'md' | 'lg';
  showReviewCount?: boolean;
  className?: string;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  reviewCount,
  size = 'md',
  showReviewCount = true,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex text-yellow-400">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`${sizeClasses[size]} ${i < Math.floor(rating) ? 'fill-current' : ''}`} 
          />
        ))}
      </div>
      {showReviewCount && reviewCount && (
        <span className={`text-gray-600 ${textSizeClasses[size]}`}>
          {rating} ({reviewCount} đánh giá)
        </span>
      )}
    </div>
  );
};
'use client';

import React from 'react';

export const LoadingSpinner: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );
};

export const CartItemSkeleton: React.FC = () => {
  return (
    <div className="bg-white p-6 border-b border-gray-200 animate-pulse">
      <div className="flex gap-4">
        {/* Image Skeleton */}
        <div className="flex-shrink-0">
          <div className="w-28 h-28 bg-gray-200 rounded-xl"></div>
        </div>

        {/* Content Skeleton */}
        <div className="flex-1 space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
          
          <div className="flex gap-4">
            <div className="h-8 bg-gray-200 rounded w-32"></div>
            <div className="h-8 bg-gray-200 rounded w-32"></div>
          </div>
          
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>

        {/* Action Skeleton */}
        <div className="flex-shrink-0">
          <div className="h-8 w-16 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
};
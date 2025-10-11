'use client';

import React from 'react';
import { Equipment } from '@/types';
import { PriceDisplay, RatingStars, AvailabilityBadge } from '../../atoms/product';

export interface BasicProductInfoProps {
  equipment: Equipment;
  className?: string;
}

export const BasicProductInfo: React.FC<BasicProductInfoProps> = ({
  equipment,
  className = '',
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div>
        <h1 className="text-3xl font-normal text-gray-800 mb-2">
          {equipment.name}
        </h1>
        <p className="text-gray-600 text-base leading-normal">
          {equipment.description}
        </p>
      </div>

      {/* Price */}
      <PriceDisplay 
        price={equipment.dailyRate} 
        size="xl"
      />

      {/* Availability */}
      <AvailabilityBadge 
        isAvailable={equipment.isAvailable}
        quantity={equipment.availableQuantity}
      />

      {/* Rating */}
      <RatingStars 
        rating={equipment.rating || 4.9}
        reviewCount={Math.floor(Math.random() * 100) + 20}
      />
    </div>
  );
};
'use client';

import React from 'react';

export interface AvailabilityBadgeProps {
  isAvailable: boolean;
  quantity?: number;
  className?: string;
}

export const AvailabilityBadge: React.FC<AvailabilityBadgeProps> = ({
  isAvailable,
  quantity,
  className = '',
}) => {
  if (!isAvailable) {
    return (
      <span className={`inline-block bg-red-50 text-red-600 px-3 py-1 rounded text-sm ${className}`}>
        Hết hàng
      </span>
    );
  }

  return (
    <span className={`inline-block bg-green-50 text-green-600 px-3 py-1 rounded text-sm ${className}`}>
      Có sẵn{quantity && ` (${quantity})`}
    </span>
  );
};
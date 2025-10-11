'use client';

import React from 'react';
import { PriceDisplay } from '../../atoms/product';

export interface PriceCalculatorProps {
  dailyRate: number;
  rentalDays: number;
  discountAmount?: number;
  insuranceAmount?: number;
  className?: string;
}

export const PriceCalculator: React.FC<PriceCalculatorProps> = ({
  dailyRate,
  rentalDays,
  discountAmount = 0,
  insuranceAmount = 0,
  className = '',
}) => {
  const subtotal = dailyRate * rentalDays;
  const total = subtotal + insuranceAmount - discountAmount;

  return (
    <div className={`border-t pt-4 space-y-3 ${className}`}>
      <div className="flex justify-between text-base text-gray-800">
        <span>{rentalDays} ngày × {dailyRate.toLocaleString('vi-VN')}</span>
        <span>{subtotal.toLocaleString('vi-VN')}đ</span>
      </div>
      
      <div className="flex justify-between text-base text-gray-800">
        <span>Bảo hiểm (Tùy chọn)</span>
        <span>{insuranceAmount.toLocaleString('vi-VN')}đ</span>
      </div>
      
      {discountAmount > 0 && (
        <div className="flex justify-between text-base text-green-600">
          <span>Giảm giá</span>
          <span>-{discountAmount.toLocaleString('vi-VN')}đ</span>
        </div>
      )}
      
      <div className="border-t pt-3 flex justify-between text-lg font-normal text-gray-800">
        <span>Tổng cộng</span>
        <span>{total.toLocaleString('vi-VN')}đ</span>
      </div>
    </div>
  );
};
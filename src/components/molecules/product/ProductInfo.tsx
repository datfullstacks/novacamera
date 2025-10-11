'use client';

import React from 'react';
import { Equipment } from '@/types';
import { Star, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ProductInfoProps {
  equipment: Equipment;
  totalPrice: number;
  rentalDays: number;
  isAvailable: boolean;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({
  equipment,
  totalPrice,
  rentalDays,
  isAvailable,
}) => {
  return (
    <div className="space-y-4">
      {/* Status Badge */}
      <Badge
        variant={isAvailable ? "default" : "destructive"}
        className={`${
          isAvailable 
            ? 'bg-green-500 text-white hover:bg-green-600' 
            : 'bg-red-500 text-white hover:bg-red-600'
        }`}
      >
        {isAvailable ? 'Có sẵn' : 'Hết hàng'}
      </Badge>

      {/* Product Name */}
      <h1 className="text-3xl font-bold text-gray-900">
        {equipment.name}
      </h1>

      {/* Brand & Model */}
      <div className="flex items-center space-x-4 text-sm text-gray-600">
        <span>Thương hiệu: <span className="font-medium text-gray-900">{equipment.brand}</span></span>
        <span>•</span>
        <span>Model: <span className="font-medium text-gray-900">{equipment.model}</span></span>
      </div>

      {/* Rating */}
      <div className="flex items-center space-x-2">
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className="h-5 w-5 text-yellow-400 fill-current"
            />
          ))}
        </div>
        <span className="text-sm text-gray-600">(4.8 • 124 đánh giá)</span>
      </div>

      {/* Price */}
      <div className="space-y-2">
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-bold text-blue-600">
            {equipment.dailyRate.toLocaleString('vi-VN')}₫
          </span>
          <span className="text-gray-600">/ ngày</span>
        </div>
        
        {rentalDays > 1 && (
          <div className="text-lg">
            <span className="text-gray-600">Tổng {rentalDays} ngày: </span>
            <span className="font-bold text-gray-900">
              {totalPrice.toLocaleString('vi-VN')}₫
            </span>
          </div>
        )}
      </div>

      {/* Availability */}
      <div className="flex items-center space-x-2 text-sm">
        <MapPin className="h-4 w-4 text-gray-500" />
        <span className="text-gray-600">
          Còn lại: <span className="font-medium text-gray-900">{equipment.availableQuantity}</span> thiết bị
        </span>
      </div>

      {/* Description */}
      <div className="pt-4">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Mô tả sản phẩm</h3>
        <p className="text-gray-600 leading-relaxed">
          {equipment.description}
        </p>
      </div>
    </div>
  );
};
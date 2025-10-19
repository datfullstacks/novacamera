'use client';

import React from 'react';
import { ProductCard } from '@/components/organisms/rental/ProductCard';
import { Equipment, EquipmentStatus } from '@/types';

interface RelatedProductsProps {
  categoryId: string;
  currentProductId: string;
}

export const RelatedProducts: React.FC<RelatedProductsProps> = ({
  categoryId,
  currentProductId,
}) => {
  // Mock related products - trong thực tế sẽ call API
  const relatedProducts: Equipment[] = [
    {
      id: 1,
      name: 'Canon EOS R6',
      description: 'Máy ảnh mirrorless full frame với khả năng quay video 4K',
      brand: 'Canon',
      model: 'EOS R6',
      category: 'Máy ảnh',
      dailyRate: 2200000,
      availableQuantity: 3,
      isAvailable: true,
      status: EquipmentStatus.ACTIVE,
      images: [{
        id: 1,
        url: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop&q=80',
        alt: 'Canon EOS R6',
      }],
      specifications: {
        resolution: '20.1MP',
        videoQuality: '4K',
        batteryLife: '360 shots',
      },
      rating: 4.8,
      reviewCount: 124,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 2,
      name: 'Sony A7 IV',
      description: 'Máy ảnh mirrorless với cảm biến full frame 33MP',
      brand: 'Sony',
      model: 'A7 IV',
      category: 'Máy ảnh',
      dailyRate: 2500000,
      availableQuantity: 2,
      isAvailable: true,
      status: EquipmentStatus.ACTIVE,
      images: [{
        id: 2,
        url: 'https://images.unsplash.com/photo-1567450840746-5a6c3b49b7c2?w=400&h=300&fit=crop&q=80',
        alt: 'Sony A7 IV',
      }],
      specifications: {
        resolution: '33MP',
        videoQuality: '4K',
        batteryLife: '520 shots',
      },
      rating: 4.9,
      reviewCount: 98,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 3,
      name: 'Nikon Z6 II',
      description: 'Máy ảnh mirrorless full frame với dual card slots',
      brand: 'Nikon',
      model: 'Z6 II',
      category: 'Máy ảnh',
      dailyRate: 1800000,
      availableQuantity: 4,
      isAvailable: true,
      status: EquipmentStatus.ACTIVE,
      images: [{
        id: 3,
        url: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=300&fit=crop&q=80',
        alt: 'Nikon Z6 II',
      }],
      specifications: {
        resolution: '24.5MP',
        videoQuality: '4K',
        batteryLife: '410 shots',
      },
      rating: 4.7,
      reviewCount: 76,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ].filter(product => product.id.toString() !== currentProductId);

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Sản phẩm liên quan</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedProducts.map((product) => (
          <ProductCard
            key={product.id}
            equipment={product}
            onViewDetails={(equipment) => {
              window.location.href = `/product/detail/${equipment.id}`;
            }}
            onToggleFavorite={(equipmentId) => {
              console.log('Toggle favorite:', equipmentId);
            }}
            isFavorite={false}
          />
        ))}
      </div>
    </div>
  );
};
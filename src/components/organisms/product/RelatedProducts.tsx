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
      id: 'related-1',
      name: 'Canon EOS R6',
      description: 'Máy ảnh mirrorless full frame với khả năng quay video 4K',
      price: 2200000,
      quantity: 3,
      categoryId: categoryId,
      category: {
        id: categoryId,
        name: 'Máy ảnh',
        description: 'Camera equipment',
        slug: 'camera',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      images: [{
        id: 'img1',
        url: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop&q=80',
        alt: 'Canon EOS R6',
        isPrimary: true,
      }],
      specifications: {
        resolution: '20.1MP',
        videoQuality: '4K',
        batteryLife: '360 shots',
      },
      status: EquipmentStatus.AVAILABLE,
      brand: 'Canon',
      model: 'EOS R6',
      isAvailable: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'related-2',
      name: 'Sony A7 IV',
      description: 'Máy ảnh mirrorless với cảm biến full frame 33MP',
      price: 2500000,
      quantity: 2,
      categoryId: categoryId,
      category: {
        id: categoryId,
        name: 'Máy ảnh',
        description: 'Camera equipment',
        slug: 'camera',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      images: [{
        id: 'img2',
        url: 'https://images.unsplash.com/photo-1567450840746-5a6c3b49b7c2?w=400&h=300&fit=crop&q=80',
        alt: 'Sony A7 IV',
        isPrimary: true,
      }],
      specifications: {
        resolution: '33MP',
        videoQuality: '4K',
        batteryLife: '520 shots',
      },
      status: EquipmentStatus.AVAILABLE,
      brand: 'Sony',
      model: 'A7 IV',
      isAvailable: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'related-3',
      name: 'Nikon Z6 II',
      description: 'Máy ảnh mirrorless full frame với dual card slots',
      price: 1800000,
      quantity: 4,
      categoryId: categoryId,
      category: {
        id: categoryId,
        name: 'Máy ảnh',
        description: 'Camera equipment',
        slug: 'camera',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      images: [{
        id: 'img3',
        url: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=300&fit=crop&q=80',
        alt: 'Nikon Z6 II',
        isPrimary: true,
      }],
      specifications: {
        resolution: '24.5MP',
        videoQuality: '4K',
        batteryLife: '410 shots',
      },
      status: EquipmentStatus.AVAILABLE,
      brand: 'Nikon',
      model: 'Z6 II',
      isAvailable: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ].filter(product => product.id !== currentProductId);

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
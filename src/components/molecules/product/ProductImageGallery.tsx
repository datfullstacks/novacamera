'use client';

import React from 'react';
import { EquipmentImage } from '@/types';
import { ProductImage } from '../../atoms/product';

interface ProductImageGalleryProps {
  images: EquipmentImage[];
  selectedIndex: number;
  onImageSelect: (index: number) => void;
}

export const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images,
  selectedIndex,
  onImageSelect,
}) => {
  const selectedImage = images[selectedIndex] || images[0];

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <ProductImage
        src={selectedImage?.url || '/images/placeholder.jpg'}
        alt={selectedImage?.alt || 'Product image'}
        className="aspect-square bg-gray-100 rounded-lg"
        width={600}
        height={600}
      />

      {/* Thumbnail Images */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => onImageSelect(index)}
              className={`aspect-square overflow-hidden rounded-md bg-gray-100 ${
                index === selectedIndex
                  ? 'ring-2 ring-blue-500'
                  : 'hover:opacity-75'
              }`}
            >
              <ProductImage
                src={image.url}
                alt={image.alt || `Product image ${index + 1}`}
                width={150}
                height={150}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
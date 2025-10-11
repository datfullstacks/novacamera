'use client';

import { HTMLAttributes, useState } from 'react';
import { EquipmentImage, ThumbnailImage } from '../../atoms/equipment';

interface EquipmentImageGalleryProps extends HTMLAttributes<HTMLDivElement> {
  mainImage: string;
  thumbnails: string[];
  alt: string;
  status: 'available' | 'rented' | 'maintenance' | 'repair';
}

export default function EquipmentImageGallery({
  mainImage,
  thumbnails,
  alt,
  status,
  className = '',
  ...props
}: EquipmentImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(mainImage);

  return (
    <div className={`space-y-4 ${className}`} {...props}>
      {/* Main Image */}
      <EquipmentImage
        src={selectedImage}
        alt={alt}
        status={status}
        className="w-80 h-80"
      />

      {/* Thumbnail Gallery */}
      <div className="flex space-x-4">
        {thumbnails.map((thumbnail, index) => (
          <ThumbnailImage
            key={index}
            src={thumbnail}
            alt={`${alt} thumbnail ${index + 1}`}
            active={thumbnail === selectedImage}
            onClick={() => setSelectedImage(thumbnail)}
          />
        ))}
      </div>
    </div>
  );
}


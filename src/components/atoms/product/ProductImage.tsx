'use client';

import React from 'react';
import Image from 'next/image';

export interface ProductImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  onClick?: () => void;
  priority?: boolean;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  width,
  height,
  fill = false,
  className = '',
  onClick,
  priority = false,
}) => {
  const imageProps = fill 
    ? { fill: true }
    : { width: width || 400, height: height || 300 };

  return (
    <div 
      className={`relative overflow-hidden ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      <Image
        src={src}
        alt={alt}
        {...imageProps}
        className="object-cover"
        priority={priority}
      />
    </div>
  );
};
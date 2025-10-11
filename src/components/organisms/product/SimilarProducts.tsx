'use client';

import React from 'react';
import { ProductImage, PriceDisplay, RatingStars } from '../../atoms/product';

export interface SimilarProduct {
  name: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
}

export interface SimilarProductsProps {
  products?: SimilarProduct[];
  className?: string;
}

export const SimilarProducts: React.FC<SimilarProductsProps> = ({
  products = [
    { name: 'Sony Alpha A7S III', price: 1050000, rating: 4.8, reviews: 98, image: 'https://placehold.co/270x180' },
    { name: 'Nikon Z7 II', price: 999000, rating: 4.6, reviews: 72, image: 'https://placehold.co/270x180' },
    { name: 'Canon RF 24-70mm f/2.8L', price: 650000, rating: 4.9, reviews: 105, image: 'https://placehold.co/270x180' },
    { name: 'DJI Ronin-S Gimbal', price: 785000, rating: 4.7, reviews: 83, image: 'https://placehold.co/270x180' },
  ],
  className = '',
}) => {
  return (
    <div className={className}>
      <h2 className="text-2xl text-gray-800 font-normal mb-6">
        Sản phẩm tương tự
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <ProductImage
              src={product.image}
              alt={product.name}
              className="aspect-[4/3] bg-gray-100"
              width={270}
              height={180}
            />
            <div className="p-4">
              <h3 className="text-blue-700 text-base font-normal mb-2">
                {product.name}
              </h3>
              <div className="mb-2">
                <PriceDisplay price={product.price} size="md" />
              </div>
              <RatingStars 
                rating={product.rating}
                reviewCount={product.reviews}
                size="sm"
                showReviewCount={false}
              />
              <span className="text-gray-600 text-base ml-2">
                {product.rating} ({product.reviews})
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
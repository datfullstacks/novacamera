import React from 'react';
import Link from 'next/link';

export interface CategoryCardProps {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  itemCount: number;
  href: string;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  name,
  description,
  imageUrl,
  itemCount,
  href
}) => {
  return (
    <Link 
      href={href}
      className="block group bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
    >
      <div className="aspect-w-16 aspect-h-9 rounded-t-lg overflow-hidden">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {name}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-2">
          {description}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            {itemCount} sản phẩm
          </span>
          
          <span className="text-blue-600 font-medium group-hover:text-blue-700">
            Xem thêm →
          </span>
        </div>
      </div>
    </Link>
  );
};

'use client';

import { useFeaturedEquipment } from '@/lib/react-query/hooks';
import Link from 'next/link';

export function FeaturedEquipmentClient() {
  const { data, isLoading, error } = useFeaturedEquipment(6);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 h-64 rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Không thể tải thiết bị nổi bật</p>
        <p className="text-gray-600 text-sm">{error.message}</p>
      </div>
    );
  }

  if (!data?.data || data.data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Chưa có thiết bị nổi bật</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.data.map((equipment) => (
        <Link
          key={equipment.equipmentId}
          href={`/equipment/${equipment.equipmentId}`}
          className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
        >
          <div className="relative h-64 overflow-hidden">
            <img
              src={equipment.mainImageUrl || 'https://placehold.co/400x300'}
              alt={equipment.name || 'Equipment'}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            {!equipment.isAvailable && (
              <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                Đã thuê
              </div>
            )}
            {equipment.isAvailable && (
              <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                Có sẵn
              </div>
            )}
          </div>
          
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
              {equipment.name || 'N/A'}
            </h3>
            
            {equipment.tagline && (
              <p className="text-sm text-gray-600 mb-2">{equipment.tagline}</p>
            )}
            
            {equipment.brand && (
              <p className="text-xs text-gray-500 mb-2">Hãng: {equipment.brand}</p>
            )}
            
            <div className="flex items-center justify-between mt-3">
              <div>
                <p className="text-sm text-gray-500">Giá thuê/ngày</p>
                <p className="text-xl font-bold text-blue-600">
                  {equipment.formattedPrice || `${equipment.pricePerDay.toLocaleString('vi-VN')}₫`}
                </p>
              </div>
              
              {equipment.rating && (
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="ml-1 text-sm text-gray-600">
                    {equipment.rating.toFixed(1)}
                  </span>
                </div>
              )}
            </div>
            
            {equipment.location && (
              <p className="text-xs text-gray-500 mt-2">
                <svg className="inline w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {equipment.location}
              </p>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}

'use client';

import { useFeaturedEquipment } from '@/lib/react-query/hooks';
import { Link } from '@/i18n/routing';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/store/slices/cartSlice';
import { showToast } from '@/components/atoms/ui/Toast';
import type { EquipmentCardResponse } from '@/types/api';

export function FeaturedEquipmentClient() {
  const { data, isLoading, error } = useFeaturedEquipment(6);
  const dispatch = useDispatch();

  const handleAddToCart = (e: React.MouseEvent, equipment: EquipmentCardResponse) => {
    e.preventDefault(); // Prevent Link navigation
    e.stopPropagation();

    if (!equipment.isAvailable) {
      showToast({
        type: 'error',
        title: 'Không khả dụng',
        message: 'Thiết bị này hiện không có sẵn',
        duration: 3000,
      });
      return;
    }

    dispatch(addToCart({
      equipmentId: equipment.equipmentId,
      name: equipment.name || 'Unnamed Product',
      pricePerDay: equipment.pricePerDay,
      depositFee: equipment.pricePerDay * 2, // Default: 2x daily rate as deposit
      imageUrl: equipment.mainImageUrl || "",
      brand: equipment.brand || "",
      category: equipment.categoryName || "",
      quantity: 1,
      rentalStartDate: null,
      rentalEndDate: null,
      totalDays: 1,
    }));

    showToast({
      type: 'success',
      title: 'Đã thêm vào giỏ hàng',
      message: `${equipment.name} đã được thêm vào giỏ hàng`,
      duration: 3000,
    });
  };

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
            
            {/* Add to Cart Button */}
            <button
              onClick={(e) => handleAddToCart(e, equipment)}
              disabled={!equipment.isAvailable}
              className="w-full mt-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
              {equipment.isAvailable ? 'Thêm vào giỏ hàng' : 'Đã thuê'}
            </button>
          </div>
        </Link>
      ))}
    </div>
  );
}

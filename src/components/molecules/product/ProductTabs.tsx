'use client';

import React, { useState } from 'react';
import { Equipment } from '@/types';

export interface ProductTabsProps {
  equipment: Equipment;
  className?: string;
}

export const ProductTabs: React.FC<ProductTabsProps> = ({
  equipment,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState('description');

  const tabs = [
    { id: 'description', label: 'Sự miêu tả' },
    { id: 'specifications', label: 'Thông số kỹ thuật' },
    { id: 'reviews', label: 'Đánh giá của người dùng' },
    { id: 'rental-info', label: 'Thông tin cho vay' },
  ];

  return (
    <div className={`bg-white rounded-lg shadow-sm ${className}`}>
      {/* Tab Headers */}
      <div className="border-b">
        <div className="flex">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 text-base border-b-2 ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-800 hover:text-blue-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-8">
        {activeTab === 'description' && (
          <div className="space-y-4 text-gray-800 text-base leading-normal">
            <p>{equipment.description}</p>
            <p>
              Máy ảnh này có cảm biến CMOS khung hình toàn bộ 45 megapixel mang lại chất lượng 
              hình ảnh đặc biệt với chi tiết và rõ ràng đáng kinh ngạc. Hệ thống Pixel CMOS AF II 
              kép nâng cao cung cấp tự động lấy nét nhanh như chớp với độ che phủ khung 100% 
              và phát hiện mắt, mặt và đầu của mắt.
            </p>
          </div>
        )}

        {activeTab === 'specifications' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {equipment.specifications && Object.entries(equipment.specifications).map(([key, value]) => (
              <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                <span className="font-medium text-gray-800 capitalize">{key}:</span>
                <span className="text-gray-600">{value}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="text-center text-gray-500 py-8">
            Đánh giá sẽ được hiển thị ở đây
          </div>
        )}

        {activeTab === 'rental-info' && (
          <div className="text-center text-gray-500 py-8">
            Thông tin cho thuê sẽ được hiển thị ở đây
          </div>
        )}
      </div>
    </div>
  );
};
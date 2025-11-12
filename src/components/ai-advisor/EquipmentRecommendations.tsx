'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/store/slices/cartSlice';
import { showToast } from '@/components/atoms/ui/Toast';

interface Equipment {
  equipmentId: number;
  equipmentName: string;
  price: number;
  image?: string;
  features: string[];
  category: string;
}

interface RecommendationSection {
  title: string;
  icon: string;
  items: Equipment[];
}

interface EquipmentRecommendationsProps {
  recommendations: RecommendationSection[];
  onAddToCart?: (equipmentId: number) => void;
}

export default function EquipmentRecommendations({ 
  recommendations,
  onAddToCart 
}: EquipmentRecommendationsProps) {
  
  const dispatch = useDispatch();
  
  // State để track carousel page cho mỗi section
  const [carouselPages, setCarouselPages] = useState<Record<number, number>>({});

  const handleAddToCart = (item: Equipment) => {
    // If parent provides onAddToCart, use it
    if (onAddToCart) {
      onAddToCart(item.equipmentId);
      return;
    }
    
    // Otherwise, dispatch to Redux directly
    try {
      dispatch(addToCart({
        equipmentId: item.equipmentId,
        name: item.equipmentName,
        pricePerDay: item.price,
        depositFee: 0,
        imageUrl: item.image || null,
        brand: null,
        category: item.category,
        quantity: 1,
        rentalStartDate: null,
        rentalEndDate: null,
        totalDays: 1,
      }));
      
      showToast({
        type: 'success',
        title: 'Đã thêm vào giỏ hàng',
        message: `${item.equipmentName} đã được thêm vào giỏ hàng`,
        duration: 3000,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      showToast({
        type: 'error',
        title: 'Lỗi',
        message: 'Không thể thêm sản phẩm vào giỏ hàng',
        duration: 3000,
      });
    }
  };

  const handleCarouselPage = (sectionIdx: number, pageIdx: number) => {
    setCarouselPages(prev => ({
      ...prev,
      [sectionIdx]: pageIdx
    }));
  };

  const getCurrentPage = (sectionIdx: number) => {
    return carouselPages[sectionIdx] || 0;
  };

  return (
    <div className="space-y-8">
      {recommendations.map((section, sectionIdx) => {
        const itemsPerPage = 2;
        const totalPages = Math.ceil(section.items.length / itemsPerPage);
        const currentPage = getCurrentPage(sectionIdx);
        const startIdx = currentPage * itemsPerPage;
        const endIdx = startIdx + itemsPerPage;
        const visibleItems = section.items.slice(startIdx, endIdx);
        const hasMultiplePages = totalPages > 1;

        return (
          <div key={sectionIdx} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 shadow-sm border border-blue-100">
            {/* Header with item count */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <span className="text-2xl">{section.icon}</span>
                {section.title}
              </h3>
              <span className="px-3 py-1 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm border border-gray-200">
                {section.items.length} thiết bị
              </span>
            </div>
            
            {/* Carousel Container */}
            <div className="relative">
              {/* Navigation Arrows - Show if more than 2 items */}
              {hasMultiplePages && (
                <>
                  {/* Left Arrow */}
                  <button
                    onClick={() => handleCarouselPage(sectionIdx, Math.max(0, currentPage - 1))}
                    disabled={currentPage === 0}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-all hover:shadow-xl border border-gray-200"
                    aria-label="Previous"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-gray-700">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                  </button>

                  {/* Right Arrow */}
                  <button
                    onClick={() => handleCarouselPage(sectionIdx, Math.min(totalPages - 1, currentPage + 1))}
                    disabled={currentPage === totalPages - 1}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-all hover:shadow-xl border border-gray-200"
                    aria-label="Next"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-gray-700">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                </>
              )}

              {/* Items Grid with Animation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[200px]">
                {visibleItems.map((item, idx) => (
                  <div 
                    key={item.equipmentId} 
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 animate-fadeIn"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <div className="flex gap-4 p-4">
                      {/* Equipment Image */}
                      <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden border border-gray-200">
                        {item.image ? (
                          <Image 
                            src={item.image} 
                            alt={item.equipmentName}
                            width={96}
                            height={96}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <span className="text-4xl">📷</span>
                        )}
                      </div>

                      {/* Equipment Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate mb-1 hover:text-blue-600 transition-colors">
                          {item.equipmentName}
                        </h4>
                        <p className="text-lg font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent mb-2">
                          {item.price.toLocaleString('vi-VN')}₫/ngày
                        </p>
                        <div className="text-xs text-gray-600 mb-3 space-y-0.5">
                          {item.features.slice(0, 2).map((feature, featureIdx) => (
                            <div key={featureIdx} className="flex items-start gap-1.5">
                              <span className="text-blue-500 mt-0.5 font-bold">•</span>
                              <span className="truncate">{feature}</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Link 
                            href={`/rental/${item.equipmentId}`}
                            className="flex-1 text-xs px-3 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-all font-medium text-center hover:border-blue-700"
                          >
                            Chi tiết
                          </Link>
                          <button
                            onClick={() => handleAddToCart(item)}
                            className="flex-1 text-xs px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm hover:shadow-md font-medium"
                          >
                            + Thêm
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination Controls - Show if more than 2 items */}
            {hasMultiplePages && (
              <div className="flex items-center justify-center gap-4 mt-6 bg-white rounded-lg py-3 px-4 shadow-sm border border-gray-200">
                {/* Page Info */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Trang</span>
                  <span className="text-sm font-bold text-gray-900 bg-blue-100 px-2 py-1 rounded">
                    {currentPage + 1}
                  </span>
                  <span className="text-sm text-gray-500">/ {totalPages}</span>
                </div>
                
                {/* Dots Navigation */}
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleCarouselPage(sectionIdx, idx)}
                      className={`h-2 rounded-full transition-all ${
                        idx === currentPage 
                          ? 'w-8 bg-gradient-to-r from-blue-600 to-blue-700 shadow-sm' 
                          : 'w-2 bg-gray-300 hover:bg-gray-400'
                      }`}
                      aria-label={`Go to page ${idx + 1}`}
                    />
                  ))}
                </div>

                {/* Item Range Info */}
                <span className="text-xs text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                  {startIdx + 1}-{Math.min(endIdx, section.items.length)} / {section.items.length} thiết bị
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/organisms/Header';
import { EquipmentCard } from '@/components/molecules/landing';
import Button from '@/components/atoms/Button';

interface Equipment {
  id: string;
  name: string;
  image: string;
  price: string;
  features: string[];
  category: string;
  available: boolean;
}

export default function PublicEquipmentPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(category || 'all');

  // Mock data - replace with actual API call
  const mockEquipment: Equipment[] = [
    {
      id: '1',
      name: 'Canon EOS R5',
      image: 'https://martinbaileyphotography.com/wp-content/uploads/2020/08/MBP_EOS_R5_20200807_MR27178.jpg',
      price: '500.000đ/ngày',
      features: ['45MP Full Frame CMOS', '8K RAW Video Recording', 'In-Body Image Stabilization'],
      category: 'camera',
      available: true,
    },
    {
      id: '2',
      name: 'Sony Alpha A7III',
      image: 'https://cms.dailysocial.id/wp-content/uploads/2018/10/4f273f89a486377f47838fde791b2ad9_Review-Sony-Alpha-A7-III-17.jpg',
      price: '450.000đ/ngày',
      features: ['24.2MP Full Frame BSI CMOS', '4K Video, 5-Axis Stabilization', '693-Point AF System'],
      category: 'camera',
      available: true,
    },
    {
      id: '3',
      name: 'Canon RF 24-70mm f/2.8L',
      image: 'https://cloudfront.slrlounge.com/wp-content/uploads/2020/03/SLR_LOUNGE_Canon_RF_24-70_Review-8938.jpg',
      price: '300.000đ/ngày',
      features: ['Standard Zoom Lens', 'Image Stabilization', 'Dust and Water Resistant'],
      category: 'lens',
      available: true,
    },
    {
      id: '4',
      name: 'Canon EF 70-200mm f/2.8L IS III',
      image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=300&fit=crop&q=80',
      price: '350.000đ/ngày',
      features: ['Telephoto Zoom Lens', 'Image Stabilization', 'Weather Sealed'],
      category: 'lens',
      available: true,
    },
    {
      id: '5',
      name: 'Godox SL-60W LED Light',
      image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop&q=80',
      price: '150.000đ/ngày',
      features: ['60W LED Light', 'Color Temperature Control', 'Dimmable'],
      category: 'lighting',
      available: true,
    },
    {
      id: '6',
      name: 'Manfrotto MT055XPRO3 Tripod',
      image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=300&fit=crop&q=80',
      price: '100.000đ/ngày',
      features: ['Carbon Fiber', '3-Way Head', 'Load Capacity 8kg'],
      category: 'tripod',
      available: true,
    },
    {
      id: '7',
      name: 'Nikon D850',
      image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop&q=80',
      price: '480.000đ/ngày',
      features: ['45.7MP Full Frame', '4K Video', '153-Point AF'],
      category: 'camera',
      available: true,
    },
    {
      id: '8',
      name: 'Sony FE 85mm f/1.4 GM',
      image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=300&fit=crop&q=80',
      price: '280.000đ/ngày',
      features: ['Portrait Lens', 'f/1.4 Aperture', 'G Master Series'],
      category: 'lens',
      available: true,
    },
    {
      id: '9',
      name: 'Aputure Light Storm LS 300X',
      image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop&q=80',
      price: '200.000đ/ngày',
      features: ['300W LED Light', 'Wireless Control', 'Color Temperature'],
      category: 'lighting',
      available: true,
    },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setEquipment(mockEquipment);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredEquipment = selectedCategory === 'all' 
    ? equipment 
    : equipment.filter(item => item.category === selectedCategory);

  const categories = [
    { id: 'all', name: 'Tất cả', count: equipment.length },
    { id: 'camera', name: 'Máy ảnh', count: equipment.filter(e => e.category === 'camera').length },
    { id: 'lens', name: 'Ống kính', count: equipment.filter(e => e.category === 'lens').length },
    { id: 'lighting', name: 'Đèn chiếu sáng', count: equipment.filter(e => e.category === 'lighting').length },
    { id: 'tripod', name: 'Chân máy', count: equipment.filter(e => e.category === 'tripod').length },
    { id: 'accessories', name: 'Phụ kiện', count: equipment.filter(e => e.category === 'accessories').length },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Thiết bị nhiếp ảnh
          </h1>
          <p className="text-gray-600">
            Khám phá bộ sưu tập thiết bị nhiếp ảnh chuyên nghiệp của chúng tôi
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Category Filter */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Danh mục
              </h3>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      selectedCategory === cat.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {cat.name} ({cat.count})
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {/* Results Header */}
                <div className="flex items-center justify-between mb-6">
                  <p className="text-gray-600">
                    Hiển thị {filteredEquipment.length} sản phẩm
                    {selectedCategory !== 'all' && (
                      <span className="ml-1">
                        trong danh mục "{categories.find(c => c.id === selectedCategory)?.name}"
                      </span>
                    )}
                  </p>
                </div>

                {/* Equipment Grid */}
                {filteredEquipment.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEquipment.map((item) => (
                      <EquipmentCard
                        key={item.id}
                        name={item.name}
                        image={item.image}
                        features={item.features}
                        price={item.price}
                        rentButtonText="Thuê ngay"
                        onRentClick={() => {
                          // Handle rent action
                          console.log('Rent equipment:', item.id);
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">📷</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Không tìm thấy thiết bị
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Không có thiết bị nào trong danh mục này.
                    </p>
                    <Button
                      onClick={() => setSelectedCategory('all')}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Xem tất cả thiết bị
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Debug: Footer should be visible */}
      <div className="bg-red-500 text-white py-4 text-center font-bold">
        🚨 FOOTER DEBUG - Nếu bạn thấy dòng này thì footer đang hoạt động! 🚨
      </div>

      {/* Footer - Simple and Visible */}
      <div className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Nova Camera</h3>
            <p className="text-gray-300 mb-4">
              Chuyên cho thuê thiết bị nhiếp ảnh và quay phim chất lượng cao
            </p>
            <div className="flex justify-center space-x-8 mb-6">
              <span className="text-gray-300">Cho thuê thiết bị</span>
              <span className="text-gray-300">Tư vấn nhiếp ảnh</span>
              <span className="text-gray-300">Khóa học</span>
              <span className="text-gray-300">Bảo trì</span>
            </div>
            <div className="border-t border-gray-700 pt-4">
              <p className="text-gray-400">© 2025 Nova Camera, Inc. Bảo lưu mọi quyền.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

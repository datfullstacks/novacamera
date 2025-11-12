'use client';

import React from 'react';
import { EquipmentCard } from '@/components/molecules/landing';
import type { EquipmentCardProps } from '@/components/molecules/landing/EquipmentCard';
import { landingColors } from '@/styles/landing-theme';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/store/slices/cartSlice';
import { showToast } from '@/components/atoms/ui/Toast';
import { useRouter } from 'next/navigation';

export interface FeaturedEquipmentSectionProps {
  title: string;
  equipment: (Omit<EquipmentCardProps, 'className'> & { 
    equipmentId?: number;
    pricePerDay?: number;
    depositFee?: number;
    brand?: string;
    category?: string;
  })[];
  rentButtonText?: string;
  className?: string;
}

export const FeaturedEquipmentSection: React.FC<FeaturedEquipmentSectionProps> = ({
  title,
  equipment,
  rentButtonText = 'Mua ngay',
  className = '',
}) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleAddToCart = (item: typeof equipment[0]) => {
    // If equipmentId exists, use real data
    if (item.equipmentId) {
      try {
        dispatch(addToCart({
          equipmentId: item.equipmentId,
          name: item.name,
          pricePerDay: item.pricePerDay || 0,
          depositFee: item.depositFee || 0,
          imageUrl: item.image || null,
          brand: item.brand || null,
          category: item.category || null,
          quantity: 1,
          rentalStartDate: null,
          rentalEndDate: null,
          totalDays: 1,
        }));
        
        showToast({
          type: 'success',
          title: 'Đã thêm vào giỏ hàng',
          message: `${item.name} đã được thêm vào giỏ hàng`,
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
    } else {
      // Fallback for mock data without equipmentId
      showToast({
        type: 'info',
        title: 'Demo',
        message: 'Đây là dữ liệu mẫu. Vui lòng truy cập trang Rental để xem sản phẩm thật.',
        duration: 3000,
      });
      router.push('/rental');
    }
  };
  return (
    <section
      className={className}
      style={{
        width: '100%',        
        margin: '0 auto',
        padding: '60px 0',
        background: landingColors.primary.lightGray,
      }}
    >
      {/* Section title with underline */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: 60,
        }}
      >
        <h2
          style={{
            textAlign: 'center',
            color: landingColors.primary.navy,
            fontSize: 31.88,
            fontFamily: 'Segoe UI',
            fontWeight: 700,
            lineHeight: '51px',
            margin: 0,
          }}
        >
          {title}
        </h2>
        <div
          style={{
            width: 80,
            height: 3,
            background: landingColors.primary.red,
            marginTop: 10,
          }}
        />
      </div>
      
      {/* Equipment grid */}
      <div
        style={{
          display: 'flex',
          gap: 30,
          justifyContent: 'center',
          flexWrap: 'wrap',
          padding: '0 20px',
        }}
      >
        {equipment.map((item, index) => (
          <EquipmentCard
            key={index}
            name={item.name}
            image={item.image}
            features={item.features}
            price={item.price}
            rentButtonText={rentButtonText}
            onRentClick={() => handleAddToCart(item)}
          />
        ))}
      </div>
    </section>
  );
};

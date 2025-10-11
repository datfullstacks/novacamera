'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { addToCart } from '@/store/slices/cartSlice';
import { Equipment } from '@/types';
import { Button } from '@/components/ui/button';
import { 
  ProductImageGallery, 
  BasicProductInfo, 
  RentalCalendar,
  PriceCalculator 
} from '../../molecules/product';

export interface ProductDetailMainProps {
  equipment: Equipment;
  className?: string;
}

export const ProductDetailMain: React.FC<ProductDetailMainProps> = ({
  equipment,
  className = '',
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [rentalDays, setRentalDays] = useState(3);
  const [selectedDates, setSelectedDates] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null
  });

  const handleAddToCart = () => {
    const cartItem = {
      id: equipment.id.toString(),
      name: equipment.name,
      dailyRate: equipment.dailyRate,
      quantity: 1,
      rentalDays: rentalDays,
      imageUrl: equipment.images[0]?.url || '',
      description: equipment.description,
    };
    
    dispatch(addToCart(cartItem));
    alert('Sản phẩm đã được thêm vào giỏ hàng!');
  };

  const handleRentNow = () => {
    handleAddToCart();
    router.push('/cart');
  };

  const handleDateSelect = (dates: { start: Date | null; end: Date | null }) => {
    setSelectedDates(dates);
    if (dates.start && dates.end) {
      const diffTime = Math.abs(dates.end.getTime() - dates.start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setRentalDays(diffDays);
    }
  };

  const discountPrice = 50000; // Mock discount

  return (
    <div className={`bg-white rounded-lg shadow-sm p-8 ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <ProductImageGallery
          images={equipment.images}
          selectedIndex={selectedImageIndex}
          onImageSelect={setSelectedImageIndex}
        />

        {/* Product Info */}
        <div className="space-y-6">
          <BasicProductInfo equipment={equipment} />

          {/* Rental Calendar Card */}
          <div className="space-y-4">
            <RentalCalendar 
              onDateSelect={handleDateSelect}
            />

            {/* Price Breakdown */}
            <PriceCalculator
              dailyRate={equipment.dailyRate}
              rentalDays={rentalDays}
              discountAmount={discountPrice}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={handleRentNow}
              className="flex-1 bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-md text-xl"
            >
              Thuê ngay
            </Button>
            <Button
              onClick={handleAddToCart}
              variant="outline"
              className="flex-1 border-gray-900 text-gray-900 hover:bg-gray-50 py-3 rounded-md"
            >
              Thêm vào giỏ hàng
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
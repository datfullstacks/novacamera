'use client';

import React from 'react';
import { Equipment } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingCart, Plus, Minus, Calendar } from 'lucide-react';

interface ProductActionsProps {
  equipment: Equipment;
  quantityInCart: number;
  rentalDays: number;
  isAvailable: boolean;
  onAddToCart: () => void;
  onUpdateQuantity: (quantity: number) => void;
  onRentalDaysChange: (days: number) => void;
}

export const ProductActions: React.FC<ProductActionsProps> = ({
  equipment,
  quantityInCart,
  rentalDays,
  isAvailable,
  onAddToCart,
  onUpdateQuantity,
  onRentalDaysChange,
}) => {
  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        {/* Rental Days Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="inline h-4 w-4 mr-1" />
            Số ngày thuê
          </label>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => rentalDays > 1 && onRentalDaysChange(rentalDays - 1)}
              disabled={rentalDays <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-12 text-center font-medium">{rentalDays}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onRentalDaysChange(rentalDays + 1)}
              disabled={rentalDays >= 30}
            >
              <Plus className="h-4 w-4" />
            </Button>
            <span className="text-sm text-gray-500 ml-2">ngày</span>
          </div>
        </div>

        {/* Quantity in Cart */}
        {quantityInCart > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số lượng trong giỏ
            </label>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onUpdateQuantity(quantityInCart - 1)}
                disabled={quantityInCart <= 0}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center font-medium">{quantityInCart}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onUpdateQuantity(quantityInCart + 1)}
                disabled={quantityInCart >= equipment.availableQuantity}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={onAddToCart}
            disabled={!isAvailable}
            className={`w-full h-12 text-lg font-semibold ${
              isAvailable 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-400 text-gray-600 cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            {isAvailable ? 'Thêm vào giỏ hàng' : 'Hết hàng'}
          </Button>

          <Button
            variant="outline"
            className="w-full h-12 text-lg"
            onClick={() => {
              onAddToCart();
              // Navigate to checkout page
              window.location.href = '/checkout';
            }}
            disabled={!isAvailable}
          >
            Thuê ngay
          </Button>
        </div>

        {/* Additional Info */}
        <div className="pt-4 border-t border-gray-200">
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Miễn phí giao hàng:</span>
              <span className="font-medium">TP.HCM & Hà Nội</span>
            </div>
            <div className="flex justify-between">
              <span>Bảo hiểm thiết bị:</span>
              <span className="font-medium">Được bảo vệ 100%</span>
            </div>
            <div className="flex justify-between">
              <span>Hỗ trợ 24/7:</span>
              <span className="font-medium">Hotline: 1900-xxxx</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
import React, { useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import { Button } from '@/components/ui/button';

interface CartSummaryProps {
  onProceedToCheckout?: () => void;
  onContinueShopping?: () => void;
  isLoading?: boolean;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  onProceedToCheckout,
  onContinueShopping,
  isLoading = false,
}) => {
  const { items, totalItems, totalPrice } = useAppSelector((state) => state.cart);
  const [discountCode, setDiscountCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const insuranceFee = 0; // Có thể tính toán dựa trên giá trị đơn hàng
  const shippingFee = 0; // Có thể tính toán dựa trên địa chỉ
  
  const finalTotal = totalPrice - discount + insuranceFee + shippingFee;

  const handleApplyDiscount = () => {
    // Logic áp dụng mã giảm giá
    if (discountCode.toLowerCase() === 'save10') {
      setDiscount(totalPrice * 0.1);
    } else {
      setDiscount(0);
    }
  };

  const handleProceedToCheckout = () => {
    onProceedToCheckout?.();
    // Redirect to checkout page
  };

  const handleContinueShopping = () => {
    onContinueShopping?.();
    // Close cart or redirect to products page
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 h-fit">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Tóm tắt đặt hàng
        </h2>
      </div>

      {/* Order Details */}
      <div className="space-y-4 mb-6">
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Mặt hàng</span>
          <span className="text-base font-medium text-gray-800">
            {totalItems}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Ngày cho thuê</span>
          <span className="text-base font-medium text-gray-800">
            {items.reduce((total, item) => Math.max(total, item.rentalDays), 0)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Tổng số tiền</span>
          <span className="text-sm font-medium text-gray-800">
            {totalPrice.toLocaleString('vi-VN')}đ
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Bảo hiểm thiết bị</span>
          <span className="text-xs font-medium text-gray-800">
            {insuranceFee.toLocaleString('vi-VN')}đ
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-base text-gray-500">Vận chuyển</span>
          <span className="text-sm font-medium text-gray-800">
            {shippingFee.toLocaleString('vi-VN')}đ
          </span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span className="text-sm">Giảm giá</span>
            <span className="text-sm font-medium">
              -{discount.toLocaleString('vi-VN')}đ
            </span>
          </div>
        )}
      </div>

      {/* Discount Code */}
      <div className="mb-6">
        <div className="flex">
          <input
            type="text"
            placeholder="Mã giảm giá"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
            className="flex-1 px-3 py-3 text-xs border border-gray-200 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Button
            onClick={handleApplyDiscount}
            className="px-4 py-3 bg-gray-800 text-white text-xs font-medium rounded-r-xl hover:bg-gray-700"
          >
            Áp dụng
          </Button>
        </div>
      </div>

      {/* Total */}
      <div className="border-t border-gray-200 pt-4 mb-6">
        <div className="flex justify-between">
          <span className="text-lg font-bold text-gray-800">Tổng cộng</span>
          <span className="text-base font-bold text-gray-800">
            {finalTotal.toLocaleString('vi-VN')}đ
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          onClick={handleProceedToCheckout}
          className="w-full py-4 bg-zinc-900 text-white text-xs font-bold rounded-xl hover:bg-zinc-800 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={items.length === 0 || isLoading}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Đang xử lý...
            </>
          ) : (
            <>
              Tiến hành thanh toán
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </>
          )}
        </Button>

        <Button
          onClick={handleContinueShopping}
          variant="outline"
          className="w-full py-3 text-gray-800 text-xs font-medium border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50"
          disabled={isLoading}
        >
          Tiếp tục mua sắm
        </Button>
      </div>
    </div>
  );
};
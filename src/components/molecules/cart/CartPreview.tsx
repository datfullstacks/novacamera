'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { removeFromCart, updateQuantity, clearCart } from '@/store/slices/cartSlice';
import { ShoppingCart, X, Trash2, Plus, Minus } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export const CartPreview: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const { items, totalItems, totalPrice } = useAppSelector((state) => state.cart);

  const handleTogglePreview = () => {
    setIsOpen(!isOpen);
  };

  const handleGoToCart = () => {
    setIsOpen(false);
    router.push('/cart');
  };

  const handleRemoveItem = (itemId: string) => {
    dispatch(removeFromCart(itemId));
  };

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      dispatch(removeFromCart(itemId));
    } else {
      dispatch(updateQuantity({ id: itemId, quantity: newQuantity }));
    }
  };

  const handleCheckout = () => {
    setIsOpen(false);
    router.push('/cart');
  };

  return (
    <div className="relative">
      {/* Cart Icon Button */}
      <button
        onClick={handleTogglePreview}
        className="relative p-2 text-black hover:text-gray-700 transition-colors"
      >
        <ShoppingCart className="w-6 h-6" />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-black text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {totalItems > 99 ? '99+' : totalItems}
          </span>
        )}
      </button>

      {/* Cart Preview Dropdown */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Panel */}
          <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-50">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">
                  Giỏ hàng ({totalItems})
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Cart Items or Empty State */}
            {items.length === 0 ? (
              <div className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <ShoppingCart className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600 mb-4">Giỏ hàng của bạn đang trống</p>
                <Button
                  onClick={() => {
                    setIsOpen(false);
                    router.push('/rental');
                  }}
                  className="w-full"
                >
                  Khám phá thiết bị
                </Button>
              </div>
            ) : (
              <>
                {/* Cart Items List */}
                <div className="max-h-80 overflow-y-auto">
                  {items.slice(0, 3).map((item) => (
                    <div key={item.id} className="p-4 border-b border-gray-100 last:border-b-0">
                      <div className="flex gap-3">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 relative bg-gray-100 rounded-lg overflow-hidden">
                            <Image
                              src={item.imageUrl || '/images/placeholder.jpg'}
                              alt={item.name}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          </div>
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-800 truncate">
                            {item.name}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            {(item.dailyRate || item.price || 0).toLocaleString('vi-VN')}đ/ngày × {item.rentalDays} ngày
                          </p>
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-gray-500">SL:</span>
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                            >
                              <Minus className="w-3 h-3 text-gray-600" />
                            </button>
                            <span className="text-xs font-medium text-gray-800 w-6 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                            >
                              <Plus className="w-3 h-3 text-gray-600" />
                            </button>
                          </div>
                          
                          <p className="text-sm font-medium text-gray-800 mt-1">
                            {((item.dailyRate || item.price || 0) * item.quantity * item.rentalDays).toLocaleString('vi-VN')}đ
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex-shrink-0 flex flex-col gap-1">
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Show more items indicator */}
                  {items.length > 3 && (
                    <div className="p-3 text-center text-sm text-gray-500 border-b border-gray-100">
                      và {items.length - 3} sản phẩm khác...
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="p-4 bg-gray-50 rounded-b-xl">
                  {/* Total */}
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-600">Tổng cộng:</span>
                    <span className="text-lg font-bold text-gray-800">
                      {(totalPrice || 0).toLocaleString('vi-VN')}đ
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <Button
                      onClick={handleCheckout}
                      className="w-full bg-zinc-900 hover:bg-zinc-800"
                    >
                      Thanh toán
                    </Button>
                    <Button
                      onClick={handleGoToCart}
                      variant="outline"
                      className="w-full"
                    >
                      Xem giỏ hàng
                    </Button>
                    <Button
                      onClick={() => dispatch(clearCart())}
                      variant="destructive"
                      className="w-full text-xs"
                    >
                      Clear Cart (Dev)
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};
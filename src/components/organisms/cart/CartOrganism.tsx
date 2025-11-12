'use client';

import React, { useState, useEffect } from 'react';
import { useAppSelector } from '@/store/hooks';
import { CartItem } from '@/components/molecules/cart/CartItem';
import { CartSummary } from '@/components/molecules/cart/CartSummary';
import { SavedItemsSection } from './SavedItemsSection';
import { useRouter } from 'next/navigation';
import { AlertTriangle, ShoppingCart } from 'lucide-react';
import { ConfirmModal } from '@/components/molecules/ConfirmModal';
import { getAuthDataFromCookies } from '@/lib/utils/cookies';

interface CartOrganismProps {
  onContinueShopping?: () => void;
}

export const CartOrganism: React.FC<CartOrganismProps> = ({
  onContinueShopping
}) => {
  const router = useRouter();
  const { items, totalItems } = useAppSelector((state) => state.cart);
  const authState = useAppSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [cookieData, setCookieData] = useState(() => getAuthDataFromCookies());

  // Update cookie data when auth state changes
  useEffect(() => {
    const data = getAuthDataFromCookies();
    setCookieData(data);
  }, [authState.isAuthenticated]);

  // Check both Redux and cookies for authentication
  const isAuthenticated = authState.isAuthenticated && cookieData.isAuthenticated;

  const handleProceedToCheckout = async () => {
    // Check authentication first (both Redux and cookies)
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call or validation
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.push('/checkout');
    } catch {
      setError('Có lỗi xảy ra khi chuyển đến trang thanh toán. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginConfirm = () => {
    router.push('/login?redirect=/checkout');
  };

  const handleContinueShopping = () => {
    if (onContinueShopping) {
      onContinueShopping();
    } else {
      router.push('/rental');
    }
  };

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-12 h-12 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Có lỗi xảy ra
              </h2>
              <p className="text-gray-600 mb-8">
                {error}
              </p>
              <button
                onClick={() => setError(null)}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Thử lại
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty Cart State
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-12 h-12 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Giỏ hàng của bạn đang trống
              </h2>
              <p className="text-gray-600 mb-8">
                Hãy thêm một số thiết bị tuyệt vời vào giỏ hàng của bạn
              </p>
              <button
                onClick={handleContinueShopping}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Khám phá thiết bị
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-8">
              <div className="mb-8">
                <h1 className="text-xl font-bold text-gray-800">
                  Giỏ hàng của bạn ({totalItems} mặt hàng)
                </h1>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-4">
              <div className="sticky top-8">
                <CartSummary 
                  onProceedToCheckout={handleProceedToCheckout}
                  onContinueShopping={handleContinueShopping}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </div>
          
          {/* Saved Items Section */}
          <SavedItemsSection />
        </div>
      </div>

      {/* Login Confirmation Modal */}
      <ConfirmModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onConfirm={handleLoginConfirm}
        title="Yêu cầu đăng nhập"
        message="Bạn cần đăng nhập để tiến hành thanh toán. Bạn có muốn chuyển đến trang đăng nhập không?"
        confirmText="Đăng nhập"
        cancelText="Hủy"
      />
    </div>
  );
};
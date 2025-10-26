'use client';

import React, { useState, useEffect } from 'react';
import { useAppSelector } from '@/store/hooks';
import { Button } from '@/components/ui/button';
import type { CustomerInfoDto, DeliveryInfoDto, PaymentInfoDto } from '@/types/api';

interface CheckoutFormProps {
  onSubmit: (data: {
    customerInfo: CustomerInfoDto;
    deliveryInfo: DeliveryInfoDto;
    paymentInfo: PaymentInfoDto;
    requireInsurance: boolean;
    couponCode?: string;
  }) => void;
  isLoading?: boolean;
  totalAmount: number;
  insuranceAmount?: number;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({
  onSubmit,
  isLoading = false,
  totalAmount,
  insuranceAmount = 400000,
}) => {
  const authState = useAppSelector((state) => state.auth);
  
  // Customer Info State - Initialize with user data if logged in
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');

  // Auto-fill user information from auth state
  useEffect(() => {
    if (authState.user) {
      setFullName(authState.user.fullName || '');
      setEmail(authState.user.email || '');
      // Phone number not available in auth state - user must enter manually
      // Note: Address fields may not be in user object, keep empty if not available
    }
  }, [authState.user]);

  // Delivery & Payment State
  const [deliveryMethod, setDeliveryMethod] = useState('StorePickup');
  const [paymentMethod, setPaymentMethod] = useState('QRCode');
  const [requireInsurance, setRequireInsurance] = useState(false);
  const [couponCode, setCouponCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const customerInfo: CustomerInfoDto = {
      fullName,
      email,
      phoneNumber,
      address,
      city,
      district,
      notes: ''
    };

    const deliveryInfo: DeliveryInfoDto = {
      deliveryMethod: deliveryMethod === 'StorePickup' ? '' : deliveryMethod,
      deliveryAddress: address,
      preferredDeliveryTime: null,
      deliveryNotes: ''
    };

    const paymentInfo: PaymentInfoDto = {
      paymentMethod,
      paidAmount: totalAmount + (requireInsurance ? insuranceAmount : 0),
      paymentReference: '',
      paymentNotes: '',
      isInstallment: false,
      depositAmount: 0,
      cardHolderName: '',
      maskedCardNumber: ''
    };

    onSubmit({
      customerInfo,
      deliveryInfo,
      paymentInfo,
      requireInsurance,
      couponCode: couponCode || undefined
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[709px] bg-white rounded-xl shadow-md p-6">
      {/* Customer Information */}
      <div className="mb-8 pb-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Thông tin khách hàng</h2>
        
        <div className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Tên đầy đủ
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nhập tên đầy đủ của bạn"
              required
              className="w-full h-11 px-4 text-base text-black bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-neutral-400"
            />
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email của bạn"
                required
                className="w-full h-11 px-4 text-base text-black bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-neutral-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Số điện thoại
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Nhập số điện thoại của bạn"
                required
                className="w-full h-11 px-4 text-base text-black bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-neutral-400"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs font-medium text-gray-800 mb-2">
              Địa chỉ
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Nhập địa chỉ của bạn"
              required
              className="w-full h-11 px-4 text-base text-black bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-neutral-400"
            />
          </div>

          {/* City & District */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-800 mb-2">
                Thành phố/Tỉnh
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Chọn thành phố"
                required
                className="w-full h-11 px-4 text-base text-black bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-neutral-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-800 mb-2">
                Huyện
              </label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="Chọn huyện"
                required
                className="w-full h-11 px-4 text-base text-black bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-neutral-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Options */}
      <div className="mb-8 pb-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Tùy chọn giao hàng</h2>
        
        <div className="space-y-3">
          <button
            type="button"
            disabled
            className="w-full h-12 px-4 rounded-md border text-left text-sm font-medium bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
          >
            <span className="ml-2">Giao hàng đến địa chỉ của bạn <span className="text-gray-400">(đang phát triển)</span></span>
          </button>
          
          <button
            type="button"
            onClick={() => setDeliveryMethod('StorePickup')}
            className={`w-full h-12 px-4 rounded-md border text-left text-sm font-medium transition-colors ${
              deliveryMethod === 'StorePickup'
                ? 'bg-blue-500/5 border-blue-500 text-gray-800'
                : 'bg-white border-gray-200 text-gray-800'
            }`}
          >
            <span className="ml-2">Nhận tại cửa hàng</span>
          </button>
        </div>
      </div>

      {/* Insurance */}
      <div className="mb-8">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={requireInsurance}
            onChange={(e) => setRequireInsurance(e.target.checked)}
            className="w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-base text-gray-800">
            Thêm bảo vệ thiết bị với giá {insuranceAmount.toLocaleString('vi-VN')}đ
          </span>
        </label>
      </div>

      {/* Payment Method */}
      <div className="mb-8 pb-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Phương thức thanh toán</h2>
        
        <div className="space-y-3">
          <button
            type="button"
            disabled
            className="w-full h-12 px-4 rounded-md border text-left text-sm font-medium bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
          >
            <span className="ml-2">Chuyển khoản ngân hàng <span className="text-gray-400">(đang phát triển)</span></span>
          </button>
          
          <button
            type="button"
            disabled
            className="w-full h-12 px-4 rounded-md border text-left text-sm font-medium bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
          >
            <span className="ml-2">Thẻ tín dụng/thẻ ghi nợ <span className="text-gray-400">(đang phát triển)</span></span>
          </button>
          
          <button
            type="button"
            onClick={() => setPaymentMethod('QRCode')}
            className={`w-full h-12 px-4 rounded-md border text-left text-sm font-medium transition-colors ${
              paymentMethod === 'QRCode'
                ? 'bg-blue-500/5 border-blue-500 text-gray-800'
                : 'bg-white border-gray-200 text-gray-800'
            }`}
          >
            <span className="ml-2">Mã QR (ví điện tử)</span>
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-12 bg-black text-white text-base font-bold rounded-lg hover:bg-gray-800 disabled:opacity-50"
      >
        {isLoading ? 'Đang xử lý...' : 'Hoàn tất đặt hàng'}
      </Button>
    </form>
  );
};

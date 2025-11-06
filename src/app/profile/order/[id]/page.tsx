'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import MainTemplate from '@/components/templates/MainTemplate';
import Image from 'next/image';
import { rentalService } from '@/lib/api/services/rental.service';
import { showToast } from '@/components/atoms/ui/Toast';
import type { RentalOrderResponse } from '@/types/api/order';

export default function UserOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id ? Number.parseInt(params.id as string) : null;

  const [order, setOrder] = useState<RentalOrderResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      if (!orderId) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await rentalService.getRentalOrder(orderId);
        
        if (response.data) {
          setOrder(response.data);
        }
      } catch (err) {
        console.error('Error fetching order detail:', err);
        setError('Không thể tải thông tin đơn hàng');
        showToast({
          type: 'error',
          title: 'Lỗi',
          message: 'Không thể tải thông tin đơn hàng',
          duration: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetail();
    }
  }, [orderId]);

  const getStatusBadge = (status: string) => {
    const badges = {
      Pending: { class: 'bg-yellow-100 text-yellow-700', label: 'Chờ xác nhận' },
      Confirmed: { class: 'bg-blue-100 text-blue-700', label: 'Đã xác nhận' },
      Rented: { class: 'bg-green-100 text-green-700', label: 'Đang thuê' },
      Completed: { class: 'bg-gray-100 text-gray-700', label: 'Hoàn thành' },
      Cancelled: { class: 'bg-red-100 text-red-700', label: 'Đã hủy' },
    };
    return badges[status as keyof typeof badges] || badges.Pending;
  };

  if (isLoading) {
    return (
      <MainTemplate>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
        </div>
      </MainTemplate>
    );
  }

  if (error || !order) {
    return (
      <MainTemplate>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 text-lg mb-4">{error || 'Không tìm thấy đơn hàng'}</p>
            <button
              onClick={() => router.push('/profile')}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Quay lại trang cá nhân
            </button>
          </div>
        </div>
      </MainTemplate>
    );
  }

  const statusBadge = getStatusBadge(order.status || 'Pending');

  return (
    <MainTemplate>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <button
                onClick={() => router.push('/profile')}
                className="text-gray-600 hover:text-gray-900 mb-2 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Quay lại
              </button>
              <h1 className="text-3xl font-bold text-gray-900">Chi tiết đơn hàng</h1>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Mã đơn hàng</p>
              <p className="text-xl font-semibold text-gray-900">#{order.referenceNo}</p>
            </div>
          </div>

          {/* Order Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-600 mb-1">Ngày đặt</p>
              <p className="text-lg font-semibold text-gray-900">
                {new Date(order.orderDate).toLocaleDateString('vi-VN')}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-600 mb-1">Tổng tiền</p>
              <p className="text-lg font-semibold text-blue-600">
                {order.totalAmount.toLocaleString('vi-VN')}đ
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-600 mb-1">Số thiết bị</p>
              <p className="text-lg font-semibold text-gray-900">
                {order.orderDetails.length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-600 mb-1">Trạng thái</p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${statusBadge.class}`}>
                {statusBadge.label}
              </span>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Order Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Equipment List */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Thiết bị thuê</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {order.orderDetails.map((item) => (
                      <div key={item.orderDetailId} className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                        <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                          {item.imageUrl ? (
                            <Image
                              src={item.imageUrl}
                              alt={item.equipmentName || 'Equipment'}
                              width={96}
                              height={96}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              No Image
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {item.equipmentName}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">{item.brand}</p>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-gray-600">Serial:</span>{' '}
                              <span className="font-medium">{item.serialNumber}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Giá thuê:</span>{' '}
                              <span className="font-medium text-blue-600">
                                {item.pricePerDay.toLocaleString('vi-VN')}đ/ngày
                              </span>
                            </div>
                            <div className="col-span-2">
                              <span className="text-gray-600">Thời gian:</span>{' '}
                              <span className="font-medium">
                                {new Date(item.rentalStartDate).toLocaleDateString('vi-VN')} -{' '}
                                {new Date(item.rentalEndDate).toLocaleDateString('vi-VN')}
                              </span>
                            </div>
                            {item.depositFee && item.depositFee > 0 && (
                              <div className="col-span-2">
                                <span className="text-gray-600">Đặt cọc:</span>{' '}
                                <span className="font-medium text-orange-600">
                                  {item.depositFee.toLocaleString('vi-VN')}đ
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Customer & Delivery Info */}
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Thông tin khách hàng</h2>
                </div>
                <div className="p-6 space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Họ tên</p>
                    <p className="font-medium text-gray-900">{order.customerInfo.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{order.customerInfo.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Số điện thoại</p>
                    <p className="font-medium text-gray-900">{order.customerInfo.phoneNumber}</p>
                  </div>
                  {order.customerInfo.address && (
                    <div>
                      <p className="text-sm text-gray-600">Địa chỉ</p>
                      <p className="font-medium text-gray-900">{order.customerInfo.address}</p>
                    </div>
                  )}
                  {order.customerInfo.district && (
                    <div>
                      <p className="text-sm text-gray-600">Quận/Huyện</p>
                      <p className="font-medium text-gray-900">{order.customerInfo.district}</p>
                    </div>
                  )}
                  {order.customerInfo.city && (
                    <div>
                      <p className="text-sm text-gray-600">Thành phố</p>
                      <p className="font-medium text-gray-900">{order.customerInfo.city}</p>
                    </div>
                  )}
                  {order.customerInfo.notes && (
                    <div>
                      <p className="text-sm text-gray-600">Ghi chú</p>
                      <p className="font-medium text-gray-900">{order.customerInfo.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Delivery Info */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Thông tin giao hàng</h2>
                </div>
                <div className="p-6 space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Phương thức</p>
                    <p className="font-medium text-gray-900">{order.deliveryInfo.deliveryMethod}</p>
                  </div>
                  {order.deliveryInfo.deliveryAddress && (
                    <div>
                      <p className="text-sm text-gray-600">Địa chỉ giao hàng</p>
                      <p className="font-medium text-gray-900">{order.deliveryInfo.deliveryAddress}</p>
                    </div>
                  )}
                  {order.deliveryInfo.preferredDeliveryTime && (
                    <div>
                      <p className="text-sm text-gray-600">Thời gian mong muốn</p>
                      <p className="font-medium text-gray-900">
                        {new Date(order.deliveryInfo.preferredDeliveryTime).toLocaleString('vi-VN')}
                      </p>
                    </div>
                  )}
                  {order.deliveryInfo.deliveryNotes && (
                    <div>
                      <p className="text-sm text-gray-600">Ghi chú giao hàng</p>
                      <p className="font-medium text-gray-900">{order.deliveryInfo.deliveryNotes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainTemplate>
  );
}

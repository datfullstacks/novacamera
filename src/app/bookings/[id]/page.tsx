'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import Image from 'next/image';
import { RootState } from '@/store';
import { ProtectedRoute } from '@/components/auth';
import DashboardTemplate from '@/components/templates/DashboardTemplate';
import { rentalService } from '@/lib/api/services';
import { showToast } from '@/components/atoms/ui/Toast';
import type { RentalOrderResponse } from '@/types/api';

export default function BookingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params?.id as string;
  const authState = useSelector((state: RootState) => state.auth);
  const [order, setOrder] = useState<RentalOrderResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Admin-only access check
  useEffect(() => {
    if (!authState.isAuthenticated) {
      return; // ProtectedRoute will handle redirect
    }

    if (authState.user?.roleId !== 1) {
      router.push('/');
      showToast({
        type: 'error',
        title: 'Truy cập bị từ chối',
        message: 'Chỉ quản trị viên mới có thể xem chi tiết đơn hàng',
        duration: 5000,
      });
    }
  }, [authState, router]);

  // Fetch order detail
  useEffect(() => {
    const fetchOrderDetail = async () => {
      if (!orderId || authState.user?.roleId !== 1) return;

      setIsLoading(true);
      try {
        const response = await rentalService.getRentalOrder(Number.parseInt(orderId, 10));
        
        if (response.statusCode === 200 && response.data) {
          setOrder(response.data);
        }
      } catch (error) {
        console.error('Error fetching order detail:', error);
        showToast({
          type: 'error',
          title: 'Lỗi tải dữ liệu',
          message: 'Không thể tải chi tiết đơn hàng',
          duration: 5000,
        });
        router.push('/bookings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetail();
  }, [orderId, authState.user?.roleId, router]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get status badge
  const getStatusBadge = (status: string | null) => {
    if (!status) return null;
    
    const statusConfig: Record<string, { label: string; className: string }> = {
      Pending: { label: 'Chờ xác nhận', className: 'bg-yellow-100 text-yellow-800' },
      Confirmed: { label: 'Đã xác nhận', className: 'bg-green-100 text-green-800' },
      Rented: { label: 'Đang thuê', className: 'bg-blue-100 text-blue-800' },
      Renting: { label: 'Đang thuê', className: 'bg-blue-100 text-blue-800' },
      Completed: { label: 'Đã hoàn thành', className: 'bg-gray-100 text-gray-800' },
      Cancelled: { label: 'Đã hủy', className: 'bg-red-100 text-red-800' },
    };

    const config = statusConfig[status] || { label: status, className: 'bg-gray-100 text-gray-800' };
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.className}`}>
        {config.label}
      </span>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <ProtectedRoute>
        <DashboardTemplate
          activeSidebarItem="bookings"
          onSidebarItemClick={(item) => {
            if (item === 'bookings') router.push('/bookings');
          }}
          activeView="platform"
          onViewChange={() => {}}
          userName="Admin"
          userRole="Quản trị viên nền tảng"
        >
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải chi tiết đơn hàng...</p>
            </div>
          </div>
        </DashboardTemplate>
      </ProtectedRoute>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <ProtectedRoute>
      <DashboardTemplate
        activeSidebarItem="bookings"
        onSidebarItemClick={(item) => {
          if (item === 'bookings') router.push('/bookings');
        }}
        activeView="platform"
        onViewChange={() => {}}
        userName="Admin"
        userRole="Quản trị viên nền tảng"
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => router.push('/bookings')}
                className="flex items-center text-gray-600 hover:text-gray-900 mb-2"
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Quay lại danh sách
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Chi tiết đơn hàng</h1>
              <p className="mt-1 text-sm text-gray-500">Mã đơn: {order.referenceNo || `#${order.orderId}`}</p>
            </div>
            <div>
              {getStatusBadge(order.status)}
            </div>
          </div>

          {/* Order Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-sm text-gray-500">Ngày đặt</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatDate(order.orderDate)}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-sm text-gray-500">Tổng tiền</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(order.totalAmount || 0)}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-sm text-gray-500">Số thiết bị</p>
              <p className="text-lg font-semibold text-gray-900">
                {order.orderDetails?.length || 0}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-sm text-gray-500">Trạng thái</p>
              <p className="text-lg font-semibold text-gray-900">
                {order.status}
              </p>
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin khách hàng</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Họ tên</p>
                <p className="text-base font-medium text-gray-900">{order.customerInfo?.fullName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-base font-medium text-gray-900">{order.customerInfo?.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Số điện thoại</p>
                <p className="text-base font-medium text-gray-900">{order.customerInfo?.phoneNumber || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Thành phố</p>
                <p className="text-base font-medium text-gray-900">{order.customerInfo?.city || 'N/A'}</p>
              </div>
              {order.customerInfo?.address && (
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Địa chỉ</p>
                  <p className="text-base font-medium text-gray-900">{order.customerInfo.address}</p>
                </div>
              )}
              {order.customerInfo?.notes && (
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Ghi chú</p>
                  <p className="text-base font-medium text-gray-900">{order.customerInfo.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Delivery Info */}
          {order.deliveryInfo && (order.deliveryInfo.deliveryMethod || order.deliveryInfo.deliveryAddress) && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin giao hàng</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {order.deliveryInfo.deliveryMethod && (
                  <div>
                    <p className="text-sm text-gray-500">Phương thức giao hàng</p>
                    <p className="text-base font-medium text-gray-900">{order.deliveryInfo.deliveryMethod}</p>
                  </div>
                )}
                {order.deliveryInfo.preferredDeliveryTime && (
                  <div>
                    <p className="text-sm text-gray-500">Thời gian giao hàng mong muốn</p>
                    <p className="text-base font-medium text-gray-900">
                      {formatDate(order.deliveryInfo.preferredDeliveryTime)}
                    </p>
                  </div>
                )}
                {order.deliveryInfo.deliveryAddress && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500">Địa chỉ giao hàng</p>
                    <p className="text-base font-medium text-gray-900">{order.deliveryInfo.deliveryAddress}</p>
                  </div>
                )}
                {order.deliveryInfo.deliveryNotes && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500">Ghi chú giao hàng</p>
                    <p className="text-base font-medium text-gray-900">{order.deliveryInfo.deliveryNotes}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Order Details */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Chi tiết thiết bị</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thiết bị
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Serial Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thời gian thuê
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Giá/ngày
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tiền cọc
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.orderDetails?.map((detail) => {
                    const startDate = new Date(detail.rentalStartDate).toLocaleDateString('vi-VN');
                    const endDate = new Date(detail.rentalEndDate).toLocaleDateString('vi-VN');
                    const days = Math.ceil(
                      (new Date(detail.rentalEndDate).getTime() - new Date(detail.rentalStartDate).getTime()) / 
                      (1000 * 60 * 60 * 24)
                    );

                    return (
                      <tr key={detail.orderDetailId}>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            {detail.imageUrl && (
                              <Image
                                src={detail.imageUrl}
                                alt={detail.equipmentName || 'Equipment'}
                                width={48}
                                height={48}
                                className="rounded object-cover mr-3"
                              />
                            )}
                            <div>
                              <p className="text-sm font-medium text-gray-900">{detail.equipmentName}</p>
                              <p className="text-sm text-gray-500">{detail.brand}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {detail.serialNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>
                            <p>{startDate} → {endDate}</p>
                            <p className="text-xs text-gray-500">({days} ngày)</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                          {formatCurrency(detail.pricePerDay || 0)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                          {formatCurrency(detail.depositFee || 0)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                      Tổng cộng:
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                      {formatCurrency(order.totalAmount || 0)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </DashboardTemplate>
    </ProtectedRoute>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { ProtectedRoute } from '@/components/auth';
import DashboardTemplate from '@/components/templates/DashboardTemplate';
import { rentalService } from '@/lib/api/services';
import { showToast } from '@/components/atoms/ui/Toast';
import type { RentalOrderResponse } from '@/types/api';

export default function BookingEditPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params?.id as string;
  const authState = useSelector((state: RootState) => state.auth);
  const [order, setOrder] = useState<RentalOrderResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<number>(0);
  const [note, setNote] = useState('');

  // Admin-only access check
  useEffect(() => {
    if (!authState.isAuthenticated) {
      return;
    }

    if (authState.user?.roleId !== 1) {
      router.push('/');
      showToast({
        type: 'error',
        title: 'Truy cập bị từ chối',
        message: 'Chỉ quản trị viên mới có thể chỉnh sửa đơn hàng',
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
          // Set current status
          const statusMap: Record<string, number> = {
            'Pending': 0,
            'Confirmed': 1,
            'Rented': 2,
            'Renting': 2,
            'Completed': 3,
            'Cancelled': 4,
          };
          const status = response.data.status;
          setSelectedStatus(status ? statusMap[status] || 0 : 0);
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

  // Get available status transitions
  const getAvailableStatuses = (currentStatus: string | null) => {
    if (!currentStatus) return [];

    const transitions: Record<string, Array<{ value: number; label: string; description: string }>> = {
      'Pending': [
        { value: 0, label: 'Chờ xác nhận', description: 'Trạng thái hiện tại' },
        { value: 1, label: 'Đã xác nhận', description: 'Xác nhận đơn hàng, reserve thiết bị' },
        { value: 4, label: 'Đã hủy', description: 'Hủy đơn hàng ngay từ đầu' },
      ],
      'Confirmed': [
        { value: 1, label: 'Đã xác nhận', description: 'Trạng thái hiện tại' },
        { value: 2, label: 'Đang thuê', description: 'Giao thiết bị cho khách, bắt đầu thuê' },
        { value: 4, label: 'Đã hủy', description: 'Hủy đơn hàng sau khi confirm (có thể có phí hủy)' },
      ],
      'Rented': [
        { value: 2, label: 'Đang thuê', description: 'Trạng thái hiện tại' },
        { value: 3, label: 'Đã hoàn thành', description: 'Khách trả thiết bị, hoàn thành đơn hàng' },
      ],
      'Renting': [
        { value: 2, label: 'Đang thuê', description: 'Trạng thái hiện tại' },
        { value: 3, label: 'Đã hoàn thành', description: 'Khách trả thiết bị, hoàn thành đơn hàng' },
      ],
      'Completed': [
        { value: 3, label: 'Đã hoàn thành', description: 'Trạng thái cuối, không thể chuyển đổi' },
      ],
      'Cancelled': [
        { value: 4, label: 'Đã hủy', description: 'Trạng thái cuối, không thể chuyển đổi' },
      ],
    };

    return transitions[currentStatus] || [];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!order) return;

    // Check if status changed
    const currentStatusValue = getAvailableStatuses(order.status).find(
      s => s.label.includes('hiện tại')
    )?.value;

    if (currentStatusValue === selectedStatus) {
      showToast({
        type: 'warning',
        title: 'Không có thay đổi',
        message: 'Trạng thái không thay đổi',
        duration: 3000,
      });
      return;
    }

    // Confirm action
    const statusLabels = ['Chờ xác nhận', 'Đã xác nhận', 'Đang thuê', 'Đã hoàn thành', 'Đã hủy'];
    const confirmMessage = `Bạn có chắc muốn chuyển trạng thái đơn hàng ${order.referenceNo || `#${order.orderId}`} sang "${statusLabels[selectedStatus]}"?`;
    
    if (!globalThis.confirm(confirmMessage)) return;

    try {
      setIsSaving(true);
      await rentalService.updateOrderStatus(Number.parseInt(orderId, 10), {
        status: selectedStatus,
        note: note || `Cập nhật trạng thái bởi admin`,
        updatedBy: authState.user?.email || 'admin',
      });

      showToast({
        type: 'success',
        title: 'Cập nhật thành công',
        message: `Trạng thái đơn hàng đã được cập nhật`,
        duration: 3000,
      });

      // Redirect back to detail page
      router.push(`/bookings/${orderId}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      showToast({
        type: 'error',
        title: 'Lỗi cập nhật',
        message: 'Không thể cập nhật trạng thái đơn hàng',
        duration: 5000,
      });
    } finally {
      setIsSaving(false);
    }
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
              <p className="text-gray-600">Đang tải thông tin đơn hàng...</p>
            </div>
          </div>
        </DashboardTemplate>
      </ProtectedRoute>
    );
  }

  if (!order) {
    return null;
  }

  const availableStatuses = getAvailableStatuses(order.status);
  const isReadOnly = order.status === 'Completed' || order.status === 'Cancelled';

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
                onClick={() => router.push(`/bookings/${orderId}`)}
                className="flex items-center text-gray-600 hover:text-gray-900 mb-2"
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Quay lại chi tiết
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa trạng thái đơn hàng</h1>
              <p className="mt-1 text-sm text-gray-500">
                Mã đơn: {order.referenceNo || `#${order.orderId}`}
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
            <div className="space-y-6">
              {/* Current Status Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">
                  ℹ️ Trạng thái hiện tại
                </h3>
                <p className="text-sm text-blue-800">
                  Đơn hàng đang ở trạng thái: <span className="font-semibold">{order.status}</span>
                </p>
              </div>

              {/* Status Selection */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Chuyển sang trạng thái *
                </label>
                {isReadOnly ? (
                  <div className="bg-gray-50 border border-gray-300 rounded-md p-4">
                    <p className="text-sm text-gray-700">
                      🔒 Đơn hàng đã ở trạng thái cuối ({order.status}), không thể thay đổi.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {availableStatuses.map((status) => (
                      <label
                        key={status.value}
                        className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                          selectedStatus === status.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        } ${status.label.includes('hiện tại') ? 'opacity-50' : ''}`}
                      >
                        <input
                          type="radio"
                          name="status"
                          value={status.value}
                          checked={selectedStatus === status.value}
                          onChange={(e) => setSelectedStatus(Number.parseInt(e.target.value, 10))}
                          disabled={status.label.includes('hiện tại')}
                          className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="ml-3 flex-1">
                          <div className="text-sm font-medium text-gray-900">
                            {status.label}
                          </div>
                          <div className="text-sm text-gray-500">
                            {status.description}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Note */}
              {!isReadOnly && (
                <div>
                  <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-2">
                    Ghi chú
                  </label>
                  <textarea
                    id="note"
                    rows={4}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Nhập ghi chú về việc thay đổi trạng thái (không bắt buộc)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Ghi chú sẽ được lưu lại trong lịch sử đơn hàng
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => router.push(`/bookings/${orderId}`)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Hủy
                </button>
                {!isReadOnly && (
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Đang lưu...
                      </>
                    ) : (
                      'Cập nhật trạng thái'
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>

          {/* Status Flow Info */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">📋 Quy trình chuyển đổi trạng thái</h2>
            <div className="space-y-3">
              <div className="flex items-start">
                <span className="text-yellow-600 mr-2">🟡</span>
                <div>
                  <span className="font-medium">Pending (Chờ xác nhận)</span>
                  <span className="mx-2">→</span>
                  <span className="text-gray-600">Confirmed hoặc Cancelled</span>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-green-600 mr-2">🟢</span>
                <div>
                  <span className="font-medium">Confirmed (Đã xác nhận)</span>
                  <span className="mx-2">→</span>
                  <span className="text-gray-600">Rented (giao thiết bị) hoặc Cancelled</span>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-blue-600 mr-2">🔵</span>
                <div>
                  <span className="font-medium">Rented (Đang thuê)</span>
                  <span className="mx-2">→</span>
                  <span className="text-gray-600">Completed (trả thiết bị)</span>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-gray-600 mr-2">⚪</span>
                <div>
                  <span className="font-medium">Completed/Cancelled</span>
                  <span className="mx-2">→</span>
                  <span className="text-gray-600">🔒 Trạng thái cuối, không thể chuyển</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardTemplate>
    </ProtectedRoute>
  );
}

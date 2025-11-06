'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { ProtectedRoute } from '@/components/auth';
import DashboardTemplate from '@/components/templates/DashboardTemplate';
import { BookingManagement } from '@/components/organisms/booking';
import { rentalService } from '@/lib/api/services';
import { showToast } from '@/components/atoms/ui/Toast';
import type { RentalOrderAdminFilterParams, RentalOrderResponse } from '@/types/api';

interface Booking {
  readonly id: string;
  readonly orderCode: string;
  readonly customerName: string;
  readonly equipment: string;
  readonly timeRange: string;
  readonly status: 'pending' | 'confirmed' | 'renting' | 'returned' | 'cancelled';
  readonly deliveryStatus: 'delivered' | 'not-delivered';
}

export default function BookingsPage() {
  const router = useRouter();
  const authState = useSelector((state: RootState) => state.auth);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<RentalOrderAdminFilterParams>({
    pageNumber: 1,
    pageSize: 10,
    sortBy: 'OrderDate',
    sortOrder: 'desc',
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    pageSize: 10,
  });

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
        message: 'Chỉ quản trị viên mới có thể xem đơn hàng',
        duration: 5000,
      });
    }
  }, [authState, router]);

  // Fetch bookings from API
  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      try {
        const response = await rentalService.getAdminRentalOrders(filters);
        
        if (response.statusCode === 200 && response.data) {
          // Transform API data to component format
          const transformedBookings = transformOrders(response.data.items || []);
          setBookings(transformedBookings);
          
          setPagination({
            currentPage: response.data.pageNumber || 1,
            totalPages: response.data.totalPage || 1,
            totalCount: response.data.totalCount || 0,
            pageSize: response.data.pageSize || 10,
          });
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
        showToast({
          type: 'error',
          title: 'Lỗi tải dữ liệu',
          message: 'Không thể tải danh sách đơn hàng',
          duration: 5000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (authState.user?.roleId === 1) {
      fetchBookings();
    }
  }, [filters, authState.user?.roleId]);

  // Transform API response to component format
  const transformOrders = (orders: RentalOrderResponse[]): Booking[] => {
    return orders.map((order) => {
      const firstDetail = order.orderDetails?.[0];
      const equipmentNames = order.orderDetails
        ?.map((d) => d.equipmentName)
        .join(', ') || 'N/A';
      
      const startDate = firstDetail?.rentalStartDate
        ? new Date(firstDetail.rentalStartDate).toLocaleDateString('vi-VN')
        : '';
      const endDate = firstDetail?.rentalEndDate
        ? new Date(firstDetail.rentalEndDate).toLocaleDateString('vi-VN')
        : '';
      
      const timeRange = startDate && endDate ? `${startDate} – ${endDate}` : 'N/A';
      
      // Map status
      const statusMap: Record<string, 'pending' | 'confirmed' | 'renting' | 'returned' | 'cancelled'> = {
        'Pending': 'pending',
        'Confirmed': 'confirmed',
        'Renting': 'renting',
        'Rented': 'renting',
        'Returned': 'returned',
        'Cancelled': 'cancelled',
        'Completed': 'returned',
      };
      
      return {
        id: order.orderId.toString(),
        orderCode: order.referenceNo || `#${order.orderId}`,
        customerName: order.customerInfo?.fullName || 'N/A',
        equipment: equipmentNames,
        timeRange,
        status: (order.status && statusMap[order.status]) || 'confirmed',
        deliveryStatus: 'delivered', // Default, can be enhanced
      };
    });
  };

  const handleViewBooking = (booking: Booking) => {
    router.push(`/bookings/${booking.id}`);
  };

  const handleEditBooking = (booking: Booking) => {
    console.log('Edit booking:', booking);
    router.push(`/bookings/${booking.id}/edit`);
  };

  const handleCancelBooking = async (booking: Booking) => {
    // Different handling for Pending vs Confirmed status
    if (booking.status === 'pending') {
      // Pending: Use cancel payment API
      const reason = globalThis.prompt(
        `Hủy thanh toán cho đơn hàng ${booking.orderCode}\n\nNhập lý do hủy:`,
        'Thanh toán thất bại hoặc timeout'
      );
      
      if (!reason) return; // User cancelled

      try {
        setIsLoading(true);
        await rentalService.cancelPayment(Number.parseInt(booking.id, 10), {
          reason: reason,
        });

        showToast({
          type: 'success',
          title: 'Hủy thanh toán thành công',
          message: `Đơn hàng ${booking.orderCode} đã được hủy do: ${reason}`,
          duration: 3000,
        });

        // Refresh data
        const response = await rentalService.getAdminRentalOrders(filters);
        if (response.statusCode === 200 && response.data) {
          const transformedBookings = transformOrders(response.data.items || []);
          setBookings(transformedBookings);
        }
      } catch (error) {
        console.error('Error cancelling payment:', error);
        showToast({
          type: 'error',
          title: 'Lỗi hủy thanh toán',
          message: 'Không thể hủy thanh toán. Vui lòng thử lại.',
          duration: 5000,
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      // Confirmed or other status: Use update status API
      const confirmCancel = globalThis.confirm(
        `Bạn có chắc muốn hủy đơn hàng ${booking.orderCode}?\n\nLưu ý: Đơn hàng đã hủy không thể khôi phục.`
      );
      
      if (!confirmCancel) return;

      try {
        setIsLoading(true);
        await rentalService.updateOrderStatus(Number.parseInt(booking.id, 10), {
          status: 4, // RentalOrderStatus.CANCELLED
          note: 'Đơn hàng bị hủy bởi admin',
          updatedBy: authState.user?.email || 'admin',
        });

        showToast({
          type: 'success',
          title: 'Hủy đơn hàng thành công',
          message: `Đơn hàng ${booking.orderCode} đã được hủy`,
          duration: 3000,
        });

        // Refresh data
        const response = await rentalService.getAdminRentalOrders(filters);
        if (response.statusCode === 200 && response.data) {
          const transformedBookings = transformOrders(response.data.items || []);
          setBookings(transformedBookings);
        }
      } catch (error) {
        console.error('Error cancelling booking:', error);
        showToast({
          type: 'error',
          title: 'Lỗi hủy đơn hàng',
          message: 'Không thể hủy đơn hàng. Vui lòng thử lại.',
          duration: 5000,
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDeliverBooking = async (booking: Booking) => {
    const confirmDeliver = globalThis.confirm(
      `Xác nhận giao thiết bị cho đơn hàng ${booking.orderCode}?\n\nTrạng thái sẽ chuyển sang "Đang thuê".`
    );
    
    if (!confirmDeliver) return;

    try {
      setIsLoading(true);
      await rentalService.updateOrderStatus(Number.parseInt(booking.id, 10), {
        status: 2, // RentalOrderStatus.RENTED
        note: 'Thiết bị đã được giao cho khách hàng',
        updatedBy: authState.user?.email || 'admin',
      });

      showToast({
        type: 'success',
        title: 'Giao thiết bị thành công',
        message: `Thiết bị đã được giao cho khách hàng. Đơn hàng ${booking.orderCode} đang thuê.`,
        duration: 3000,
      });

      // Refresh data
      const response = await rentalService.getAdminRentalOrders(filters);
      if (response.statusCode === 200 && response.data) {
        const transformedBookings = transformOrders(response.data.items || []);
        setBookings(transformedBookings);
      }
    } catch (error) {
      console.error('Error delivering booking:', error);
      showToast({
        type: 'error',
        title: 'Lỗi giao thiết bị',
        message: 'Không thể cập nhật trạng thái giao hàng. Vui lòng thử lại.',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReturnBooking = async (booking: Booking) => {
    const confirmReturn = globalThis.confirm(
      `Xác nhận khách hàng đã trả thiết bị cho đơn hàng ${booking.orderCode}?\n\nĐơn hàng sẽ hoàn thành.`
    );
    
    if (!confirmReturn) return;

    try {
      setIsLoading(true);
      await rentalService.updateOrderStatus(Number.parseInt(booking.id, 10), {
        status: 3, // RentalOrderStatus.COMPLETED
        note: 'Khách hàng đã trả thiết bị, đơn hàng hoàn thành',
        updatedBy: authState.user?.email || 'admin',
      });

      showToast({
        type: 'success',
        title: 'Hoàn thành đơn hàng',
        message: `Đơn hàng ${booking.orderCode} đã hoàn thành`,
        duration: 3000,
      });

      // Refresh data
      const response = await rentalService.getAdminRentalOrders(filters);
      if (response.statusCode === 200 && response.data) {
        const transformedBookings = transformOrders(response.data.items || []);
        setBookings(transformedBookings);
      }
    } catch (error) {
      console.error('Error returning booking:', error);
      showToast({
        type: 'error',
        title: 'Lỗi hoàn thành đơn hàng',
        message: 'Không thể cập nhật trạng thái trả hàng. Vui lòng thử lại.',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBooking = () => {
    console.log('Create booking clicked');
    router.push('/rental');
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, pageNumber: page });
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
          userName="Alex Morgan"
          userRole="Quản trị viên nền tảng"
        >
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải đơn hàng...</p>
            </div>
          </div>
        </DashboardTemplate>
      </ProtectedRoute>
    );
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
        userName="Alex Morgan"
        userRole="Quản trị viên nền tảng"
      >
        <BookingManagement
          bookings={bookings}
          onViewBooking={handleViewBooking}
          onEditBooking={handleEditBooking}
          onCancelBooking={handleCancelBooking}
          onDeliverBooking={handleDeliverBooking}
          onReturnBooking={handleReturnBooking}
          onCreateBooking={handleCreateBooking}
          pagination={{
            currentPage: pagination.currentPage,
            totalPages: pagination.totalPages,
            totalCount: pagination.totalCount,
            pageSize: pagination.pageSize,
            onPageChange: handlePageChange,
          }}
        />
      </DashboardTemplate>
    </ProtectedRoute>
  );
}

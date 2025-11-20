'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import DashboardTemplate from '@/components/templates/DashboardTemplate';
import { StatsGrid, ChartCard, EquipmentList, BookingList, MaintenanceList, RevenueChart } from '@/components/organisms/dashboard';
import { useDashboardSummary, useUpcomingRentals, useMonthlyRevenue, useDashboardPopularEquipment } from '@/lib/react-query/hooks';

export default function DashboardPage() {
  const router = useRouter();
  const authState = useSelector((state: RootState) => state.auth);
  const [activeSidebarItem, setActiveSidebarItem] = useState('dashboard');
  const [activeView, setActiveView] = useState('platform');

  // Fetch dashboard data from API (must be called before any returns)
  const { data: summaryData, isLoading: loadingSummary } = useDashboardSummary();
  const { data: upcomingData } = useUpcomingRentals();
  const { data: revenueData } = useMonthlyRevenue();
  const { data: popularEquipmentData } = useDashboardPopularEquipment();

  // Check if user is admin (roleId === 1)
  useEffect(() => {
    if (!authState.isAuthenticated) {
      // Not logged in - redirect to login
      router.push('/login?redirect=/dashboard');
      return;
    }

    if (authState.user?.roleId !== 1) {
      // Not admin - redirect to home with error message
      router.push('/?error=unauthorized');
      return;
    }
  }, [authState, router]);

  // If not authenticated or not admin, show loading (will redirect)
  if (!authState.isAuthenticated || authState.user?.roleId !== 1) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  const summary = summaryData?.data;

  // Transform monthly revenue data for chart
  const monthlyRevenueData = revenueData?.data ? Object.entries(revenueData.data).map(([month, revenue]) => ({
    month: `Tháng ${month}`,
    revenue: revenue,
  })) : [];

  // Transform API data to component format - simplified without change fields
  const stats = summary ? [
    {
      title: 'Tổng doanh thu',
      value: `${summary.totalRevenue?.toLocaleString('vi-VN')}₫` || 'N/A',
    },
    {
      title: 'Cho thuê tích cực',
      value: summary.activeRentals?.toString() || '0',
    },
    {
      title: 'Thiết bị có sẵn',
      value: summary.availableEquipments?.toString() || '0',
    },
    {
      title: 'Khách hàng mới',
      value: summary.newCustomers?.toString() || '0',
    },
  ] : [
    {
      title: 'Tổng doanh thu',
      value: loadingSummary ? 'Đang tải...' : '50.000.000đ',
    },
    {
      title: 'Cho thuê tích cực',
      value: loadingSummary ? 'Đang tải...' : '78',
    },
    {
      title: 'Thiết bị có sẵn',
      value: loadingSummary ? 'Đang tải...' : '142',
    },
    {
      title: 'Khách hàng mới',
      value: loadingSummary ? 'Đang tải...' : '36',
    },
  ];

  // Transform popular equipment data - fallback to mock data if API fails
  const equipment = (popularEquipmentData?.data && popularEquipmentData.data.length > 0)
    ? popularEquipmentData.data.map((item) => {
        const status: 'available' | 'rented' | 'maintenance' = 
          item.availabilityClass === 'available' ? 'available' : 
          item.availabilityClass === 'rented' ? 'rented' : 'maintenance';
        
        return {
          id: item.equipmentId.toString(),
          name: item.name || 'N/A',
          price: item.formattedPrice || '0₫',
          usage: '0%', // API không cung cấp usage data
          status,
          image: item.mainImageUrl || 'https://placehold.co/90x60',
        };
      })
    : [
        {
          id: '1',
          name: 'Sony Alpha A7III',
          price: '$ 85/ngày',
          usage: '92%',
          status: 'rented' as const,
          image: 'https://placehold.co/60x75',
        },
        {
          id: '2',
          name: 'Canon EOS R5',
          price: '$ 95/ngày',
          usage: '88%',
          status: 'available' as const,
          image: 'https://placehold.co/90x60',
        },
        {
          id: '3',
          name: 'Dji Ronin-s Gimbal',
          price: '$ 45/ngày',
          usage: '76%',
          status: 'maintenance' as const,
          image: 'https://placehold.co/90x60',
        },
        {
          id: '4',
          name: 'Nikon Z6 II',
          price: '$ 75/ngày',
          usage: '72%',
          status: 'available' as const,
        },
      ];

  // Transform upcoming rentals data - fallback to mock data if API fails
  const bookings = (upcomingData?.data && upcomingData.data.length > 0) 
    ? upcomingData.data.map((rental, index) => {
        const rentalDate = new Date(rental.rentalStartDate || '');
        return {
          id: `${rental.orderId || index}-${index}`, // Thêm index để đảm bảo unique key
          day: rentalDate.getDate(),
          month: rentalDate.toLocaleDateString('vi-VN', { month: 'short' }),
          customerName: rental.customerName || 'N/A',
          equipment: rental.equipmentName || 'N/A',
          time: `${new Date(rental.rentalStartDate || '').toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} - ${new Date(rental.rentalEndDate || '').toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`,
        };
      })
    : [
        {
          id: '1',
          day: 24,
          month: 'Jun',
          customerName: 'Sarah Johnson',
          equipment: 'Sony alpha a7iii + ống kính 24-70mm',
          time: '9:00 sáng - 6:00 tối',
        },
        {
          id: '2',
          day: 25,
          month: 'Jun',
          customerName: 'Michael Chen',
          equipment: 'Dji ronin-s gimbal + canon eos r5',
          time: '10:30 sáng - 5:30 chiều',
        },
      ];

  const maintenance = [
    {
      id: '1',
      equipmentName: 'Dji Ronin-s Gimbal',
      description: 'Hiệu chuẩn động cơ cần thiết',
      priority: 'urgent' as const,
      image: 'https://placehold.co/90x60',
    },
    {
      id: '2',
      equipmentName: 'Canon 70- 200mm f/2 . 8',
      description: 'Làm sạch yếu tố ống kính',
      priority: 'scheduled' as const,
      image: 'https://placehold.co/90x60',
    },
  ];

  return (
    <ProtectedRoute>
      <DashboardTemplate
        activeSidebarItem={activeSidebarItem}
        onSidebarItemClick={setActiveSidebarItem}
        activeView={activeView}
        onViewChange={setActiveView}
        userName={authState.user?.fullName || 'Alex Morgan'}
        userRole="Quản trị viên nền tảng"
        userAvatar={authState.user?.avatar}
      >
        <div className="flex flex-col xl:flex-row gap-6">
          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Stats Grid */}
            <StatsGrid stats={stats} />

            {/* Chart Card */}
            <ChartCard
              title="Tổng quan doanh thu"
              actionText="Xem báo cáo"
            >
              <RevenueChart data={monthlyRevenueData} />
            </ChartCard>

            {/* Equipment List */}
            <EquipmentList
              title="Thiết bị phổ biến"
              actionText="Xem tất cả"
              equipment={equipment}
            />
          </div>

          {/* Right Sidebar */}
          <div className="w-full xl:w-96 space-y-6">
            {/* Booking List */}
            <BookingList
              title="Đặt chỗ sắp tới"
              actionText="Xem lịch"
              bookings={bookings}
            />

            {/* Maintenance List */}
            <MaintenanceList
              title="Cảnh báo bảo trì"
              actionText="Xem tất cả"
              maintenance={maintenance}
            />
          </div>
        </div>
      </DashboardTemplate>
    </ProtectedRoute>
  );
}
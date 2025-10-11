'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/auth';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import DashboardTemplate from '@/components/templates/DashboardTemplate';
import { StatsGrid, ChartCard, EquipmentList, BookingList, MaintenanceList } from '@/components/organisms/dashboard';

export default function DashboardPage() {
  const authState = useSelector((state: RootState) => state.auth);
  const [activeSidebarItem, setActiveSidebarItem] = useState('dashboard');
  const [activeView, setActiveView] = useState('platform');

  // Mock data - in real app, this would come from API
  const stats = [
    {
      title: 'Tổng doanh thu',
      value: '50.000.000đ',
      change: {
        value: '12.5% từ tháng trước',
        type: 'positive' as const,
      },
    },
    {
      title: 'Cho thuê tích cực',
      value: '78',
      change: {
        value: '8.2% so với tháng trước',
        type: 'positive' as const,
      },
    },
    {
      title: 'Thiết bị có sẵn',
      value: '142',
    },
    {
      title: 'Khách hàng mới',
      value: '36',
      change: {
        value: '24.1% so với tháng trước',
        type: 'positive' as const,
      },
    },
  ];

  const equipment = [
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

  const bookings = [
    {
      id: '1',
      day: 24,
      month: 'Jun',
      customerName: 'Sarah Johnson',
      equipment: 'Sony alpha a7iii + ống kính 24- 70mm',
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
    {
      id: '3',
      day: 26,
      month: 'Jun',
      customerName: 'Emily Rodriguez',
      equipment: 'Ống kính Nikon Z6 II + 14-24mm',
      time: '8:00 sáng - 7:00 tối',
    },
    {
      id: '4',
      day: 28,
      month: 'Jun',
      customerName: 'David Wilson',
      equipment: 'Túi đen 6K + Phụ kiện',
      time: '9:00 sáng - 8:00 tối',
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
        userRole={authState.user?.role || 'Quản trị viên nền tảng'}
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
              <div className="w-full h-64 lg:h-72 bg-black/0 overflow-hidden">
                <div className="w-full h-48 relative overflow-hidden">
                  <div className="w-full h-40 absolute top-2 bg-blue-500/20 rounded" />
                  <div className="w-full h-32 absolute top-2 outline-2 outline-blue-500 rounded" />
                  <div className="w-1.5 h-1.5 absolute left-[20%] top-[75%] bg-blue-500 rounded-full" />
                  <div className="w-1.5 h-1.5 absolute left-[40%] top-[90%] bg-blue-500 rounded-full" />
                  <div className="w-1.5 h-1.5 absolute left-[60%] top-[60%] bg-blue-500 rounded-full" />
                  <div className="w-1.5 h-1.5 absolute left-[80%] top-[40%] bg-blue-500 rounded-full" />
                  <div className="w-1.5 h-1.5 absolute left-[95%] top-[20%] bg-blue-500 rounded-full" />
                </div>
              </div>
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
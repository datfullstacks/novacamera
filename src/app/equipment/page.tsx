'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/auth';
import DashboardTemplate from '@/components/templates/DashboardTemplate';
import { EquipmentManagement } from '@/components/organisms/equipment';
import { useEquipments } from '@/lib/react-query/hooks';
import type { EquipmentFilterParams } from '@/types/api';

interface Equipment {
  id: string;
  name: string;
  code: string;
  status: 'available' | 'rented' | 'maintenance' | 'repair';
  price: string;
  usage: string;
  image?: string;
}

export default function EquipmentPage() {
  const [activeSidebarItem, setActiveSidebarItem] = useState('equipment');
  const [activeView, setActiveView] = useState('platform');
  const [filters, setFilters] = useState<EquipmentFilterParams>({
    pageNumber: 1,
    pageSize: 20,
  });

  // Fetch equipment from API
  const { data, isLoading, error } = useEquipments(filters);

  // Transform API data to component format
  const equipment: Equipment[] = data?.data.items.map((item) => ({
    id: item.equipmentId.toString(),
    name: item.name || 'N/A',
    code: `#${item.equipmentId}`,
    status: item.isAvailable ? 'available' : 'rented',
    price: `${item.pricePerDay.toLocaleString('vi-VN')}₫`,
    usage: '0%', // API doesn't provide this, placeholder
    image: item.mainImageUrl || 'https://placehold.co/60x60',
  })) || [];

  // Show loading state
  if (isLoading) {
    return (
      <ProtectedRoute>
        <DashboardTemplate
          activeSidebarItem={activeSidebarItem}
          onSidebarItemClick={setActiveSidebarItem}
          activeView={activeView}
          onViewChange={setActiveView}
          userName="Alex Morgan"
          userRole="Quản trị viên nền tảng"
        >
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải thiết bị...</p>
            </div>
          </div>
        </DashboardTemplate>
      </ProtectedRoute>
    );
  }

  // Show error state
  if (error) {
    return (
      <ProtectedRoute>
        <DashboardTemplate
          activeSidebarItem={activeSidebarItem}
          onSidebarItemClick={setActiveSidebarItem}
          activeView={activeView}
          onViewChange={setActiveView}
          userName="Alex Morgan"
          userRole="Quản trị viên nền tảng"
        >
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-red-600 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-800 font-semibold mb-2">Không thể tải dữ liệu thiết bị</p>
              <p className="text-gray-600 text-sm">{error.message}</p>
              <button 
                onClick={() => setFilters({ ...filters })}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Thử lại
              </button>
            </div>
          </div>
        </DashboardTemplate>
      </ProtectedRoute>
    );
  }

  const handleAddEquipment = () => {
    console.log('Add equipment clicked');
    // Implementation: Open add equipment modal/form
  };

  const handleEditEquipment = (equipment: Equipment) => {
    console.log('Edit equipment:', equipment);
    // Implementation: Open edit equipment modal/form
  };

  const handleDeleteEquipment = (equipment: Equipment) => {
    console.log('Delete equipment:', equipment);
    // Implementation: Show confirmation dialog and delete
  };

  const handleViewEquipment = (equipment: Equipment) => {
    console.log('View equipment:', equipment);
    // Implementation: Navigate to equipment detail page
  };

  return (
    <ProtectedRoute>
      <DashboardTemplate
        activeSidebarItem={activeSidebarItem}
        onSidebarItemClick={setActiveSidebarItem}
        activeView={activeView}
        onViewChange={setActiveView}
        userName="Alex Morgan"
        userRole="Quản trị viên nền tảng"
      >
        <EquipmentManagement
          equipment={equipment}
          onAddEquipment={handleAddEquipment}
          onEditEquipment={handleEditEquipment}
          onDeleteEquipment={handleDeleteEquipment}
          onViewEquipment={handleViewEquipment}
        />
      </DashboardTemplate>
    </ProtectedRoute>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ProtectedRoute } from '@/components/auth';
import DashboardTemplate from '@/components/templates/DashboardTemplate';
import { EquipmentManagement } from '@/components/organisms/equipment';
import { ConfirmationDialog, showToast } from '@/components/atoms/ui';
import { useEquipments } from '@/lib/react-query/hooks';
import { equipmentService } from '@/lib/api/services';
import { QUERY_KEYS } from '@/lib/react-query/query-keys';
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
  const router = useRouter();
  const authState = useSelector((state: RootState) => state.auth);
  const [activeSidebarItem, setActiveSidebarItem] = useState('equipment');
  const [activeView, setActiveView] = useState('platform');
  const [filters, setFilters] = useState<EquipmentFilterParams>({
    pageNumber: 1,
    pageSize: 10, // Change to 10 items per page for better UX
    isAvailable: true, // Chỉ hiển thị thiết bị available
    sortBy: 'newest', // Mặc định sắp xếp theo tên
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
        message: 'Chỉ quản trị viên mới có thể quản lý thiết bị',
        duration: 5000,
      });
    }
  }, [authState, router]);

  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    type?: 'danger' | 'warning' | 'info' | 'success';
    loading?: boolean;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    loading: false,
  });

  // React Query setup
  const queryClient = useQueryClient();

  // Fetch equipment from API
  const { data, isLoading, error } = useEquipments(filters);

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (equipmentId: number) => equipmentService.deleteEquipment(equipmentId),
    onSuccess: () => {
      // Invalidate and refetch equipment list
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EQUIPMENT.LIST(filters as Record<string, unknown>) });
      
      // Close dialog
      setConfirmDialog({ ...confirmDialog, isOpen: false, loading: false });
      
      // Show success toast
      showToast({
        type: 'success',
        title: 'Xóa thành công',
        message: 'Thiết bị đã được xóa khỏi hệ thống',
      });
    },
    onError: (error: Error) => {
      console.error('Delete failed:', error);
      
      // Show error toast
      showToast({
        type: 'error',
        title: 'Xóa thất bại',
        message: error.message || 'Không thể xóa thiết bị. Vui lòng thử lại.',
      });
      
      // Close dialog
      setConfirmDialog({ ...confirmDialog, isOpen: false, loading: false });
    },
  });

  // Debug: Log component mount
  useEffect(() => {
    console.log('🚀 EquipmentPage mounted');
    console.log('🔑 Current filters:', filters);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debug: Log data changes
  useEffect(() => {
    console.log('📊 Data changed:', {
      isLoading,
      hasError: !!error,
      errorMessage: error?.message,
      hasData: !!data,
      itemsCount: data?.data?.items?.length,
    });
  }, [data, isLoading, error]);

  console.log('🔍 Equipment Page Debug:', {
    isLoading,
    error: error?.message,
    dataExists: !!data,
    itemsCount: data?.data?.items?.length,
    pagination: {
      currentPage: data?.data?.pageNumber,
      totalPages: data?.data?.totalPage,
      totalCount: data?.data?.totalCount,
    },
    rawData: data,
  });

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

  console.log('📦 Transformed Equipment:', equipment.length, 'items');

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
    router.push('/equipment/add');
  };

  const handleEditEquipment = (equipment: Equipment) => {
    console.log('Edit equipment:', equipment);
    router.push(`/equipment/${equipment.id}`);
  };

  const handleDeleteEquipment = (equipment: Equipment) => {
    console.log('Delete equipment:', equipment);
    // Show confirmation dialog before deleting
    setConfirmDialog({
      isOpen: true,
      title: 'Xác nhận xóa thiết bị',
      message: `Bạn có chắc chắn muốn xóa thiết bị "${equipment.name}" (${equipment.code})? Hành động này không thể hoàn tác.`,
      type: 'danger',
      loading: false,
      onConfirm: async () => {
        // Set loading state
        setConfirmDialog(prev => ({ ...prev, loading: true }));
        
        // Call API to delete equipment
        const equipmentId = parseInt(equipment.id, 10);
        console.log('🗑️ Deleting equipment:', equipmentId);
        
        deleteMutation.mutate(equipmentId);
      },
    });
  };

  const handleViewEquipment = (equipment: Equipment) => {
    console.log('View equipment:', equipment);
    router.push(`/equipment/${equipment.id}`);
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, pageNumber: page });
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
          pagination={{
            currentPage: data?.data?.pageNumber || 1,
            totalPages: data?.data?.totalPage || 1,
            totalCount: data?.data?.totalCount || 0,
            pageSize: filters.pageSize || 10,
            onPageChange: handlePageChange,
          }}
        />

        {/* Confirmation Dialog */}
        <ConfirmationDialog
          isOpen={confirmDialog.isOpen}
          title={confirmDialog.title}
          message={confirmDialog.message}
          type={confirmDialog.type}
          confirmLabel="Xóa"
          cancelLabel="Hủy bỏ"
          loading={confirmDialog.loading}
          onConfirm={confirmDialog.onConfirm}
          onCancel={() => setConfirmDialog({ ...confirmDialog, isOpen: false, loading: false })}
        />
      </DashboardTemplate>
    </ProtectedRoute>
  );
}

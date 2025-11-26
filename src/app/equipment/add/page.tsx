'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
import { RootState } from '@/store';
import { ProtectedRoute } from '@/components/auth';
import { showToast } from '@/components/atoms/ui/Toast';
import DashboardTemplate from '@/components/templates/DashboardTemplate';
import { BackButton } from '@/components/atoms/equipment';
import { AddEquipmentForm } from '@/components/organisms/equipment';

interface EquipmentFormData {
  name: string;
  code: string;
  price: string;
  status: 'active' | 'inactive';
  manufacturer: string;
  category: string;
  categoryId: number;
  tagline: string;
  shortDescription: string;
  depositFee: string;
  stock: string;
  serialNumber: string;
  purchaseDate: string;
  condition: string;
  rentalCount: string;
  description: string;
  images: File[];
  specs: Array<{ label: string; value: string }>;
  accessories: Array<{ name: string; included: boolean }>;
}

export default function AddEquipmentPage() {
  const router = useRouter();
  const authState = useSelector((state: RootState) => state.auth);
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  // Debug log auth state
  console.log('AddEquipmentPage - authState:', authState);

  // Admin-only check
  useEffect(() => {
    if (!authState.isAuthenticated) {
      return; // ProtectedRoute will handle redirect
    }

    if (authState.user?.roleId !== 1) {
      router.push('/');
      showToast({
        type: 'error',
        title: 'Truy cập bị từ chối',
        message: 'Chỉ quản trị viên mới có thể thêm thiết bị',
        duration: 5000,
      });
    }
  }, [authState, router]);

  const handleBack = () => {
    router.push('/equipment');
  };

  const handleSubmit = async (data: EquipmentFormData) => {
    setLoading(true);
    try {
      // Mapping đúng trường API
      const formData = new FormData();
      formData.append('Name', data.name);
      formData.append('Tagline', data.tagline || '');
      formData.append('ShortDescription', data.shortDescription || '');
      formData.append('Brand', data.manufacturer);
      formData.append('Description', data.description);
      formData.append('ConditionNote', data.condition);
      formData.append('PricePerDay', String(data.price));
      formData.append('DepositFee', String(data.depositFee || 0));
      formData.append('Status', data.status); // 'active' hoặc 'inactive'
      formData.append('Stock', String(data.stock || 0));
      formData.append('RentalCount', String(data.rentalCount || 0));
      formData.append('CategoryId', String(data.categoryId));
      // MainImage
      if (data.images[0]) {
        formData.append('MainImage', data.images[0]);
      } else {
        // API cho phép gửi giá trị trống
        formData.append('MainImage', '');
      }
      // AdditionalImages
      data.images.slice(1).forEach(img => formData.append('AdditionalImages', img));
      // Các trường mở rộng nếu có
      // Gọi API
      const response = await import('@/lib/api/services/equipment.service').then(mod => mod.equipmentService.createEquipment(formData));
      showToast({
        type: 'success',
        title: 'Thêm thiết bị thành công',
        message: response.message || 'Thiết bị đã được thêm!',
        duration: 4000,
      });
      // Invalidate equipment queries so list refreshes after navigation
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
      router.push('/equipment');
    } catch (error) {
      console.error('Error adding equipment:', error);
      showToast({
        type: 'error',
        title: 'Lỗi',
        message: 'Không thể thêm thiết bị',
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/equipment');
  };

  return (
    <ProtectedRoute>
      <DashboardTemplate
        activeSidebarItem="equipment"
        onSidebarItemClick={(item) => {
          if (item === 'equipment') router.push('/equipment');
        }}
        activeView="platform"
        onViewChange={() => {}}
        userName="Alex Morgan"
        userRole="Quản trị viên nền tảng"
      >
        <div className="w-full max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <BackButton onClick={handleBack}>
              Quay lại danh sách thiết bị
            </BackButton>
            <div className="mt-4">
              <h1 className="text-3xl font-bold text-gray-900">
                Thêm thiết bị mới
              </h1>
              <p className="mt-2 text-gray-600">
                Nhập thông tin chi tiết về thiết bị mới để thêm vào hệ thống
              </p>
            </div>
          </div>

          {/* Form */}
          <AddEquipmentForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={loading}
          />
        </div>
      </DashboardTemplate>
    </ProtectedRoute>
  );
}



'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
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
  status: 'available' | 'rented' | 'maintenance' | 'repair';
  manufacturer: string;
  category: string;
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
  const [loading, setLoading] = useState(false);

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
      // Simulate API call
      console.log('Adding equipment:', data);
      
      // Here you would typically:
      // 1. Upload images to cloud storage
      // 2. Save equipment data to database
      // 3. Handle success/error states
      
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay
      
      // Redirect to equipment list after success
      router.push('/equipment');
    } catch (error) {
      console.error('Error adding equipment:', error);
      // Handle error (show toast, etc.)
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


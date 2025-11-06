'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { ProtectedRoute } from '@/components/auth';
import { showToast } from '@/components/atoms/ui/Toast';
import DashboardTemplate from '@/components/templates/DashboardTemplate';
import { 
  EquipmentDetailHeader, 
  EquipmentSpecsTable, 
  EquipmentAccessories, 
  EquipmentBookings,
  EquipmentDetailTabs,
  EquipmentItemsManager
} from '@/components/organisms/equipment';
import { EquipmentImageGallery, EquipmentInfo } from '@/components/molecules/equipment';
import { useEquipment } from '@/lib/react-query/hooks';
import { equipmentItemService, type EquipmentItemResponse } from '@/lib/api/services/equipment-item.service';

interface EquipmentDetailPageProps {
  params: {
    id: string;
  };
}

export default function EquipmentDetailPage({ params }: Readonly<EquipmentDetailPageProps>) {
  const router = useRouter();
  const authState = useSelector((state: RootState) => state.auth);
  const equipmentId = Number(params.id);

  // Equipment Items state
  const [equipmentItems, setEquipmentItems] = useState<EquipmentItemResponse[]>([]);

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
        message: 'Chỉ quản trị viên mới có thể xem chi tiết thiết bị',
        duration: 5000,
      });
    }
  }, [authState, router]);

  // Fetch equipment detail from API
  const { data, isLoading, error } = useEquipment(equipmentId);
  
  const equipmentDetail = data?.data;

  // Fetch equipment items
  const loadEquipmentItems = async () => {
    try {
      const response = await equipmentItemService.getItemsByEquipmentId(equipmentId);
      if (response.statusCode === 200 && response.data) {
        setEquipmentItems(response.data);
      }
    } catch (err) {
      console.error('Error loading equipment items:', err);
    }
  };

  // Load items when equipment is loaded
  useEffect(() => {
    if (equipmentDetail) {
      loadEquipmentItems();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [equipmentDetail]);

  // Transform API data to component format
  const equipment = equipmentDetail ? {
    id: params.id,
    name: equipmentDetail.name || 'N/A',
    code: `#EQ-${equipmentDetail.equipmentId}`,
    price: equipmentDetail.pricingInfo?.formattedOneDay || `${equipmentDetail.pricePerDay.toLocaleString('vi-VN')}₫/ngày`,
    status: (equipmentDetail.isAvailable ? 'available' : 'rented') as 'available' | 'rented' | 'maintenance' | 'repair',
    mainImage: equipmentDetail.mainImageUrl || 'https://placehold.co/350x437',
    thumbnails: equipmentDetail.images?.slice(0, 4).map(img => img.imageUrl).filter((url): url is string => url !== null) || [],
    details: [
      { label: 'Hãng sản xuất', value: equipmentDetail.brand || 'N/A' },
      { label: 'Loại thiết bị', value: equipmentDetail.categoryName || 'N/A' },
      { label: 'Trạng thái', value: equipmentDetail.status || 'N/A' },
      { label: 'Tồn kho', value: `${equipmentDetail.stock || 0} sản phẩm` },
      { label: 'Đánh giá', value: equipmentDetail.ratingStars || 'Chưa có đánh giá' },
      { label: 'Địa điểm', value: equipmentDetail.location || 'N/A' },
      { label: 'Số lần thuê', value: `${equipmentDetail.rentalCount || 0} lần` },
    ],
    description: equipmentDetail.description || equipmentDetail.shortDescription || 'Không có mô tả',
    specs: equipmentDetail.specifications?.map(spec => ({
      label: spec.label || '',
      value: spec.value || ''
    })) || [],
    accessories: [], // API doesn't provide accessories in current schema
    bookings: [], // Will be populated from separate endpoint if needed
  } : null;

  // Show loading state
  if (isLoading) {
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
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-400">Đang tải chi tiết thiết bị...</p>
            </div>
          </div>
        </DashboardTemplate>
      </ProtectedRoute>
    );
  }

  // Show error state
  if (error || !equipment) {
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
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="text-red-500 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-300 font-semibold mb-2">Không thể tải thông tin thiết bị</p>
              <p className="text-gray-500 text-sm mb-4">{error?.message || 'Thiết bị không tồn tại'}</p>
              <button 
                onClick={() => router.push('/equipment')}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Quay lại danh sách
              </button>
            </div>
          </div>
        </DashboardTemplate>
      </ProtectedRoute>
    );
  }

  const handleBack = () => {
    router.push('/equipment');
  };

  const handleHistory = () => {
    console.log('View history clicked');
  };

  const handleUpdate = () => {
    console.log('Update equipment clicked');
  };

  const handleRent = () => {
    console.log('Rent equipment clicked');
  };

  const handleMaintenance = () => {
    console.log('Maintenance clicked');
  };

  const handleStopRent = () => {
    console.log('Stop rent clicked');
  };

  const tabs = [
    {
      id: 'specs',
      label: 'Thông số kỹ thuật',
      content: <EquipmentSpecsTable specs={equipment.specs} />,
    },
    {
      id: 'availability',
      label: 'Lịch sẵn có',
      content: <div className="text-center py-8 text-gray-500">Lịch sẵn có sẽ được hiển thị ở đây</div>,
    },
    {
      id: 'history',
      label: 'Lịch sử thuê',
      content: <EquipmentBookings bookings={equipment.bookings} />,
    },
    {
      id: 'maintenance',
      label: 'Bảo trì & Sửa chữa',
      content: <div className="text-center py-8 text-gray-500">Lịch sử bảo trì sẽ được hiển thị ở đây</div>,
    },
  ];

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
        <div className="w-full max-w-[1423px] mx-auto bg-zinc-900 rounded-xl p-6">
          {/* Header */}
          <EquipmentDetailHeader
            onBack={handleBack}
            onHistory={handleHistory}
            onUpdate={handleUpdate}
            className="mb-6"
          />

          {/* Main Content */}
          <div className="space-y-6">
            {/* Equipment Overview */}
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Image Gallery */}
              <div className="lg:w-80">
                <EquipmentImageGallery
                  mainImage={equipment.mainImage}
                  thumbnails={equipment.thumbnails}
                  alt={equipment.name}
                  status={equipment.status}
                />
              </div>

              {/* Equipment Info */}
              <div className="flex-1">
                <EquipmentInfo
                  name={equipment.name}
                  code={equipment.code}
                  price={equipment.price}
                  details={equipment.details}
                  description={equipment.description}
                  onRent={handleRent}
                  onMaintenance={handleMaintenance}
                  onStopRent={handleStopRent}
                />
              </div>
            </div>

            {/* Tabs Content */}
            <EquipmentDetailTabs
              tabs={tabs}
              defaultTab="specs"
            />

            {/* Accessories */}
            <EquipmentAccessories
              accessories={equipment.accessories}
            />

            {/* Equipment Items Manager */}
            <EquipmentItemsManager
              equipmentId={equipmentId}
              equipmentName={equipment.name}
              items={equipmentItems}
              onItemsChange={loadEquipmentItems}
            />
          </div>
        </div>
      </DashboardTemplate>
    </ProtectedRoute>
  );
}


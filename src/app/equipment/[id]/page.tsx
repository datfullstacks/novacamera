'use client';

import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth';
import DashboardTemplate from '@/components/templates/DashboardTemplate';
import { 
  EquipmentDetailHeader, 
  EquipmentSpecsTable, 
  EquipmentAccessories, 
  EquipmentBookings,
  EquipmentDetailTabs 
} from '@/components/organisms/equipment';
import { EquipmentImageGallery, EquipmentInfo } from '@/components/molecules/equipment';

interface EquipmentDetailPageProps {
  params: {
    id: string;
  };
}

export default function EquipmentDetailPage({ params }: EquipmentDetailPageProps) {
  const router = useRouter();

  // Mock data - in real app, this would come from API based on params.id
  const equipment = {
    id: params.id,
    name: 'Canon EOS R5',
    code: 'CAM-R5-001',
    price: '1.500.000đ',
    status: 'available' as const,
    mainImage: 'https://placehold.co/350x437',
    thumbnails: [
      'https://placehold.co/60x75',
      'https://placehold.co/90x60',
      'https://placehold.co/90x60',
      'https://placehold.co/90x60',
    ],
    details: [
      { label: 'Hãng sản xuất', value: 'Canon' },
      { label: 'Loại thiết bị', value: 'Máy ảnh mirrorless' },
      { label: 'Số seri', value: 'R5C98765432' },
      { label: 'Ngày mua', value: '15/03/2022' },
      { label: 'Tình trạng', value: 'Mới (95%)' },
      { label: 'Số lần cho thuê', value: '27 lần' },
    ],
    description: 'Canon EOS R5 là máy ảnh mirrorless full-frame cao cấp với cảm biến 45MP, quay video 8K, hệ thống lấy nét tự động tiên tiến và tốc độ chụp liên tiếp lên đến 20fps. Thiết bị phù hợp cho cả nhiếp ảnh chuyên nghiệp và quay phim.',
    specs: [
      { label: 'Cảm biến', value: 'CMOS Full-frame 45 megapixel' },
      { label: 'Bộ xử lý', value: 'DIGIC X' },
      { label: 'Dải ISO', value: '100-51,200 (mở rộng: 50-102,400)' },
      { label: 'Tốc độ màn trập', value: '1/8000 đến 30 giây' },
      { label: 'Tốc độ chụp liên tiếp', value: 'Tối đa 20 fps (màn trập điện tử), 12 fps (màn trập cơ)' },
      { label: 'Hệ thống lấy nét', value: 'Dual Pixel CMOS AF II, 1053 điểm AF' },
      { label: 'Quay video', value: '8K 30p, 4K 120p, 1080p 60p' },
      { label: 'Màn hình', value: 'LCD cảm ứng 3.2 inch, 2.1 triệu điểm ảnh' },
      { label: 'Kính ngắm', value: 'EVF OLED 5.76 triệu điểm ảnh' },
      { label: 'Khe thẻ nhớ', value: '1x CFexpress, 1x SD UHS-II' },
      { label: 'Kết nối', value: 'Wi-Fi, Bluetooth, USB-C, HDMI micro, Microphone, Headphone' },
      { label: 'Pin', value: 'LP-E6NH (khoảng 320 ảnh)' },
      { label: 'Kích thước', value: '138 x 97.5 x 88 mm' },
      { label: 'Trọng lượng', value: '738g (bao gồm pin và thẻ nhớ)' },
    ],
    accessories: [
      { name: 'Pin Canon LP-E6NH (2 pin)', included: true },
      { name: 'Sạc pin LC-E6', included: true },
      { name: 'Dây đeo máy ảnh', included: true },
      { name: 'Cáp kết nối USB-C', included: true },
      { name: 'Nắp body và nắp ngàm flash', included: true },
      { name: 'Thẻ nhớ SD 64GB UHS-II', included: true },
      { name: 'Túi đựng máy ảnh', included: true },
    ],
    bookings: [
      {
        id: '1',
        customerName: 'Trần Hoàng',
        orderCode: '#BK102',
        dateRange: '20/07 - 22/07/2023',
        duration: '3 ngày',
        status: 'Đang thuê',
        contact: '0912 345 678',
      },
      {
        id: '2',
        customerName: 'Nguyễn Lan',
        orderCode: '#BK103',
        dateRange: '24/07 - 26/07/2023',
        duration: '3 ngày',
        status: 'Đã xác nhận',
        contact: '0987 654 321',
      },
    ],
  };

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
          </div>
        </div>
      </DashboardTemplate>
    </ProtectedRoute>
  );
}


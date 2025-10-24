'use client';

import { HTMLAttributes, useState, useEffect } from 'react';
import { 
  FormInput, 
  FormSelect, 
  FormTextarea, 
  ImageUpload, 
  ActionButton 
} from '../../atoms/equipment';
import { 
  FormSection, 
  SpecField, 
  AccessoryField 
} from '../../molecules/equipment';
import { equipmentService, categoryService } from '@/lib/api/services';

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

interface AddEquipmentFormProps extends Omit<HTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  onSubmit?: (data: EquipmentFormData) => void;
  onCancel?: () => void;
  loading?: boolean;
}

const statusOptions = [
  { value: 'available', label: 'Có sẵn' },
  { value: 'rented', label: 'Đang thuê' },
  { value: 'maintenance', label: 'Bảo trì' },
  { value: 'repair', label: 'Sửa chữa' },
];

export default function AddEquipmentForm({
  onSubmit,
  onCancel,
  loading = false,
  className = '',
  ...props
}: AddEquipmentFormProps) {
  const [formData, setFormData] = useState<EquipmentFormData>({
    name: '',
    code: '',
    price: '',
    status: 'available',
    manufacturer: '',
    category: '',
    serialNumber: '',
    purchaseDate: '',
    condition: '',
    rentalCount: '0',
    description: '',
    images: [],
    specs: [],
    accessories: [],
  });

  const [errors, setErrors] = useState<Partial<Record<keyof EquipmentFormData, string>>>({});
  const [brands, setBrands] = useState<string[]>([]);
  const [categories, setCategories] = useState<Array<{ value: string; label: string }>>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Load brands and categories on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingData(true);
        
        // Load brands
        try {
          const brandsRes = await equipmentService.getBrands();
          console.log('📦 Brands response:', brandsRes);
          
          // Brands API returns statusCode 400 but with data in errors field
          if (brandsRes.errors && Array.isArray(brandsRes.errors) && brandsRes.errors.length > 0) {
            console.log('✅ Brands loaded from errors array:', brandsRes.errors);
            setBrands(brandsRes.errors as string[]);
          } else if (brandsRes.data && Array.isArray(brandsRes.data)) {
            console.log('✅ Brands loaded from data:', brandsRes.data);
            setBrands(brandsRes.data as string[]);
          }
        } catch (brandError) {
          console.error('❌ Error loading brands:', brandError);
        }

        // Load categories
        try {
          const categoriesRes = await categoryService.getCategories();
          console.log('📂 Categories response:', categoriesRes);
          
          if (categoriesRes.data && Array.isArray(categoriesRes.data)) {
            const categoryOptions = categoriesRes.data
              .filter((cat) => cat.categoryName)
              .map((cat) => ({
                value: String(cat.categoryId),
                label: cat.categoryName || '',
              }));
            console.log('✅ Categories loaded:', categoryOptions);
            setCategories(categoryOptions);
          } else {
            console.warn('⚠️ No categories data:', categoriesRes);
          }
        } catch (categoryError) {
          console.error('❌ Error loading categories:', categoryError);
        }
      } catch (error) {
        console.error('❌ Error loading data:', error);
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, []);

  const updateField = (field: keyof EquipmentFormData, value: EquipmentFormData[keyof EquipmentFormData]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof EquipmentFormData, string>> = {};

    if (!formData.name.trim()) newErrors.name = 'Tên thiết bị là bắt buộc';
    if (!formData.code.trim()) newErrors.code = 'Mã thiết bị là bắt buộc';
    if (!formData.price.trim()) newErrors.price = 'Giá thuê là bắt buộc';
    if (!formData.manufacturer.trim()) newErrors.manufacturer = 'Hãng sản xuất là bắt buộc';
    if (!formData.category) newErrors.category = 'Loại thiết bị là bắt buộc';
    if (!formData.serialNumber.trim()) newErrors.serialNumber = 'Số seri là bắt buộc';
    if (!formData.purchaseDate) newErrors.purchaseDate = 'Ngày mua là bắt buộc';
    if (!formData.condition.trim()) newErrors.condition = 'Tình trạng là bắt buộc';
    if (!formData.description.trim()) newErrors.description = 'Mô tả là bắt buộc';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit?.(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-8 ${className}`} {...props}>
      {/* Basic Information */}
      <FormSection
        title="Thông tin cơ bản"
        description="Nhập thông tin cơ bản về thiết bị"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Tên thiết bị"
            value={formData.name}
            onChange={(value) => updateField('name', value)}
            error={errors.name}
            required
            placeholder="Ví dụ: Canon EOS R5"
          />
          <FormInput
            label="Mã thiết bị"
            value={formData.code}
            onChange={(value) => updateField('code', value)}
            error={errors.code}
            required
            placeholder="Ví dụ: CAM-R5-001"
          />
          <FormInput
            label="Giá thuê (VNĐ/ngày)"
            value={formData.price}
            onChange={(value) => updateField('price', value)}
            error={errors.price}
            required
            placeholder="Ví dụ: 1.500.000"
          />
          <FormSelect
            label="Trạng thái"
            value={formData.status}
            onChange={(value) => updateField('status', value)}
            error={errors.status}
            required
            options={statusOptions}
          />
          <FormSelect
            label="Hãng sản xuất"
            value={formData.manufacturer}
            onChange={(value) => updateField('manufacturer', value)}
            error={errors.manufacturer}
            required
            options={brands.length > 0 
              ? brands.map(brand => ({ value: brand, label: brand }))
              : [{ value: '', label: 'Đang tải...' }]
            }
            placeholder="Chọn hãng sản xuất"
          />
          <FormSelect
            label="Loại thiết bị"
            value={formData.category}
            onChange={(value) => updateField('category', value)}
            error={errors.category}
            required
            options={categories.length > 0 ? categories : [{ value: '', label: 'Đang tải...' }]}
            placeholder="Chọn loại thiết bị"
          />
        </div>
      </FormSection>

      {/* Technical Details */}
      <FormSection
        title="Chi tiết kỹ thuật"
        description="Thông tin chi tiết về thiết bị"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Số seri"
            value={formData.serialNumber}
            onChange={(value) => updateField('serialNumber', value)}
            error={errors.serialNumber}
            required
            placeholder="Ví dụ: R5C98765432"
          />
          <FormInput
            label="Ngày mua"
            type="date"
            value={formData.purchaseDate}
            onChange={(value) => updateField('purchaseDate', value)}
            error={errors.purchaseDate}
            required
          />
          <FormInput
            label="Tình trạng"
            value={formData.condition}
            onChange={(value) => updateField('condition', value)}
            error={errors.condition}
            required
            placeholder="Ví dụ: Mới (95%)"
          />
          <FormInput
            label="Số lần cho thuê"
            type="number"
            value={formData.rentalCount}
            onChange={(value) => updateField('rentalCount', value)}
            placeholder="0"
          />
        </div>
        <FormTextarea
          label="Mô tả"
          value={formData.description}
          onChange={(value) => updateField('description', value)}
          error={errors.description}
          required
          placeholder="Mô tả chi tiết về thiết bị..."
        />
      </FormSection>

      {/* Images */}
      <FormSection
        title="Hình ảnh"
        description="Tải lên hình ảnh của thiết bị"
      >
        <ImageUpload
          label="Hình ảnh thiết bị"
          multiple
          onImagesChange={(images) => updateField('images', images)}
          previewImages={formData.images.map(file => URL.createObjectURL(file))}
        />
      </FormSection>

      {/* Specifications */}
      <FormSection
        title="Thông số kỹ thuật"
        description="Thêm các thông số kỹ thuật của thiết bị"
      >
        <SpecField
          specs={formData.specs}
          onSpecsChange={(specs) => updateField('specs', specs)}
        />
      </FormSection>

      {/* Accessories */}
      <FormSection
        title="Phụ kiện đi kèm"
        description="Danh sách các phụ kiện đi kèm với thiết bị"
      >
        <AccessoryField
          accessories={formData.accessories}
          onAccessoriesChange={(accessories) => updateField('accessories', accessories)}
        />
      </FormSection>

      {/* Actions */}
      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
        <ActionButton
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Hủy
        </ActionButton>
        <ActionButton
          type="submit"
          variant="primary"
          disabled={loading}
        >
          {loading ? 'Đang thêm...' : 'Thêm thiết bị'}
        </ActionButton>
      </div>
    </form>
  );
}


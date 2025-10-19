'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Equipment, EquipmentStatus } from '@/types';
import { equipmentService } from '@/lib/api/services';
import { ProductDetailTemplate } from '@/components/templates/ProductDetailTemplate';

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<Equipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!params.id) return;

      try {
        setLoading(true);
        const equipmentId = parseInt(params.id as string, 10);
        
        if (isNaN(equipmentId)) {
          setError('Invalid product ID');
          return;
        }

        const response = await equipmentService.getEquipmentById(equipmentId);
        
        console.log('✅ API Response for detail:', response);

        if (response.statusCode === 200 && response.data) {
          const apiData = response.data;
          
          // Map API response to Equipment type
          const mappedProduct: Equipment = {
            id: apiData.equipmentId,
            name: apiData.name || '',
            description: apiData.description || apiData.shortDescription || '',
            dailyRate: apiData.pricePerDay,
            category: apiData.categoryName || '',
            brand: apiData.brand || '',
            images: apiData.images?.map((img) => ({
              id: img.imageId,
              url: img.imageUrl || '',
              alt: apiData.name || ''
            })) || (apiData.mainImageUrl ? [{
              id: 1,
              url: apiData.mainImageUrl,
              alt: apiData.name || ''
            }] : []),
            rating: apiData.rating || 0,
            reviewCount: apiData.reviewCount || 0,
            isAvailable: apiData.isAvailable,
            availableQuantity: apiData.stock || 0,
            specifications: apiData.specifications?.reduce((acc, spec) => {
              if (spec.label) {
                acc[spec.label] = spec.value || '';
              }
              return acc;
            }, {} as Record<string, string>) || {},
            status: apiData.isAvailable ? EquipmentStatus.ACTIVE : EquipmentStatus.INACTIVE,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          setProduct(mappedProduct);
        } else {
          setError(response.message || 'Product not found');
        }
      } catch (err) {
        setError('Failed to load product');
        console.error('❌ Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-xl text-gray-600">
          Đang tải sản phẩm...
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Không tìm thấy sản phẩm'}
          </h1>
          <button
            onClick={() => window.history.back()}
            className="text-blue-600 hover:text-blue-800"
          >
            ← Quay lại
          </button>
        </div>
      </div>
    );
  }

  return <ProductDetailTemplate equipment={product} />;
}
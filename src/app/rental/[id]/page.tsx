'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Equipment } from '@/types';
import { equipmentService } from '@/lib/api/equipmentService';
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
        const response = await equipmentService.getEquipmentById(params.id as string);
        
        if (response.success && response.data) {
          setProduct(response.data);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        setError('Failed to load product');
        console.error('Error fetching product:', err);
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
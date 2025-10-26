'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Equipment, EquipmentStatus } from '@/types';
import { equipmentService } from '@/lib/api/services';
import { ProductDetailTemplate } from '@/components/templates/ProductDetailTemplate';

// Force dynamic rendering on Vercel
export const dynamic = 'force-dynamic';

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<Equipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!params.id) {
        console.log('❌ No product ID in params');
        setError('No product ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const equipmentId = parseInt(params.id as string, 10);
        
        console.log('🔍 Fetching product with ID:', equipmentId);
        
        if (isNaN(equipmentId)) {
          console.log('❌ Invalid product ID:', params.id);
          setError('Invalid product ID');
          setLoading(false);
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
            tagline: apiData.tagline || '',
            dailyRate: apiData.pricePerDay,
            depositFee: apiData.depositFee || undefined,
            category: apiData.categoryName || '',
            brand: apiData.brand || '',
            location: apiData.location || '',
            condition: apiData.conditionNote || '',
            mainImageUrl: apiData.mainImageUrl || '',
            images: (() => {
              // Build images array with mainImageUrl first, then other images
              const imagesArray = [];
              
              // Add mainImageUrl as first image if exists
              if (apiData.mainImageUrl) {
                imagesArray.push({
                  id: 0,
                  url: apiData.mainImageUrl,
                  alt: apiData.name || '',
                  isPrimary: true
                });
              }
              
              // Add other images from API (skip if they match mainImageUrl)
              if (apiData.images && apiData.images.length > 0) {
                apiData.images.forEach((img) => {
                  // Skip duplicate of mainImageUrl
                  if (img.imageUrl !== apiData.mainImageUrl) {
                    imagesArray.push({
                      id: img.imageId,
                      url: img.imageUrl || '',
                      alt: apiData.name || '',
                      isPrimary: img.isPrimary || false
                    });
                  }
                });
              }
              
              return imagesArray;
            })(),
            rating: apiData.rating || 0,
            reviewCount: apiData.reviewCount || 0,
            // Normalize status from API: some endpoints return string 'Active'/'InActive'
            // Prefer explicit status field if present, else fall back to boolean isAvailable
            // Accept common variants (active, available, in_stock)
            isAvailable: (() => {
              const rawStatus = (apiData.status || apiData.availabilityText || '') as string;
              const s = rawStatus ? rawStatus.toString().toLowerCase() : '';
              if (s) return s === 'active' || s === 'available' || s === 'in_stock';
              return !!apiData.isAvailable;
            })(),
            availableQuantity: apiData.stock || 0,
            specifications: apiData.specifications?.reduce((acc, spec) => {
              if (spec.label) {
                acc[spec.label] = spec.value || '';
              }
              return acc;
            }, {} as Record<string, string>) || {},
            // Map to EquipmentStatus enum using normalized availability
            status: ((() => {
              const rawStatus = (apiData.status || apiData.availabilityText || '') as string;
              const s = rawStatus ? rawStatus.toString().toLowerCase() : '';
              const available = s ? (s === 'active' || s === 'available' || s === 'in_stock') : !!apiData.isAvailable;
              return available ? EquipmentStatus.ACTIVE : EquipmentStatus.INACTIVE;
            })()),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            // Add pricing info
            pricingInfo: apiData.pricingInfo ? {
              oneDayPrice: apiData.pricingInfo.oneDayPrice || 0,
              threeDayPrice: apiData.pricingInfo.threeDayPrice || 0,
              weeklyPrice: apiData.pricingInfo.weeklyPrice || 0,
              monthlyPrice: apiData.pricingInfo.monthlyPrice || 0,
              depositFee: apiData.pricingInfo.depositFee || 0,
              currency: apiData.pricingInfo.currency || 'VND',
              formattedOneDay: apiData.pricingInfo.formattedOneDay || '',
              formattedThreeDay: apiData.pricingInfo.formattedThreeDay || '',
              formattedWeekly: apiData.pricingInfo.formattedWeekly || '',
              formattedMonthly: apiData.pricingInfo.formattedMonthly || '',
              formattedDeposit: apiData.pricingInfo.formattedDeposit || '',
            } : undefined,
            // Add related equipment
            relatedEquipments: apiData.relatedEquipments?.map((rel) => ({
              id: rel.equipmentId,
              name: rel.name || '',
              brand: rel.brand || '',
              category: rel.categoryName || '',
              image: rel.mainImageUrl || '',
              price: rel.pricePerDay || 0,
              rating: rel.rating || 0,
              reviewCount: rel.reviewCount || 0,
              isAvailable: rel.isAvailable,
              formattedPrice: rel.formattedPrice || '',
              ratingDisplay: rel.ratingStars || '',
            })) || []
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
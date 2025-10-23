'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { updateViewMode, updateSortBy } from '@/store/slices/filtersSlice';
import { addToCart } from '@/store/slices/cartSlice';
import { equipmentService } from '@/lib/api/services';
import type { EquipmentFilterParams, EquipmentCardResponse } from '@/types/api';
import { Equipment, EquipmentStatus } from '@/types';
import { EmptyState } from '../../atoms/ui/EmptyState';
import { ViewToggle } from '../../molecules/rental/ViewToggle';
import { SortDropdown } from '../../molecules/rental/SortDropdown';
import { showToast } from '../../atoms/ui/Toast';
import type { RootState } from '@/store';

interface ProductListSectionProps {
  className?: string;
  filtersReady?: boolean; // Wait for categories & brands to load first
}

export function ProductListSection({ className = '', filtersReady = false }: ProductListSectionProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [products, setProducts] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Get filter state from Redux
  const filters = useAppSelector((state: RootState) => state.filters);
  const searchQuery = useAppSelector((state: RootState) => state.filters.searchQuery);
  const viewMode = useAppSelector((state: RootState) => state.filters.viewMode);
  const sortBy = useAppSelector((state: RootState) => state.filters.sortBy);

  const handleViewDetails = (productId: string | number) => {
    router.push(`/rental/${productId}`);
  };

  const handleAddToCart = (product: Equipment) => {
    console.log('handleAddToCart called with:', product);
    
    try {
      dispatch(addToCart({
        id: product.id.toString(),
        name: product.name,
        dailyRate: product.dailyRate,
        imageUrl: product.images?.[0]?.url || '',
        description: product.description,
        quantity: 1,
        rentalDays: 1,
      }));
      
      console.log('Successfully dispatched addToCart');
      
      // Show success notification
      showToast({
        type: 'success',
        title: 'Đã thêm vào giỏ hàng!',
        message: `${product.name} đã được thêm vào giỏ hàng của bạn.`,
        duration: 3000,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      showToast({
        type: 'error',
        title: 'Lỗi!',
        message: 'Không thể thêm sản phẩm vào giỏ hàng.',
        duration: 3000,
      });
    }
  };

  const handleViewModeChange = (isGrid: boolean) => {
    dispatch(updateViewMode(isGrid ? 'grid' : 'list'));
  };

  const handleSortChange = (sortValue: string) => {
    dispatch(updateSortBy(sortValue));
  };

  const sortOptions = [
    { value: 'recommended', label: 'Được đề xuất' },
    { value: 'name', label: 'Tên A-Z' },
    { value: 'price-low', label: 'Giá thấp đến cao' },
    { value: 'price-high', label: 'Giá cao đến thấp' },
    { value: 'rating', label: 'Đánh giá cao nhất' },
    { value: 'newest', label: 'Mới nhất' },
  ];

  useEffect(() => {
    // Don't fetch products until filters are ready
    if (!filtersReady) {
      console.log('⏳ Waiting for filters to be ready...');
      return;
    }

    console.log('✅ Filters ready - fetching products');

    // Debounce to prevent rapid API calls when filters change
    const timeoutId = setTimeout(() => {
      const fetchProducts = async () => {
        try {
          setLoading(true);
          setError(null);

          // Build filter parameters for API
        const filterParams: EquipmentFilterParams = {
          pageNumber: currentPage,
          pageSize: 12,
          searchTerm: searchQuery || undefined,
          categoryIds: filters.categories.length > 0 ? filters.categories.map((id: string) => parseInt(id, 10)).filter((id: number) => !isNaN(id)) : undefined,
          brands: filters.brands.length > 0 ? filters.brands : undefined,
          minPrice: filters.priceRange[0] > 0 ? filters.priceRange[0] : undefined,
          maxPrice: filters.priceRange[1] < 10000000 ? filters.priceRange[1] : undefined,
          isAvailable: filters.availability || undefined,
          minRating: filters.rating > 0 ? filters.rating : undefined,
          sortBy: sortBy === 'price-low' ? 'price' : sortBy === 'price-high' ? 'price' : sortBy === 'newest' ? 'createdAt' : sortBy,
        };

        console.log('🔍 Fetching products with filters:', {
          categories: filters.categories,
          categoryIds: filterParams.categoryIds,
          brands: filters.brands,
          priceRange: filters.priceRange,
          rating: filters.rating,
          availability: filters.availability,
          searchQuery,
          sortBy,
          filterParams
        });

        // Call real API
        const response = await equipmentService.getEquipments(filterParams);

        console.log('✅ API Response:', response);
        console.log('📦 Response data:', response.data);
        console.log('📋 Items:', response.data?.items);

        if (response.statusCode === 200 && response.data && response.data.items) {
          // Map API response to Equipment type
          const mappedProducts: Equipment[] = response.data.items.map((item: EquipmentCardResponse) => ({
            id: item.equipmentId,
            name: item.name || '',
            description: item.tagline || '',
            dailyRate: item.pricePerDay,
            category: item.categoryName || '',
            brand: item.brand || '',
            images: item.mainImageUrl ? [{
              id: 1,
              url: item.mainImageUrl,
              alt: item.name || ''
            }] : [],
            rating: item.rating || 0,
            reviewCount: item.reviewCount || 0,
            isAvailable: item.isAvailable,
            availableQuantity: 1,
            specifications: {},
            status: item.isAvailable ? EquipmentStatus.ACTIVE : EquipmentStatus.INACTIVE,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }));

          setProducts(mappedProducts);
          setTotalPages(response.data.totalPage || 1);
          setTotalCount(response.data.totalCount || 0);
          
          console.log('✅ Mapped products:', mappedProducts.length);
          console.log('📊 Total count:', response.data.totalCount);
          console.log('📄 Total pages:', response.data.totalPage);
        } else {
          console.warn('⚠️ API returned non-200 or no data:', response);
          setError(response.message || 'Không thể tải danh sách sản phẩm');
          setProducts([]);
          setTotalCount(0);
        }
      } catch (err) {
        setError('An error occurred while fetching products');
        console.error('❌ Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    }, 300); // 300ms debounce

    // Cleanup function - cancel timeout if dependencies change
    return () => clearTimeout(timeoutId);
  }, [filters, searchQuery, currentPage, sortBy, filtersReady]); // Add filtersReady to dependencies

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-center space-x-2 mt-8">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Trước
        </button>

        {[...Array(Math.min(5, totalPages))].map((_, index) => {
          let pageNumber;
          if (totalPages <= 5) {
            pageNumber = index + 1;
          } else if (currentPage <= 3) {
            pageNumber = index + 1;
          } else if (currentPage >= totalPages - 2) {
            pageNumber = totalPages - 4 + index;
          } else {
            pageNumber = currentPage - 2 + index;
          }

          return (
            <button
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                currentPage === pageNumber
                  ? 'text-blue-600 bg-blue-50 border border-blue-600'
                  : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {pageNumber}
            </button>
          );
        })}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Sau
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(12)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-64"></div>
              <div className="mt-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`space-y-6 ${className}`}>
        <EmptyState
          title="Lỗi tải dữ liệu"
          description={error}
          action={{
            label: 'Thử lại',
            onClick: () => window.location.reload(),
          }}
        />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className={`space-y-6 ${className}`}>
        <EmptyState
          title="Không tìm thấy sản phẩm"
          description="Thử điều chỉnh bộ lọc hoặc tìm kiếm với từ khóa khác"
        />
      </div>
    );
  }

  return (
    <div className={`space-y-4 md:space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
        <div className="flex items-center space-x-2">
          <h2 className="text-base md:text-lg font-semibold text-gray-900 dark:text-black">
            Sản phẩm
          </h2>
          <span className="text-xs md:text-sm text-gray-700 dark:text-white bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
            {totalCount} sản phẩm
          </span>
        </div>
        
        <div className="flex items-center space-x-2 md:space-x-4 w-full sm:w-auto">
          {/* Sort Dropdown */}
          <div className="flex-1 sm:flex-initial">
            <SortDropdown
              value={sortBy}
              onChange={handleSortChange}
              options={sortOptions}
            />
          </div>
          
          {/* View Toggle - Hidden on mobile */}
          <div className="hidden sm:block">
            <ViewToggle
              isGridView={viewMode === 'grid'}
              onToggle={handleViewModeChange}
            />
          </div>
        </div>
      </div>

      {/* Product Grid - Responsive columns */}
      <div className={viewMode === 'grid' 
        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
        : "flex flex-col gap-3 md:gap-4"
      }>
        {products.map((product) => (
          <div
            key={product.id}
            className={`bg-gray-50 dark:bg-white rounded-lg shadow-sm border border-gray-200 dark:border-gray-300 hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-400 transition-all duration-200 ${
              viewMode === 'list' ? 'flex flex-row gap-4 md:gap-6 p-4 md:p-6' : 'flex flex-col'
            }`}
          >
            <div className={`overflow-hidden rounded-lg bg-gray-200 ${
              viewMode === 'list' ? 'w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 flex-shrink-0' : 'aspect-w-1 aspect-h-1 w-full rounded-t-lg'
            }`}>
              <img
                src={product.images?.[0]?.url || '/placeholder-image.jpg'}
                alt={product.name}
                className={`object-cover object-center group-hover:opacity-75 ${
                  viewMode === 'list' ? 'w-full h-full' : 'h-40 sm:h-48 w-full'
                }`}
              />
            </div>
            <div className={viewMode === 'list' ? 'flex-1 flex flex-col justify-between' : 'p-3 md:p-4 flex flex-col flex-1'}>
              <div className="flex-1">
                <h3 className="text-sm sm:text-base md:text-lg font-medium text-gray-900 dark:text-gray-900 line-clamp-2">
                  {product.name}
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-600 line-clamp-2">
                  {product.description}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 dark:text-gray-900">
                    {product.dailyRate.toLocaleString('vi-VN')} VNĐ
                  </p>
                  {product.rating && (
                    <div className="flex items-center">
                      <span className="text-yellow-400 text-sm sm:text-base">★</span>
                      <span className="ml-1 text-xs sm:text-sm text-gray-600 dark:text-gray-600">
                        {product.rating}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-2 md:mt-3 flex flex-col sm:flex-row gap-2">
                <button 
                  onClick={() => handleAddToCart(product)}
                  className="flex-1 bg-black dark:bg-black text-white dark:text-white py-2 px-3 md:px-4 rounded-md text-xs sm:text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-800 transition-colors"
                >
                  Thuê ngay
                </button>
                <button 
                  onClick={() => handleViewDetails(product.id)}
                  className="flex-1 sm:flex-initial px-3 md:px-4 py-2 border-2 border-black dark:border-black rounded-md text-xs sm:text-sm font-medium text-black dark:text-black hover:bg-black hover:text-white dark:hover:bg-black dark:hover:text-white transition-colors"
                >
                  Chi tiết
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {renderPagination()}
    </div>
  );
}
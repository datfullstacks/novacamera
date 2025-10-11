'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { updateViewMode, updateSortBy } from '@/store/slices/filtersSlice';
import { addToCart } from '@/store/slices/cartSlice';
import { equipmentService, EquipmentSearchParams } from '@/lib/api/equipmentService';
import { Equipment } from '@/types';
import { EmptyState } from '../../atoms/ui/EmptyState';
import { ViewToggle } from '../../molecules/rental/ViewToggle';
import { SortDropdown } from '../../molecules/rental/SortDropdown';
import { showToast } from '../../atoms/ui/Toast';

interface ProductListSectionProps {
  className?: string;
}

export function ProductListSection({ className = '' }: ProductListSectionProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [products, setProducts] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Get filter state from Redux
  const filters = useAppSelector((state: any) => state.filters);
  const searchQuery = useAppSelector((state: any) => state.filters.searchQuery);
  const viewMode = useAppSelector((state: any) => state.filters.viewMode);
  const sortBy = useAppSelector((state: any) => state.filters.sortBy);

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
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Build search parameters from Redux state
        const searchParams: EquipmentSearchParams = {
          search: searchQuery || undefined,
          page: currentPage,
          limit: 12,
          categories: filters.categories.length > 0 ? filters.categories : undefined,
          brands: filters.brands.length > 0 ? filters.brands : undefined,
          minPrice: filters.priceRange[0] > 0 ? filters.priceRange[0] : undefined,
          maxPrice: filters.priceRange[1] < 10000000 ? filters.priceRange[1] : undefined,
          rating: filters.rating > 0 ? filters.rating : undefined,
          availableOnly: filters.availability || undefined,
          sortBy: sortBy === 'price-low' ? 'price' : sortBy === 'price-high' ? 'price' : sortBy === 'newest' ? 'createdAt' : sortBy,
          sortOrder: sortBy === 'price-high' ? 'desc' : sortBy === 'newest' ? 'desc' : 'asc',
        };

        const response = await equipmentService.searchEquipment(searchParams);

        if (response.success) {
          setProducts(response.data);
          setTotalPages(response.totalPages || 1);
          setTotalCount(response.totalCount || 0);
        } else {
          setError(response.message || 'Failed to fetch products');
        }
      } catch (err) {
        setError('An error occurred while fetching products');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters, searchQuery, currentPage, sortBy]);

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
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Sản phẩm
          </h2>
          <span className="text-sm text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
            {totalCount} sản phẩm
          </span>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Sort Dropdown */}
          <SortDropdown
            value={sortBy}
            onChange={handleSortChange}
            options={sortOptions}
          />
          
          {/* View Toggle */}
          <ViewToggle
            isGridView={viewMode === 'grid'}
            onToggle={handleViewModeChange}
          />
        </div>
      </div>

      {/* Product Grid */}
      <div className={viewMode === 'grid' 
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        : "flex flex-col space-y-4"
      }>
        {products.map((product) => (
          <div
            key={product.id}
            className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow ${
              viewMode === 'list' ? 'flex flex-row p-4' : ''
            }`}
          >
            <div className={`overflow-hidden rounded-lg bg-gray-200 ${
              viewMode === 'list' ? 'w-48 h-32 flex-shrink-0' : 'aspect-w-1 aspect-h-1 w-full rounded-t-lg'
            }`}>
              <img
                src={product.images?.[0]?.url || '/placeholder-image.jpg'}
                alt={product.name}
                className={`object-cover object-center group-hover:opacity-75 ${
                  viewMode === 'list' ? 'w-full h-full' : 'h-48 w-full'
                }`}
              />
            </div>
            <div className={viewMode === 'list' ? 'ml-4 flex-1 flex flex-col justify-between' : 'p-4'}>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white line-clamp-2">
                  {product.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                  {product.description}
                </p>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {product.dailyRate.toLocaleString('vi-VN')} VNĐ
                </p>
                {product.rating && (
                  <div className="flex items-center">
                    <span className="text-yellow-400">★</span>
                    <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
                      {product.rating}
                    </span>
                  </div>
                )}
              </div>
              <div className={`${viewMode === 'list' ? 'mt-2' : 'mt-3'} flex space-x-2`}>
                <button 
                  onClick={() => handleAddToCart(product)}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Thuê ngay
                </button>
                <button 
                  onClick={() => handleViewDetails(product.id)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
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
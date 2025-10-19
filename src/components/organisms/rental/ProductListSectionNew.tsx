'use client';

import { useEffect, useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import { equipmentService, EquipmentSearchParams } from '@/lib/api/equipmentService';
import { Equipment } from '@/types';
import { EmptyState } from '../../atoms/ui/EmptyState';

interface ProductListSectionProps {
  className?: string;
}

export function ProductListSection({ className = '' }: ProductListSectionProps) {
  const [products, setProducts] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Get filter state from Redux
  const filters = useAppSelector((state) => state.filters);
  const searchQuery = useAppSelector((state) => state.filters.searchQuery);

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
          sortBy: filters.sortBy || 'name',
          sortOrder: 'asc',
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
  }, [filters, searchQuery, currentPage]);

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
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-lg bg-gray-200">
              <img
                src={product.images?.[0]?.url || '/placeholder-image.jpg'}
                alt={product.name}
                className="h-48 w-full object-cover object-center group-hover:opacity-75"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white line-clamp-2">
                {product.name}
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                {product.description}
              </p>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {product.dailyRate.toLocaleString('vi-VN')} VNĐ/ngày
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
              <div className="mt-3 flex space-x-2">
                <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                  Thuê ngay
                </button>
                <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
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
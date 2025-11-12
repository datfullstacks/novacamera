'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { rentalService } from '@/lib/api/services/rental.service';
import { showToast } from '@/components/atoms/ui/Toast';
import type { RentalOrderResponse, RentalOrderUserFilterParams } from '@/types/api/order';
import { Search, Filter, ChevronDown, Calendar } from 'lucide-react';

interface OrdersTabProps {
  userId: number;
}

export const OrdersTab: React.FC<OrdersTabProps> = ({ userId }) => {
  const router = useRouter();
  
  // Orders state
  const [orders, setOrders] = useState<RentalOrderResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  
  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [sortBy, setSortBy] = useState('OrderDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const params: RentalOrderUserFilterParams = {
          pageNumber: currentPage,
          pageSize: pageSize,
          sortBy: sortBy,
          sortOrder: sortOrder,
        };

        // Add optional filters
        if (searchTerm) params.searchTerm = searchTerm;
        if (status) params.status = status;
        if (fromDate) params.fromDate = fromDate;
        if (toDate) params.toDate = toDate;

        const response = await rentalService.getUserRentalOrders(userId, params);

        if (response.data?.items) {
          setOrders(response.data.items);
          setTotalPages(response.data.totalPage || 1);
          setTotalItems(response.data.totalCount || 0);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Không thể tải danh sách đơn hàng');
        showToast({
          type: 'error',
          title: 'Lỗi',
          message: 'Không thể tải danh sách đơn hàng',
          duration: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchOrders();
    }
  }, [userId, currentPage, pageSize, searchTerm, status, fromDate, toDate, sortBy, sortOrder]);

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page
  };

  // Handle filter change
  const handleFilterChange = () => {
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Clear filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setStatus('');
    setFromDate('');
    setToDate('');
    setSortBy('OrderDate');
    setSortOrder('desc');
    setCurrentPage(1);
  };

  // Get status badge
  const getStatusBadge = (statusValue: string) => {
    const statusMap: Record<string, { label: string; class: string }> = {
      'Pending': { label: 'Chờ xác nhận', class: 'bg-yellow-100 text-yellow-800' },
      'Confirmed': { label: 'Đã xác nhận', class: 'bg-blue-100 text-blue-800' },
      'Rented': { label: 'Đang thuê', class: 'bg-green-100 text-green-800' },
      'Completed': { label: 'Hoàn thành', class: 'bg-gray-100 text-gray-800' },
      'Cancelled': { label: 'Đã hủy', class: 'bg-red-100 text-red-800' },
    };
    return statusMap[statusValue] || { label: statusValue, class: 'bg-gray-100 text-gray-800' };
  };

  // Navigate to order detail
  const handleViewOrderDetail = (orderId: number) => {
    router.push(`/profile/order/${orderId}`);
  };

  return (
    <div className="flex flex-col">
      {/* Header with Search and Filter */}
      <div className="mb-6 space-y-4">
        {/* Search Bar */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã đơn hàng, tên thiết bị..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2.5 border rounded-lg flex items-center gap-2 transition-colors ${
              showFilters ? 'bg-blue-50 border-blue-500 text-blue-600' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-5 h-5" />
            Lọc
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                <select
                  value={status}
                  onChange={(e) => { setStatus(e.target.value); handleFilterChange(); }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                >
                  <option value="">Tất cả</option>
                  <option value="Pending">Chờ xác nhận</option>
                  <option value="Confirmed">Đã xác nhận</option>
                  <option value="Rented">Đang thuê</option>
                  <option value="Completed">Hoàn thành</option>
                  <option value="Cancelled">Đã hủy</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sắp xếp theo</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                >
                  <option value="OrderDate">Ngày đặt</option>
                  <option value="TotalAmount">Tổng tiền</option>
                </select>
              </div>

              {/* From Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Từ ngày</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => { setFromDate(e.target.value); handleFilterChange(); }}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  />
                </div>
              </div>

              {/* To Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Đến ngày</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => { setToDate(e.target.value); handleFilterChange(); }}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Sort Order */}
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">Thứ tự:</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setSortOrder('desc')}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    sortOrder === 'desc' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Mới nhất
                </button>
                <button
                  onClick={() => setSortOrder('asc')}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    sortOrder === 'asc' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Cũ nhất
                </button>
              </div>
              <button
                onClick={handleClearFilters}
                className="ml-auto px-4 py-1.5 text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Xóa bộ lọc
              </button>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="text-sm text-gray-600">
          Tìm thấy <span className="font-semibold">{totalItems}</span> đơn hàng
        </div>
      </div>

      {/* Orders List */}
      <div className="flex-1 overflow-y-auto space-y-4">
        {isLoading && (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}

        {!isLoading && error && (
          <div className="text-center text-red-500 mt-8">{error}</div>
        )}

        {!isLoading && !error && orders.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <p className="text-lg mb-4">Không tìm thấy đơn hàng nào</p>
            {(searchTerm || status || fromDate || toDate) && (
              <button
                onClick={handleClearFilters}
                className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>
        )}

        {!isLoading && !error && orders.length > 0 && orders.map((order) => {
          const statusBadge = getStatusBadge(order.status || 'Pending');

          return (
            <div
              key={order.orderId}
              className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleViewOrderDetail(order.orderId)}
            >
              {/* Order Header */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-semibold text-gray-900">
                      Đơn hàng #{order.referenceNo}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge.class}`}>
                      {statusBadge.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Ngày đặt: {new Date(order.orderDate).toLocaleDateString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">Tổng tiền</p>
                  <p className="text-lg font-bold text-blue-600">
                    {order.totalAmount.toLocaleString('vi-VN')}đ
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-3">
                {order.orderDetails.slice(0, 2).map((item) => (
                  <div key={item.orderDetailId} className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.equipmentName || 'Equipment'}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{item.equipmentName}</p>
                      {item.brand && <p className="text-xs text-gray-500">{item.brand}</p>}
                      <p className="text-xs text-gray-500">
                        {new Date(item.rentalStartDate).toLocaleDateString('vi-VN')} - {new Date(item.rentalEndDate).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        {item.pricePerDay.toLocaleString('vi-VN')}đ/ngày
                      </p>
                    </div>
                  </div>
                ))}
                {order.orderDetails.length > 2 && (
                  <p className="text-xs text-gray-500 pl-20">
                    +{order.orderDetails.length - 2} thiết bị khác
                  </p>
                )}
              </div>

              {/* View Details Button */}
              <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end">
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                  Xem chi tiết
                  <ChevronDown className="w-4 h-4 -rotate-90" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {!isLoading && !error && totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Hiển thị:</label>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span className="text-sm text-gray-600">đơn hàng/trang</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Trước
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Sau
            </button>
          </div>

          <div className="text-sm text-gray-600">
            Trang {currentPage} / {totalPages}
          </div>
        </div>
      )}
    </div>
  );
};

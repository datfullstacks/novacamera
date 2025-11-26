'use client';

import { HTMLAttributes } from 'react';
import { EquipmentTableRow } from '../../molecules/equipment';

interface Equipment {
  readonly id: string;
  readonly name: string;
  readonly code: string;
  readonly status: 'available' | 'rented' | 'maintenance' | 'repair';
  readonly price: string;
  readonly usage: string;
  readonly image?: string;
}

interface EquipmentTableProps extends HTMLAttributes<HTMLDivElement> {
  readonly equipment: ReadonlyArray<Equipment>;
  readonly onEdit?: (equipment: Equipment) => void;
  readonly onDelete?: (equipment: Equipment) => void;
  readonly onView?: (equipment: Equipment) => void;
  readonly pagination?: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    pageSize: number;
    onPageChange: (page: number) => void;
  };
  readonly startIndex?: number; // Index bắt đầu cho row
}

export default function EquipmentTable({
  equipment,
  onEdit,
  onDelete,
  onView,
  pagination,
  startIndex = 0,
  className = '',
  ...props
}: EquipmentTableProps) {
  // Helper function to generate page numbers with ellipsis
  const generatePageNumbers = () => {
    if (!pagination) return [];
    
    const { currentPage, totalPages } = pagination;
    const pages: (number | string)[] = [];
    
    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push('...');
      }
      
      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('...');
      }
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div className={`bg-white shadow-sm rounded-lg overflow-hidden ${className}`} {...props}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                STT
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ảnh
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên thiết bị
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mã số
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Giá thuê (VND/ngày)
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {equipment.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <div className="text-gray-500">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Không có thiết bị</h3>
                    <p className="mt-1 text-sm text-gray-500">Chưa có thiết bị nào được thêm vào.</p>
                  </div>
                </td>
              </tr>
            ) : (
              equipment.map((item, index) => (
                <EquipmentTableRow
                  key={item.id}
                  equipment={item}
                  index={startIndex + index + 1}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onView={onView}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {pagination && pagination.totalPages > 1 && (
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 sm:px-6">
          <div className="flex items-center justify-between">
            {/* Showing X-Y of Z items */}
            <div className="hidden sm:block">
              <p className="text-sm text-gray-700">
                Hiển thị{' '}
                <span className="font-medium">
                  {(pagination.currentPage - 1) * pagination.pageSize + 1}
                </span>
                {' '}-{' '}
                <span className="font-medium">
                  {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalCount)}
                </span>
                {' '}trong tổng số{' '}
                <span className="font-medium">{pagination.totalCount}</span>
                {' '}thiết bị
              </p>
            </div>

            {/* Page Numbers and Navigation */}
            <div className="flex-1 flex justify-center sm:justify-end">
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                {/* Previous Button */}
                <button
                  onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                    pagination.currentPage === 1
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">Trang trước</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>

                {/* Page Numbers */}
                {generatePageNumbers().map((page, index) => {
                  if (page === '...') {
                    return (
                      <span
                        key={`ellipsis-${index}`}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                      >
                        ...
                      </span>
                    );
                  }

                  const pageNumber = page as number;
                  const isCurrentPage = pageNumber === pagination.currentPage;

                  return (
                    <button
                      key={pageNumber}
                      onClick={() => pagination.onPageChange(pageNumber)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        isCurrentPage
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}

                {/* Next Button */}
                <button
                  onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                    pagination.currentPage === pagination.totalPages
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">Trang sau</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



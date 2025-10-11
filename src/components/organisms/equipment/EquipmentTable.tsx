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
}

export default function EquipmentTable({
  equipment,
  onEdit,
  onDelete,
  onView,
  className = '',
  ...props
}: EquipmentTableProps) {
  return (
    <div className={`bg-white shadow-sm rounded-lg overflow-hidden ${className}`} {...props}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Giá thuê
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tần suất SD
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
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
              equipment.map((item) => (
                <EquipmentTableRow
                  key={item.id}
                  equipment={item}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onView={onView}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

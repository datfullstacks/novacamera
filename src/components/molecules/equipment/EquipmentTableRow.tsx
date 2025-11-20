'use client';

import { HTMLAttributes } from 'react';
import { useRouter } from 'next/navigation';
import { StatusBadge, ActionButton } from '../../atoms/equipment';

interface Equipment {
  readonly id: string;
  readonly name: string;
  readonly code: string;
  readonly status: 'available' | 'rented' | 'maintenance' | 'repair';
  readonly price: string;
  readonly usage: string;
  readonly image?: string;
}

interface EquipmentTableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  readonly equipment: Equipment;
  readonly index?: number; // STT của row
  readonly onEdit?: (equipment: Equipment) => void;
  readonly onDelete?: (equipment: Equipment) => void;
  readonly onView?: (equipment: Equipment) => void;
}

export default function EquipmentTableRow({
  equipment,
  index,
  onEdit,
  onDelete,
  onView,
  className = '',
  ...props
}: EquipmentTableRowProps) {
  const router = useRouter();

  const handleViewClick = () => {
    if (onView) {
      onView(equipment);
    } else {
      router.push(`/equipment/${equipment.id}`);
    }
  };
  const handleEdit = () => onEdit?.(equipment);
  const handleDelete = () => onDelete?.(equipment);

  return (
    <tr className={`hover:bg-gray-50 ${className}`} {...props}>
      {/* STT */}
      <td className="px-6 py-4 whitespace-nowrap text-center">
        <div className="text-sm font-medium text-gray-900">{index}</div>
      </td>

      {/* Ảnh */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
          {equipment.image ? (
            <img
              src={equipment.image}
              alt={equipment.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-400 text-xs">IMG</span>
          )}
        </div>
      </td>

      {/* Tên thiết bị */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{equipment.name}</div>
      </td>

      {/* Mã số */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500">{equipment.code}</div>
      </td>

      {/* Trạng thái */}
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge status={equipment.status} />
      </td>

      {/* Giá thuê */}
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <div className="text-sm font-medium text-gray-900">{equipment.price}</div>
      </td>

      {/* Hành động */}
      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
        <div className="flex items-center justify-center space-x-2">
          <ActionButton
            variant="secondary"
            size="sm"
            onClick={handleViewClick}
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            }
          >
            Xem
          </ActionButton>
          <ActionButton
            variant="primary"
            size="sm"
            onClick={handleEdit}
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            }
          >
            Sửa
          </ActionButton>
          <ActionButton
            variant="danger"
            size="sm"
            onClick={handleDelete}
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            }
          >
            Xóa
          </ActionButton>
        </div>
      </td>
    </tr>
  );
}

'use client';

import { HTMLAttributes } from 'react';
import AddEquipmentForm from './AddEquipmentForm';

interface EquipmentFormData {
  name: string;
  code: string;
  price: string;
  status: 'active' | 'inactive';
  manufacturer: string;
  category: string;
  serialNumber: string;
  purchaseDate: string;
  condition: string;
  rentalCount: string;
  description: string;
  images: File[];
  specs: Array<{ label: string; value: string }>;
  accessories: Array<{ name: string; included: boolean }>;
}

interface EquipmentFormModalProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSubmit'> {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: EquipmentFormData) => void;
  loading?: boolean;
}

export default function EquipmentFormModal({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
  className = '',
  ...props
}: EquipmentFormModalProps) {
  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 overflow-y-auto ${className}`} {...props}>
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <button 
          type="button"
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" 
          onClick={onClose}
          onKeyDown={(e) => e.key === 'Escape' && onClose()}
          aria-label="Close modal"
        />
        
        {/* Modal */}
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Thêm thiết bị mới
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <AddEquipmentForm
              onSubmit={onSubmit}
              onCancel={onClose}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

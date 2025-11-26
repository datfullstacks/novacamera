'use client';

import { HTMLAttributes, useState } from 'react';
import { FormInput, ActionButton } from '../../atoms/equipment';

interface Accessory {
  readonly name: string;
  readonly included: boolean;
}

interface AccessoryFieldProps extends HTMLAttributes<HTMLDivElement> {
  accessories: ReadonlyArray<Accessory>;
  onAccessoriesChange?: (accessories: Accessory[]) => void;
}

export default function AccessoryField({
  accessories,
  onAccessoriesChange,
  className = '',
  ...props
}: AccessoryFieldProps) {
  // Convert readonly array to mutable array for state
  const [localAccessories, setLocalAccessories] = useState<Accessory[]>([...accessories]);

  const addAccessory = () => {
    const newAccessories = [...localAccessories, { name: '', included: true }];
    setLocalAccessories(newAccessories);
    onAccessoriesChange?.(newAccessories);
  };

  const updateAccessory = (index: number, field: keyof Accessory, value: string | boolean) => {
    const newAccessories = localAccessories.map((accessory, i) =>
      i === index ? { ...accessory, [field]: value } : accessory
    );
    setLocalAccessories(newAccessories);
    onAccessoriesChange?.(newAccessories);
  };

  const removeAccessory = (index: number) => {
    const newAccessories = localAccessories.filter((_, i) => i !== index);
    setLocalAccessories(newAccessories);
    onAccessoriesChange?.(newAccessories);
  };

  return (
    <div className={`space-y-4 ${className}`} {...props}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Phụ kiện đi kèm</h3>
        <ActionButton
          type="button"
          variant="secondary"
          size="sm"
          onClick={addAccessory}
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          }
        >
          Thêm phụ kiện
        </ActionButton>
      </div>

      <div className="space-y-3">
        {localAccessories.map((accessory, index) => (
          <div key={index} className="flex gap-4 items-end">
            <div className="flex-1">
              <FormInput
                label="Tên phụ kiện"
                onChange={(value) => updateAccessory(index, 'name', value)}
                placeholder="Ví dụ: Pin Canon LP-E6NH"
                defaultValue={accessory.name}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={accessory.included}
                onChange={(e) => updateAccessory(index, 'included', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="text-sm text-gray-700">Có kèm theo</label>
            </div>
            <ActionButton
              type="button"
              variant="danger"
              size="sm"
              onClick={() => removeAccessory(index)}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              }
            >
              Xóa
            </ActionButton>
          </div>
        ))}
      </div>
    </div>
  );
}


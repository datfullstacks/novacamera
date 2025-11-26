'use client';

import { HTMLAttributes, useState } from 'react';
import { FormInput, ActionButton } from '../../atoms/equipment';

interface Spec {
  readonly label: string;
  readonly value: string;
}

interface SpecFieldProps extends HTMLAttributes<HTMLDivElement> {
  specs: ReadonlyArray<Spec>;
  onSpecsChange?: (specs: Spec[]) => void;
}

export default function SpecField({
  specs,
  onSpecsChange,
  className = '',
  ...props
}: SpecFieldProps) {
  // Convert readonly array to mutable array for state
  const [localSpecs, setLocalSpecs] = useState<Spec[]>([...specs]);

  const addSpec = () => {
    const newSpecs = [...localSpecs, { label: '', value: '' }];
    setLocalSpecs(newSpecs);
    onSpecsChange?.(newSpecs);
  };

  const updateSpec = (index: number, field: keyof Spec, value: string) => {
    const newSpecs = localSpecs.map((spec, i) =>
      i === index ? { ...spec, [field]: value } : spec
    );
    setLocalSpecs(newSpecs);
    onSpecsChange?.(newSpecs);
  };

  const removeSpec = (index: number) => {
    const newSpecs = localSpecs.filter((_, i) => i !== index);
    setLocalSpecs(newSpecs);
    onSpecsChange?.(newSpecs);
  };

  return (
    <div className={`space-y-4 ${className}`} {...props}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Thông số kỹ thuật</h3>
        <ActionButton
          type="button"
          variant="secondary"
          size="sm"
          onClick={addSpec}
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          }
        >
          Thêm thông số
        </ActionButton>
      </div>

      <div className="space-y-3">
        {localSpecs.map((spec, index) => (
          <div key={index} className="flex gap-4 items-end">
            <div className="flex-1">
              <FormInput
                label="Tên thông số"
                value={spec.label}
                onChange={(value) => updateSpec(index, 'label', value)}
                placeholder="Ví dụ: Cảm biến"
              />
            </div>
            <div className="flex-1">
              <FormInput
                label="Giá trị"
                value={spec.value}
                onChange={(value) => updateSpec(index, 'value', value)}
                placeholder="Ví dụ: CMOS Full-frame 45 megapixel"
              />
            </div>
            <ActionButton
              type="button"
              variant="danger"
              size="sm"
              onClick={() => removeSpec(index)}
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


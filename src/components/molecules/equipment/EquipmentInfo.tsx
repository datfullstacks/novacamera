'use client';

import { HTMLAttributes } from 'react';
import { ActionButton } from '../../atoms/equipment';

interface EquipmentInfoProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  code: string;
  price: string;
  details: Array<{
    label: string;
    value: string;
  }>;
  description: string;
  onRent?: () => void;
  onMaintenance?: () => void;
  onStopRent?: () => void;
}

export default function EquipmentInfo({
  name,
  code,
  price,
  details,
  description,
  onRent,
  onMaintenance,
  onStopRent,
  className = '',
  ...props
}: EquipmentInfoProps) {
  return (
    <div className={`space-y-6 ${className}`} {...props}>
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-zinc-800 leading-9 mb-2">
          {name}
        </h1>
        <p className="text-gray-500 text-sm font-normal leading-tight">
          Mã thiết bị: {code}
        </p>
        <p className="text-blue-500 text-2xl font-bold leading-loose">
          {price} / ngày
        </p>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-6">
        {details.map((detail, index) => (
          <div key={`${detail.label}-${index}`} className="space-y-1">
            <p className="text-gray-500 text-sm font-normal leading-tight">
              {detail.label}
            </p>
            <p className="text-zinc-800 text-base font-normal leading-snug">
              {detail.value}
            </p>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <ActionButton
          variant="success"
          onClick={onRent}
        >
          Đặt thuê ngay
        </ActionButton>
        <ActionButton
          variant="secondary"
          onClick={onMaintenance}
        >
          Báo bảo trì
        </ActionButton>
        <ActionButton
          variant="danger"
          onClick={onStopRent}
        >
          Ngừng cho thuê
        </ActionButton>
      </div>

      {/* Description */}
      <div>
        <p className="text-zinc-800 text-base font-normal leading-normal">
          {description}
        </p>
      </div>
    </div>
  );
}

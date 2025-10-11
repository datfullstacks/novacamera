'use client';

import { HTMLAttributes } from 'react';
import { BackButton, ActionButton } from '../../atoms/equipment';

interface EquipmentDetailHeaderProps extends HTMLAttributes<HTMLDivElement> {
  onBack?: () => void;
  onHistory?: () => void;
  onUpdate?: () => void;
}

export default function EquipmentDetailHeader({
  onBack,
  onHistory,
  onUpdate,
  className = '',
  ...props
}: EquipmentDetailHeaderProps) {
  return (
    <div className={`flex justify-between items-center ${className}`} {...props}>
      <BackButton onClick={onBack}>
        Quay lại danh sách thiết bị
      </BackButton>
      
      <div className="flex space-x-4">
        <ActionButton
          variant="secondary"
          onClick={onHistory}
          className="border border-zinc-200 text-neutral-700"
        >
          Lịch sử thuê
        </ActionButton>
        <ActionButton
          variant="primary"
          onClick={onUpdate}
        >
          Cập nhật thông tin
        </ActionButton>
      </div>
    </div>
  );
}


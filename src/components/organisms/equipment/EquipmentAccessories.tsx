'use client';

import { HTMLAttributes } from 'react';
import { ChecklistItem } from '../../atoms/equipment';

interface Accessory {
  readonly name: string;
  readonly included: boolean;
}

interface EquipmentAccessoriesProps extends HTMLAttributes<HTMLDivElement> {
  accessories: ReadonlyArray<Accessory>;
}

export default function EquipmentAccessories({
  accessories,
  className = '',
  ...props
}: EquipmentAccessoriesProps) {
  return (
    <div className={`space-y-4 ${className}`} {...props}>
      <h3 className="text-lg font-bold text-zinc-800 leading-relaxed">
        Phụ kiện đi kèm
      </h3>
      
      <div className="space-y-3">
        {accessories.map((accessory, index) => (
          <ChecklistItem
            key={`${accessory.name}-${index}`}
            text={accessory.name}
            checked={accessory.included}
          />
        ))}
      </div>
    </div>
  );
}

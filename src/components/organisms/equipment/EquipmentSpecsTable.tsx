'use client';

import { HTMLAttributes } from 'react';
import { SpecRow } from '../../atoms/equipment';

interface Spec {
  readonly label: string;
  readonly value: string;
}

interface EquipmentSpecsTableProps extends HTMLAttributes<HTMLDivElement> {
  specs: ReadonlyArray<Spec>;
}

export default function EquipmentSpecsTable({
  specs,
  className = '',
  ...props
}: EquipmentSpecsTableProps) {
  return (
    <div className={`bg-white rounded-lg border border-zinc-200 overflow-hidden ${className}`} {...props}>
      {specs.map((spec, index) => (
        <SpecRow
          key={`${spec.label}-${index}`}
          label={spec.label}
          value={spec.value}
          isHeader={index === 0}
        />
      ))}
    </div>
  );
}

'use client';

import { HTMLAttributes } from 'react';

interface FormSectionProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export default function FormSection({
  title,
  description,
  children,
  className = '',
  ...props
}: FormSectionProps) {
  return (
    <div className={`bg-white shadow rounded-lg p-6 ${className}`} {...props}>
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        {description && (
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        )}
      </div>
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
}


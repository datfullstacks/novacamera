'use client';

import { ReactNode, HTMLAttributes } from 'react';
import { Text } from '../atoms';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  children?: ReactNode;
  hoverable?: boolean;
}

export default function Card({
  title,
  description,
  children,
  hoverable = false,
  className = '',
  ...props
}: CardProps) {
  const hoverStyles = hoverable ? 'hover:shadow-lg transition-shadow' : '';

  return (
    <div
      className={`bg-white rounded-lg shadow-md p-6 ${hoverStyles} ${className}`}
      {...props}
    >
      {title && (
        <Text as="h3" variant="heading" className="mb-2">
          {title}
        </Text>
      )}
      {description && (
        <Text variant="body" className="mb-4 text-gray-600">
          {description}
        </Text>
      )}
      {children}
    </div>
  );
}
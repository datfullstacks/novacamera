'use client';

import { HTMLAttributes } from 'react';

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function Avatar({
  src,
  alt,
  name,
  size = 'md',
  className = '',
  ...props
}: AvatarProps) {
  const sizeStyles = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const textSizeStyles = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <div
      className={`${sizeStyles[size]} rounded-full overflow-hidden bg-gray-200 flex items-center justify-center ${className}`}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt={alt || name || 'Avatar'}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className={`${textSizeStyles[size]} font-medium text-gray-600`}>
          {name ? name.charAt(0).toUpperCase() : '?'}
        </span>
      )}
    </div>
  );
}


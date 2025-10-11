'use client';

import { HTMLAttributes } from 'react';

interface ThumbnailImageProps extends HTMLAttributes<HTMLButtonElement> {
  readonly src: string;
  readonly alt: string;
  readonly active?: boolean;
  readonly onClick?: () => void;
}

export default function ThumbnailImage({
  src,
  alt,
  active = false,
  onClick,
  className = '',
  ...props
}: ThumbnailImageProps) {
  return (
    <button
      type="button"
      className={`w-14 h-14 rounded overflow-hidden ${
        active 
          ? 'ring-2 ring-blue-500' 
          : 'ring-2 ring-transparent hover:ring-gray-300'
      } ${className}`}
      onClick={onClick}
      {...props}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
      />
    </button>
  );
}

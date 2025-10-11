import React from 'react';
import Image from 'next/image';
import { landingBorderRadius } from '@/styles/landing-theme';

export interface AvatarProps {
  src: string;
  alt: string;
  size?: number;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  size = 50,
  className = '',
}) => {
  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: landingBorderRadius.circle,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        style={{
          objectFit: 'cover',
        }}
      />
    </div>
  );
};

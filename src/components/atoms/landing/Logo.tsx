import React from 'react';
import Image from 'next/image';
import { landingShadows } from '@/styles/landing-theme';

export interface LogoProps {
  width?: number;
  height?: number;
  showText?: boolean;
  text?: string;
  textColor?: string;
  src?: string;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  width = 100,
  height = 32,
  showText = true,
  text = 'Nova Camera',
  textColor = '#120B0B',
  src = '/logo.png',
  className = '',
}) => {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        padding: '0 36px',
      }}
    >
      <Image
        src={src}
        alt={text}
        width={width}
        height={height}
       
      />
      
    </div>
  );
};

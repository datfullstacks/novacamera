'use client';

import { HTMLAttributes, ReactNode } from 'react';

interface TextProps extends HTMLAttributes<HTMLElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  variant?: 'title' | 'heading' | 'body' | 'caption';
  children: ReactNode;
}

export default function Text({
  as: Component = 'p',
  variant = 'body',
  children,
  className = '',
  ...props
}: TextProps) {
  const variantStyles = {
    title: 'text-4xl font-bold',
    heading: 'text-2xl font-semibold',
    body: 'text-base',
    caption: 'text-sm text-gray-600',
  };

  return (
    <Component
      className={`${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
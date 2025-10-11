'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';

export const CartIcon: React.FC = () => {
  const router = useRouter();
  const { totalItems } = useAppSelector((state) => state.cart);

  const handleCartClick = () => {
    router.push('/cart');
  };

  return (
    <button
      onClick={handleCartClick}
      className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
      aria-label="Shopping Cart"
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19"
        />
      </svg>
      
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </button>
  );
};
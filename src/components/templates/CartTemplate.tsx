import React from 'react';
import Header from '@/components/organisms/Header';
import { CartOrganism } from '@/components/organisms/cart/CartOrganism';
import Breadcrumb from '@/components/atoms/ui/Breadcrumb';

export const CartTemplate: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 mb-6 pt-8">
          <Breadcrumb className="text-sm" />
        </div>
        <CartOrganism />
      </main>
    </div>
  );
};

export default CartTemplate;
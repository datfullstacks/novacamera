import React from 'react';
import Header from '@/components/organisms/Header';
import { CartOrganism } from '@/components/organisms/cart/CartOrganism';
import Breadcrumb from '@/components/atoms/ui/Breadcrumb';
import PageFooter from '@/components/molecules/common/PageFooter';

export const CartTemplate: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 mb-6 pt-4 md:pt-6 bg-gray-50">
          <Breadcrumb className="text-sm" />
        </div>
        <CartOrganism />
      </main>
      <PageFooter />
    </div>
  );
};

export default CartTemplate;
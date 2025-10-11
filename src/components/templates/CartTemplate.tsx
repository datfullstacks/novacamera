import React from 'react';
import Header from '@/components/organisms/Header';
import { CartOrganism } from '@/components/organisms/cart/CartOrganism';

export const CartTemplate: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-20">
        <CartOrganism />
      </main>
    </div>
  );
};

export default CartTemplate;
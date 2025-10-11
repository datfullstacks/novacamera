'use client';

import React from 'react';
import { Equipment } from '@/types';
import Header from '@/components/organisms/Header';
import { ProductDetailMain, SimilarProducts } from '../organisms/product';
import { ProductTabs } from '../molecules/product';

interface ProductDetailTemplateProps {
  equipment: Equipment;
}

export const ProductDetailTemplate: React.FC<ProductDetailTemplateProps> = ({
  equipment,
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6 space-y-8">
          {/* Product Detail Main Section */}
          <ProductDetailMain equipment={equipment} />

          {/* Product Details Tabs */}
          <ProductTabs equipment={equipment} />

          {/* Similar Products */}
          <SimilarProducts />
        </div>
      </main>

      {/* Footer placeholder */}
      <footer className="bg-white border-t-4 border-black py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="text-gray-600">
            © 2025 Nova Camera, Inc. Tất cả quyền được bảo lưu.
          </div>
        </div>
      </footer>
    </div>
  );
};
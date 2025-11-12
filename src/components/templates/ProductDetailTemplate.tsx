'use client';

import React from 'react';
import { Equipment } from '@/types';
import Header from '@/components/organisms/Header';
import { ProductDetailMain, SimilarProducts } from '../organisms/product';
import { ProductTabs } from '../molecules/product';
import Breadcrumb from '@/components/atoms/ui/Breadcrumb';
import PageFooter from '@/components/molecules/common/PageFooter';

interface ProductDetailTemplateProps {
  equipment: Equipment;
}

export const ProductDetailTemplate: React.FC<ProductDetailTemplateProps> = ({
  equipment,
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-24 pb-16 bg-gray-50">
        {/* Breadcrumb */}
        <div className="py-4 bg-gray-50 mb-8">
          <div className="max-w-7xl mx-auto px-6 pt-4 md:pt-6">
            <Breadcrumb className="text-sm" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 space-y-8">
          {/* Product Detail Main Section */}
          <ProductDetailMain equipment={equipment} />

          {/* Product Details Tabs */}
          <ProductTabs equipment={equipment} />

          {/* Similar Products */}
          <SimilarProducts 
            products={equipment.relatedEquipments?.map(rel => ({
              id: rel.id,
              name: rel.name,
              price: rel.price,
              rating: rel.rating,
              reviews: rel.reviewCount,
              image: rel.image
            })) || []}
          />
        </div>
      </main>

      {/* Footer with spacing */}
      <div className="mt-12 md:mt-16">
        <PageFooter />
      </div>
    </div>
  );
};
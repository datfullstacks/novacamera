'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { ProductDetailTemplate } from '@/components/templates/ProductDetailTemplate';

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;

  return <ProductDetailTemplate productId={id} />;
}
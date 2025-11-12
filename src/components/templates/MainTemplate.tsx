'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { Header } from '../organisms';
import { LandingFooter } from '../organisms/landing/LandingFooter';
import Breadcrumb from '@/components/atoms/ui/Breadcrumb';

interface MainTemplateProps {
  children: ReactNode;
}

export default function MainTemplate({ children }: MainTemplateProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 pt-24 pb-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 mb-6 pt-4">
          <Breadcrumb className="text-sm" />
        </div>
        <div className="max-w-7xl mx-auto px-6">
          {children}
        </div>
      </main>
      <LandingFooter
        companyInfo="© 2024 Nova Camera. All rights reserved."
        columns={[
          {
            title: 'Về chúng tôi',
            content: (
              <div className="flex flex-col gap-2">
                <Link href="/about" className="text-gray-600 hover:text-blue-600">Giới thiệu</Link>
                <Link href="/contact" className="text-gray-600 hover:text-blue-600">Liên hệ</Link>
              </div>
            ),
          },
          {
            title: 'Dịch vụ',
            content: (
              <div className="flex flex-col gap-2">
                <Link href="/rental" className="text-gray-600 hover:text-blue-600">Thuê thiết bị</Link>
                <Link href="/products" className="text-gray-600 hover:text-blue-600">Sản phẩm</Link>
              </div>
            ),
          },
          {
            title: 'Hỗ trợ',
            content: (
              <div className="flex flex-col gap-2">
                <Link href="/faq" className="text-gray-600 hover:text-blue-600">FAQ</Link>
                <Link href="/policy" className="text-gray-600 hover:text-blue-600">Chính sách</Link>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
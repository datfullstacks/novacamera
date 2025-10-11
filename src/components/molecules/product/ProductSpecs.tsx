'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProductSpecsProps {
  specifications?: Record<string, string | number | boolean>;
  description?: string;
}

export const ProductSpecs: React.FC<ProductSpecsProps> = ({
  specifications,
  description,
}) => {
  const formatValue = (value: string | number | boolean) => {
    if (typeof value === 'boolean') {
      return value ? 'Có' : 'Không';
    }
    return value.toString();
  };

  return (
    <div className="space-y-6">
      {/* Specifications */}
      {specifications && Object.keys(specifications).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Thông số kỹ thuật</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                  </span>
                  <span className="text-gray-900">{formatValue(value)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Additional Description */}
      {description && (
        <Card>
          <CardHeader>
            <CardTitle>Mô tả chi tiết</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {description}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Usage Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle>Hướng dẫn sử dụng & Lưu ý</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Trước khi sử dụng:</h4>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Kiểm tra tình trạng thiết bị khi nhận hàng</li>
                <li>Đọc kỹ hướng dẫn sử dụng</li>
                <li>Kiểm tra pin và phụ kiện đi kèm</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Trong quá trình sử dụng:</h4>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Sử dụng đúng mục đích và trong điều kiện cho phép</li>
                <li>Tránh va đập mạnh, tiếp xúc với nước (trừ khi có khả năng chống nước)</li>
                <li>Bảo quản cẩn thận khi không sử dụng</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Khi trả hàng:</h4>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Vệ sinh sạch sẽ thiết bị</li>
                <li>Trả đầy đủ phụ kiện đi kèm</li>
                <li>Thông báo nếu có sự cố xảy ra trong quá trình sử dụng</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
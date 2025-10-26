'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { sepayService } from '@/lib/api/services/sepay.service';
import { Loader2 } from 'lucide-react';

interface PaymentQRCodeProps {
  orderId: number;
  amount: number;
  customerName: string;
}

export const PaymentQRCode: React.FC<PaymentQRCodeProps> = ({
  orderId,
  amount,
  customerName,
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [paymentContent, setPaymentContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        setIsLoading(true);
        setError('');

        // Get payment content from API
        const response = await sepayService.getPaymentContent({
          orderId,
          amount,
          customerName,
        });

        console.log('🔍 SePay API Response:', response);
        console.log('🔍 Response data type:', typeof response.data);
        console.log('🔍 Response data value:', response.data);

        if (response.statusCode === 200 && response.data) {
          // Ensure data is string, not object
          const contentString = typeof response.data === 'string' 
            ? response.data 
            : JSON.stringify(response.data);
          
          setPaymentContent(contentString);
          
          // Generate QR code URL
          const qrUrl = sepayService.generateQRCodeUrl(contentString, amount);
          setQrCodeUrl(qrUrl);
        } else {
          setError(response.message || 'Không thể tạo mã QR');
        }
      } catch (err) {
        console.error('Error generating QR code:', err);
        setError('Có lỗi xảy ra khi tạo mã QR');
      } finally {
        setIsLoading(false);
      }
    };

    generateQRCode();
  }, [orderId, amount, customerName]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-4" />
        <p className="text-gray-600">Đang tạo mã QR thanh toán...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="text-red-500 text-center">
          <p className="font-semibold mb-2">Lỗi tạo mã QR</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          Quét mã QR để thanh toán
        </h3>
        <p className="text-sm text-gray-600">
          Sử dụng ứng dụng ngân hàng của bạn để quét mã QR
        </p>
      </div>

      {/* QR Code */}
      {qrCodeUrl && (
        <div className="relative w-80 h-80 mb-6 bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
          <Image
            src={qrCodeUrl}
            alt="Payment QR Code"
            fill
            className="object-contain p-4"
            unoptimized // Important for external QR code URLs
          />
        </div>
      )}

      {/* Payment Details */}
      <div className="w-full max-w-md space-y-3 mb-4">
        <div className="flex justify-between items-center py-2 border-b border-gray-200">
          <span className="text-sm text-gray-600">Mã đơn hàng:</span>
          <span className="text-sm font-semibold text-gray-800">#{orderId}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-gray-200">
          <span className="text-sm text-gray-600">Số tiền:</span>
          <span className="text-lg font-bold text-blue-600">
            {amount.toLocaleString('vi-VN')}đ
          </span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-gray-200">
          <span className="text-sm text-gray-600">Tên khách hàng:</span>
          <span className="text-sm font-semibold text-gray-800">{customerName}</span>
        </div>
        {paymentContent && (
          <div className="flex flex-col py-2">
            <span className="text-sm text-gray-600 mb-1">Nội dung chuyển khoản:</span>
            <code className="text-xs font-mono bg-gray-100 p-2 rounded text-gray-800 break-all">
              {paymentContent}
            </code>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="w-full max-w-md bg-blue-50 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-800 mb-2">
          Hướng dẫn thanh toán:
        </h4>
        <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
          <li>Mở ứng dụng ngân hàng MBBank</li>
          <li>Chọn chức năng quét mã QR</li>
          <li>Quét mã QR phía trên</li>
          <li>Kiểm tra thông tin và xác nhận thanh toán</li>
        </ol>
        <p className="text-xs text-blue-600 mt-3">
          * Đơn hàng sẽ được xác nhận tự động sau khi thanh toán thành công
        </p>
      </div>
    </div>
  );
};

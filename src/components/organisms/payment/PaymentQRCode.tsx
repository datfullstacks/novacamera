'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { sepayService } from '@/lib/api/services/sepay.service';
import { rentalService } from '@/lib/api/services/rental.service';
import { showToast } from '@/components/atoms/ui/Toast';
import { Loader2, CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react';

interface PaymentQRCodeProps {
  orderId: number;
  amount: number;
  customerName: string;
}

type PaymentStatus = 'pending' | 'checking' | 'success' | 'failed' | 'timeout';

export const PaymentQRCode: React.FC<PaymentQRCodeProps> = ({
  orderId,
  amount,
  customerName,
}) => {
  const router = useRouter();
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [paymentContent, setPaymentContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  
  // Payment status tracking
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('pending');
  const [orderStatus, setOrderStatus] = useState<string>('Pending');
  const [timeRemaining, setTimeRemaining] = useState(15 * 60); // 15 minutes in seconds
  const [isManualChecking, setIsManualChecking] = useState(false);
  
  // Refs for cleanup
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

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

  // Payment status polling
  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        setPaymentStatus('checking');
        const response = await rentalService.getOrderStatus(orderId);
        
        if (response.statusCode === 200 && response.data) {
          const status = response.data; // response.data is the status string directly
          setOrderStatus(status);
          
          // Check for completion states
          if (status === 'Confirmed') {
            setPaymentStatus('success');
            clearPolling();
            
            showToast({
              type: 'success',
              title: 'Thanh toán thành công!',
              message: 'Đơn hàng của bạn đã được xác nhận. Đang chuyển hướng...',
              duration: 3000,
            });
            
            // Redirect after 3 seconds
            setTimeout(() => {
              router.push(`/orders/${orderId}`);
            }, 3000);
          } else if (status === 'Cancelled') {
            setPaymentStatus('failed');
            clearPolling();
            
            showToast({
              type: 'error',
              title: 'Đơn hàng đã bị hủy',
              message: 'Vui lòng tạo đơn hàng mới để tiếp tục.',
              duration: 5000,
            });
          } else {
            // Still pending, continue polling
            setPaymentStatus('pending');
          }
        }
      } catch (err) {
        console.error('Error checking payment status:', err);
        // Continue polling on error
        setPaymentStatus('pending');
      }
    };

    const clearPolling = () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }
    };

    // Start polling only after QR code is loaded
    if (!isLoading && qrCodeUrl) {
      // Initial check
      checkPaymentStatus();
      
      // Poll every 3 seconds
      pollingIntervalRef.current = setInterval(checkPaymentStatus, 3000);
      
      // Timeout after 15 minutes
      timeoutRef.current = setTimeout(() => {
        setPaymentStatus('timeout');
        clearPolling();
        
        showToast({
          type: 'warning',
          title: 'Hết thời gian chờ',
          message: 'Quá thời gian chờ thanh toán. Vui lòng kiểm tra lại hoặc tạo đơn mới.',
          duration: 5000,
        });
      }, 15 * 60 * 1000); // 15 minutes
    }

    // Cleanup on unmount
    return () => {
      clearPolling();
    };
  }, [orderId, isLoading, qrCodeUrl, router]);

  // Countdown timer
  useEffect(() => {
    if (paymentStatus === 'pending' || paymentStatus === 'checking') {
      countdownRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }
    };
  }, [paymentStatus]);

  // Manual refresh handler
  const handleManualRefresh = async () => {
    setIsManualChecking(true);
    try {
      const response = await rentalService.getOrderStatus(orderId);
      
      if (response.statusCode === 200 && response.data) {
        const status = response.data; // response.data is the status string directly
        setOrderStatus(status);
        
        if (status === 'Confirmed') {
          setPaymentStatus('success');
          showToast({
            type: 'success',
            title: 'Thanh toán thành công!',
            message: 'Đơn hàng của bạn đã được xác nhận.',
            duration: 3000,
          });
          
          setTimeout(() => {
            router.push(`/orders/${orderId}`);
          }, 2000);
        } else if (status === 'Cancelled') {
          setPaymentStatus('failed');
          showToast({
            type: 'error',
            title: 'Đơn hàng đã bị hủy',
            message: 'Vui lòng tạo đơn hàng mới.',
            duration: 5000,
          });
        } else {
          showToast({
            type: 'info',
            title: 'Đang chờ thanh toán',
            message: 'Đơn hàng vẫn đang chờ xác nhận thanh toán.',
            duration: 3000,
          });
        }
      }
    } catch (err) {
      console.error('Error manual checking:', err);
      showToast({
        type: 'error',
        title: 'Lỗi kiểm tra',
        message: 'Không thể kiểm tra trạng thái thanh toán. Vui lòng thử lại.',
        duration: 3000,
      });
    } finally {
      setIsManualChecking(false);
    }
  };

  // Format time remaining as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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

  // Payment status UI
  const getStatusUI = () => {
    switch (paymentStatus) {
      case 'checking':
        return (
          <div className="w-full max-w-md flex items-center justify-center gap-2 text-blue-600 bg-blue-50 p-3 rounded-lg mb-4">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="font-medium">Đang kiểm tra thanh toán...</span>
          </div>
        );
      case 'success':
        return (
          <div className="w-full max-w-md flex items-center justify-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg mb-4">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Thanh toán thành công! Đang chuyển hướng...</span>
          </div>
        );
      case 'failed':
        return (
          <div className="w-full max-w-md flex items-center justify-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg mb-4">
            <XCircle className="w-5 h-5" />
            <span className="font-medium">Đơn hàng đã bị hủy</span>
          </div>
        );
      case 'timeout':
        return (
          <div className="w-full max-w-md flex items-center justify-center gap-2 text-orange-600 bg-orange-50 p-3 rounded-lg mb-4">
            <Clock className="w-5 h-5" />
            <span className="font-medium">Hết thời gian chờ thanh toán</span>
          </div>
        );
      default:
        return (
          <div className="w-full max-w-md flex items-center justify-between bg-yellow-50 p-3 rounded-lg mb-4">
            <div className="flex items-center gap-2 text-yellow-700">
              <Clock className="w-5 h-5" />
              <span className="font-medium">Đang chờ thanh toán...</span>
            </div>
            <div className="text-yellow-700 font-mono font-bold">
              {formatTime(timeRemaining)}
            </div>
          </div>
        );
    }
  };

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

      {/* Payment Status */}
      {getStatusUI()}

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

      {/* Manual Refresh Button */}
      {(paymentStatus === 'pending' || paymentStatus === 'timeout') && (
        <button
          onClick={handleManualRefresh}
          disabled={isManualChecking}
          className="w-full max-w-md mb-4 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isManualChecking ? 'animate-spin' : ''}`} />
          <span>{isManualChecking ? 'Đang kiểm tra...' : 'Kiểm tra thanh toán'}</span>
        </button>
      )}

      {/* Payment Details */}
      <div className="w-full max-w-md space-y-3 mb-4">
        <div className="flex justify-between items-center py-2 border-b border-gray-200">
          <span className="text-sm text-gray-600">Mã đơn hàng:</span>
          <span className="text-sm font-semibold text-gray-800">#{orderId}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-gray-200">
          <span className="text-sm text-gray-600">Trạng thái:</span>
          <span className="text-sm font-semibold text-gray-800">{orderStatus}</span>
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
          <li>Hệ thống sẽ tự động cập nhật khi thanh toán thành công</li>
        </ol>
        <p className="text-xs text-blue-600 mt-3">
          * Đơn hàng sẽ được xác nhận tự động sau khi thanh toán thành công
        </p>
      </div>
    </div>
  );
};

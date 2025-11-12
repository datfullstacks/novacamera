'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { sepayService } from '@/lib/api/services/sepay.service';
import { rentalService } from '@/lib/api/services/rental.service';
import { showToast } from '@/components/atoms/ui/Toast';
import { Loader2, CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react';
import { RentalOrderStatus } from '@/types/api/order';

interface PaymentQRCodeProps {
  orderId: number;
  amount: number;
  customerName: string;
}

// Payment status type definition 
type TPaymentStatus = 'pending' | 'success' | 'failed' | 'timeout';

// Cookie helper functions
const PAYMENT_TIMEOUT_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

const setCookie = (name: string, value: string, maxAge: number) => {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Lax`;
};

const deleteCookie = (name: string) => {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; path=/; max-age=0`;
};

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
  const [paymentStatus, setPaymentStatus] = useState<TPaymentStatus>('pending');
  const [orderStatus, setOrderStatus] = useState<string>('Pending');
  const [timeRemaining, setTimeRemaining] = useState(15 * 60); // 15 minutes in seconds
  const [isManualChecking, setIsManualChecking] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  
  // Refs for cleanup
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const paymentStartTimeRef = useRef<number | null>(null);

  // Initialize payment start time from cookie or create new
  useEffect(() => {
    const cookieName = `payment_start_${orderId}`;
    const savedStartTime = getCookie(cookieName);
    
    if (savedStartTime) {
      // Resume from saved time
      const startTime = Number.parseInt(savedStartTime, 10);
      paymentStartTimeRef.current = startTime;
      
      // Calculate remaining time
      const now = Date.now();
      const elapsed = now - startTime;
      const remaining = Math.max(0, PAYMENT_TIMEOUT_DURATION - elapsed);
      
      if (remaining === 0) {
        // Already expired
        setPaymentStatus('timeout');
        setTimeRemaining(0);
      } else {
        setTimeRemaining(Math.floor(remaining / 1000));
      }
    } else {
      // First time - create new start time
      const now = Date.now();
      paymentStartTimeRef.current = now;
      setCookie(cookieName, now.toString(), 15 * 60); // 15 minutes
      setTimeRemaining(15 * 60);
    }
  }, [orderId]);

  // Auto-cancel order when timeout
  const handleTimeout = async () => {
    setPaymentStatus('timeout');
    setIsCancelling(true);
    
    try {
      // Call API to cancel order
      await rentalService.updateOrderStatus(orderId, {
        status: RentalOrderStatus.CANCELLED,
        note: 'Tự động hủy do hết thời gian thanh toán',
        updatedBy: customerName,
      });
      
      // Delete cookie
      deleteCookie(`payment_start_${orderId}`);
      
      showToast({
        type: 'warning',
        title: 'Hết thời gian thanh toán',
        message: 'Đơn hàng đã bị hủy tự động do quá thời gian chờ thanh toán.',
        duration: 5000,
      });
    } catch (err) {
      console.error('Error cancelling order:', err);
      showToast({
        type: 'error',
        title: 'Lỗi hủy đơn hàng',
        message: 'Không thể hủy đơn hàng tự động. Vui lòng liên hệ hỗ trợ.',
        duration: 5000,
      });
    } finally {
      setIsCancelling(false);
    }
  };

  // Generate QR Code
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
        // Don't change status to 'checking' during auto-polling to avoid UI flicker
        const response = await rentalService.getOrderStatus(orderId);
        
        if (response.statusCode === 200 && response.data) {
          // Handle both string and object response
          let status: string;
          if (typeof response.data === 'string') {
            status = response.data;
          } else if (typeof response.data === 'object' && response.data !== null) {
            // If it's an object, try to extract status field
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            status = (response.data as any).status || (response.data as any).statusValue || 'Pending';
          } else {
            status = 'Pending';
          }
          
          setOrderStatus(status);
          
          // Check for completion states
          if (status === 'Confirmed') {
            setPaymentStatus('success');
            clearPolling();
            
            // Delete payment timer cookie on success
            deleteCookie(`payment_start_${orderId}`);
            
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
            
            // Delete payment timer cookie on cancellation
            deleteCookie(`payment_start_${orderId}`);
            
            showToast({
              type: 'error',
              title: 'Đơn hàng đã bị hủy',
              message: 'Vui lòng tạo đơn hàng mới để tiếp tục.',
              duration: 5000,
            });
          }
          // If still pending, keep status as 'pending' without changing
        }
      } catch (err) {
        console.error('Error checking payment status:', err);
        // Continue polling on error without changing UI state
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

    // Start polling only after QR code is loaded and not already timed out
    if (!isLoading && qrCodeUrl && paymentStatus !== 'timeout') {
      // Initial check
      checkPaymentStatus();
      
      // Poll every 3 seconds
      pollingIntervalRef.current = setInterval(checkPaymentStatus, 3000);
      
      // Calculate remaining timeout based on saved start time
      if (paymentStartTimeRef.current) {
        const now = Date.now();
        const elapsed = now - paymentStartTimeRef.current;
        const remainingTimeout = Math.max(0, PAYMENT_TIMEOUT_DURATION - elapsed);
        
        if (remainingTimeout > 0) {
          // Set timeout for remaining time
          timeoutRef.current = setTimeout(() => {
            handleTimeout();
            clearPolling();
          }, remainingTimeout);
        } else {
          // Already timed out
          handleTimeout();
        }
      }
    }

    // Cleanup on unmount
    return () => {
      clearPolling();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId, isLoading, qrCodeUrl, router, paymentStatus]);

  // Countdown timer
  useEffect(() => {
    if (paymentStatus === 'pending') {
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
        // Handle both string and object response
        let status: string;
        if (typeof response.data === 'string') {
          status = response.data;
        } else if (typeof response.data === 'object' && response.data !== null) {
          // If it's an object, try to extract status field
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          status = (response.data as any).status || (response.data as any).statusValue || 'Pending';
        } else {
          status = 'Pending';
        }
        
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

  // Timeout expired layout
  if (paymentStatus === 'timeout') {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-lg">
        {/* Timeout Header */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-orange-100 flex items-center justify-center">
            <Clock className="w-10 h-10 text-orange-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            Hết thời gian thanh toán
          </h3>
          <p className="text-gray-600">
            Đơn hàng #{orderId} đã hết thời gian chờ thanh toán
          </p>
        </div>

        {/* Timeout Status */}
        <div className="w-full max-w-md bg-orange-50 border-2 border-orange-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <XCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-orange-800 mb-1">
                Đơn hàng đã bị hủy tự động
              </h4>
              <p className="text-sm text-orange-700">
                Do không nhận được thanh toán trong vòng 15 phút, đơn hàng đã được hủy tự động. 
                {isCancelling && ' Đang xử lý hủy đơn...'}
              </p>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="w-full max-w-md space-y-3 mb-6">
          <div className="flex justify-between items-center py-2 border-b border-gray-200">
            <span className="text-sm text-gray-600">Mã đơn hàng:</span>
            <span className="text-sm font-semibold text-gray-800">#{orderId}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-200">
            <span className="text-sm text-gray-600">Số tiền:</span>
            <span className="text-lg font-bold text-gray-600 line-through">
              {amount.toLocaleString('vi-VN')}đ
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-200">
            <span className="text-sm text-gray-600">Trạng thái:</span>
            <span className="text-sm font-semibold text-orange-600">Đã hủy</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-gray-600">Thời gian hết hạn:</span>
            <span className="text-sm font-mono text-gray-800">00:00</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full max-w-md space-y-3">
          <button
            onClick={() => router.push('/rental')}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
          >
            Đặt hàng mới
          </button>
          <button
            onClick={() => router.push('/orders')}
            className="w-full px-6 py-3 bg-white text-gray-700 font-medium rounded-lg border-2 border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Xem đơn hàng của tôi
          </button>
        </div>

        {/* Info Box */}
        <div className="w-full max-w-md bg-blue-50 rounded-lg p-4 mt-6">
          <h4 className="text-sm font-semibold text-blue-800 mb-2">
            💡 Lưu ý:
          </h4>
          <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
            <li>Đơn hàng đã bị hủy và không thể khôi phục</li>
            <li>Nếu bạn đã thanh toán, vui lòng liên hệ hỗ trợ</li>
            <li>Bạn có thể tạo đơn hàng mới bất cứ lúc nào</li>
          </ul>
        </div>
      </div>
    );
  }

  // Payment status UI
  const getStatusUI = (): React.ReactNode => {
    const status: TPaymentStatus = paymentStatus;
    switch (status) {
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
      default:
        if (status === ('timeout' as TPaymentStatus)) {
          return (
            <div className="w-full max-w-md flex items-center justify-center gap-2 text-orange-600 bg-orange-50 p-3 rounded-lg mb-4">
              <Clock className="w-5 h-5" />
              <span className="font-medium">Hết thời gian chờ thanh toán</span>
            </div>
          );
        }
        return (
          <div className="w-full max-w-md bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg mb-4 border border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-blue-700">
                <Clock className="w-5 h-5 animate-pulse" />
                <span className="font-semibold">Đang chờ thanh toán</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-600">Thời gian còn lại:</span>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-blue-700 font-mono tabular-nums">
                  {formatTime(timeRemaining)}
                </div>
                <div className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin opacity-20"></div>
              </div>
            </div>
            <div className="mt-2 h-1.5 bg-blue-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-1000 ease-linear"
                style={{ 
                  width: `${(timeRemaining / (15 * 60)) * 100}%` 
                }}
              ></div>
            </div>
            <p className="text-xs text-blue-500 mt-2 text-center">
              Hệ thống tự động kiểm tra mỗi 3 giây
            </p>
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
      {qrCodeUrl && paymentStatus !== ('timeout' as TPaymentStatus) && (
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
      {paymentStatus === 'pending' && (
        <button
          onClick={handleManualRefresh}
          disabled={isManualChecking}
          className={`
            w-full max-w-md mb-4 flex items-center justify-center gap-2 
            px-6 py-3 rounded-lg font-medium
            transition-all duration-300 ease-in-out
            ${isManualChecking 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
            }
            text-white
          `}
        >
          {isManualChecking ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Đang kiểm tra...</span>
            </>
          ) : (
            <>
              <RefreshCw className="w-5 h-5" />
              <span>Kiểm tra thanh toán ngay</span>
            </>
          )}
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

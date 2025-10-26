"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { clearCart } from "@/store/slices/cartSlice";
import { CheckoutForm } from "@/components/organisms/checkout/CheckoutForm";
import { PaymentQRCode } from "@/components/organisms/payment/PaymentQRCode";
import { showToast } from "@/components/atoms/ui/Toast";
import { rentalService } from "@/lib/api/services/rental.service";
import type {
  CreateRentalOrderRequest,
  RentalOrderItemDto,
  CustomerInfoDto,
  DeliveryInfoDto,
  PaymentInfoDto,
} from "@/types/api";
import Header from "@/components/organisms/Header";
import Breadcrumb from "@/components/atoms/ui/Breadcrumb";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export const CheckoutTemplate: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items, totalPrice } = useAppSelector((state) => state.cart);
  const authState = useAppSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [orderCreated, setOrderCreated] = useState(false);
  const [orderData, setOrderData] = useState<{
    orderId: number;
    amount: number;
    customerName: string;
  } | null>(null);

  const handleCheckout = async (formData: {
    customerInfo: CustomerInfoDto;
    deliveryInfo: DeliveryInfoDto;
    paymentInfo: PaymentInfoDto;
    requireInsurance: boolean;
    couponCode?: string;
  }) => {
    try {
      setIsLoading(true);

      // Map cart items to rental order items
      const orderItems: RentalOrderItemDto[] = items.map((item) => {
        // Start date: tomorrow (to avoid timezone/past date issues)
        const startDate = new Date();
        startDate.setDate(startDate.getDate() + 1);
        startDate.setHours(0, 0, 0, 0); // Set to beginning of day
        
        // End date: start date + rental days
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + item.rentalDays);

        return {
          equipmentId: parseInt(item.id),
          rentalStartDate: startDate.toISOString(),
          rentalEndDate: endDate.toISOString(),
          quantity: item.quantity,
          notes: item.description || "",
          preferredEquipmentItemIds: null,
        };
      });

      // Build rental order request
      const request: CreateRentalOrderRequest = {
        userId: authState.user?.userId ?? 0,
        items: orderItems,
        note: "",
        customerInfo: formData.customerInfo,
        deliveryInfo: {
          deliveryMethod: "tại nhà",
          deliveryAddress: "",
           preferredDeliveryTime: null,
          deliveryNotes: "",
        },
        paymentInfo: {
          ...formData.paymentInfo,
          paymentMethod: "BankTransfer", // Always use BankTransfer regardless of UI selection
        },
        couponCode: formData.couponCode ?? null,
        discountAmount: 0,
        requireInsurance: formData.requireInsurance,
        insuranceAmount: formData.requireInsurance ? 400000 : 0,
        isOfflineOrder: false,
      };

      console.log("📦 Creating rental order:", request);

      // Call API to create rental order
      const response = await rentalService.createRentalOrder(request);

      console.log("✅ Order created successfully:", response);

      // Clear cart
      dispatch(clearCart());

      // Calculate final amount (use totalAmount from API if available, otherwise calculate)
      const finalAmount = response.data?.totalAmount || (totalPrice + (formData.requireInsurance ? 400000 : 0));
      
      // Get customer name from API response or fallback to form data
      const customerName = response.data?.customerInfo?.fullName || formData.customerInfo.fullName;

      // Set order data for QR code display
      setOrderData({
        orderId: response.data?.orderId || 0,
        amount: finalAmount,
        customerName: customerName,
      });

      setOrderCreated(true);

      // Show success toast
      showToast({
        type: "success",
        title: "Đặt hàng thành công",
        message: `Đơn hàng #${response.data?.orderId || 'N/A'} đã được tạo thành công! Vui lòng quét mã QR để thanh toán.`,
        duration: 5000,
      });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("❌ Checkout error:", error);

      // Extract error message from API response
      let errorMessage = "Có lỗi xảy ra khi tạo đơn hàng";
      
      if (error?.response?.data) {
        const apiError = error.response.data;
        
        // Handle errors array from backend
        if (apiError.errors && Array.isArray(apiError.errors) && apiError.errors.length > 0) {
          errorMessage = apiError.errors.join('\n');
        } 
        // Handle message field
        else if (apiError.message) {
          errorMessage = apiError.message;
          // Append errors if available
          if (apiError.errors && Array.isArray(apiError.errors) && apiError.errors.length > 0) {
            errorMessage += '\n\n' + apiError.errors.join('\n');
          }
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      showToast({
        type: "error",
        title: "Lỗi đặt hàng",
        message: errorMessage,
        duration: 7000, // Longer duration for error messages
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user is logged in
  if (!authState.isAuthenticated || !authState.user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Vui lòng đăng nhập để tiếp tục thanh toán
              </h2>
              <p className="text-gray-600 mb-6">
                Bạn cần đăng nhập để có thể đặt hàng và thanh toán
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => router.push("/login?redirect=/checkout")}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Đăng nhập
                </button>
                <button
                  onClick={() => router.push("/rental")}
                  className="inline-flex items-center px-6 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  Tiếp tục mua sắm
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // If order created successfully, show QR code payment (CHECK THIS FIRST before cart empty check)
  if (orderCreated && orderData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />

        <main className="pt-24 pb-16">
          <div className="max-w-4xl mx-auto px-6">
            {/* Breadcrumb */}
            <div className="mb-6">
              <Breadcrumb className="text-sm" />
            </div>

            <h1 className="text-2xl font-bold text-gray-800 mb-8 text-center">
              Thanh toán đơn hàng
            </h1>

            {/* QR Code Payment */}
            <PaymentQRCode
              orderId={orderData.orderId}
              amount={orderData.amount}
              customerName={orderData.customerName}
            />

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center mt-8">
              <Button
                onClick={() => router.push('/rental')}
                variant="outline"
                className="min-w-[200px]"
              >
                Tiếp tục mua sắm
              </Button>
              <Button
                onClick={() => {
                  // TODO: Navigate to order detail page when available
                  router.push('/rental');
                }}
                className="min-w-[200px] bg-blue-600 hover:bg-blue-700"
              >
                Xem đơn hàng
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // If cart is empty, redirect to rental
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Giỏ hàng của bạn đang trống
              </h2>
              <button
                onClick={() => router.push("/rental")}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Khám phá thiết bị
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Breadcrumb className="text-sm" />
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-8">Thanh toán</h1>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-7">
              <CheckoutForm
                onSubmit={handleCheckout}
                isLoading={isLoading}
                totalAmount={totalPrice}
              />
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                  Đơn hàng của bạn
                </h2>

                {/* Cart Items */}
                <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-16 h-16 relative bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.imageUrl || "/images/placeholder.jpg"}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-800 truncate">
                          {item.name}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          SL: {item.quantity} × {item.rentalDays} ngày
                        </p>
                        <p className="text-sm font-medium text-gray-800 mt-1">
                          {(
                            (item.dailyRate || item.price || 0) *
                            item.quantity *
                            item.rentalDays
                          ).toLocaleString("vi-VN")}
                          đ
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-bold text-gray-800">
                    <span>Tổng cộng</span>
                    <span>{totalPrice.toLocaleString("vi-VN")}đ</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutTemplate;

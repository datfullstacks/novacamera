import { apiClient } from '../client';
import type { ApiResponse } from '@/types/api';

/**
 * SePay Payment Service
 * Handles SePay payment-related API calls
 */

export interface PaymentContentResponse {
  statusCode: number;
  message: string;
  data: string; // Payment content string for QR code
  errors: string[];
}

export interface GenerateQRCodeParams {
  orderId: number;
  amount: number;
  customerName: string;
}

export const sepayService = {
  /**
   * Generate payment content for SePay QR code
   */
  getPaymentContent: async (params: GenerateQRCodeParams): Promise<PaymentContentResponse> => {
    const response: ApiResponse<string> = await apiClient.get<string>(
      '/sepay/payment-content',
      { params: params as unknown as Record<string, string | number | boolean | undefined> }
    );
    
    console.log('🔍 Raw API Response:', response);
    console.log('🔍 Response.data type:', typeof response.data);
    console.log('🔍 Response.data value:', response.data);
    
    // apiClient returns ApiResponse<T> format: { data, message, statusCode, errors }
    // Sometimes backend returns nested structure: { data: { paymentContent: "string" } }
    let dataString = '';
    
    if (typeof response.data === 'string') {
      dataString = response.data;
    } else if (response.data && typeof response.data === 'object') {
      // Check if it's nested structure with paymentContent key
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const dataObj = response.data as any;
      if (dataObj.paymentContent && typeof dataObj.paymentContent === 'string') {
        dataString = dataObj.paymentContent;
      } else {
        // Fallback: stringify the object
        dataString = JSON.stringify(response.data);
      }
    } else {
      dataString = String(response.data || '');
    }
    
    // Ensure errors is array
    const errorsArray = Array.isArray(response.errors) 
      ? response.errors 
      : (response.errors ? [String(response.errors)] : []);
    
    const result = {
      statusCode: response.statusCode || 200,
      message: response.message || '',
      data: dataString,
      errors: errorsArray,
    };
    
    console.log('🔍 Processed Response:', result);
    
    return result;
  },

  /**
   * Generate QR code URL for payment
   * @param paymentContent - Content from getPaymentContent API
   * @param amount - Payment amount
   */
  generateQRCodeUrl: (paymentContent: string, amount: number): string => {
    const qrParams = new URLSearchParams({
      acc: '00001205984',
      bank: 'MBBank',
      amount: amount.toString(),
      des: paymentContent,
      template: 'compact', // or 'TEMPLATE' based on your preference
    });

    return `https://qr.sepay.vn/img?${qrParams.toString()}`;
  },
};

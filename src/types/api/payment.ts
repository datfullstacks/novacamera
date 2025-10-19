import { ApiResponse } from './base';

// SePay Webhook Request
export interface SePayWebhookRequest {
  id: number;
  gateway: string | null;
  transactionDate: string | null;
  accountNumber: string | null;
  code: string | null;
  content: string | null;
  transferType: string | null;
  transferAmount: number;
  accumulated: number;
  subAccount: string | null;
  referenceCode: string | null;
  description: string | null;
}

// Payment Content Request
export interface PaymentContentRequest {
  orderId?: number;
  amount?: number;
  customerName?: string;
}

// Payment Information Model
export interface PaymentInformationModel {
  orderType: string | null;
  amount: number;
  orderDescription: string | null;
  name: string | null;
}

// API Response Types
export type SePayWebhookApiResponse = ApiResponse<string>;
export type PaymentContentApiResponse = ApiResponse<string>;

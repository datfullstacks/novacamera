import { ApiResponse } from './base';

// Ask Request (Chat AI)
export interface AskRequest {
  question: string | null;
}

// Ask Response
export interface AskResponse {
  answer: string;
  contextProducts?: {
    equipmentId: number;
    name: string | null;
    brand: string | null;
    description: string | null;
    pricePerDay: number;
    depositFee: number | null;
    stock: number | null;
    category: string | null;
    imageUrl: string | null;
  }[];
  relatedEquipment?: number[];
}

// Index Response
export interface IndexResponse {
  message: string;
  indexed: number;
}

// API Response Types
export type AskApiResponse = ApiResponse<AskResponse>;
export type IndexApiResponse = ApiResponse<IndexResponse>;

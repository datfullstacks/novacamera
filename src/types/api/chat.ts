import { ApiResponse } from './base';

// Ask Request (Chat AI)
export interface AskRequest {
  question: string | null;
}

// Ask Response
export interface AskResponse {
  answer: string;
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

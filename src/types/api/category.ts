import { ApiResponse } from './base';

// Category Response
export interface CategoryResponse {
  categoryId: number;
  categoryName: string | null;
  description: string | null;
  slug: string | null;
  equipmentCount?: number;
}

// API Response Types
export type CategoryListApiResponse = ApiResponse<CategoryResponse[]>;
export type CategoryDetailApiResponse = ApiResponse<CategoryResponse>;

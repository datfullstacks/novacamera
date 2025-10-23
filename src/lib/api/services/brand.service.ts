import { apiClient } from '../client';

/**
 * Brand API Response Type
 */
export interface BrandResponse {
  brandId: number;
  brandName: string;
  equipmentCount?: number;
}

export interface BrandListApiResponse {
  statusCode: number;
  message: string | null;
  data: BrandResponse[];
}

/**
 * Brand Service
 * Handles all brand-related API calls
 */
export const brandService = {
  /**
   * Get all brands
   */
  getBrands: async (): Promise<BrandListApiResponse> => {
    const response = await apiClient.get<BrandResponse[]>('/Brand');
    return response;
  },
};

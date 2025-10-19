import { apiClient } from '../client';
import type { CategoryListApiResponse } from '@/types/api';

/**
 * Category Service
 * Handles all category-related API calls
 */
export const categoryService = {
  /**
   * Get all categories
   */
  getCategories: async (): Promise<CategoryListApiResponse> => {
    const response = await apiClient.get<CategoryListApiResponse['data']>('/Category');
    return response;
  },
};

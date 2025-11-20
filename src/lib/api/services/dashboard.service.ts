import { apiClient } from '../client';
import type {
  DashboardSummaryApiResponse,
  UpcomingRentalsApiResponse,
} from '@/types/api';

/**
 * Dashboard Service
 * Handles all dashboard-related API calls
 */
export const dashboardService = {
  /**
   * Get dashboard summary
   */
  getSummary: async (): Promise<DashboardSummaryApiResponse> => {
    const response = await apiClient.get<DashboardSummaryApiResponse['data']>('/Dashboard/summary');
    return response;
  },

  /**
   * Get upcoming rentals (next 7 days)
   */
  getUpcomingRentals: async (): Promise<UpcomingRentalsApiResponse> => {
    const response = await apiClient.get<UpcomingRentalsApiResponse['data']>('/Dashboard/upcoming-rentals');
    return response;
  },

  /**
   * Get monthly revenue data for current year
   */
  getMonthlyRevenue: async () => {
    const response = await apiClient.get<Record<string, number>>('/Dashboard/revenue-in-months');
    return response;
  },

  /**
   * Get popular equipment (top 5)
   */
  getPopularEquipment: async () => {
    const response = await apiClient.get<Array<{
      equipmentId: number;
      name: string;
      tagline: string;
      brand: string;
      mainImageUrl: string;
      pricePerDay: number;
      rating: number;
      reviewCount: number;
      isAvailable: boolean;
      location: string;
      categoryName: string;
      formattedPrice: string;
      ratingDisplay: string;
      reviewDisplay: string;
      availabilityDisplay: string;
      availabilityClass: string;
    }>>('/Equipment/popular');
    return response;
  },
};

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
};

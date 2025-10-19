'use client';

/**
 * Dashboard Query Hooks
 * Custom hooks for dashboard data queries
 */

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { dashboardService } from '@/lib/api/services';
import { QUERY_KEYS } from '../query-keys';
import type {
  DashboardSummaryApiResponse,
  UpcomingRentalsApiResponse,
} from '@/types/api';

/**
 * Get dashboard summary statistics
 */
export function useDashboardSummary(
  options?: Omit<UseQueryOptions<DashboardSummaryApiResponse>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: QUERY_KEYS.DASHBOARD.SUMMARY,
    queryFn: () => dashboardService.getSummary(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  });
}

/**
 * Get upcoming rentals
 */
export function useUpcomingRentals(
  options?: Omit<UseQueryOptions<UpcomingRentalsApiResponse>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: QUERY_KEYS.DASHBOARD.UPCOMING_RENTALS(),
    queryFn: () => dashboardService.getUpcomingRentals(),
    staleTime: 1000 * 60 * 2, // 2 minutes
    ...options,
  });
}

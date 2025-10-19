'use client';

/**
 * Category Query Hooks
 * Custom hooks for category-related queries
 */

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { categoryService } from '@/lib/api/services';
import { QUERY_KEYS } from '../query-keys';
import type { CategoryListApiResponse } from '@/types/api';

/**
 * Get all categories
 */
export function useCategories(
  options?: Omit<UseQueryOptions<CategoryListApiResponse>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: QUERY_KEYS.CATEGORY.LIST,
    queryFn: () => categoryService.getCategories(),
    staleTime: 1000 * 60 * 30, // 30 minutes - categories rarely change
    ...options,
  });
}

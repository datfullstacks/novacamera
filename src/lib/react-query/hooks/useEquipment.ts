'use client';

/**
 * Equipment Query Hooks
 * Custom hooks for equipment-related queries
 */

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { equipmentService } from '@/lib/api/services';
import { QUERY_KEYS } from '../query-keys';
import type {
  EquipmentListResponse,
  EquipmentDetailApiResponse,
  EquipmentCardListApiResponse,
  EquipmentFilterParams,
  FilterMetadataApiResponse,
  BrandsListApiResponse,
} from '@/types/api';

/**
 * Get paginated list of equipment with filters
 */
export function useEquipments(
  params?: EquipmentFilterParams,
  options?: Omit<
    UseQueryOptions<EquipmentListResponse>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: QUERY_KEYS.EQUIPMENT.LIST(params as Record<string, unknown>),
    queryFn: () => equipmentService.getEquipments(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  });
}

/**
 * Get single equipment detail by ID
 */
export function useEquipment(
  id: number,
  options?: Omit<
    UseQueryOptions<EquipmentDetailApiResponse>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: QUERY_KEYS.EQUIPMENT.DETAIL(id),
    queryFn: () => equipmentService.getEquipmentById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 10, // 10 minutes
    ...options,
  });
}

/**
 * Get featured equipment
 */
export function useFeaturedEquipment(
  take = 8,
  options?: Omit<
    UseQueryOptions<EquipmentCardListApiResponse>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: QUERY_KEYS.EQUIPMENT.FEATURED,
    queryFn: () => equipmentService.getFeaturedEquipment(take),
    staleTime: 1000 * 60 * 15, // 15 minutes
    ...options,
  });
}

/**
 * Get popular equipment
 */
export function usePopularEquipment(
  take = 8,
  options?: Omit<
    UseQueryOptions<EquipmentCardListApiResponse>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: QUERY_KEYS.EQUIPMENT.POPULAR,
    queryFn: () => equipmentService.getPopularEquipment(take),
    staleTime: 1000 * 60 * 15, // 15 minutes
    ...options,
  });
}

/**
 * Get new equipment
 */
export function useNewEquipment(
  take = 8,
  options?: Omit<
    UseQueryOptions<EquipmentCardListApiResponse>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: QUERY_KEYS.EQUIPMENT.NEW,
    queryFn: () => equipmentService.getNewEquipment(take),
    staleTime: 1000 * 60 * 10, // 10 minutes
    ...options,
  });
}

/**
 * Search equipment
 */
export function useSearchEquipment(
  searchTerm: string,
  take = 10,
  options?: Omit<
    UseQueryOptions<EquipmentCardListApiResponse>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: QUERY_KEYS.EQUIPMENT.SEARCH({ searchTerm } as Record<string, unknown>),
    queryFn: () => equipmentService.searchEquipment(searchTerm, take),
    enabled: !!searchTerm,
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  });
}

/**
 * Get filter metadata (categories, brands, etc.)
 */
export function useFilterMetadata(
  options?: Omit<UseQueryOptions<FilterMetadataApiResponse>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: QUERY_KEYS.EQUIPMENT.FILTER_METADATA,
    queryFn: () => equipmentService.getFilterMetadata(),
    staleTime: 1000 * 60 * 30, // 30 minutes - rarely changes
    ...options,
  });
}

/**
 * Get available brands
 */
export function useBrands(
  options?: Omit<UseQueryOptions<BrandsListApiResponse>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: QUERY_KEYS.EQUIPMENT.BRANDS,
    queryFn: () => equipmentService.getBrands(),
    staleTime: 1000 * 60 * 30, // 30 minutes
    ...options,
  });
}

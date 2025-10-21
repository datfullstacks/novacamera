import { apiClient } from '../client';
import type {
  EquipmentFilterParams,
  EquipmentListResponse,
  EquipmentDetailApiResponse,
  EquipmentCardListApiResponse,
  FilterMetadataApiResponse,
  BrandsListApiResponse,
  ApiResponse,
} from '@/types/api';

/**
 * Equipment Service
 * Handles all equipment-related API calls
 */
export const equipmentService = {
  /**
   * Get equipment list with filters
   */
  getEquipments: async (params?: EquipmentFilterParams): Promise<EquipmentListResponse> => {
    const response = await apiClient.get<EquipmentListResponse['data']>('/Equipment', { params: params as unknown as Record<string, string | number | boolean | undefined> });
    return response;
  },

  /**
   * Get equipment by ID
   */
  getEquipmentById: async (id: number): Promise<EquipmentDetailApiResponse> => {
    const response = await apiClient.get<EquipmentDetailApiResponse['data']>(`/Equipment/${id}`);
    return response;
  },

  /**
   * Get featured equipment
   */
  getFeaturedEquipment: async (take = 8): Promise<EquipmentCardListApiResponse> => {
    const response = await apiClient.get<EquipmentCardListApiResponse['data']>('/Equipment/featured', { params: { take } });
    return response;
  },

  /**
   * Get popular equipment
   */
  getPopularEquipment: async (take = 8): Promise<EquipmentCardListApiResponse> => {
    const response = await apiClient.get<EquipmentCardListApiResponse['data']>('/Equipment/popular', { params: { take } });
    return response;
  },

  /**
   * Get new equipment
   */
  getNewEquipment: async (take = 8): Promise<EquipmentCardListApiResponse> => {
    const response = await apiClient.get<EquipmentCardListApiResponse['data']>('/Equipment/new', { params: { take } });
    return response;
  },

  /**
   * Search equipment
   */
  searchEquipment: async (searchTerm: string, take = 10): Promise<EquipmentCardListApiResponse> => {
    const response = await apiClient.get<EquipmentCardListApiResponse['data']>('/Equipment/search', { params: { searchTerm, take } });
    return response;
  },

  /**
   * Get filter metadata
   */
  getFilterMetadata: async (): Promise<FilterMetadataApiResponse> => {
    const response = await apiClient.get<FilterMetadataApiResponse['data']>('/Equipment/filter-metadata');
    return response;
  },

  /**
   * Get available brands
   */
  getBrands: async (): Promise<BrandsListApiResponse> => {
    const response = await apiClient.get<BrandsListApiResponse['data']>('/Equipment/brands');
    return response;
  },

  /**
   * Delete equipment by ID
   */
  deleteEquipment: async (id: number): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete<null>(`/Equipment/${id}`);
    return response;
  },
};

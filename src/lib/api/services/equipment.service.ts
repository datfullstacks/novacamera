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

  /**
   * Create new equipment
   */
  createEquipment: async (data: FormData): Promise<EquipmentDetailApiResponse> => {
    const response = await apiClient.post<EquipmentDetailApiResponse['data']>('/Equipment', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },

  /**
   * Update equipment
   */
  updateEquipment: async (id: number, data: FormData): Promise<EquipmentDetailApiResponse> => {
    const response = await apiClient.put<EquipmentDetailApiResponse['data']>(`/Equipment/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },

  /**
   * Get equipment images
   */
  getEquipmentImages: async (equipmentId: number): Promise<ApiResponse<Array<{
    imageId: number;
    imageUrl: string;
    isPrimary: boolean;
    sortOrder: number;
  }>>> => {
    const response = await apiClient.get<Array<{
      imageId: number;
      imageUrl: string;
      isPrimary: boolean;
      sortOrder: number;
    }>>(`/Equipment/${equipmentId}/images`);
    return response;
  },

  /**
   * Upload equipment image
   */
  uploadEquipmentImage: async (equipmentId: number, imageFile: File, isPrimary = false, sortOrder = 0): Promise<ApiResponse<string>> => {
    const formData = new FormData();
    formData.append('Image', imageFile);
    formData.append('IsPrimary', String(isPrimary));
    formData.append('SortOrder', String(sortOrder));

    const response = await apiClient.post<string>(`/Equipment/${equipmentId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },

  /**
   * Delete equipment image
   */
  deleteEquipmentImage: async (equipmentId: number, imageId: number): Promise<ApiResponse<string>> => {
    const response = await apiClient.delete<string>(`/Equipment/${equipmentId}/images/${imageId}`);
    return response;
  },

  /**
   * Set equipment image as primary
   */
  setEquipmentImageAsPrimary: async (equipmentId: number, imageId: number): Promise<ApiResponse<string>> => {
    const response = await apiClient.put<string>(`/Equipment/${equipmentId}/images/${imageId}/set-primary`, {});
    return response;
  },

  /**
   * Update equipment image sort order
   */
  updateEquipmentImageSortOrder: async (equipmentId: number, images: Array<{ imageId: number; sortOrder: number }>): Promise<ApiResponse<string>> => {
    const response = await apiClient.put<string>(`/Equipment/${equipmentId}/images/sort-order`, { images });
    return response;
  },

  /**
   * Get related equipment
   */
  getRelatedEquipment: async (id: number, categoryId?: number, take = 4): Promise<EquipmentCardListApiResponse> => {
    const params: Record<string, number | undefined> = { take };
    if (categoryId) params.categoryId = categoryId;
    const response = await apiClient.get<EquipmentCardListApiResponse['data']>(`/Equipment/${id}/related`, { params });
    return response;
  },

  /**
   * Get price range
   */
  getPriceRange: async (): Promise<ApiResponse<{ minPrice: number; maxPrice: number }>> => {
    const response = await apiClient.get<{ minPrice: number; maxPrice: number }>('/Equipment/price-range');
    return response;
  },
};

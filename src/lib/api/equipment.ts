import { Equipment } from '@/types';
import { apiClient } from './client';
import { 
  EquipmentListParams, 
  CategoryResponse, 
  BrandResponse 
} from './types';

export class EquipmentService {
  private readonly basePath = '/Equipment';

  async getEquipment(params: EquipmentListParams = {}): Promise<Equipment[]> {
    try {
      const searchParams = new URLSearchParams();
      
      // Add pagination
      if (params.page) searchParams.append('page', params.page.toString());
      if (params.pageSize) searchParams.append('pageSize', params.pageSize.toString());
      
      // Add filters
      if (params.categories?.length) {
        params.categories.forEach(cat => searchParams.append('categories', cat));
      }
      if (params.brands?.length) {
        params.brands.forEach(brand => searchParams.append('brands', brand));
      }
      if (params.priceRange) {
        searchParams.append('minPrice', params.priceRange[0].toString());
        searchParams.append('maxPrice', params.priceRange[1].toString());
      }
      if (params.rating) {
        searchParams.append('minRating', params.rating.toString());
      }
      if (params.availability !== undefined) {
        searchParams.append('availability', params.availability.toString());
      }
      if (params.searchQuery) {
        searchParams.append('search', params.searchQuery);
      }
      if (params.sortBy) {
        searchParams.append('sortBy', params.sortBy);
      }

      const queryString = searchParams.toString();
      const endpoint = `${this.basePath}${queryString ? `?${queryString}` : ''}`;
      
      const response = await apiClient.get<Equipment[]>(endpoint);
      
      return response.data;
    } catch (error) {
      console.error('Failed to fetch equipment:', error);
      throw error;
    }
  }

  async getEquipmentById(id: string): Promise<Equipment> {
    try {
      const response = await apiClient.get<Equipment>(`${this.basePath}/${id}`);
      
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch equipment ${id}:`, error);
      throw error;
    }
  }

  async getCategories(): Promise<CategoryResponse[]> {
    try {
      const response = await apiClient.get<CategoryResponse[]>(`${this.basePath}/categories`);
      
      return response.data;
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      throw error;
    }
  }

  async getBrands(): Promise<BrandResponse[]> {
    try {
      const response = await apiClient.get<BrandResponse[]>(`${this.basePath}/brands`);
      
      return response.data;
    } catch (error) {
      console.error('Failed to fetch brands:', error);
      throw error;
    }
  }

  async searchEquipment(query: string, params: EquipmentListParams = {}): Promise<Equipment[]> {
    try {
      const searchParams = new URLSearchParams();
      searchParams.append('q', query);
      
      if (params.page) searchParams.append('page', params.page.toString());
      if (params.pageSize) searchParams.append('pageSize', params.pageSize.toString());
      
      const endpoint = `${this.basePath}/search?${searchParams.toString()}`;
      const response = await apiClient.get<Equipment[]>(endpoint);
      
      return response.data;
    } catch (error) {
      console.error('Failed to search equipment:', error);
      throw error;
    }
  }
}

// Create singleton instance
export const equipmentService = new EquipmentService();

// Export individual methods for easier use
export const equipmentApi = {
  getList: (params?: EquipmentListParams) => equipmentService.getEquipment(params),
  getById: (id: string) => equipmentService.getEquipmentById(id),
  getCategories: () => equipmentService.getCategories(),
  getBrands: () => equipmentService.getBrands(),
  search: (query: string, params?: EquipmentListParams) => equipmentService.searchEquipment(query, params),
};
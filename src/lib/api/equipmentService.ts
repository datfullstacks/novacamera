import { Equipment } from '@/types';
import { mockEquipmentData, mockCategories, mockBrands } from './mockDataFixed';

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message: string;
  totalCount?: number;
  currentPage?: number;
  totalPages?: number;
}

export interface EquipmentSearchParams {
  search?: string;
  page?: number;
  limit?: number;
  categories?: string[];
  brands?: string[];
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  availableOnly?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export class EquipmentService {
  // Simulate API delay
  private delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  async searchEquipment(params: EquipmentSearchParams = {}): Promise<ApiResponse<Equipment[]>> {
    try {
      // Simulate API call delay
      await this.delay(500);

      // For now, use mock data with filtering
      let filteredData = [...mockEquipmentData];

      // Apply search filter
      if (params.search) {
        const searchLower = params.search.toLowerCase();
        filteredData = filteredData.filter(item =>
          item.name.toLowerCase().includes(searchLower) ||
          item.description?.toLowerCase().includes(searchLower) ||
          item.brand?.toLowerCase().includes(searchLower)
        );
      }

      // Apply filters
      if (params.categories && params.categories.length > 0) {
        filteredData = filteredData.filter(item => params.categories!.includes(item.category));
      }

      if (params.brands && params.brands.length > 0) {
        filteredData = filteredData.filter(item => item.brand && params.brands!.includes(item.brand));
      }

      if (params.minPrice !== undefined) {
        filteredData = filteredData.filter(item => (item.dailyRate || 0) >= params.minPrice!);
      }

      if (params.maxPrice !== undefined) {
        filteredData = filteredData.filter(item => (item.dailyRate || 0) <= params.maxPrice!);
      }

      if (params.rating !== undefined) {
        filteredData = filteredData.filter(item => (item.rating || 0) >= params.rating!);
      }

      if (params.availableOnly) {
        filteredData = filteredData.filter(item => item.isAvailable && item.availableQuantity > 0);
      }

      // Apply sorting
      if (params.sortBy) {
        filteredData.sort((a, b) => {
          let aValue: string | number | Date;
          let bValue: string | number | Date;

          switch (params.sortBy) {
            case 'price':
              aValue = a.dailyRate;
              bValue = b.dailyRate;
              break;
            case 'name':
              aValue = a.name.toLowerCase();
              bValue = b.name.toLowerCase();
              break;
            case 'rating':
              aValue = a.rating || 0;
              bValue = b.rating || 0;
              break;
            case 'createdAt':
              aValue = new Date(a.createdAt);
              bValue = new Date(b.createdAt);
              break;
            default:
              return 0;
          }

          if (params.sortOrder === 'desc') {
            return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
          } else {
            return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
          }
        });
      }

      // Apply pagination
      const page = params.page || 1;
      const limit = params.limit || 12;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedData = filteredData.slice(startIndex, endIndex);

      return {
        data: paginatedData,
        success: true,
        message: 'Equipment retrieved successfully',
        totalCount: filteredData.length,
        currentPage: page,
        totalPages: Math.ceil(filteredData.length / limit),
      };
    } catch (error) {
      console.error('Error searching equipment:', error);
      return {
        data: [],
        success: false,
        message: 'Failed to search equipment',
      };
    }
  }

  async getEquipmentById(id: string): Promise<ApiResponse<Equipment | null>> {
    try {
      await this.delay(300);
      
      const equipment = mockEquipmentData.find(item => item.id === parseInt(id, 10));
      
      return {
        data: equipment || null,
        success: !!equipment,
        message: equipment ? 'Equipment found' : 'Equipment not found',
      };
    } catch (error) {
      console.error('Error getting equipment:', error);
      return {
        data: null,
        success: false,
        message: 'Failed to get equipment',
      };
    }
  }

  async getCategories(): Promise<ApiResponse<typeof mockCategories>> {
    try {
      await this.delay(200);
      
      return {
        data: mockCategories,
        success: true,
        message: 'Categories retrieved successfully',
      };
    } catch (error) {
      console.error('Error getting categories:', error);
      return {
        data: [],
        success: false,
        message: 'Failed to get categories',
      };
    }
  }

  async getBrands(): Promise<ApiResponse<typeof mockBrands>> {
    try {
      await this.delay(200);
      
      return {
        data: mockBrands,
        success: true,
        message: 'Brands retrieved successfully',
      };
    } catch (error) {
      console.error('Error getting brands:', error);
      return {
        data: [],
        success: false,
        message: 'Failed to get brands',
      };
    }
  }
}

export const equipmentService = new EquipmentService();
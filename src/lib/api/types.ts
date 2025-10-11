export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  totalCount?: number;
  currentPage?: number;
  totalPages?: number;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface EquipmentFilters {
  categories?: string[];
  brands?: string[];
  priceRange?: [number, number];
  rating?: number;
  availability?: boolean;
  searchQuery?: string;
  sortBy?: string;
}

export interface CategoryResponse {
  id: string;
  name: string;
  description?: string;
  equipmentCount: number;
}

export interface BrandResponse {
  id: string;
  name: string;
  equipmentCount: number;
}

export interface EquipmentListParams extends PaginationParams, EquipmentFilters {}

// Base API configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  // Equipment endpoints
  equipment: {
    list: '/Equipment',
    detail: (id: string) => `/Equipment/${id}`,
    categories: '/Equipment/categories',
    brands: '/Equipment/brands',
    search: '/Equipment/search',
  },
  // Category endpoints
  categories: {
    list: '/Category',
    detail: (id: string) => `/Category/${id}`,
  },
  // Order endpoints
  orders: {
    list: '/Order',
    create: '/Order',
    detail: (id: string) => `/Order/${id}`,
  },
} as const;
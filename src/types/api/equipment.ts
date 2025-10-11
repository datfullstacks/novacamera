import { ApiResponse, PaginatedResponse, BaseEntity } from './base';

// Equipment status
export enum EquipmentStatus {
  AVAILABLE = 'available',
  RENTED = 'rented',
  MAINTENANCE = 'maintenance',
  UNAVAILABLE = 'unavailable'
}

// Equipment category
export interface EquipmentCategory extends BaseEntity {
  name: string;
  description: string;
  slug: string;
}

// Equipment image
export interface EquipmentImage extends BaseEntity {
  equipmentId: number;
  imageUrl: string;
  altText?: string;
  isMain: boolean;
  sortOrder: number;
}

// Equipment entity
export interface Equipment extends BaseEntity {
  name: string;
  description: string;
  brand: string;
  model: string;
  categoryId: number;
  category?: EquipmentCategory;
  dailyRate: number;
  weeklyRate?: number;
  monthlyRate?: number;
  deposit: number;
  status: EquipmentStatus;
  specifications?: Record<string, unknown>;
  images: EquipmentImage[];
  ownerId: number;
  location?: string;
  quantity: number;
  availableQuantity: number;
}

// Equipment requests
export interface CreateEquipmentRequest {
  name: string;
  description: string;
  brand: string;
  model: string;
  categoryId: number;
  dailyRate: number;
  weeklyRate?: number;
  monthlyRate?: number;
  deposit: number;
  specifications?: Record<string, unknown>;
  location?: string;
  quantity: number;
}

export interface UpdateEquipmentRequest extends Partial<CreateEquipmentRequest> {
  status?: EquipmentStatus;
}

export interface EquipmentFilterParams {
  categoryId?: number;
  brand?: string;
  status?: EquipmentStatus;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'price' | 'createdAt' | 'rating';
  sortOrder?: 'asc' | 'desc';
}

// API response types
export type EquipmentListResponse = PaginatedResponse<Equipment>;
export type EquipmentDetailResponse = ApiResponse<Equipment>;
export type EquipmentCreateResponse = ApiResponse<Equipment>;
export type EquipmentUpdateResponse = ApiResponse<Equipment>;
export type EquipmentCategoriesResponse = ApiResponse<EquipmentCategory[]>;
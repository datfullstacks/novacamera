// Common types
export interface BaseEntity {
  id: number;
  createdAt: string;
  updatedAt: string;
}

// Equipment Status Enum
export enum EquipmentStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  MAINTENANCE = 'maintenance'
}

// Equipment types
export interface Equipment extends BaseEntity {
  name: string;
  description: string;
  brand: string;
  category: string;
  dailyRate: number;
  availableQuantity: number;
  status: EquipmentStatus;
  images: Array<{
    id: number;
    url: string;
    alt: string;
  }>;
  specifications: Record<string, string>;
  rating: number;
  reviewCount: number;
}

// User types
export interface User extends BaseEntity {
  email: string;
  name: string;
  role: 'customer' | 'admin';
  phone?: string;
  avatar?: string;
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// DTO types
export interface CreateUserDto {
  email: string;
  name: string;
  password: string;
  role?: 'customer' | 'admin';
}

export interface UpdateUserDto {
  name?: string;
  phone?: string;
  avatar?: string;
}

// Auth types - re-export from auth.ts
export * from './auth';
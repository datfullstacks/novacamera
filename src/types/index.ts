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

// Equipment Image type
export interface EquipmentImage {
  id: number;
  url: string;
  alt: string;
  isPrimary?: boolean;
}

// Equipment Pricing Info
export interface EquipmentPricingInfo {
  oneDayPrice: number;
  threeDayPrice: number;
  weeklyPrice: number;
  monthlyPrice: number;
  depositFee: number;
  currency: string;
  formattedOneDay: string;
  formattedThreeDay: string;
  formattedWeekly: string;
  formattedMonthly: string;
  formattedDeposit: string;
}

// Related Equipment
export interface RelatedEquipment {
  id: number;
  name: string;
  brand: string;
  category: string;
  image: string;
  price: number;
  rating: number;
  reviewCount: number;
  isAvailable: boolean;
  formattedPrice: string;
  ratingDisplay: string;
}

// Equipment types
export interface Equipment extends BaseEntity {
  name: string;
  description: string;
  brand: string;
  model?: string;
  category: string;
  dailyRate: number;
  depositFee?: number;
  availableQuantity: number;
  isAvailable: boolean;
  status: EquipmentStatus;
  images: EquipmentImage[];
  specifications: Record<string, string>;
  rating: number;
  reviewCount: number;
  tagline?: string;
  location?: string;
  condition?: string;
  mainImageUrl?: string;
  pricingInfo?: EquipmentPricingInfo;
  relatedEquipments?: RelatedEquipment[];
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
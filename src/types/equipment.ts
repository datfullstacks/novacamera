/**
 * Equipment Types
 * Type definitions for equipment-related entities
 */

import { BaseEntity } from './common';

export interface Equipment extends BaseEntity {
  name: string;
  description?: string;
  price: number;
  dailyRate: number; // Price per day (from API: pricePerDay)
  quantity: number;
  availableQuantity: number; // Available stock (from API: stock)
  categoryId: string;
  category?: Category;
  images: EquipmentImage[];
  specifications?: Record<string, string | number | boolean>;
  status: EquipmentStatus;
  brand?: string;
  model?: string;
  isAvailable: boolean;
  rating?: number;
  reviewsCount?: number;
}

export interface EquipmentImage {
  id: string;
  url: string;
  alt?: string;
  isPrimary?: boolean;
}

export interface Category extends BaseEntity {
  name: string;
  description?: string;
  slug: string;
  parentId?: string;
  parent?: Category;
  children?: Category[];
}

export enum EquipmentStatus {
  AVAILABLE = 'available',
  RENTED = 'rented',
  MAINTENANCE = 'maintenance',
  RETIRED = 'retired',
  OUT_OF_STOCK = 'out_of_stock',
}

// DTOs
export interface CreateEquipmentDto {
  name: string;
  description?: string;
  price: number;
  quantity: number;
  categoryId: string;
  specifications?: Record<string, string | number | boolean>;
  brand?: string;
  model?: string;
}

export interface UpdateEquipmentDto {
  name?: string;
  description?: string;
  price?: number;
  quantity?: number;
  categoryId?: string;
  specifications?: Record<string, string | number | boolean>;
  brand?: string;
  model?: string;
  status?: EquipmentStatus;
}

export interface EquipmentFilters {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  status?: EquipmentStatus;
  isAvailable?: boolean;
  search?: string;
}

export interface EquipmentSort {
  field: 'name' | 'price' | 'createdAt' | 'rating';
  direction: 'asc' | 'desc';
}

// Rental related types
export interface RentalPeriod {
  startDate: Date;
  endDate: Date;
  days: number;
}

export interface RentalAvailability {
  equipmentId: string;
  availableQuantity: number;
  bookedDates: Date[];
  isAvailable: boolean;
}
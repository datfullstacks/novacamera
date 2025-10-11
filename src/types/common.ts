/**
 * Common TypeScript Types
 * Shared types used across the application
 */

// Pagination
export interface PaginationParams {
  page: number;
  limit: number;
  total?: number;
  totalPages?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationParams;
}

// API Response
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  errors?: Record<string, string[]>;
}

// Base Entity
export interface BaseEntity {
  id: string | number;
  createdAt: string;
  updatedAt: string;
}

// Locale
export type Locale = 'en' | 'vi';

export interface LocaleConfig {
  locale: Locale;
  label: string;
  flag: string;
}
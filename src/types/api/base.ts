// Base API Response structure
export interface ApiResponse<T = unknown> {
  statusCode: number;
  message: string;
  data: T;
  errors: string[];
}

// Base pagination
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: PaginationMeta;
}

// Error types
export interface ApiError {
  statusCode: number;
  message: string;
  errors: string[];
}

// Request options
export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: Record<string, unknown> | FormData | string;
  token?: string;
}

// Base entity
export interface BaseEntity {
  id: number;
  createdAt: string;
  updatedAt: string;
}
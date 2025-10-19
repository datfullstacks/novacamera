// Base API Response structure matching NovaCMS API
export interface ApiResponse<T = unknown> {
  statusCode: number;
  message: string | null;
  data: T;
  errors: string[] | null;
}

// Pagination Response structure matching NovaCMS API
export interface PaginationResponse<T> {
  items: T[];
  totalPage: number;
  pageSize: number;
  pageNumber: number;
  totalCount: number;
}

// Paginated API Response
export type PaginatedApiResponse<T> = ApiResponse<PaginationResponse<T>>;

// Legacy pagination meta (for backward compatibility)
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

// Problem Details (RFC 7807 format)
export interface ProblemDetails {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  [key: string]: string | number | undefined;
}

// Request options
export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: Record<string, unknown> | FormData | string;
  token?: string;
  params?: Record<string, string | number | boolean | undefined>;
}

// Base entity
export interface BaseEntity {
  id: number;
  createdAt: string;
  updatedAt: string;
}
/**
 * Query Keys
 * Centralized query key definitions for TanStack Query
 * Following best practices for query key structure
 */

export const QUERY_KEYS = {
  // Authentication
  AUTH: {
    ME: ['auth', 'me'] as const,
    SESSION: ['auth', 'session'] as const,
  },

  // Users
  USERS: {
    ALL: ['users'] as const,
    LIST: (params?: Record<string, any>) => ['users', 'list', params] as const,
    DETAIL: (id: string | number) => ['users', 'detail', id] as const,
    SEARCH: (query: string) => ['users', 'search', query] as const,
  },

  // Products
  PRODUCTS: {
    ALL: ['products'] as const,
    LIST: (params?: Record<string, any>) => ['products', 'list', params] as const,
    DETAIL: (id: string | number) => ['products', 'detail', id] as const,
    SEARCH: (query: string) => ['products', 'search', query] as const,
  },

  // Add more query keys as needed
} as const;

// Type helper for query keys
export type QueryKey = (typeof QUERY_KEYS)[keyof typeof QUERY_KEYS];
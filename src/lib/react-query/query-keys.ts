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
    LIST: (params?: Record<string, unknown>) => ['users', 'list', params] as const,
    DETAIL: (id: string | number) => ['users', 'detail', id] as const,
    SEARCH: (query: string) => ['users', 'search', query] as const,
  },

  // Products
  PRODUCTS: {
    ALL: ['products'] as const,
    LIST: (params?: Record<string, unknown>) => ['products', 'list', params] as const,
    DETAIL: (id: string | number) => ['products', 'detail', id] as const,
    SEARCH: (query: string) => ['products', 'search', query] as const,
  },

  // Equipment (Cameras)
  EQUIPMENT: {
    ALL: ['equipment'] as const,
    LIST: (params?: Record<string, unknown>) => ['equipment', 'list', params] as const,
    DETAIL: (id: number) => ['equipment', 'detail', id] as const,
    SEARCH: (params?: Record<string, unknown>) => ['equipment', 'search', params] as const,
    FEATURED: ['equipment', 'featured'] as const,
    POPULAR: ['equipment', 'popular'] as const,
    NEW: ['equipment', 'new'] as const,
    BRANDS: ['equipment', 'brands'] as const,
    PRICE_RANGE: ['equipment', 'price-range'] as const,
    FILTER_METADATA: ['equipment', 'filter-metadata'] as const,
  },

  // Rental Orders
  RENTAL: {
    ALL: ['rental'] as const,
    LIST: (params?: Record<string, unknown>) => ['rental', 'list', params] as const,
    USER_ORDERS: (userId: string) => ['rental', 'user', userId] as const,
    ADMIN_ORDERS: (params?: Record<string, unknown>) => ['rental', 'admin', params] as const,
    DETAIL: (id: number) => ['rental', 'detail', id] as const,
    CALCULATE: (params?: Record<string, unknown>) => ['rental', 'calculate', params] as const,
    CHECK_AVAILABILITY: (equipmentId: number, startDate: string, endDate: string) =>
      ['rental', 'availability', equipmentId, startDate, endDate] as const,
    CALENDAR: (equipmentId: number, month?: number, year?: number) =>
      ['rental', 'calendar', equipmentId, month, year] as const,
  },

  // Categories
  CATEGORY: {
    ALL: ['category'] as const,
    LIST: ['category', 'list'] as const,
  },

  // Dashboard
  DASHBOARD: {
    SUMMARY: ['dashboard', 'summary'] as const,
    UPCOMING_RENTALS: (params?: Record<string, unknown>) =>
      ['dashboard', 'upcoming-rentals', params] as const,
    MONTHLY_REVENUE: ['dashboard', 'monthly-revenue'] as const,
    POPULAR_EQUIPMENT: ['dashboard', 'popular-equipment'] as const,
  },

  // Chat / AI
  CHAT: {
    ALL: ['chat'] as const,
    ASK: (question: string) => ['chat', 'ask', question] as const,
  },

  // Payment
  PAYMENT: {
    ALL: ['payment'] as const,
    WEBHOOK: ['payment', 'webhook'] as const,
  },
} as const;

// Type helper for query keys
export type QueryKey = (typeof QUERY_KEYS)[keyof typeof QUERY_KEYS];
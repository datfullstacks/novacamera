// Base types
export * from './base';

// Domain-specific types
export * from './auth';
export * from './equipment';
export * from './order';

// Re-export commonly used types for convenience
export type {
  ApiResponse,
  PaginatedResponse,
  ApiError,
  RequestOptions
} from './base';

export type {
  RegisterRequest,
  LoginRequest,
  RegisterResponse,
  LoginResponse,
  UserProfile,
  UserRole
} from './auth';

export type {
  Equipment,
  EquipmentCategory,
  EquipmentStatus,
  EquipmentFilterParams
} from './equipment';

export type {
  Order,
  OrderItem,
  OrderStatus,
  PaymentStatus,
  CreateOrderRequest
} from './order';
// Base types
export * from './base';

// Domain-specific types
export * from './auth';
export * from './equipment';
export * from './order';
export * from './category';
export * from './dashboard';
export * from './chat';
export * from './payment';

// Re-export commonly used types for convenience
export type {
  ApiResponse,
  PaginatedApiResponse,
  PaginationResponse,
  ApiError,
  RequestOptions,
  ProblemDetails
} from './base';

export type {
  RegisterRequest,
  LoginRequest,
  RegisterResponse,
  LoginResponse,
  UserProfile,
  UserRole,
  UserResponse,
  ChangePasswordRequest,
  Invoice,
  UserInvoicesData,
  UserInvoicesResponse
} from './auth';

export type {
  EquipmentResponse,
  EquipmentDetailResponse,
  EquipmentCardResponse,
  EquipmentStatus,
  EquipmentFilterParams,
  EquipmentImageResponse
} from './equipment';

export type {
  RentalOrderResponse,
  RentalOrderStatus,
  CreateRentalOrderRequest,
  RentalOrderItemDto,
  CustomerInfoDto,
  DeliveryInfoDto
} from './order';

export type {
  CategoryResponse
} from './category';

export type {
  DashboardSummaryResponse,
  UpcomingRentalResponse
} from './dashboard';
import { ApiResponse, PaginatedResponse, BaseEntity } from './base';
import { Equipment } from './equipment';
import { UserProfile } from './auth';

// Order status
export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded'
}

// Payment status
export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

// Order item
export interface OrderItem extends BaseEntity {
  orderId: number;
  equipmentId: number;
  equipment?: Equipment;
  quantity: number;
  dailyRate: number;
  days: number;
  subtotal: number;
}

// Order entity
export interface Order extends BaseEntity {
  orderNumber: string;
  customerId: number;
  customer?: UserProfile;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  startDate: string;
  endDate: string;
  totalDays: number;
  subtotal: number;
  tax: number;
  total: number;
  deposit: number;
  items: OrderItem[];
  notes?: string;
  deliveryAddress?: string;
  pickupMethod: 'delivery' | 'pickup';
}

// Order requests
export interface CreateOrderRequest {
  items: {
    equipmentId: number;
    quantity: number;
    days: number;
  }[];
  startDate: string;
  endDate: string;
  deliveryAddress?: string;
  pickupMethod: 'delivery' | 'pickup';
  notes?: string;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
  notes?: string;
}

export interface OrderFilterParams {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  customerId?: number;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'total' | 'status';
  sortOrder?: 'asc' | 'desc';
}

// API response types
export type OrderListResponse = PaginatedResponse<Order>;
export type OrderDetailResponse = ApiResponse<Order>;
export type OrderCreateResponse = ApiResponse<Order>;
export type OrderUpdateResponse = ApiResponse<Order>;
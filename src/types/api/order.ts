import { ApiResponse, PaginatedApiResponse } from './base';

// Order/Rental status enum
export enum RentalOrderStatus {
  PENDING = 0,
  CONFIRMED = 1,
  RENTED = 2,
  COMPLETED = 3,
  CANCELLED = 4,
}

// Customer Info
export interface CustomerInfoDto {
  fullName: string;
  phoneNumber: string;
  email: string;
  address: string | null;
  district: string | null;
  city: string | null;
  notes: string | null;
}

// Delivery Info
export interface DeliveryInfoDto {
  deliveryMethod: string;
  deliveryAddress: string | null;
  preferredDeliveryTime: string | null;
  deliveryNotes: string | null;
}

// Payment Info
export interface PaymentInfoDto {
  paymentMethod: string;
  paidAmount: number | null;
  paymentReference: string | null;
  paymentNotes: string | null;
  isInstallment: boolean;
  depositAmount: number | null;
  cardHolderName: string | null;
  maskedCardNumber: string | null;
}

// Rental Order Item
export interface RentalOrderItemDto {
  equipmentId: number;
  rentalStartDate: string;
  rentalEndDate: string;
  quantity: number;
  notes: string | null;
  preferredEquipmentItemIds: number[] | null;
}

// Rental Order Detail Response
export interface RentalOrderDetailResponse {
  orderDetailId: number;
  equipmentId: number;
  equipmentName: string | null;
  brand: string | null;
  equipmentItemId: number | null;
  serialNumber: string | null;
  rentalStartDate: string;
  rentalEndDate: string;
  pricePerDay: number;
  depositFee: number | null;
  imageUrl: string | null;
}

// Rental Order Response
export interface RentalOrderResponse {
  orderId: number;
  referenceNo: string | null;
  orderDate: string;
  status: string | null;
  totalAmount: number;
  orderDetails: RentalOrderDetailResponse[];
  customerInfo: CustomerInfoDto;
  deliveryInfo: DeliveryInfoDto;
}

// Create Rental Order Request
export interface CreateRentalOrderRequest {
  userId: number;
  items: RentalOrderItemDto[];
  note: string | null;
  customerInfo: CustomerInfoDto;
  deliveryInfo: DeliveryInfoDto;
  paymentInfo: PaymentInfoDto;
  couponCode: string | null;
  discountAmount: number;
  requireInsurance: boolean;
  insuranceAmount: number;
  isOfflineOrder: boolean;
}

// Order Item Summary
export interface OrderItemSummaryDto {
  equipmentId: number;
  equipmentName: string | null;
  brand: string | null;
  imageUrl: string | null;
  pricePerDay: number;
  depositFee: number | null;
  quantity: number;
  rentalDays: number;
  itemTotal: number;
  isAvailable: boolean;
  availableStock: number;
}

// Rental Order Summary
export interface RentalOrderSummaryDto {
  items: OrderItemSummaryDto[];
  subTotal: number;
  discountAmount: number;
  deliveryFee: number;
  totalAmount: number;
  totalDays: number;
  estimatedStartDate: string;
  estimatedEndDate: string;
}

// Update Order Status
export interface UpdateOrderStatusDto {
  status: RentalOrderStatus;
  note: string | null;
  updatedBy: string | null;
}

// Enum Value (for status display)
export interface EnumValueDto {
  value: number;
  name: string | null;
  description: string | null;
}

// Rental Conflict
export interface RentalConflictDto {
  orderId: number;
  referenceNo: string | null;
  startDate: string;
  endDate: string;
  quantity: number;
  customerName: string | null;
}

// Day Availability
export interface DayAvailabilityDto {
  date: string;
  availableCount: number;
  totalStock: number;
  isAvailable: boolean;
  availabilityStatus: string | null;
  conflicts: RentalConflictDto[];
}

// Equipment Calendar Availability
export interface EquipmentCalendarAvailabilityDto {
  equipmentId: number;
  equipmentName: string | null;
  totalStock: number;
  dayAvailabilities: DayAvailabilityDto[];
}

// Selected Dates Availability
export interface SelectedDatesAvailabilityDto {
  equipmentId: number;
  equipmentName: string | null;
  selectedDates: string[];
  quantity: number;
  isAvailable: boolean;
  unavailableDates: string[];
  totalRentalDays: number;
  pricePerDay: number;
  totalCost: number;
  depositFee: number | null;
  message: string | null;
}

// Check Selected Dates Request
export interface CheckSelectedDatesRequest {
  selectedDates: string[];
  quantity: number;
}

// Cancel Payment Request
export interface CancelPaymentRequest {
  reason: string;
}

// Rental Order Filter Params (Admin)
export interface RentalOrderAdminFilterParams {
  userId?: number;
  referenceNo?: string;
  status?: string;
  orderDateFrom?: string;
  orderDateTo?: string;
  rentalStartDateFrom?: string;
  rentalStartDateTo?: string;
  rentalEndDateFrom?: string;
  rentalEndDateTo?: string;
  minTotalAmount?: number;
  maxTotalAmount?: number;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: string;
  pageNumber?: number;
  pageSize?: number;
}

// Rental Order Filter Params (User)
export interface RentalOrderUserFilterParams {
  status?: string;
  searchTerm?: string;
  fromDate?: string;
  toDate?: string;
  sortBy?: string;
  sortOrder?: string;
  pageNumber?: number;
  pageSize?: number;
}

// API Response Types
export type RentalOrderListResponse = PaginatedApiResponse<RentalOrderResponse>;
export type RentalOrderDetailApiResponse = ApiResponse<RentalOrderResponse>;
export type RentalOrderSummaryApiResponse = ApiResponse<RentalOrderSummaryDto>;
export type RentalOrderCreateApiResponse = ApiResponse<RentalOrderResponse>;
export type OrderStatusListApiResponse = ApiResponse<string[]>;
export type EnumValueListApiResponse = ApiResponse<EnumValueDto[]>;
export type AvailabilityCheckApiResponse = ApiResponse<string>;
export type CalendarAvailabilityApiResponse = ApiResponse<EquipmentCalendarAvailabilityDto>;
export type SelectedDatesAvailabilityApiResponse = ApiResponse<SelectedDatesAvailabilityDto>;
export type UpdateOrderStatusApiResponse = ApiResponse<string>;
export type CancelPaymentApiResponse = ApiResponse<string>;
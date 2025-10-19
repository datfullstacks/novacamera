import { apiClient } from '../client';
import type {
  CreateRentalOrderRequest,
  UpdateOrderStatusDto,
  CheckSelectedDatesRequest,
  CancelPaymentRequest,
  RentalOrderAdminFilterParams,
  RentalOrderUserFilterParams,
  RentalOrderListResponse,
  RentalOrderDetailApiResponse,
  RentalOrderSummaryApiResponse,
  RentalOrderCreateApiResponse,
  OrderStatusListApiResponse,
  EnumValueListApiResponse,
  AvailabilityCheckApiResponse,
  CalendarAvailabilityApiResponse,
  SelectedDatesAvailabilityApiResponse,
  UpdateOrderStatusApiResponse,
  CancelPaymentApiResponse,
} from '@/types/api';

/**
 * Rental Order Service
 * Handles all rental order-related API calls
 */
export const rentalService = {
  /**
   * Calculate order summary before creating
   */
  calculateOrderSummary: async (data: CreateRentalOrderRequest): Promise<RentalOrderSummaryApiResponse> => {
    const response = await apiClient.post<RentalOrderSummaryApiResponse['data']>(
      '/RentalOrder/calculate',
      data as unknown as Record<string, unknown>
    );
    return response;
  },

  /**
   * Create new rental order
   */
  createRentalOrder: async (data: CreateRentalOrderRequest): Promise<RentalOrderCreateApiResponse> => {
    const response = await apiClient.post<RentalOrderCreateApiResponse['data']>(
      '/RentalOrder',
      data as unknown as Record<string, unknown>
    );
    return response;
  },

  /**
   * Get rental order by ID
   */
  getRentalOrder: async (id: number): Promise<RentalOrderDetailApiResponse> => {
    const response = await apiClient.get<RentalOrderDetailApiResponse['data']>(`/RentalOrder/${id}`);
    return response;
  },

  /**
   * Get user's rental orders
   */
  getUserRentalOrders: async (
    userId: number,
    params?: RentalOrderUserFilterParams
  ): Promise<RentalOrderListResponse> => {
    const response = await apiClient.get<RentalOrderListResponse['data']>(
      `/RentalOrder/user/${userId}`,
      { params: params as unknown as Record<string, string | number | boolean | undefined> }
    );
    return response;
  },

  /**
   * Get all rental orders (Admin)
   */
  getAdminRentalOrders: async (params?: RentalOrderAdminFilterParams): Promise<RentalOrderListResponse> => {
    const response = await apiClient.get<RentalOrderListResponse['data']>(
      '/RentalOrder/admin',
      { params: params as unknown as Record<string, string | number | boolean | undefined> }
    );
    return response;
  },

  /**
   * Check equipment availability
   */
  checkAvailability: async (
    equipmentId: number,
    startDate: string,
    endDate: string,
    quantity = 1
  ): Promise<AvailabilityCheckApiResponse> => {
    const response = await apiClient.get<AvailabilityCheckApiResponse['data']>(
      '/RentalOrder/check-availability',
      { params: { equipmentId, startDate, endDate, quantity } }
    );
    return response;
  },

  /**
   * Get equipment calendar availability
   */
  getCalendarAvailability: async (
    equipmentId: number,
    startDate: string,
    endDate: string
  ): Promise<CalendarAvailabilityApiResponse> => {
    const response = await apiClient.get<CalendarAvailabilityApiResponse['data']>(
      `/RentalOrder/equipment/${equipmentId}/calendar-availability`,
      { params: { startDate, endDate } }
    );
    return response;
  },

  /**
   * Check selected dates availability
   */
  checkSelectedDates: async (
    equipmentId: number,
    data: CheckSelectedDatesRequest
  ): Promise<SelectedDatesAvailabilityApiResponse> => {
    const response = await apiClient.post<SelectedDatesAvailabilityApiResponse['data']>(
      `/RentalOrder/equipment/${equipmentId}/check-selected-dates`,
      data as unknown as Record<string, unknown>
    );
    return response;
  },

  /**
   * Update order status
   */
  updateOrderStatus: async (
    orderId: number,
    data: UpdateOrderStatusDto
  ): Promise<UpdateOrderStatusApiResponse> => {
    const response = await apiClient.put<UpdateOrderStatusApiResponse['data']>(
      `/RentalOrder/${orderId}/status`,
      data as unknown as Record<string, unknown>
    );
    return response;
  },

  /**
   * Get order status
   */
  getOrderStatus: async (orderId: number): Promise<AvailabilityCheckApiResponse> => {
    const response = await apiClient.get<AvailabilityCheckApiResponse['data']>(
      `/RentalOrder/${orderId}/status`
    );
    return response;
  },

  /**
   * Get available statuses
   */
  getAvailableStatuses: async (): Promise<EnumValueListApiResponse> => {
    const response = await apiClient.get<EnumValueListApiResponse['data']>(
      '/RentalOrder/statuses/available'
    );
    return response;
  },

  /**
   * Get order statuses list
   */
  getOrderStatuses: async (): Promise<OrderStatusListApiResponse> => {
    const response = await apiClient.get<OrderStatusListApiResponse['data']>('/RentalOrder/statuses');
    return response;
  },

  /**
   * Cancel payment
   */
  cancelPayment: async (orderId: number, data: CancelPaymentRequest): Promise<CancelPaymentApiResponse> => {
    const response = await apiClient.post<CancelPaymentApiResponse['data']>(
      `/RentalOrder/${orderId}/cancel-payment`,
      data as unknown as Record<string, unknown>
    );
    return response;
  },
};

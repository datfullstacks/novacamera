'use client';

/**
 * Rental Order Query Hooks
 * Custom hooks for rental order-related queries and mutations
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { rentalService } from '@/lib/api/services';
import { QUERY_KEYS } from '../query-keys';
import type {
  CreateRentalOrderRequest,
  RentalOrderListResponse,
  RentalOrderDetailApiResponse,
  RentalOrderSummaryApiResponse,
  AvailabilityCheckApiResponse,
  CalendarAvailabilityApiResponse,
  SelectedDatesAvailabilityApiResponse,
  RentalOrderUserFilterParams,
  RentalOrderAdminFilterParams,
  UpdateOrderStatusDto,
  CheckSelectedDatesRequest,
  CancelPaymentRequest,
} from '@/types/api';

/**
 * Get user's rental orders
 */
export function useUserRentalOrders(
  userId: number,
  params?: RentalOrderUserFilterParams,
  options?: Omit<UseQueryOptions<RentalOrderListResponse>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: QUERY_KEYS.RENTAL.USER_ORDERS(userId.toString()),
    queryFn: () => rentalService.getUserRentalOrders(userId, params),
    enabled: !!userId,
    staleTime: 1000 * 60 * 2, // 2 minutes
    ...options,
  });
}

/**
 * Get admin rental orders with filters
 */
export function useAdminRentalOrders(
  params?: RentalOrderAdminFilterParams,
  options?: Omit<UseQueryOptions<RentalOrderListResponse>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: QUERY_KEYS.RENTAL.ADMIN_ORDERS(params as Record<string, unknown>),
    queryFn: () => rentalService.getAdminRentalOrders(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
    ...options,
  });
}

/**
 * Get single rental order by ID
 */
export function useRentalOrder(
  id: number,
  options?: Omit<UseQueryOptions<RentalOrderDetailApiResponse>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: QUERY_KEYS.RENTAL.DETAIL(id),
    queryFn: () => rentalService.getRentalOrder(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  });
}

/**
 * Calculate order summary
 */
export function useCalculateOrder(
  orderData: CreateRentalOrderRequest,
  options?: Omit<UseQueryOptions<RentalOrderSummaryApiResponse>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: QUERY_KEYS.RENTAL.CALCULATE(orderData as unknown as Record<string, unknown>),
    queryFn: () => rentalService.calculateOrderSummary(orderData),
    enabled: !!(orderData.items && orderData.items.length > 0),
    staleTime: 1000 * 60, // 1 minute
    ...options,
  });
}

/**
 * Check equipment availability
 */
export function useCheckAvailability(
  equipmentId: number,
  startDate: string,
  endDate: string,
  quantity = 1,
  options?: Omit<UseQueryOptions<AvailabilityCheckApiResponse>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: QUERY_KEYS.RENTAL.CHECK_AVAILABILITY(equipmentId, startDate, endDate),
    queryFn: () => rentalService.checkAvailability(equipmentId, startDate, endDate, quantity),
    enabled: !!(equipmentId && startDate && endDate),
    staleTime: 1000 * 60, // 1 minute
    ...options,
  });
}

/**
 * Get calendar availability
 */
export function useCalendarAvailability(
  equipmentId: number,
  startDate: string,
  endDate: string,
  options?: Omit<UseQueryOptions<CalendarAvailabilityApiResponse>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: QUERY_KEYS.RENTAL.CALENDAR(equipmentId),
    queryFn: () => rentalService.getCalendarAvailability(equipmentId, startDate, endDate),
    enabled: !!(equipmentId && startDate && endDate),
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  });
}

/**
 * Check selected dates availability
 */
export function useCheckSelectedDates(
  equipmentId: number,
  data: CheckSelectedDatesRequest,
  options?: Omit<UseQueryOptions<SelectedDatesAvailabilityApiResponse>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: QUERY_KEYS.RENTAL.CHECK_AVAILABILITY(
      equipmentId,
      data.selectedDates[0] || '',
      data.selectedDates[data.selectedDates.length - 1] || ''
    ),
    queryFn: () => rentalService.checkSelectedDates(equipmentId, data),
    enabled: !!(equipmentId && data.selectedDates && data.selectedDates.length > 0),
    staleTime: 1000 * 60, // 1 minute
    ...options,
  });
}

/**
 * Create rental order mutation
 */
export function useCreateRentalOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderData: CreateRentalOrderRequest) =>
      rentalService.createRentalOrder(orderData),
    onSuccess: () => {
      // Invalidate rental queries to refresh lists
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RENTAL.ALL });
      // Invalidate dashboard queries as well
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD.SUMMARY });
    },
  });
}

/**
 * Update order status mutation
 */
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: number; status: UpdateOrderStatusDto }) =>
      rentalService.updateOrderStatus(orderId, status),
    onSuccess: (_, variables) => {
      // Invalidate specific order query
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.RENTAL.DETAIL(variables.orderId),
      });
      // Invalidate all rental lists
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RENTAL.ALL });
      // Invalidate dashboard
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD.SUMMARY });
    },
  });
}

/**
 * Cancel payment mutation
 */
export function useCancelPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, data }: { orderId: number; data: CancelPaymentRequest }) =>
      rentalService.cancelPayment(orderId, data),
    onSuccess: (_, variables) => {
      // Invalidate specific order query
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RENTAL.DETAIL(variables.orderId) });
      // Invalidate all rental lists
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RENTAL.ALL });
    },
  });
}

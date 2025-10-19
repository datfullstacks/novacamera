// @ts-nocheck
/**
 * User Query Hooks
 * Custom hooks for user-related queries and mutations
 * 
 * NOTE: This file is currently disabled as userService is not yet implemented.
 * It will be enabled once the User API service is created.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/lib/api';
import { QUERY_KEYS } from '../query-keys';
import type { User, CreateUserDto, UpdateUserDto, PaginatedResponse } from '@/types';

/**
 * Get list of users with pagination
 */
export function useUsers(params?: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  return useQuery({
    queryKey: QUERY_KEYS.USERS.LIST(params),
    queryFn: () => userService.getUsers(params),
  });
}

/**
 * Get single user by ID
 */
export function useUser(id: string | number) {
  return useQuery({
    queryKey: QUERY_KEYS.USERS.DETAIL(id),
    queryFn: () => userService.getUserById(id),
    enabled: !!id, // Only run if id exists
  });
}

/**
 * Create new user mutation
 */
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserDto) => userService.createUser(data),
    onSuccess: () => {
      // Invalidate users list to refetch
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS.ALL });
    },
  });
}

/**
 * Update user mutation
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: UpdateUserDto }) =>
      userService.updateUser(id, data),
    onSuccess: (_, variables) => {
      // Invalidate specific user and users list
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS.DETAIL(variables.id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS.ALL });
    },
  });
}

/**
 * Delete user mutation
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => userService.deleteUser(id),
    onSuccess: () => {
      // Invalidate users list to refetch
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS.ALL });
    },
  });
}
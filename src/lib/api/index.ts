// Export API client
export { apiClient, ApiClientError } from './client';

// Export services
export { authService, AuthService } from './auth';
export { equipmentService, EquipmentService } from './equipment';

// Import services for internal use
import { authService } from './auth';
import { equipmentService } from './equipment';

// Export types for convenience
export type * from '@/types/api';

// Create centralized API object
export const api = {
  auth: authService,
  equipment: equipmentService,
  // Add more services here as they are created
  // order: orderService,
  // user: userService,
} as const;

// Export individual services for tree-shaking
export {
  authService as auth,
  equipmentService as equipment,
};
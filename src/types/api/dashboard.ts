import { ApiResponse } from './base';

// Dashboard Summary
export interface DashboardSummaryResponse {
  totalRevenue: number;
  activeRentals: number;
  availableEquipments: number;
  newCustomers: number;
}

// Upcoming Rental
export interface UpcomingRentalResponse {
  orderId: number;
  customerName: string | null;
  equipmentName: string | null;
  equipmentId: number;
  equipmentImage: string | null;
  rentalStartDate: string;
  rentalEndDate: string;
  status: string | null;
}

// API Response Types
export type DashboardSummaryApiResponse = ApiResponse<DashboardSummaryResponse>;
export type UpcomingRentalsApiResponse = ApiResponse<UpcomingRentalResponse[]>;

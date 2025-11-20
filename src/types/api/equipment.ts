import { ApiResponse, PaginatedApiResponse } from './base';

// Equipment status
export enum EquipmentStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  MAINTENANCE = 'maintenance',
}

// Equipment Image
export interface EquipmentImageResponse {
  imageId: number;
  imageUrl: string | null;
  isPrimary: boolean | null;
  sortOrder: number | null;
}

// Equipment Card (List View)
export interface EquipmentCardResponse {
  equipmentId: number;
  name: string | null;
  tagline: string | null;
  brand: string | null;
  mainImageUrl: string | null;
  pricePerDay: number;
  rating: number | null;
  reviewCount: number | null;
  isAvailable: boolean;
  location: string | null;
  categoryName: string | null;
  formattedPrice: string | null;
  ratingDisplay: string | null;
  reviewDisplay: string | null;
  availabilityDisplay: string | null;
  availabilityClass: string | null;
}

// Rental Pricing Info
export interface RentalPricingInfo {
  oneDayPrice: number;
  threeDayPrice: number;
  weeklyPrice: number;
  monthlyPrice: number;
  depositFee: number;
  currency: string | null;
  formattedOneDay: string | null;
  formattedThreeDay: string | null;
  formattedWeekly: string | null;
  formattedMonthly: string | null;
  formattedDeposit: string | null;
}

// Specification Info
export interface SpecificationInfo {
  label: string | null;
  value: string | null;
  unit: string | null;
  category: string | null;
}

// Equipment Response (Full Detail)
export interface EquipmentResponse {
  equipmentId: number;
  categoryId: number | null;
  name: string | null;
  tagline: string | null;
  shortDescription: string | null;
  brand: string | null;
  mainImageUrl: string | null;
  description: string | null;
  conditionNote: string | null;
  pricePerDay: number;
  depositFee: number | null;
  rating: number | null;
  reviewCount: number | null;
  status: string | null;
  stock: number | null;
  rentalCount: number | null;
  categoryName: string | null;
  isAvailable: boolean;
  location: string | null;
  imageResponses: EquipmentImageResponse[];
  formattedPrice: string | null;
  formattedDeposit: string | null;
  ratingStars: string | null;
  reviewText: string | null;
  availabilityText: string | null;
}

// Equipment Detail Response (with related equipment)
export interface EquipmentDetailResponse extends EquipmentResponse {
  images: EquipmentImageResponse[];
  relatedEquipments: EquipmentResponse[];
  pricingInfo: RentalPricingInfo;
  specifications: SpecificationInfo[];
}

// Category Info
export interface CategoryInfo {
  categoryId: number;
  categoryName: string | null;
  equipmentCount: number;
}

// Filter Metadata
export interface FilterMetadata {
  availableBrands: string[];
  minPrice: number;
  maxPrice: number;
  categories: CategoryInfo[];
  locations: string[];
  statusCounts: Record<string, number> | null;
}

// Equipment Filter Params
export interface EquipmentFilterParams {
  searchTerm?: string;
  categoryIds?: number[];
  brands?: string[];
  minPrice?: number;
  maxPrice?: number;
  isAvailable?: boolean;
  minRating?: number;
  maxRating?: number;
  sortBy?: string;
  pageNumber?: number;
  pageSize?: number;
  location?: string;
  statuses?: string[];
  conditionFilter?: string;
  hasImages?: boolean;
  minStock?: number;
  maxRentalCount?: number;
}

// Image Sort Order
export interface ImageSortOrderItem {
  imageId: number;
  sortOrder: number;
}

export interface UpdateImageSortOrderRequest {
  images: ImageSortOrderItem[];
}

// API Response Types
export type EquipmentListResponse = PaginatedApiResponse<EquipmentCardResponse>;
export type EquipmentDetailApiResponse = ApiResponse<EquipmentDetailResponse>;
export type EquipmentCardListApiResponse = ApiResponse<EquipmentCardResponse[]>;
export type EquipmentApiResponse = ApiResponse<EquipmentResponse>;
export type EquipmentImagesApiResponse = ApiResponse<EquipmentImageResponse[]>;
export type FilterMetadataApiResponse = ApiResponse<FilterMetadata>;
export type BrandsListApiResponse = ApiResponse<{ brands: string[] }>;
export type PriceRangeApiResponse = ApiResponse<string>;
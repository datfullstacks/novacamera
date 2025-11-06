import { apiClient } from '../client';
import type { ApiResponse } from '@/types/api';

/**
 * Equipment Item Status Types
 * Các trạng thái của từng vật phẩm thiết bị cụ thể
 */
export type EquipmentItemStatus = 
  | 'Available'    // Sẵn sàng cho thuê
  | 'Rented'       // Đang được thuê
  | 'Reserved'     // Đã đặt trước
  | 'Held'         // Đang giữ chỗ
  | 'Maintenance'  // Đang bảo trì
  | 'Damaged';     // Hỏng hóc

/**
 * Equipment Item Response
 * Thông tin chi tiết của một vật phẩm thiết bị
 */
export interface EquipmentItemResponse {
  itemId: number;
  equipmentId: number;
  equipmentName: string;
  serialNumber: string;
  conditionNote: string;
  warrantyInfo: string;
  specifications: string;
  weight: number;
  specs: string;
  status: EquipmentItemStatus;
  isCurrentlyRented: boolean;
  lastRentalDate: string | null;
}

/**
 * Create Equipment Item Request
 * Dữ liệu để tạo vật phẩm thiết bị mới
 */
export interface CreateEquipmentItemRequest extends Record<string, unknown> {
  equipmentId: number;
  serialNumber: string;
  conditionNote?: string;
  warrantyInfo?: string;
  weight?: number;
  specs?: string;
  status: EquipmentItemStatus;
}

/**
 * Update Equipment Item Request
 * Dữ liệu để cập nhật vật phẩm thiết bị
 */
export interface UpdateEquipmentItemRequest extends Record<string, unknown> {
  itemId?: number; // Optional but included in API spec
  serialNumber?: string;
  conditionNote?: string;
  warrantyInfo?: string;
  weight?: number;
  specs?: string;
  status?: EquipmentItemStatus;
}

/**
 * Equipment Item Service
 * Quản lý các API liên quan đến từng vật phẩm thiết bị cụ thể
 */
export const equipmentItemService = {
  /**
   * Lấy danh sách tất cả equipment items theo equipmentId
   * @param equipmentId - ID của equipment (thông tin chung)
   */
  async getItemsByEquipmentId(equipmentId: number): Promise<ApiResponse<EquipmentItemResponse[]>> {
    return apiClient.get<EquipmentItemResponse[]>(`/EquipmentItem/equipment/${equipmentId}`);
  },

  /**
   * Lấy thông tin chi tiết một equipment item
   * @param itemId - ID của equipment item
   */
  async getItemById(itemId: number): Promise<ApiResponse<EquipmentItemResponse>> {
    return apiClient.get<EquipmentItemResponse>(`/EquipmentItem/${itemId}`);
  },

  /**
   * Tạo mới equipment item (Admin only)
   * @param data - Dữ liệu equipment item
   */
  async createItem(data: CreateEquipmentItemRequest): Promise<ApiResponse<EquipmentItemResponse>> {
    return apiClient.post<EquipmentItemResponse>('/EquipmentItem', data);
  },

  /**
   * Cập nhật equipment item (Admin only)
   * @param itemId - ID của equipment item
   * @param data - Dữ liệu cập nhật
   */
  async updateItem(
    itemId: number, 
    data: UpdateEquipmentItemRequest
  ): Promise<ApiResponse<EquipmentItemResponse>> {
    return apiClient.put<EquipmentItemResponse>(`/EquipmentItem/${itemId}`, data);
  },

  /**
   * Xóa equipment item (Admin only)
   * @param itemId - ID của equipment item
   */
  async deleteItem(itemId: number): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/EquipmentItem/${itemId}`);
  },

  /**
   * Lấy danh sách equipment items có sẵn (Available) cho một equipment
   * @param equipmentId - ID của equipment
   */
  async getAvailableItems(equipmentId: number): Promise<ApiResponse<EquipmentItemResponse[]>> {
    const response = await this.getItemsByEquipmentId(equipmentId);
    
    if (response.statusCode === 200 && response.data) {
      // Filter chỉ lấy items có status = "Available"
      const availableItems = response.data.filter(item => item.status === 'Available');
      return {
        ...response,
        data: availableItems,
      };
    }
    
    return response;
  },

  /**
   * Helper: Format status sang tiếng Việt
   */
  formatStatus(status: EquipmentItemStatus): string {
    const statusMap: Record<EquipmentItemStatus, string> = {
      'Available': 'Sẵn sàng',
      'Rented': 'Đang thuê',
      'Reserved': 'Đã đặt trước',
      'Held': 'Đang giữ chỗ',
      'Maintenance': 'Bảo trì',
      'Damaged': 'Hỏng hóc',
    };
    return statusMap[status] || status;
  },

  /**
   * Helper: Get status badge color
   */
  getStatusColor(status: EquipmentItemStatus): string {
    const colorMap: Record<EquipmentItemStatus, string> = {
      'Available': 'bg-green-100 text-green-800',
      'Rented': 'bg-blue-100 text-blue-800',
      'Reserved': 'bg-yellow-100 text-yellow-800',
      'Held': 'bg-orange-100 text-orange-800',
      'Maintenance': 'bg-purple-100 text-purple-800',
      'Damaged': 'bg-red-100 text-red-800',
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  },

  /**
   * Helper: Validate status value
   * Kiểm tra status có hợp lệ không (theo API requirement)
   */
  isValidStatus(status: string): status is EquipmentItemStatus {
    const validStatuses: EquipmentItemStatus[] = [
      'Available',
      'Rented', 
      'Reserved',
      'Held',
      'Maintenance',
      'Damaged'
    ];
    return validStatuses.includes(status as EquipmentItemStatus);
  },

  /**
   * Helper: Get all valid status options
   */
  getAllStatuses(): EquipmentItemStatus[] {
    return ['Available', 'Rented', 'Reserved', 'Held', 'Maintenance', 'Damaged'];
  },
};

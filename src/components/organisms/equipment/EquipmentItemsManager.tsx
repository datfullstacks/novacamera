'use client';

import React, { useState } from 'react';
import { Plus, Package, Trash2, Edit2 } from 'lucide-react';
import { 
  equipmentItemService, 
  type EquipmentItemResponse,
  type EquipmentItemStatus 
} from '@/lib/api/services/equipment-item.service';
import { showToast } from '@/components/atoms/ui/Toast';

interface EquipmentItemsManagerProps {
  equipmentId: number;
  equipmentName: string;
  items: EquipmentItemResponse[];
  onItemsChange: () => void;
}

export const EquipmentItemsManager: React.FC<EquipmentItemsManagerProps> = ({
  equipmentId,
  equipmentName,
  items,
  onItemsChange,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<EquipmentItemResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    serialNumber: '',
    conditionNote: '',
    warrantyInfo: '',
    weight: 0,
    specs: '',
    status: 'Available' as EquipmentItemStatus,
  });

  const handleAddItem = async () => {
    if (!formData.serialNumber.trim()) {
      showToast({
        type: 'error',
        title: 'Thiếu thông tin',
        message: 'Vui lòng nhập số serial',
        duration: 3000,
      });
      return;
    }

    // Validate status
    if (!equipmentItemService.isValidStatus(formData.status)) {
      showToast({
        type: 'error',
        title: 'Trạng thái không hợp lệ',
        message: 'Vui lòng chọn trạng thái hợp lệ: Available, Rented, Reserved, Held, Maintenance, hoặc Damaged',
        duration: 4000,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await equipmentItemService.createItem({
        equipmentId,
        serialNumber: formData.serialNumber,
        conditionNote: formData.conditionNote,
        warrantyInfo: formData.warrantyInfo,
        weight: formData.weight,
        specs: formData.specs,
        status: formData.status,
      });

      if (response.statusCode === 201 || response.statusCode === 200) {
        showToast({
          type: 'success',
          title: 'Thành công',
          message: 'Đã thêm vật phẩm mới',
          duration: 3000,
        });
        
        setShowAddModal(false);
        resetForm();
        onItemsChange();
      } else {
        throw new Error(response.message || 'Không thể thêm vật phẩm');
      }
    } catch (error) {
      console.error('Error adding item:', error);
      showToast({
        type: 'error',
        title: 'Lỗi',
        message: error instanceof Error ? error.message : 'Không thể thêm vật phẩm',
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditItem = async () => {
    if (!selectedItem) return;

    if (!formData.serialNumber.trim()) {
      showToast({
        type: 'error',
        title: 'Thiếu thông tin',
        message: 'Vui lòng nhập số serial',
        duration: 3000,
      });
      return;
    }

    // Validate status
    if (!equipmentItemService.isValidStatus(formData.status)) {
      showToast({
        type: 'error',
        title: 'Trạng thái không hợp lệ',
        message: 'Vui lòng chọn trạng thái hợp lệ: Available, Rented, Reserved, Held, Maintenance, hoặc Damaged',
        duration: 4000,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await equipmentItemService.updateItem(selectedItem.itemId, {
        itemId: selectedItem.itemId, // Include itemId in request body as per API spec
        serialNumber: formData.serialNumber,
        conditionNote: formData.conditionNote,
        warrantyInfo: formData.warrantyInfo,
        weight: formData.weight,
        specs: formData.specs,
        status: formData.status,
      });

      if (response.statusCode === 200) {
        showToast({
          type: 'success',
          title: 'Thành công',
          message: 'Đã cập nhật vật phẩm',
          duration: 3000,
        });
        
        setShowEditModal(false);
        setSelectedItem(null);
        resetForm();
        onItemsChange();
      } else {
        throw new Error(response.message || 'Không thể cập nhật vật phẩm');
      }
    } catch (error) {
      console.error('Error updating item:', error);
      showToast({
        type: 'error',
        title: 'Lỗi',
        message: error instanceof Error ? error.message : 'Không thể cập nhật vật phẩm',
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteItem = async () => {
    if (!selectedItem) return;

    // Validate confirmation text
    if (deleteConfirmText !== selectedItem.serialNumber) {
      showToast({
        type: 'error',
        title: 'Xác nhận không khớp',
        message: `Vui lòng nhập đúng số serial "${selectedItem.serialNumber}" để xác nhận xóa.`,
        duration: 4000,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await equipmentItemService.deleteItem(selectedItem.itemId);

      if (response.statusCode === 200 || response.statusCode === 204) {
        showToast({
          type: 'success',
          title: 'Đã xóa',
          message: 'Vật phẩm đã được xóa vĩnh viễn khỏi hệ thống',
          duration: 3000,
        });
        
        setShowDeleteModal(false);
        setSelectedItem(null);
        setDeleteConfirmText('');
        onItemsChange();
      } else {
        throw new Error(response.message || 'Không thể xóa vật phẩm');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      showToast({
        type: 'error',
        title: 'Lỗi',
        message: error instanceof Error ? error.message : 'Không thể xóa vật phẩm',
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      serialNumber: '',
      conditionNote: '',
      warrantyInfo: '',
      weight: 0,
      specs: '',
      status: 'Available',
    });
  };

  // Get status options from service
  const statusOptions = equipmentItemService.getAllStatuses();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Package className="w-6 h-6 text-blue-600" />
          <div>
            <h3 className="text-xl font-bold text-gray-800">Quản lý vật phẩm</h3>
            <p className="text-sm text-gray-600">
              {items.length} vật phẩm cho {equipmentName}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Thêm vật phẩm
        </button>
      </div>

      {/* Items List */}
      {items.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">Chưa có vật phẩm nào</p>
          <p className="text-sm text-gray-500">Thêm vật phẩm để bắt đầu quản lý kho</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.itemId}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-semibold text-gray-800">
                    SN: {item.serialNumber}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${equipmentItemService.getStatusColor(
                      item.status
                    )}`}
                  >
                    {equipmentItemService.formatStatus(item.status)}
                  </span>
                  {item.isCurrentlyRented && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      Đang cho thuê
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  {item.conditionNote && (
                    <p>
                      <span className="font-medium">Tình trạng:</span> {item.conditionNote}
                    </p>
                  )}
                  {item.warrantyInfo && (
                    <p>
                      <span className="font-medium">Bảo hành:</span> {item.warrantyInfo}
                    </p>
                  )}
                  {item.lastRentalDate && (
                    <p>
                      <span className="font-medium">Thuê gần nhất:</span>{' '}
                      {new Date(item.lastRentalDate).toLocaleDateString('vi-VN')}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedItem(item);
                    setFormData({
                      serialNumber: item.serialNumber,
                      conditionNote: item.conditionNote || '',
                      warrantyInfo: item.warrantyInfo || '',
                      weight: item.weight || 0,
                      specs: item.specs || '',
                      status: item.status,
                    });
                    setShowEditModal(true);
                  }}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Sửa"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setSelectedItem(item);
                    setShowDeleteModal(true);
                  }}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Xóa"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Thêm vật phẩm mới</h3>

              <div className="space-y-4">
                {/* Serial Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số Serial <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.serialNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, serialNumber: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ví dụ: SN001, ABC123"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trạng thái <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as EquipmentItemStatus })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {equipmentItemService.formatStatus(status)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Condition Note */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ghi chú tình trạng
                  </label>
                  <textarea
                    value={formData.conditionNote}
                    onChange={(e) =>
                      setFormData({ ...formData, conditionNote: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Mô tả tình trạng vật phẩm..."
                  />
                </div>

                {/* Warranty Info */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thông tin bảo hành
                  </label>
                  <input
                    type="text"
                    value={formData.warrantyInfo}
                    onChange={(e) =>
                      setFormData({ ...formData, warrantyInfo: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ví dụ: Bảo hành 12 tháng"
                  />
                </div>

                {/* Weight */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trọng lượng (gram)
                  </label>
                  <input
                    type="number"
                    value={formData.weight}
                    onChange={(e) =>
                      setFormData({ ...formData, weight: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={handleAddItem}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'Đang thêm...' : 'Thêm vật phẩm'}
                </button>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {showEditModal && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Chỉnh sửa vật phẩm: {selectedItem.serialNumber}
              </h3>

              <div className="space-y-4">
                {/* Serial Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số Serial <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.serialNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, serialNumber: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ví dụ: SN001, ABC123"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trạng thái <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as EquipmentItemStatus })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {equipmentItemService.formatStatus(status)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Condition Note */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ghi chú tình trạng
                  </label>
                  <textarea
                    value={formData.conditionNote}
                    onChange={(e) =>
                      setFormData({ ...formData, conditionNote: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Mô tả tình trạng vật phẩm..."
                  />
                </div>

                {/* Warranty Info */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thông tin bảo hành
                  </label>
                  <input
                    type="text"
                    value={formData.warrantyInfo}
                    onChange={(e) =>
                      setFormData({ ...formData, warrantyInfo: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ví dụ: Bảo hành 12 tháng"
                  />
                </div>

                {/* Weight */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trọng lượng (gram)
                  </label>
                  <input
                    type="number"
                    value={formData.weight}
                    onChange={(e) =>
                      setFormData({ ...formData, weight: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={handleEditItem}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedItem(null);
                    resetForm();
                  }}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal - Custom with input verification */}
      {showDeleteModal && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              {/* Warning Icon */}
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                ⚠️ Xóa vĩnh viễn
              </h3>

              {/* Warning Message */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-red-800 mb-2">
                  <strong>Cảnh báo nghiêm trọng:</strong>
                </p>
                <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
                  <li>Vật phẩm sẽ bị <strong>xóa vĩnh viễn</strong> khỏi hệ thống</li>
                  <li><strong>KHÔNG THỂ KHÔI PHỤC</strong> sau khi xóa</li>
                  <li>Tất cả dữ liệu liên quan sẽ mất</li>
                </ul>
              </div>

              {/* Item Info */}
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <p className="text-sm text-gray-600 mb-1">Vật phẩm sẽ bị xóa:</p>
                <p className="font-semibold text-gray-900">{selectedItem.serialNumber}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Equipment: {selectedItem.equipmentName}
                </p>
              </div>

              {/* Confirmation Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Để xác nhận, vui lòng nhập số serial:{' '}
                  <code className="ml-1 px-2 py-1 bg-gray-100 rounded text-red-600 font-mono">
                    {selectedItem.serialNumber}
                  </code>
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder={`Nhập "${selectedItem.serialNumber}"`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  disabled={isSubmitting}
                />
                {deleteConfirmText && deleteConfirmText !== selectedItem.serialNumber && (
                  <p className="text-xs text-red-600 mt-1">
                    ⚠️ Số serial không khớp
                  </p>
                )}
              </div>

              {/* Alternative Action Suggestion */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <p className="text-xs text-blue-800">
                  <strong>💡 Gợi ý:</strong> Nếu vật phẩm chỉ tạm thời không sử dụng, hãy đổi trạng thái thành
                  {' '}<strong className="text-blue-900">&quot;Maintenance&quot;</strong>{' '}hoặc
                  {' '}<strong className="text-blue-900">&quot;Damaged&quot;</strong>{' '}thay vì xóa.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedItem(null);
                    setDeleteConfirmText('');
                  }}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Hủy (An toàn)
                </button>
                <button
                  onClick={handleDeleteItem}
                  disabled={isSubmitting || deleteConfirmText !== selectedItem.serialNumber}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
                >
                  {isSubmitting ? 'Đang xóa...' : 'Xóa vĩnh viễn'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

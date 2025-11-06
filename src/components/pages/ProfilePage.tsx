

import React, { useState, useRef, useEffect } from "react";
import MainTemplate from "@/components/templates/MainTemplate";
import Image from "next/image";
import { authService } from "@/lib/api/services/auth.service";
import { rentalService } from "@/lib/api/services/rental.service";
import { showToast } from "@/components/atoms/ui/Toast";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { updateUser } from "@/store/slices/authSlice";
import type { RentalOrderResponse } from "@/types/api/order";
import type { Invoice, UserResponse } from "@/types/api/auth";

const ProfilePage = () => {
  const dispatch = useAppDispatch();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = useAppSelector((state: any) => state.auth.user);
  
  const [activeTab, setActiveTab] = useState('profile');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Orders state
  const [orders, setOrders] = useState<RentalOrderResponse[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  
  // Invoices state
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoadingInvoices, setIsLoadingInvoices] = useState(false);
  const [invoicesError, setInvoicesError] = useState<string | null>(null);

  // Profile state
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [profileData, setProfileData] = useState<UserResponse | null>(null);

  // Fetch current user profile when profile tab is active
  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoadingProfile(true);
      
      try {
        const response = await authService.getCurrentUser();

        if (response.data) {
          setProfileData(response.data);
          // Update Redux store with latest user data
          if (user) {
            dispatch(updateUser({
              ...user,
              fullName: response.data.fullName || user.fullName,
              email: response.data.email || user.email,
              avatar: response.data.avatarUrl || user.avatar,
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    if (activeTab === 'profile') {
      fetchUserProfile();
    }
  }, [activeTab, user, dispatch]);

  // Avatar upload handlers
  const handleAvatarButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showToast({
        type: 'error',
        title: 'Lỗi',
        message: 'Vui lòng chọn file ảnh',
        duration: 3000,
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast({
        type: 'error',
        title: 'Lỗi',
        message: 'Kích thước ảnh không được vượt quá 5MB',
        duration: 3000,
      });
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewAvatar(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload avatar
    setIsUploadingAvatar(true);
    try {
      const response = await authService.uploadAvatar(file);
      
      if (response.data) {
        // Update user avatar in Redux
        if (user) {
          dispatch(updateUser({
            ...user,
            avatar: response.data.avatarUrl
          }));
        }
        
        showToast({
          type: 'success',
          title: 'Thành công',
          message: 'Cập nhật ảnh đại diện thành công',
          duration: 3000,
        });
        setPreviewAvatar(null); // Clear preview after successful upload
      }
    } catch (error) {
      console.error('Avatar upload error:', error);
      const errorMessage = error && typeof error === 'object' && 'response' in error && 
        error.response && typeof error.response === 'object' && 'data' in error.response &&
        error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data
        ? String(error.response.data.message)
        : 'Không thể tải lên ảnh đại diện';
      showToast({
        type: 'error',
        title: 'Lỗi',
        message: errorMessage,
        duration: 3000,
      });
      setPreviewAvatar(null); // Clear preview on error
    } finally {
      setIsUploadingAvatar(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Get current avatar URL
  const currentAvatarUrl = previewAvatar || profileData?.avatarUrl || user?.avatar || 'https://placehold.co/102x98';

  // Helper function to get status badge style
  const getStatusBadge = (status: string) => {
    const badges = {
      Pending: { class: 'bg-yellow-100 text-yellow-700', label: 'Chờ xác nhận' },
      Confirmed: { class: 'bg-blue-100 text-blue-700', label: 'Đã xác nhận' },
      Rented: { class: 'bg-green-100 text-green-700', label: 'Đang thuê' },
      Completed: { class: 'bg-gray-100 text-gray-700', label: 'Hoàn thành' },
      Cancelled: { class: 'bg-red-100 text-red-700', label: 'Đã hủy' },
    };
    return badges[status as keyof typeof badges] || badges.Pending;
  };

  // Helper function for payment status
  const getPaymentStatusBadge = (status: string) => {
    const badges = {
      Paid: { class: 'bg-green-100 text-green-700', label: 'Đã thanh toán' },
      Unpaid: { class: 'bg-yellow-100 text-yellow-700', label: 'Chưa thanh toán' },
      Overdue: { class: 'bg-red-100 text-red-700', label: 'Quá hạn' },
      Cancelled: { class: 'bg-gray-100 text-gray-700', label: 'Đã hủy' },
    };
    return badges[status as keyof typeof badges] || badges.Unpaid;
  };

  // Helper function for payment method
  const getPaymentMethodLabel = (method: string) => {
    const methods: Record<string, string> = {
      BankTransfer: 'Chuyển khoản',
      Cash: 'Tiền mặt',
      CreditCard: 'Thẻ tín dụng',
      DebitCard: 'Thẻ ghi nợ',
    };
    return methods[method] || method;
  };

  // Fetch user orders when rental tab is active
  useEffect(() => {
    const fetchUserOrders = async () => {
      if (!user?.userId) return;

      setIsLoadingOrders(true);
      setOrdersError(null);
      
      try {
        const response = await rentalService.getUserRentalOrders(user.userId, {
          pageNumber: 1,
          pageSize: 10,
          sortBy: 'OrderDate',
          sortOrder: 'desc',
        });

        if (response.data?.items) {
          setOrders(response.data.items);
        }
      } catch (error) {
        console.error('Error fetching user orders:', error);
        setOrdersError('Không thể tải danh sách đơn hàng');
        showToast({
          type: 'error',
          title: 'Lỗi',
          message: 'Không thể tải danh sách đơn hàng',
          duration: 3000,
        });
      } finally {
        setIsLoadingOrders(false);
      }
    };

    if (activeTab === 'rental' && user?.userId) {
      fetchUserOrders();
    }
  }, [activeTab, user?.userId]);

  // Fetch user invoices when payment tab is active
  useEffect(() => {
    const fetchUserInvoices = async () => {
      setIsLoadingInvoices(true);
      setInvoicesError(null);
      
      try {
        const response = await authService.getUserInvoices();

        if (response.data && typeof response.data === 'object' && 'invoices' in response.data) {
          const data = response.data as { invoices: Invoice[] };
          setInvoices(data.invoices);
        }
      } catch (error) {
        console.error('Error fetching user invoices:', error);
        setInvoicesError('Không thể tải danh sách hóa đơn');
        showToast({
          type: 'error',
          title: 'Lỗi',
          message: 'Không thể tải danh sách hóa đơn',
          duration: 3000,
        });
      } finally {
        setIsLoadingInvoices(false);
      }
    };

    if (activeTab === 'payment' && user?.userId) {
      fetchUserInvoices();
    }
  }, [activeTab, user?.userId]);
  
  // Danh sách sản phẩm cho thuê mẫu
  
    // ...có thể thêm nhiều sản phẩm mẫu
  

  return (
    <MainTemplate>
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)] bg-gray-50">
        <div className="w-[1196px] h-[796px] bg-black/0 flex">
          {/* Sidebar */}
          <div className="w-72 h-full bg-white shadow-[0px_1px_3px_0px_rgba(0,0,0,0.10)] flex flex-col justify-between py-8">
            <div>
              <div className="flex flex-col items-center mb-8">
                <div className="w-20 h-20 rounded-full outline-zinc-100 overflow-hidden mb-2" style={{ outline: '3px solid #f4f4f5', outlineOffset: '-3px' }}>
                  <Image src={currentAvatarUrl} alt="Avatar" width={80} height={80} className="w-20 h-20 object-cover" />
                </div>
                <div className="font-bold text-lg text-gray-800">{user?.fullName || 'John Doe'}</div>
                <div className="text-sm text-gray-500">{user?.email || 'John.doe@example.com'}</div>
              </div>
              <nav className="flex flex-col gap-2 px-6">
                <button onClick={() => setActiveTab('profile')} className={`py-2 px-4 rounded-lg font-medium border-l-4 ${activeTab === 'profile' ? 'bg-blue-50 text-blue-500 border-blue-500' : 'text-gray-600 border-transparent'}`}>Hồ sơ của tôi</button>
                <button onClick={() => setActiveTab('rental')} className={`py-2 px-4 rounded-lg text-gray-600 border-l-4 ${activeTab === 'rental' ? 'bg-blue-50 text-blue-500 border-blue-500' : 'border-transparent'}`}>Đơn hàng</button>
                <button onClick={() => setActiveTab('payment')} className={`py-2 px-4 rounded-lg text-gray-600 border-l-4 ${activeTab === 'payment' ? 'bg-blue-50 text-blue-500 border-blue-500' : 'border-transparent'}`}>Hóa đơn</button>
                <button onClick={() => setActiveTab('notifications')} className={`py-2 px-4 rounded-lg text-gray-600 border-l-4 ${activeTab === 'notifications' ? 'bg-blue-50 text-blue-500 border-blue-500' : 'border-transparent'}`}>Thông báo</button>
                <button onClick={() => setActiveTab('security')} className={`py-2 px-4 rounded-lg text-gray-600 border-l-4 ${activeTab === 'security' ? 'bg-blue-50 text-blue-500 border-blue-500' : 'border-transparent'}`}>Bảo vệ</button>
              </nav>
            </div>
            <div className="px-6 pb-8">
              <button className="w-full py-2 rounded-lg bg-red-100 text-red-700 font-medium">Đăng xuất</button>
            </div>
          </div>
          {/* Main Card */}
          <div className="flex-1 flex items-center justify-center">
            <div className="w-[872px] h-[716px] bg-white rounded-xl shadow-[0px_1px_3px_0px_rgba(0,0,0,0.10)] p-6 relative">
              <div className="border-b border-gray-200 pb-4 mb-6">
                <h2 className="text-2xl font-normal text-gray-800 font-['ABeeZee'] leading-loose">
                  {activeTab === 'profile' && 'Hồ sơ của tôi'}
                  {activeTab === 'rental' && 'Đơn hàng'}
                  {activeTab === 'payment' && 'Hóa đơn'}
                  {activeTab === 'notifications' && 'Thông báo'}
                  {activeTab === 'security' && 'Bảo vệ'}
                </h2>
              </div>
              {/* Tab Content */}
           
              {activeTab === 'profile' && (
                <div className="h-[600px] overflow-y-auto">
                  {isLoadingProfile ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                  ) : (
                    <div className="flex gap-8 mb-8">
                      <div className="flex flex-col items-center">
                        <div className="w-24 h-24 rounded-full outline-zinc-100 overflow-hidden mb-2 relative" style={{ outline: '3px solid #f4f4f5', outlineOffset: '-3px' }}>
                          <Image src={currentAvatarUrl} alt="Avatar" width={96} height={96} className="w-24 h-24 object-cover" />
                          {isUploadingAvatar && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                            </div>
                          )}
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <button 
                          onClick={handleAvatarButtonClick}
                          disabled={isUploadingAvatar}
                          className="mt-2 px-4 py-2 bg-white rounded-md border border-gray-200 text-sm text-black hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {isUploadingAvatar ? 'Đang tải lên...' : 'Tải lên ảnh mới'}
                        </button>
                      </div>
                      <div className="flex-1 grid grid-cols-2 gap-x-8 gap-y-6">
                        <div className="col-span-2">
                          <div className="block text-sm text-gray-800 mb-1 font-['ABeeZee']">Họ và tên</div>
                          <div className="bg-white rounded-md border border-gray-200 px-3 py-2 text-xs text-black">
                            {profileData?.fullName || user?.fullName || 'N/A'}
                          </div>
                        </div>
                        <div className="col-span-2">
                          <div className="block text-sm text-gray-800 mb-1 font-['ABeeZee']">Địa chỉ email</div>
                          <div className="bg-white rounded-md border border-gray-200 px-3 py-2 text-xs text-black">
                            {profileData?.email || user?.email || 'N/A'}
                          </div>
                        </div>
                        <div>
                          <div className="block text-sm text-gray-800 mb-1 font-['ABeeZee']">Số điện thoại</div>
                          <div className="bg-white rounded-md border border-gray-200 px-3 py-2 text-xs text-black">
                            {profileData?.phoneNumber || 'N/A'}
                          </div>
                        </div>
                        <div>
                          <div className="block text-sm text-gray-800 mb-1 font-['ABeeZee']">Vai trò</div>
                          <div className="bg-white rounded-md border border-gray-200 px-3 py-2 text-xs text-black">
                            {profileData?.roleName || user?.roleName || 'N/A'}
                          </div>
                        </div>
                        <div>
                          <div className="block text-sm text-gray-800 mb-1 font-['ABeeZee']">Địa chỉ</div>
                          <div className="bg-white rounded-md border border-gray-200 px-3 py-2 text-xs text-black">
                            {profileData?.address || 'Chưa cập nhật'}
                          </div>
                        </div>
                        <div>
                          <div className="block text-sm text-gray-800 mb-1 font-['ABeeZee']">Trạng thái</div>
                          <div className="bg-white rounded-md border border-gray-200 px-3 py-2 text-xs text-black">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              profileData?.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {profileData?.status === 'Active' ? 'Đang hoạt động' : profileData?.status || 'N/A'}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="block text-sm text-gray-800 mb-1 font-['ABeeZee']">Điểm tích lũy</div>
                          <div className="bg-white rounded-md border border-gray-200 px-3 py-2 text-xs text-black">
                            {profileData?.loyaltyPoints?.toLocaleString('vi-VN') || '0'} điểm
                          </div>
                        </div>
                        <div>
                          <div className="block text-sm text-gray-800 mb-1 font-['ABeeZee']">Tổng giao dịch</div>
                          <div className="bg-white rounded-md border border-gray-200 px-3 py-2 text-xs text-black">
                            {profileData?.totaltransactions || '0'}
                          </div>
                        </div>
                        <div className="col-span-2">
                          <div className="block text-sm text-gray-800 mb-1 font-['ABeeZee']">Ngày tạo tài khoản</div>
                          <div className="bg-white rounded-md border border-gray-200 px-3 py-2 text-xs text-black">
                            {profileData?.createdAt ? new Date(profileData.createdAt).toLocaleDateString('vi-VN', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            }) : 'N/A'}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {activeTab === 'rental' && (
                <div className="h-[600px] overflow-y-auto">
                  {isLoadingOrders && (
                    <div className="flex items-center justify-center h-64">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                  )}
                  
                  {!isLoadingOrders && ordersError && (
                    <div className="text-center text-red-500 mt-8">{ordersError}</div>
                  )}
                  
                  {!isLoadingOrders && !ordersError && orders.length === 0 && (
                    <div className="text-center text-gray-500 mt-8">
                      <p className="text-lg mb-4">Bạn chưa có đơn hàng nào</p>
                      <button 
                        onClick={() => { globalThis.location.href = '/equipment'; }}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition"
                      >
                        Bắt đầu thuê thiết bị
                      </button>
                    </div>
                  )}
                  
                  {!isLoadingOrders && !ordersError && orders.length > 0 && (
                    <div className="space-y-4">
                      {orders.map((order) => {
                        const statusBadge = getStatusBadge(order.status || 'Pending');
                        
                        return (
                          <div key={order.orderId} className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                            {/* Order Header */}
                            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                              <div>
                                <div className="flex items-center gap-3 mb-2">
                                  <span className="text-sm font-semibold text-gray-900">
                                    Đơn hàng #{order.referenceNo}
                                  </span>
                                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge.class}`}>
                                    {statusBadge.label}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-500">
                                  Ngày đặt: {new Date(order.orderDate).toLocaleDateString('vi-VN', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric'
                                  })}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-600 mb-1">Tổng tiền</p>
                                <p className="text-lg font-bold text-blue-600">
                                  {order.totalAmount.toLocaleString('vi-VN')}đ
                                </p>
                              </div>
                            </div>

                            {/* Order Items */}
                            <div className="space-y-3 mb-4">
                              {order.orderDetails.slice(0, 2).map((item) => (
                                <div key={item.orderDetailId} className="flex items-center gap-4">
                                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                    {item.imageUrl ? (
                                      <Image 
                                        src={item.imageUrl} 
                                        alt={item.equipmentName || 'Equipment'} 
                                        width={64} 
                                        height={64} 
                                        className="w-full h-full object-cover" 
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        No Image
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900 truncate">{item.equipmentName}</p>
                                    <p className="text-xs text-gray-500">SN: {item.serialNumber}</p>
                                    <p className="text-xs text-gray-500">
                                      {new Date(item.rentalStartDate).toLocaleDateString('vi-VN')} - {new Date(item.rentalEndDate).toLocaleDateString('vi-VN')}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm font-semibold text-gray-900">
                                      {item.pricePerDay.toLocaleString('vi-VN')}đ/ngày
                                    </p>
                                  </div>
                                </div>
                              ))}
                              {order.orderDetails.length > 2 && (
                                <p className="text-xs text-gray-500 pl-20">
                                  +{order.orderDetails.length - 2} thiết bị khác
                                </p>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 justify-end pt-4 border-t border-gray-200">
                              <button 
                                onClick={() => { globalThis.location.href = `/profile/order/${order.orderId}`; }}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition"
                              >
                                Xem chi tiết
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
              {activeTab === 'payment' && (
                <div className="h-[600px] overflow-y-auto">
                  {isLoadingInvoices && (
                    <div className="flex items-center justify-center h-64">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                  )}
                  
                  {!isLoadingInvoices && invoicesError && (
                    <div className="text-center text-red-500 mt-8">{invoicesError}</div>
                  )}
                  
                  {!isLoadingInvoices && !invoicesError && invoices.length === 0 && (
                    <div className="text-center text-gray-500 mt-8">
                      <p className="text-lg mb-4">Bạn chưa có hóa đơn nào</p>
                    </div>
                  )}
                  
                  {!isLoadingInvoices && !invoicesError && invoices.length > 0 && (
                    <div className="space-y-3">
                      {invoices.map((invoice) => {
                        const statusBadge = getPaymentStatusBadge(invoice.paymentStatus);
                        const methodLabel = getPaymentMethodLabel(invoice.paymentMethod);
                        
                        return (
                          <div key={invoice.invoiceId} className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <span className="text-sm font-semibold text-gray-900">
                                    Hóa đơn #{invoice.invoiceId}
                                  </span>
                                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge.class}`}>
                                    {statusBadge.label}
                                  </span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                                  <div>
                                    <span className="font-medium">Ngày tạo:</span>{' '}
                                    {new Date(invoice.invoiceDate).toLocaleDateString('vi-VN', {
                                      day: '2-digit',
                                      month: '2-digit',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </div>
                                  <div>
                                    <span className="font-medium">Hạn thanh toán:</span>{' '}
                                    {new Date(invoice.dueDate).toLocaleDateString('vi-VN', {
                                      day: '2-digit',
                                      month: '2-digit',
                                      year: 'numeric'
                                    })}
                                  </div>
                                  <div className="col-span-2">
                                    <span className="font-medium">Phương thức:</span> {methodLabel}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right ml-4">
                                <p className="text-xs text-gray-600 mb-1">Số tiền</p>
                                <p className="text-xl font-bold text-blue-600">
                                  {invoice.amount.toLocaleString('vi-VN')}đ
                                </p>
                                {invoice.paymentStatus === 'Unpaid' && (
                                  <button className="mt-2 px-4 py-1.5 bg-blue-600 text-white rounded-md text-xs font-medium hover:bg-blue-700 transition">
                                    Thanh toán
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
              {activeTab === 'notifications' && (
                <div className="p-4 max-w-2xl mx-auto">
                  <div className="mb-6">
                    <div className="font-bold text-xl text-gray-900 mb-2">Kênh thông báo</div>
                    <div className="text-gray-700 mb-4">Chọn cách bạn muốn nhận thông báo từ chúng tôi.</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <label className="flex flex-col items-start p-4 border rounded-lg cursor-pointer bg-gray-50">
                        <input type="checkbox" className="mb-2" defaultChecked />
                        <span className="font-medium text-gray-800">E-mail</span>
                        <span className="text-sm text-gray-600">Nhận thông báo trực tiếp đến địa chỉ email của bạn.</span>
                      </label>
                      <label className="flex flex-col items-start p-4 border rounded-lg cursor-pointer bg-gray-50">
                        <input type="checkbox" className="mb-2" />
                        <span className="font-medium text-gray-800">SMS</span>
                        <span className="text-sm text-gray-600">Nhận thông báo tin nhắn văn bản để cập nhật quan trọng.</span>
                      </label>
                      <label className="flex flex-col items-start p-4 border rounded-lg cursor-pointer bg-gray-50">
                        <input type="checkbox" className="mb-2" defaultChecked />
                        <span className="font-medium text-gray-800">Trong ứng dụng</span>
                        <span className="text-sm text-gray-600">Nhận thông báo trong ứng dụng.</span>
                      </label>
                    </div>
                  </div>
                  <div className="mb-6">
                    <div className="font-bold text-xl text-gray-900 mb-2">Loại thông báo</div>
                    <div className="text-gray-700 mb-4">Chọn loại thông báo bạn muốn nhận.</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <label className="flex flex-col items-start p-4 border rounded-lg cursor-pointer bg-gray-50">
                        <input type="checkbox" className="mb-2" defaultChecked />
                        <span className="font-medium text-gray-800">Cập nhật đặt hàng</span>
                        <span className="text-sm text-gray-600">Nhận thông báo về thay đổi trạng thái cho thuê của bạn</span>
                      </label>
                      <label className="flex flex-col items-start p-4 border rounded-lg cursor-pointer bg-gray-50">
                        <input type="checkbox" className="mb-2" />
                        <span className="font-medium text-gray-800">Cập nhật AI Advisor</span>
                        <span className="text-sm text-gray-600">Nhận các đề xuất và mẹo được cá nhân hóa</span>
                      </label>
                      <label className="flex flex-col items-start p-4 border rounded-lg cursor-pointer bg-gray-50">
                        <input type="checkbox" className="mb-2" defaultChecked />
                        <span className="font-medium text-gray-800">Chương trình khuyến mãi & Giảm giá</span>
                        <span className="text-sm text-gray-600">Luôn cập nhật về các ưu đãi và giao dịch đặc biệt</span>
                      </label>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button className="px-6 py-2 bg-zinc-900 text-white rounded">Lưu tùy chọn</button>
                  </div>
                </div>
              )}
              {activeTab === 'security' && (
                <div className="flex flex-col items-center justify-center h-full text-gray-700 text-lg">Nội dung bảo vệ (đổi mật khẩu, xác thực 2 bước...)</div>
              )}
              {activeTab === 'profile' && (
                <div className="flex justify-end gap-4 mt-auto">
                  <button className="px-4 py-2 rounded-md border border-gray-200 text-black text-sm">Hủy bỏ</button>
                  <button className="px-6 py-2 rounded-md bg-zinc-900 text-white text-sm">Lưu các thay đổi</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainTemplate>
  );
};

export default ProfilePage;

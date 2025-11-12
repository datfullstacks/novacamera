import { showToast } from "@/components/atoms/ui/Toast";
import { OrdersTab } from "@/components/organisms/profile/OrdersTab";
import MainTemplate from "@/components/templates/MainTemplate";
import { authService } from "@/lib/api/services/auth.service";
import { rentalService } from "@/lib/api/services/rental.service";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateUser } from "@/store/slices/authSlice";
import type { Invoice, UserResponse } from "@/types/api/auth";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";

const ProfilePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = useAppSelector((state: any) => state.auth.user);

  const [activeTab, setActiveTab] = useState("profile");
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Invoices state
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoadingInvoices, setIsLoadingInvoices] = useState(false);
  const [invoicesError, setInvoicesError] = useState<string | null>(null);

  // Profile state
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [profileData, setProfileData] = useState<UserResponse | null>(null);

  // Edit mode state
  const [isEditMode, setIsEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState({
    fullName: "",
    phoneNumber: "",
    address: "",
  });
  const [formErrors, setFormErrors] = useState({
    fullName: "",
    phoneNumber: "",
    address: "",
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Update URL when tab changes
  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
    router.push(`/profile?tab=${tab}`, { scroll: false });
  }, [router]);

  // Read tab from URL query parameter on mount
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['profile', 'rental', 'invoice', 'security', 'notifications'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Listen for tab change event from header
  useEffect(() => {
    const handleSetTab = (event: CustomEvent<string>) => {
      handleTabChange(event.detail);
    };

    window.addEventListener("setProfileTab", handleSetTab as EventListener);
    return () => {
      window.removeEventListener(
        "setProfileTab",
        handleSetTab as EventListener
      );
    };
  }, [handleTabChange]);

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
            dispatch(
              updateUser({
                ...user,
                fullName: response.data.fullName || user.fullName,
                email: response.data.email || user.email,
                avatar: response.data.avatarUrl || user.avatar,
              })
            );
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    if (activeTab === "profile" && !profileData) {
      fetchUserProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // Avatar upload handlers
  const handleAvatarButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      showToast({
        type: "error",
        title: "Lỗi",
        message: "Vui lòng chọn file ảnh",
        duration: 3000,
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast({
        type: "error",
        title: "Lỗi",
        message: "Kích thước ảnh không được vượt quá 5MB",
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
          dispatch(
            updateUser({
              ...user,
              avatar: response.data.avatarUrl,
            })
          );
        }

        showToast({
          type: "success",
          title: "Thành công",
          message: "Cập nhật ảnh đại diện thành công",
          duration: 3000,
        });
        setPreviewAvatar(null); // Clear preview after successful upload
      }
    } catch (error) {
      console.error("Avatar upload error:", error);
      const errorMessage =
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response &&
        error.response.data &&
        typeof error.response.data === "object" &&
        "message" in error.response.data
          ? String(error.response.data.message)
          : "Không thể tải lên ảnh đại diện";
      showToast({
        type: "error",
        title: "Lỗi",
        message: errorMessage,
        duration: 3000,
      });
      setPreviewAvatar(null); // Clear preview on error
    } finally {
      setIsUploadingAvatar(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Get current avatar URL
  const currentAvatarUrl =
    previewAvatar ||
    profileData?.avatarUrl ||
    user?.avatar ||
    "https://placehold.co/102x98";

  // Validation functions
  const validateFullName = (name: string): string => {
    if (!name.trim()) {
      return "Họ và tên không được để trống";
    }
    if (name.trim().length < 2) {
      return "Họ và tên phải có ít nhất 2 ký tự";
    }
    if (name.trim().length > 100) {
      return "Họ và tên không được vượt quá 100 ký tự";
    }
    // Allow Vietnamese characters, spaces, and common name characters
    const nameRegex = /^[a-zA-ZÀ-ỹ\s]+$/;
    if (!nameRegex.test(name.trim())) {
      return "Họ và tên chỉ được chứa chữ cái và khoảng trắng";
    }
    return "";
  };

  const validatePhoneNumber = (phone: string): string => {
    if (!phone.trim()) {
      return "Số điện thoại không được để trống";
    }
    // Vietnamese phone number: 10-11 digits, starts with 0
    const phoneRegex = /^0\d{9,10}$/;
    if (!phoneRegex.test(phone.trim())) {
      return "Số điện thoại không hợp lệ (phải có 10-11 số và bắt đầu bằng 0)";
    }
    return "";
  };

  const validateAddress = (address: string): string => {
    if (!address.trim()) {
      return "Địa chỉ không được để trống";
    }
    if (address.trim().length < 5) {
      return "Địa chỉ phải có ít nhất 5 ký tự";
    }
    if (address.trim().length > 200) {
      return "Địa chỉ không được vượt quá 200 ký tự";
    }
    return "";
  };

  // Handle edit mode toggle
  const handleEditToggle = () => {
    if (isEditMode) {
      // Cancel edit - reset form
      setIsEditMode(false);
      setFormErrors({ fullName: "", phoneNumber: "", address: "" });
    } else {
      // Enter edit mode - populate form with current data
      setEditFormData({
        fullName: profileData?.fullName || user?.fullName || "",
        phoneNumber: profileData?.phoneNumber || "",
        address: profileData?.address || "",
      });
      setIsEditMode(true);
    }
  };

  // Handle form input change with validation
  const handleInputChange = (
    field: "fullName" | "phoneNumber" | "address",
    value: string
  ) => {
    setEditFormData((prev) => ({ ...prev, [field]: value }));

    // Validate on change
    let error = "";
    switch (field) {
      case "fullName":
        error = validateFullName(value);
        break;
      case "phoneNumber":
        error = validatePhoneNumber(value);
        break;
      case "address":
        error = validateAddress(value);
        break;
    }
    setFormErrors((prev) => ({ ...prev, [field]: error }));
  };

  // Handle save profile
  const handleSaveProfile = async () => {
    // Validate all fields
    const errors = {
      fullName: validateFullName(editFormData.fullName),
      phoneNumber: validatePhoneNumber(editFormData.phoneNumber),
      address: validateAddress(editFormData.address),
    };

    setFormErrors(errors);

    // Check if there are any errors
    if (Object.values(errors).some((error) => error !== "")) {
      showToast({
        type: "error",
        title: "Lỗi xác thực",
        message: "Vui lòng kiểm tra lại thông tin đã nhập",
        duration: 3000,
      });
      return;
    }

    setIsSavingProfile(true);
    try {
      // Call API to update user profile
      const response = await authService.updateProfile({
        fullName: editFormData.fullName.trim(),
        phoneNumber: editFormData.phoneNumber.trim(),
        address: editFormData.address.trim(),
      });

      if (response.data) {
        setProfileData(response.data);

        // Update Redux store
        if (user) {
          dispatch(
            updateUser({
              ...user,
              fullName: response.data.fullName || user.fullName,
            })
          );
        }

        showToast({
          type: "success",
          title: "Cập nhật thành công",
          message: "Thông tin cá nhân đã được cập nhật",
          duration: 3000,
        });

        setIsEditMode(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      showToast({
        type: "error",
        title: "Lỗi",
        message: "Không thể cập nhật thông tin. Vui lòng thử lại.",
        duration: 3000,
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Helper function for payment status
  const getPaymentStatusBadge = (status: string) => {
    const badges = {
      Paid: { class: "bg-green-100 text-green-700", label: "Đã thanh toán" },
      Unpaid: {
        class: "bg-yellow-100 text-yellow-700",
        label: "Chưa thanh toán",
      },
      Overdue: { class: "bg-red-100 text-red-700", label: "Quá hạn" },
      Cancelled: { class: "bg-gray-100 text-gray-700", label: "Đã hủy" },
    };
    return badges[status as keyof typeof badges] || badges.Unpaid;
  };

  // Helper function for payment method
  const getPaymentMethodLabel = (method: string) => {
    const methods: Record<string, string> = {
      BankTransfer: "Chuyển khoản",
      Cash: "Tiền mặt",
      CreditCard: "Thẻ tín dụng",
      DebitCard: "Thẻ ghi nợ",
    };
    return methods[method] || method;
  };

  // Fetch user invoices when payment tab is active
  useEffect(() => {
    const fetchUserInvoices = async () => {
      setIsLoadingInvoices(true);
      setInvoicesError(null);

      try {
        const response = await authService.getUserInvoices();

        if (
          response.data &&
          typeof response.data === "object" &&
          "invoices" in response.data
        ) {
          const data = response.data as { invoices: Invoice[] };
          setInvoices(data.invoices);
        }
      } catch (error) {
        console.error("Error fetching user invoices:", error);
        setInvoicesError("Không thể tải danh sách hóa đơn");
        showToast({
          type: "error",
          title: "Lỗi",
          message: "Không thể tải danh sách hóa đơn",
          duration: 3000,
        });
      } finally {
        setIsLoadingInvoices(false);
      }
    };

    if (activeTab === "invoice" && user?.userId) {
      fetchUserInvoices();
    }
  }, [activeTab, user?.userId]);

  // Danh sách sản phẩm cho thuê mẫu

  // ...có thể thêm nhiều sản phẩm mẫu

  return (
    <MainTemplate>
      <div className="flex justify-center items-start">
        <div className="w-full max-w-[1196px] flex gap-6">
          {/* Sidebar */}
          <div className="w-72 bg-white shadow-[0px_1px_3px_0px_rgba(0,0,0,0.10)] rounded-xl flex flex-col justify-between py-8 h-fit sticky top-24">
            <div>
              <div className="flex flex-col items-center mb-8">
                <div
                  className="w-20 h-20 rounded-full outline-zinc-100 overflow-hidden mb-2"
                  style={{
                    outline: "3px solid #f4f4f5",
                    outlineOffset: "-3px",
                  }}
                >
                  <Image
                    src={currentAvatarUrl}
                    alt="Avatar"
                    width={80}
                    height={80}
                    className="w-20 h-20 object-cover"
                  />
                </div>
                <div className="font-bold text-lg text-gray-800">
                  {user?.fullName || "John Doe"}
                </div>
                <div className="text-sm text-gray-500">
                  {user?.email || "John.doe@example.com"}
                </div>
              </div>
              <nav className="flex flex-col gap-2 px-6">
                <button
                  onClick={() => handleTabChange("profile")}
                  className={`py-2 px-4 rounded-lg font-medium border-l-4 ${
                    activeTab === "profile"
                      ? "bg-blue-50 text-blue-500 border-blue-500"
                      : "text-gray-600 border-transparent"
                  }`}
                >
                  Hồ sơ của tôi
                </button>
                <button
                  onClick={() => handleTabChange("rental")}
                  className={`py-2 px-4 rounded-lg text-gray-600 border-l-4 ${
                    activeTab === "rental"
                      ? "bg-blue-50 text-blue-500 border-blue-500"
                      : "border-transparent"
                  }`}
                >
                  Đơn hàng
                </button>
                <button
                  onClick={() => handleTabChange("invoice")}
                  className={`py-2 px-4 rounded-lg text-gray-600 border-l-4 ${
                    activeTab === "invoice"
                      ? "bg-blue-50 text-blue-500 border-blue-500"
                      : "border-transparent"
                  }`}
                >
                  Hóa đơn
                </button>
                <button
                  onClick={() => handleTabChange("notifications")}
                  className={`py-2 px-4 rounded-lg text-gray-600 border-l-4 ${
                    activeTab === "notifications"
                      ? "bg-blue-50 text-blue-500 border-blue-500"
                      : "border-transparent"
                  }`}
                >
                  Thông báo
                </button>
                <button
                  onClick={() => handleTabChange("security")}
                  className={`py-2 px-4 rounded-lg text-gray-600 border-l-4 ${
                    activeTab === "security"
                      ? "bg-blue-50 text-blue-500 border-blue-500"
                      : "border-transparent"
                  }`}
                >
                  Bảo vệ
                </button>
              </nav>
            </div>
            <div className="px-6 pb-8">
              <button className="w-full py-2 rounded-lg bg-red-100 text-red-700 font-medium">
                Đăng xuất
              </button>
            </div>
          </div>

          {/* Main Card */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-[0px_1px_3px_0px_rgba(0,0,0,0.10)] p-6">
              <div className="border-b border-gray-200 pb-4 mb-6">
                <h2 className="text-2xl font-normal text-gray-800 font-['ABeeZee'] leading-loose">
                  {activeTab === "profile" && "Hồ sơ của tôi"}
                  {activeTab === "rental" && "Đơn hàng"}
                  {activeTab === "invoice" && "Hóa đơn"}
                  {activeTab === "notifications" && "Thông báo"}
                  {activeTab === "security" && "Bảo vệ"}
                </h2>
              </div>
              {/* Tab Content */}

              {activeTab === "profile" && (
                <div>
                  {isLoadingProfile ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                  ) : (
                    <>
                      {/* Edit/Save Buttons */}
                      <div className="flex justify-end mb-4">
                        {!isEditMode ? (
                          <button
                            onClick={handleEditToggle}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                          >
                            Chỉnh sửa thông tin
                          </button>
                        ) : (
                          <div className="flex gap-3">
                            <button
                              onClick={handleEditToggle}
                              disabled={isSavingProfile}
                              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors disabled:opacity-50"
                            >
                              Hủy
                            </button>
                            <button
                              onClick={handleSaveProfile}
                              disabled={isSavingProfile}
                              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                              {isSavingProfile && (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              )}
                              {isSavingProfile ? "Đang lưu..." : "Lưu thay đổi"}
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-8 mb-8">
                        <div className="flex flex-col items-center">
                          <div
                            className="w-24 h-24 rounded-full outline-zinc-100 overflow-hidden mb-2 relative"
                            style={{
                              outline: "3px solid #f4f4f5",
                              outlineOffset: "-3px",
                            }}
                          >
                            <Image
                              src={currentAvatarUrl}
                              alt="Avatar"
                              width={96}
                              height={96}
                              className="w-24 h-24 object-cover"
                            />
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
                            {isUploadingAvatar
                              ? "Đang tải lên..."
                              : "Tải lên ảnh mới"}
                          </button>
                        </div>
                        <div className="flex-1 grid grid-cols-2 gap-x-8 gap-y-6">
                          {/* Họ và tên - Editable */}
                          <div className="col-span-2">
                            <div className="block text-sm text-gray-800 mb-1 font-['ABeeZee']">
                              Họ và tên <span className="text-red-500">*</span>
                            </div>
                            {isEditMode ? (
                              <div>
                                <input
                                  type="text"
                                  value={editFormData.fullName}
                                  onChange={(e) =>
                                    handleInputChange(
                                      "fullName",
                                      e.target.value
                                    )
                                  }
                                  className={`w-full bg-white rounded-md border px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 ${
                                    formErrors.fullName
                                      ? "border-red-500 focus:ring-red-500"
                                      : "border-gray-300 focus:ring-blue-500"
                                  }`}
                                  placeholder="Nhập họ và tên"
                                />
                                {formErrors.fullName && (
                                  <p className="text-xs text-red-500 mt-1">
                                    {formErrors.fullName}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <div className="bg-white rounded-md border border-gray-200 px-3 py-2 text-xs text-black">
                                {profileData?.fullName ||
                                  user?.fullName ||
                                  "N/A"}
                              </div>
                            )}
                          </div>

                          {/* Email - Read only */}
                          <div className="col-span-2">
                            <div className="block text-sm text-gray-800 mb-1 font-['ABeeZee']">
                              Địa chỉ email
                            </div>
                            <div className="bg-gray-100 rounded-md border border-gray-200 px-3 py-2 text-xs text-gray-600">
                              {profileData?.email || user?.email || "N/A"}
                            </div>
                          </div>

                          {/* Số điện thoại - Editable */}
                          <div>
                            <div className="block text-sm text-gray-800 mb-1 font-['ABeeZee']">
                              Số điện thoại{" "}
                              <span className="text-red-500">*</span>
                            </div>
                            {isEditMode ? (
                              <div>
                                <input
                                  type="tel"
                                  value={editFormData.phoneNumber}
                                  onChange={(e) =>
                                    handleInputChange(
                                      "phoneNumber",
                                      e.target.value
                                    )
                                  }
                                  className={`w-full bg-white rounded-md border px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 ${
                                    formErrors.phoneNumber
                                      ? "border-red-500 focus:ring-red-500"
                                      : "border-gray-300 focus:ring-blue-500"
                                  }`}
                                  placeholder="0xxxxxxxxx"
                                />
                                {formErrors.phoneNumber && (
                                  <p className="text-xs text-red-500 mt-1">
                                    {formErrors.phoneNumber}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <div className="bg-white rounded-md border border-gray-200 px-3 py-2 text-xs text-black">
                                {profileData?.phoneNumber || "N/A"}
                              </div>
                            )}
                          </div>

                          {/* Vai trò - Read only */}
                          <div>
                            <div className="block text-sm text-gray-800 mb-1 font-['ABeeZee']">
                              Vai trò
                            </div>
                            <div className="bg-gray-100 rounded-md border border-gray-200 px-3 py-2 text-xs text-gray-600">
                              {profileData?.roleName || user?.roleName || "N/A"}
                            </div>
                          </div>

                          {/* Địa chỉ - Editable */}
                          <div className="col-span-2">
                            <div className="block text-sm text-gray-800 mb-1 font-['ABeeZee']">
                              Địa chỉ <span className="text-red-500">*</span>
                            </div>
                            {isEditMode ? (
                              <div>
                                <textarea
                                  value={editFormData.address}
                                  onChange={(e) =>
                                    handleInputChange("address", e.target.value)
                                  }
                                  rows={2}
                                  className={`w-full bg-white rounded-md border px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 resize-none ${
                                    formErrors.address
                                      ? "border-red-500 focus:ring-red-500"
                                      : "border-gray-300 focus:ring-blue-500"
                                  }`}
                                  placeholder="Nhập địa chỉ đầy đủ"
                                />
                                {formErrors.address && (
                                  <p className="text-xs text-red-500 mt-1">
                                    {formErrors.address}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <div className="bg-white rounded-md border border-gray-200 px-3 py-2 text-xs text-black">
                                {profileData?.address || "Chưa cập nhật"}
                              </div>
                            )}
                          </div>

                          {/* Trạng thái - Read only */}
                          <div>
                            <div className="block text-sm text-gray-800 mb-1 font-['ABeeZee']">
                              Trạng thái
                            </div>
                            <div className="bg-gray-100 rounded-md border border-gray-200 px-3 py-2 text-xs text-black">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                  profileData?.status === "Active"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {profileData?.status === "Active"
                                  ? "Đang hoạt động"
                                  : profileData?.status || "N/A"}
                              </span>
                            </div>
                          </div>

                          {/* Điểm tích lũy - Read only */}
                          <div>
                            <div className="block text-sm text-gray-800 mb-1 font-['ABeeZee']">
                              Điểm tích lũy
                            </div>
                            <div className="bg-gray-100 rounded-md border border-gray-200 px-3 py-2 text-xs text-gray-600">
                              {profileData?.loyaltyPoints?.toLocaleString(
                                "vi-VN"
                              ) || "0"}{" "}
                              điểm
                            </div>
                          </div>

                          {/* Tổng giao dịch - Read only */}
                          <div>
                            <div className="block text-sm text-gray-800 mb-1 font-['ABeeZee']">
                              Tổng giao dịch
                            </div>
                            <div className="bg-gray-100 rounded-md border border-gray-200 px-3 py-2 text-xs text-gray-600">
                              {profileData?.totaltransactions || "0"}
                            </div>
                          </div>

                          {/* Ngày tạo - Read only */}
                          <div className="col-span-2">
                            <div className="block text-sm text-gray-800 mb-1 font-['ABeeZee']">
                              Ngày tạo tài khoản
                            </div>
                            <div className="bg-gray-100 rounded-md border border-gray-200 px-3 py-2 text-xs text-gray-600">
                              {profileData?.createdAt
                                ? new Date(
                                    profileData.createdAt
                                  ).toLocaleDateString("vi-VN", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                : "N/A"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
              {activeTab === "rental" && user?.userId && (
                <OrdersTab userId={user.userId} />
              )}
              {activeTab === "invoice" && (
                <div>
                  {isLoadingInvoices && (
                    <div className="flex items-center justify-center h-64">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                  )}

                  {!isLoadingInvoices && invoicesError && (
                    <div className="text-center text-red-500 mt-8">
                      {invoicesError}
                    </div>
                  )}

                  {!isLoadingInvoices &&
                    !invoicesError &&
                    invoices.length === 0 && (
                      <div className="text-center text-gray-500 mt-8">
                        <p className="text-lg mb-4">Bạn chưa có hóa đơn nào</p>
                      </div>
                    )}

                  {!isLoadingInvoices &&
                    !invoicesError &&
                    invoices.length > 0 && (
                      <div className="space-y-3">
                        {invoices.map((invoice) => {
                          const statusBadge = getPaymentStatusBadge(
                            invoice.paymentStatus
                          );
                          const methodLabel = getPaymentMethodLabel(
                            invoice.paymentMethod
                          );

                          return (
                            <div
                              key={invoice.invoiceId}
                              className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <span className="text-sm font-semibold text-gray-900">
                                      Hóa đơn #{invoice.invoiceId}
                                    </span>
                                    <span
                                      className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge.class}`}
                                    >
                                      {statusBadge.label}
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                                    <div>
                                      <span className="font-medium">
                                        Ngày tạo:
                                      </span>{" "}
                                      {new Date(
                                        invoice.invoiceDate
                                      ).toLocaleDateString("vi-VN", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </div>
                                    <div>
                                      <span className="font-medium">
                                        Hạn thanh toán:
                                      </span>{" "}
                                      {new Date(
                                        invoice.dueDate
                                      ).toLocaleDateString("vi-VN", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                      })}
                                    </div>
                                    <div className="col-span-2">
                                      <span className="font-medium">
                                        Phương thức:
                                      </span>{" "}
                                      {methodLabel}
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right ml-4">
                                  <p className="text-xs text-gray-600 mb-1">
                                    Số tiền
                                  </p>
                                  <p className="text-xl font-bold text-blue-600">
                                    {invoice.amount.toLocaleString("vi-VN")}đ
                                  </p>
                                  {invoice.paymentStatus === "Unpaid" && (
                                    <div className="mt-2 space-y-2">
                                      <button
                                        onClick={() => {
                                          // Navigate to payment page for this invoice/order
                                          router.push(
                                            `/checkout?invoiceId=${invoice.invoiceId}`
                                          );
                                        }}
                                        className="w-full px-4 py-1.5 bg-blue-600 text-white rounded-md text-xs font-medium hover:bg-blue-700 transition"
                                      >
                                        Thanh toán
                                      </button>
                                      <button
                                        onClick={async () => {
                                          if (
                                            window.confirm(
                                              "Bạn có chắc chắn muốn hủy hóa đơn này?"
                                            )
                                          ) {
                                            try {
                                              // Assuming invoice has orderId
                                              const orderId =
                                                invoice.orderId ||
                                                invoice.invoiceId;
                                              await rentalService.cancelPayment(
                                                orderId,
                                                {
                                                  reason:
                                                    "Khách hàng tự hủy hóa đơn",
                                                }
                                              );

                                              showToast({
                                                type: "success",
                                                title: "Đã hủy hóa đơn",
                                                message:
                                                  "Hóa đơn đã được hủy thành công.",
                                                duration: 3000,
                                              });

                                              // Refresh invoices list
                                              const response =
                                                await authService.getUserInvoices();
                                              if (
                                                response.data &&
                                                typeof response.data ===
                                                  "object" &&
                                                "invoices" in response.data
                                              ) {
                                                const data = response.data as {
                                                  invoices: Invoice[];
                                                };
                                                setInvoices(data.invoices);
                                              }
                                            } catch (error) {
                                              console.error(
                                                "Error cancelling invoice:",
                                                error
                                              );
                                              showToast({
                                                type: "error",
                                                title: "Lỗi",
                                                message:
                                                  "Không thể hủy hóa đơn. Vui lòng thử lại.",
                                                duration: 3000,
                                              });
                                            }
                                          }
                                        }}
                                        className="w-full px-4 py-1.5 bg-white border border-red-500 text-red-600 rounded-md text-xs font-medium hover:bg-red-50 transition"
                                      >
                                        Hủy hóa đơn
                                      </button>
                                    </div>
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
              {activeTab === "notifications" && (
                <div className="p-4 max-w-2xl mx-auto">
                  <div className="mb-6">
                    <div className="font-bold text-xl text-gray-900 mb-2">
                      Kênh thông báo
                    </div>
                    <div className="text-gray-700 mb-4">
                      Chọn cách bạn muốn nhận thông báo từ chúng tôi.
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <label className="flex flex-col items-start p-4 border rounded-lg cursor-pointer bg-gray-50">
                        <input
                          type="checkbox"
                          className="mb-2"
                          defaultChecked
                        />
                        <span className="font-medium text-gray-800">
                          E-mail
                        </span>
                        <span className="text-sm text-gray-600">
                          Nhận thông báo trực tiếp đến địa chỉ email của bạn.
                        </span>
                      </label>
                      <label className="flex flex-col items-start p-4 border rounded-lg cursor-pointer bg-gray-50">
                        <input type="checkbox" className="mb-2" />
                        <span className="font-medium text-gray-800">SMS</span>
                        <span className="text-sm text-gray-600">
                          Nhận thông báo tin nhắn văn bản để cập nhật quan
                          trọng.
                        </span>
                      </label>
                      <label className="flex flex-col items-start p-4 border rounded-lg cursor-pointer bg-gray-50">
                        <input
                          type="checkbox"
                          className="mb-2"
                          defaultChecked
                        />
                        <span className="font-medium text-gray-800">
                          Trong ứng dụng
                        </span>
                        <span className="text-sm text-gray-600">
                          Nhận thông báo trong ứng dụng.
                        </span>
                      </label>
                    </div>
                  </div>
                  <div className="mb-6">
                    <div className="font-bold text-xl text-gray-900 mb-2">
                      Loại thông báo
                    </div>
                    <div className="text-gray-700 mb-4">
                      Chọn loại thông báo bạn muốn nhận.
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <label className="flex flex-col items-start p-4 border rounded-lg cursor-pointer bg-gray-50">
                        <input
                          type="checkbox"
                          className="mb-2"
                          defaultChecked
                        />
                        <span className="font-medium text-gray-800">
                          Cập nhật đặt hàng
                        </span>
                        <span className="text-sm text-gray-600">
                          Nhận thông báo về thay đổi trạng thái cho thuê của bạn
                        </span>
                      </label>
                      <label className="flex flex-col items-start p-4 border rounded-lg cursor-pointer bg-gray-50">
                        <input type="checkbox" className="mb-2" />
                        <span className="font-medium text-gray-800">
                          Cập nhật AI Advisor
                        </span>
                        <span className="text-sm text-gray-600">
                          Nhận các đề xuất và mẹo được cá nhân hóa
                        </span>
                      </label>
                      <label className="flex flex-col items-start p-4 border rounded-lg cursor-pointer bg-gray-50">
                        <input
                          type="checkbox"
                          className="mb-2"
                          defaultChecked
                        />
                        <span className="font-medium text-gray-800">
                          Chương trình khuyến mãi & Giảm giá
                        </span>
                        <span className="text-sm text-gray-600">
                          Luôn cập nhật về các ưu đãi và giao dịch đặc biệt
                        </span>
                      </label>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button className="px-6 py-2 bg-zinc-900 text-white rounded">
                      Lưu tùy chọn
                    </button>
                  </div>
                </div>
              )}
              {activeTab === "security" && (
                <div className="flex flex-col items-center justify-center h-full text-gray-700 text-lg">
                  Nội dung bảo vệ (đổi mật khẩu, xác thực 2 bước...)
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

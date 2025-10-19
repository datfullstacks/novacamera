import React, { useState, useEffect } from "react";
import MainTemplate from "@/components/templates/MainTemplate";
import Image from "next/image";
import { authService } from "@/lib/api/services/auth.service";
import { rentalService } from "@/lib/api/services/rental.service";

interface UserProfile {
  userId: number;
  fullName: string | null;
  email: string | null;
  phoneNumber: string | null;
  avatar: string | null;
  address: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  isEmailConfirmed: boolean;
}

interface RentalOrder {
  orderId: number;
  equipmentName: string | null;
  equipmentImageUrl: string | null;
  startDate: string | null;
  endDate: string | null;
  status: string | null;
  totalAmount: number;
}

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [searchTerm, setSearchTerm] = useState("");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [rentalOrders, setRentalOrders] = useState<RentalOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await authService.getCurrentUser();

        console.log("✅ User Profile Response:", response);

        if (response.statusCode === 200 && response.data) {
          // Map API response to local UserProfile interface
          const mappedProfile: UserProfile = {
            userId: response.data.userId,
            fullName: response.data.fullName,
            email: response.data.email,
            phoneNumber: response.data.phoneNumber,
            avatar: response.data.avatarUrl || null,
            address: response.data.address,
            dateOfBirth: null, // API doesn't provide this yet
            gender: null, // API doesn't provide this yet
            isEmailConfirmed: response.data.isEmailVerified || false,
          };
          setUserProfile(mappedProfile);
        } else {
          setError(response.message || "Failed to load profile");
        }
      } catch (err) {
        console.error("❌ Error fetching profile:", err);
        setError("Không thể tải thông tin người dùng");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Fetch rental orders when on rental tab
  useEffect(() => {
    const fetchRentalOrders = async () => {
      if (activeTab === "rental" && userProfile?.userId) {
        try {
          const response = await rentalService.getUserRentalOrders(
            userProfile.userId,
            {
              pageNumber: 1,
              pageSize: 10,
            }
          );

          console.log("✅ Rental Orders Response:", response);

          if (response.statusCode === 200 && response.data?.items) {
            const mappedOrders: RentalOrder[] = response.data.items.map(
              (order: any) => ({
                orderId: order.orderId,
                equipmentName: order.equipmentName,
                equipmentImageUrl: order.equipmentImageUrl,
                startDate: order.startDate,
                endDate: order.endDate,
                status: order.status,
                totalAmount: order.totalAmount || 0,
              })
            );
            setRentalOrders(mappedOrders);
          }
        } catch (err) {
          console.error("❌ Error fetching rental orders:", err);
        }
      }
    };

    fetchRentalOrders();
  }, [activeTab, userProfile]);

  // Lọc rental orders theo searchTerm
  const filteredOrders = rentalOrders.filter((order) =>
    order.equipmentName?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  // Hiển thị tối đa 10 orders
  const ordersToShow = filteredOrders.slice(0, 10);

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Get status color
  const getStatusColor = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case "active":
      case "ongoing":
        return "yellow";
      case "completed":
      case "returned":
        return "green";
      case "cancelled":
        return "red";
      default:
        return "gray";
    }
  };

  if (loading) {
    return (
      <MainTemplate>
        <div className="flex justify-center items-center min-h-[70vh]">
          <div className="animate-pulse text-xl text-gray-600">Đang tải...</div>
        </div>
      </MainTemplate>
    );
  }

  if (error) {
    return (
      <MainTemplate>
        <div className="flex justify-center items-center min-h-[70vh]">
          <div className="text-center">
            <p className="text-red-600 text-xl mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Thử lại
            </button>
          </div>
        </div>
      </MainTemplate>
    );
  }

  return (
    <MainTemplate>
      <div className="-mx-4 -my-8 -mt-[72px] pt-[72px] min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar */}
            <div className="lg:w-80 w-full bg-white rounded-2xl shadow-lg border border-gray-100 flex flex-col py-6 lg:sticky lg:top-[88px] lg:self-start lg:max-h-[calc(100vh-7rem)]">
              <div>
                <div className="flex flex-col items-center mb-8 px-6">
                  <div className="relative group mb-3">
                    <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-blue-100 ring-offset-2 transition-all duration-300 group-hover:ring-blue-200">
                      <Image
                        src={
                          userProfile?.avatar || "https://placehold.co/102x98"
                        }
                        alt="Avatar"
                        width={96}
                        height={96}
                        className="w-24 h-24 object-cover"
                      />
                    </div>
                    <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>
                  </div>
                  <div className="font-bold text-xl text-gray-900 text-center">
                    {userProfile?.fullName || "User"}
                  </div>
                  <div className="text-sm text-gray-500 text-center">
                    {userProfile?.email || "No email"}
                  </div>
                  {userProfile?.isEmailConfirmed && (
                    <div className="mt-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1">
                      <svg
                        className="w-3 h-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Đã xác thực
                    </div>
                  )}
                </div>
                <nav className="flex flex-col gap-1 px-4">
                  <button
                    onClick={() => setActiveTab("profile")}
                    className={`group py-3 px-4 rounded-xl font-medium border-l-4 transition-all duration-200 flex items-center gap-3 ${
                      activeTab === "profile"
                        ? "bg-gradient-to-r from-blue-50 to-blue-100/50 text-blue-600 border-blue-500 shadow-sm"
                        : "text-gray-600 border-transparent hover:bg-gray-50 hover:border-gray-200"
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span>Hồ sơ của tôi</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("rental")}
                    className={`group py-3 px-4 rounded-xl font-medium border-l-4 transition-all duration-200 flex items-center gap-3 ${
                      activeTab === "rental"
                        ? "bg-gradient-to-r from-blue-50 to-blue-100/50 text-blue-600 border-blue-500 shadow-sm"
                        : "text-gray-600 border-transparent hover:bg-gray-50 hover:border-gray-200"
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <span>Đơn thuê của tôi</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("payment")}
                    className={`group py-3 px-4 rounded-xl font-medium border-l-4 transition-all duration-200 flex items-center gap-3 ${
                      activeTab === "payment"
                        ? "bg-gradient-to-r from-blue-50 to-blue-100/50 text-blue-600 border-blue-500 shadow-sm"
                        : "text-gray-600 border-transparent hover:bg-gray-50 hover:border-gray-200"
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      />
                    </svg>
                    <span>Thanh toán</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("notifications")}
                    className={`group py-3 px-4 rounded-xl font-medium border-l-4 transition-all duration-200 flex items-center gap-3 ${
                      activeTab === "notifications"
                        ? "bg-gradient-to-r from-blue-50 to-blue-100/50 text-blue-600 border-blue-500 shadow-sm"
                        : "text-gray-600 border-transparent hover:bg-gray-50 hover:border-gray-200"
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                    <span>Thông báo</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("security")}
                    className={`group py-3 px-4 rounded-xl font-medium border-l-4 transition-all duration-200 flex items-center gap-3 ${
                      activeTab === "security"
                        ? "bg-gradient-to-r from-blue-50 to-blue-100/50 text-blue-600 border-blue-500 shadow-sm"
                        : "text-gray-600 border-transparent hover:bg-gray-50 hover:border-gray-200"
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    <span>Bảo mật</span>
                  </button>
                </nav>
              </div>
              <div className="mt-auto pt-6 px-4">
                <button className="w-full py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Đăng xuất
                </button>
              </div>
            </div>
            {/* Main Content */}
            <div className="flex-1">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <div className="border-b border-gray-200 pb-5 mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    {activeTab === "profile" && (
                      <>
                        <svg
                          className="w-8 h-8 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        Hồ sơ của tôi
                      </>
                    )}
                    {activeTab === "rental" && (
                      <>
                        <svg
                          className="w-8 h-8 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                        Đơn thuê của tôi
                      </>
                    )}
                    {activeTab === "payment" && (
                      <>
                        <svg
                          className="w-8 h-8 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                          />
                        </svg>
                        Phương thức thanh toán
                      </>
                    )}
                    {activeTab === "notifications" && (
                      <>
                        <svg
                          className="w-8 h-8 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                          />
                        </svg>
                        Thông báo
                      </>
                    )}
                    {activeTab === "security" && (
                      <>
                        <svg
                          className="w-8 h-8 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                        Bảo mật
                      </>
                    )}
                  </h2>
                </div>
                {/* Tab Content */}

                {activeTab === "profile" && (
                  <div className="space-y-8">
                    <div className="flex flex-col md:flex-row gap-8">
                      <div className="flex flex-col items-center">
                        <div className="relative group">
                          <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-blue-100 ring-offset-4 transition-all duration-300 group-hover:ring-blue-200 mb-4">
                            <Image
                              src={
                                userProfile?.avatar ||
                                "https://placehold.co/102x98"
                              }
                              alt="Avatar"
                              width={128}
                              height={128}
                              className="w-32 h-32 object-cover"
                            />
                          </div>
                          <button className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <svg
                              className="w-8 h-8 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                          </button>
                        </div>
                        <button className="mt-3 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 font-medium">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                            />
                          </svg>
                          Tải ảnh lên
                        </button>
                      </div>
                      <div className="flex-1 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="col-span-2">
                            <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                              <svg
                                className="w-4 h-4 text-gray-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                              </svg>
                              Họ và tên
                            </label>
                            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 px-4 py-3 text-gray-900 font-medium">
                              {userProfile?.fullName || "Chưa cập nhật"}
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                              <svg
                                className="w-4 h-4 text-gray-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                              </svg>
                              Địa chỉ email
                            </label>
                            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 px-4 py-3 text-gray-900 flex items-center justify-between">
                              <span className="text-sm">
                                {userProfile?.email || "Chưa cập nhật"}
                              </span>
                              {userProfile?.isEmailConfirmed && (
                                <span className="text-green-600 text-xs flex items-center gap-1">
                                  <svg
                                    className="w-3 h-3"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </span>
                              )}
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                              <svg
                                className="w-4 h-4 text-gray-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                />
                              </svg>
                              Số điện thoại
                            </label>
                            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 px-4 py-3 text-gray-900 text-sm">
                              {userProfile?.phoneNumber || "Chưa cập nhật"}
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                              <svg
                                className="w-4 h-4 text-gray-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              Ngày sinh
                            </label>
                            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 px-4 py-3 text-gray-900 text-sm">
                              {userProfile?.dateOfBirth
                                ? formatDate(userProfile.dateOfBirth)
                                : "Chưa cập nhật"}
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                              <svg
                                className="w-4 h-4 text-gray-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                                />
                              </svg>
                              Giới tính
                            </label>
                            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 px-4 py-3 text-gray-900 text-sm">
                              {userProfile?.gender || "Chưa cập nhật"}
                            </div>
                          </div>
                          <div className="col-span-2">
                            <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                              <svg
                                className="w-4 h-4 text-gray-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                              Địa chỉ
                            </label>
                            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 px-4 py-3 text-gray-900">
                              {userProfile?.address || "Chưa cập nhật"}
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                          <button className="px-6 py-2.5 rounded-lg border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                            Hủy bỏ
                          </button>
                          <button className="px-8 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200">
                            Lưu thay đổi
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === "rental" && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="relative flex-1">
                        <svg
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                        <input
                          type="text"
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="Tìm kiếm đơn thuê (ví dụ: Canon R6, DJI Mavic 3)..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {ordersToShow.map((order) => (
                        <div
                          key={order.orderId}
                          className="group bg-white border-2 border-gray-100 hover:border-blue-200 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                        >
                          <div className="p-6 space-y-4">
                            <div className="flex items-start gap-4">
                              <div className="w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-md flex-shrink-0">
                                <Image
                                  src={
                                    order.equipmentImageUrl ||
                                    "https://placehold.co/80x80"
                                  }
                                  alt={order.equipmentName || "Equipment"}
                                  width={80}
                                  height={80}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-lg text-gray-900 mb-1 truncate group-hover:text-blue-600 transition-colors">
                                  {order.equipmentName || "N/A"}
                                </h3>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                  </svg>
                                  <span className="truncate">
                                    {formatDate(order.startDate)} -{" "}
                                    {formatDate(order.endDate)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-3 pt-3 border-t border-gray-100">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-600">
                                  Trạng thái:
                                </span>
                                <span
                                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider ${
                                    getStatusColor(order.status) === "green"
                                      ? "bg-green-100 text-green-700"
                                      : getStatusColor(order.status) ===
                                        "yellow"
                                      ? "bg-yellow-100 text-yellow-700"
                                      : getStatusColor(order.status) === "red"
                                      ? "bg-red-100 text-red-700"
                                      : "bg-gray-100 text-gray-700"
                                  }`}
                                >
                                  {order.status || "N/A"}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-600">
                                  Tổng chi phí:
                                </span>
                                <span className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 text-sm font-bold">
                                  {order.totalAmount.toLocaleString("vi-VN")}{" "}
                                  VNĐ
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() =>
                                (window.location.href = `/rental/${order.orderId}`)
                              }
                              className="w-full mt-4 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                              Xem chi tiết đơn hàng
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Hiển thị thông báo nếu không có order */}
                    {ordersToShow.length === 0 && (
                      <div className="text-center py-16">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
                          <svg
                            className="w-10 h-10 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                            />
                          </svg>
                        </div>
                        <p className="text-gray-500 text-lg font-medium mb-2">
                          {searchTerm
                            ? "Không tìm thấy đơn thuê phù hợp"
                            : "Bạn chưa có đơn thuê nào"}
                        </p>
                        <p className="text-gray-400 text-sm mb-6">
                          {searchTerm
                            ? "Thử tìm kiếm với từ khóa khác"
                            : "Hãy bắt đầu thuê thiết bị ngay hôm nay!"}
                        </p>
                        {!searchTerm && (
                          <button
                            onClick={() => (window.location.href = "/rental")}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                              />
                            </svg>
                            Khám phá thiết bị
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
                {activeTab === "payment" && (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 mb-6">
                      <svg
                        className="w-12 h-12 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Phương thức thanh toán
                    </h3>
                    <p className="text-gray-600 mb-8 text-center max-w-md">
                      Quản lý thẻ tín dụng, ví điện tử và các phương thức thanh
                      toán khác của bạn.
                    </p>
                    <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      Thêm phương thức thanh toán
                    </button>
                  </div>
                )}
                {activeTab === "notifications" && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="font-bold text-xl text-gray-900 mb-2 flex items-center gap-2">
                        <svg
                          className="w-6 h-6 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                        Kênh thông báo
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Chọn cách bạn muốn nhận thông báo từ chúng tôi.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <label className="group flex flex-col items-start p-5 border-2 border-gray-200 hover:border-blue-300 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md bg-gradient-to-br from-gray-50 to-white">
                          <input
                            type="checkbox"
                            className="mb-3 w-5 h-5 text-blue-600 rounded"
                            defaultChecked
                          />
                          <span className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                            <svg
                              className="w-5 h-5 text-blue-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              />
                            </svg>
                            E-mail
                          </span>
                          <span className="text-sm text-gray-600">
                            Nhận thông báo trực tiếp đến địa chỉ email của bạn.
                          </span>
                        </label>
                        <label className="group flex flex-col items-start p-5 border-2 border-gray-200 hover:border-blue-300 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md bg-gradient-to-br from-gray-50 to-white">
                          <input
                            type="checkbox"
                            className="mb-3 w-5 h-5 text-blue-600 rounded"
                          />
                          <span className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                            <svg
                              className="w-5 h-5 text-blue-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                              />
                            </svg>
                            SMS
                          </span>
                          <span className="text-sm text-gray-600">
                            Nhận thông báo tin nhắn văn bản để cập nhật quan
                            trọng.
                          </span>
                        </label>
                        <label className="group flex flex-col items-start p-5 border-2 border-gray-200 hover:border-blue-300 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md bg-gradient-to-br from-gray-50 to-white">
                          <input
                            type="checkbox"
                            className="mb-3 w-5 h-5 text-blue-600 rounded"
                            defaultChecked
                          />
                          <span className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                            <svg
                              className="w-5 h-5 text-blue-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                              />
                            </svg>
                            Trong ứng dụng
                          </span>
                          <span className="text-sm text-gray-600">
                            Nhận thông báo trong ứng dụng.
                          </span>
                        </label>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-gray-900 mb-2 flex items-center gap-2">
                        <svg
                          className="w-6 h-6 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                          />
                        </svg>
                        Loại thông báo
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Chọn loại thông báo bạn muốn nhận.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <label className="group flex flex-col items-start p-5 border-2 border-gray-200 hover:border-blue-300 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md bg-gradient-to-br from-gray-50 to-white">
                          <input
                            type="checkbox"
                            className="mb-3 w-5 h-5 text-blue-600 rounded"
                            defaultChecked
                          />
                          <span className="font-semibold text-gray-900 mb-1">
                            Cập nhật đặt hàng
                          </span>
                          <span className="text-sm text-gray-600">
                            Nhận thông báo về thay đổi trạng thái cho thuê của
                            bạn
                          </span>
                        </label>
                        <label className="group flex flex-col items-start p-5 border-2 border-gray-200 hover:border-blue-300 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md bg-gradient-to-br from-gray-50 to-white">
                          <input
                            type="checkbox"
                            className="mb-3 w-5 h-5 text-blue-600 rounded"
                          />
                          <span className="font-semibold text-gray-900 mb-1">
                            Cập nhật AI Advisor
                          </span>
                          <span className="text-sm text-gray-600">
                            Nhận các đề xuất và mẹo được cá nhân hóa
                          </span>
                        </label>
                        <label className="group flex flex-col items-start p-5 border-2 border-gray-200 hover:border-blue-300 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md bg-gradient-to-br from-gray-50 to-white">
                          <input
                            type="checkbox"
                            className="mb-3 w-5 h-5 text-blue-600 rounded"
                            defaultChecked
                          />
                          <span className="font-semibold text-gray-900 mb-1">
                            Khuyến mãi & Giảm giá
                          </span>
                          <span className="text-sm text-gray-600">
                            Luôn cập nhật về các ưu đãi và giao dịch đặc biệt
                          </span>
                        </label>
                      </div>
                    </div>
                    <div className="flex justify-end pt-4">
                      <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
                        Lưu tùy chọn
                      </button>
                    </div>
                  </div>
                )}
                {activeTab === "security" && (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-red-100 to-orange-100 mb-6">
                      <svg
                        className="w-12 h-12 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Bảo mật tài khoản
                    </h3>
                    <p className="text-gray-600 mb-8 text-center max-w-md">
                      Quản lý mật khẩu, xác thực hai yếu tố và các cài đặt bảo
                      mật khác.
                    </p>
                    <div className="flex gap-4">
                      <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                          />
                        </svg>
                        Đổi mật khẩu
                      </button>
                      <button className="px-8 py-3 bg-white border-2 border-gray-300 hover:border-blue-400 hover:bg-gray-50 text-gray-700 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          />
                        </svg>
                        Xác thực 2 bước
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainTemplate>
  );
};

export default ProfilePage;

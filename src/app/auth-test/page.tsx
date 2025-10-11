'use client';

import Link from 'next/link';

export default function AuthTestPage() {
  const protectedRoutes = [
    { path: '/dashboard', name: 'Dashboard', description: 'Trang tổng quan cá nhân' },
    { path: '/profile', name: 'Hồ sơ cá nhân', description: 'Quản lý thông tin tài khoản' },
    { path: '/orders', name: 'Đơn hàng', description: 'Lịch sử và quản lý đơn hàng' },
    { path: '/rental', name: 'Thuê thiết bị', description: 'Trang thuê thiết bị' },
    { path: '/settings', name: 'Cài đặt', description: 'Cài đặt tài khoản và ứng dụng' },
  ];

  const publicRoutes = [
    { path: '/', name: 'Trang chủ', description: 'Landing page công khai' },
    { path: '/login', name: 'Đăng nhập', description: 'Trang đăng nhập' },
    { path: '/signup', name: 'Đăng ký', description: 'Trang đăng ký' },
    { path: '/pricing', name: 'Bảng giá', description: 'Thông tin giá cả' },
    { path: '/support', name: 'Hỗ trợ', description: 'Trang hỗ trợ khách hàng' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              🔐 Test Hệ thống Authentication
            </h1>
            <p className="text-gray-600 mb-6">
              Trang này dùng để test hệ thống bảo vệ routes. Hãy thử truy cập các trang dưới đây khi 
              <span className="font-medium text-green-600"> đã đăng nhập</span> và 
              <span className="font-medium text-red-600"> chưa đăng nhập</span> để xem sự khác biệt.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Protected Routes */}
              <div>
                <h2 className="text-xl font-semibold text-red-600 mb-4">
                  🔒 Trang được bảo vệ (Cần đăng nhập)
                </h2>
                <div className="space-y-3">
                  {protectedRoutes.map((route) => (
                    <Link
                      key={route.path}
                      href={route.path}
                      className="block p-4 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <div className="font-medium text-gray-900">{route.name}</div>
                      <div className="text-sm text-gray-600">{route.description}</div>
                      <div className="text-xs text-red-600 mt-1">
                        Sẽ redirect về /login nếu chưa đăng nhập
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Public Routes */}
              <div>
                <h2 className="text-xl font-semibold text-green-600 mb-4">
                  🌐 Trang công khai (Không cần đăng nhập)
                </h2>
                <div className="space-y-3">
                  {publicRoutes.map((route) => (
                    <Link
                      key={route.path}
                      href={route.path}
                      className="block p-4 border border-green-200 rounded-lg hover:bg-green-50 transition-colors"
                    >
                      <div className="font-medium text-gray-900">{route.name}</div>
                      <div className="text-sm text-gray-600">{route.description}</div>
                      <div className="text-xs text-green-600 mt-1">
                        Có thể truy cập mà không cần đăng nhập
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Authentication Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">
              ℹ️ Thông tin hệ thống Authentication
            </h3>
            <div className="space-y-2 text-sm text-blue-800">
              <p>• <strong>Middleware:</strong> Kiểm tra token trong cookies và redirect tự động</p>
              <p>• <strong>ProtectedRoute:</strong> Component wrapper bảo vệ trang ở client-side</p>
              <p>• <strong>AuthGuard:</strong> Server-side protection cho các trang sensitive</p>
              <p>• <strong>Redux + Cookies:</strong> State management kết hợp với persistent storage</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 flex justify-center space-x-4">
            <Link
              href="/login"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Đăng nhập
            </Link>
            <Link
              href="/signup"
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Đăng ký
            </Link>
            <Link
              href="/"
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
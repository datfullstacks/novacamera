'use client';

import { ProtectedRoute } from '@/components/auth';

export default function OrdersPage() {

  // Mock orders data
  const orders = [
    {
      id: '001',
      equipmentName: 'Canon EOS R5',
      rentalPeriod: '15/10/2025 - 20/10/2025',
      status: 'active',
      total: '2,500,000đ'
    },
    {
      id: '002',
      equipmentName: 'Sony A7 IV + Lens Kit',
      rentalPeriod: '10/10/2025 - 12/10/2025',
      status: 'completed',
      total: '1,800,000đ'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
            Đang thuê
          </span>
        );
      case 'completed':
        return (
          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
            Hoàn thành
          </span>
        );
      case 'pending':
        return (
          <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
            Chờ xử lý
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              Đơn hàng của tôi
            </h1>

            {orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {order.equipmentName}
                          </h3>
                          {getStatusBadge(order.status)}
                        </div>
                        
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>
                            <span className="font-medium">Mã đơn hàng:</span> #{order.id}
                          </p>
                          <p>
                            <span className="font-medium">Thời gian thuê:</span> {order.rentalPeriod}
                          </p>
                          <p>
                            <span className="font-medium">Tổng tiền:</span> 
                            <span className="text-lg font-semibold text-blue-600 ml-1">
                              {order.total}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                          Xem chi tiết
                        </button>
                        {order.status === 'active' && (
                          <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                            Gia hạn
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Chưa có đơn hàng nào
                </h3>
                <p className="text-gray-600 mb-4">
                  Bạn chưa có đơn hàng thuê thiết bị nào. Hãy khám phá các thiết bị có sẵn!
                </p>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Khám phá thiết bị
                </button>
              </div>
            )}

            {/* Quick Stats */}
            <div className="mt-8 grid md:grid-cols-3 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{orders.length}</div>
                <div className="text-sm text-blue-700">Tổng đơn hàng</div>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {orders.filter(o => o.status === 'active').length}
                </div>
                <div className="text-sm text-green-700">Đang thuê</div>
              </div>
              
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {orders.filter(o => o.status === 'completed').length}
                </div>
                <div className="text-sm text-purple-700">Hoàn thành</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
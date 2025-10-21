

import React, { useState } from "react";
import MainTemplate from "@/components/templates/MainTemplate";
import Image from "next/image";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [searchTerm, setSearchTerm] = useState("");
  // Danh sách sản phẩm cho thuê mẫu
  const rentalProducts = [
    {
      name: "Canon R6",
      image: "https://placehold.co/64x64",
      date: "22 tháng 5 năm 2025 đến 25 tháng 5 năm 2025",
      status: "Trả lại",
      statusColor: "green",
      cost: "150.000đ",
      actions: ["Xem chi tiết"],
    },
    {
      name: "DJI Mavic 3",
      image: "https://placehold.co/64x64",
      date: "2 tháng 7 năm 2025 đến 5 tháng 7 năm 2025",
      status: "Đang diễn ra",
      statusColor: "yellow",
      cost: "240.000đ",
      actions: ["Chi tiết", "Tạm dừng thuê"],
    },
    {
      name: "Sony A7 IV",
      image: "https://placehold.co/64x64",
      date: "22 tháng 7 năm 2025 đến 25 tháng 8 năm 2025",
      status: "Đang diễn ra",
      statusColor: "yellow",
      cost: "300.000đ",
      actions: ["Chi tiết"],
    },
    ...Array.from({ length: 12 }, (_, i) => ({
      name: `Sản phẩm ${i + 4}`,
      image: "https://placehold.co/64x64",
      date: "1 tháng 8 năm 2025 đến 5 tháng 8 năm 2025",
      status: "Đang diễn ra",
      statusColor: "yellow",
      cost: "100.000đ",
      actions: ["Chi tiết"],
    }))
  ];

  // Lọc theo searchTerm
  const filteredProducts = rentalProducts.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  // Hiển thị tối đa 10 sản phẩm
  const productsToShow = filteredProducts.slice(0, 10);
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
                  <Image src="https://placehold.co/102x98" alt="Avatar" width={80} height={80} className="w-20 h-20 object-cover" />
                </div>
                <div className="font-bold text-lg text-gray-800">John Doe</div>
                <div className="text-sm text-gray-500">John.doe@example.com</div>
              </div>
              <nav className="flex flex-col gap-2 px-6">
                <button onClick={() => setActiveTab('profile')} className={`py-2 px-4 rounded-lg font-medium border-l-4 ${activeTab === 'profile' ? 'bg-blue-50 text-blue-500 border-blue-500' : 'text-gray-600 border-transparent'}`}>Hồ sơ của tôi</button>
                <button onClick={() => setActiveTab('rental')} className={`py-2 px-4 rounded-lg text-gray-600 border-l-4 ${activeTab === 'rental' ? 'bg-blue-50 text-blue-500 border-blue-500' : 'border-transparent'}`}>Cho thuê của tôi</button>
                <button onClick={() => setActiveTab('payment')} className={`py-2 px-4 rounded-lg text-gray-600 border-l-4 ${activeTab === 'payment' ? 'bg-blue-50 text-blue-500 border-blue-500' : 'border-transparent'}`}>Phương thức thanh toán</button>
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
                  {activeTab === 'rental' && 'Đã thuê'}
                  {activeTab === 'payment' && 'Phương thức thanh toán'}
                  {activeTab === 'notifications' && 'Thông báo'}
                  {activeTab === 'security' && 'Bảo vệ'}
                </h2>
              </div>
              {/* Tab Content */}
           
              {activeTab === 'profile' && (
                <div className="flex gap-8 mb-8">
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full outline-zinc-100 overflow-hidden mb-2" style={{ outline: '3px solid #f4f4f5', outlineOffset: '-3px' }}>
                      <Image src="https://placehold.co/102x98" alt="Avatar" width={96} height={96} className="w-24 h-24 object-cover" />
                    </div>
                    <button className="mt-2 px-4 py-2 bg-white rounded-md border border-gray-200 text-sm text-black">Tải lên ảnh mới</button>
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-x-8 gap-y-6">
                    <div>
                      <label className="block text-sm text-gray-800 mb-1 font-['ABeeZee']">Tên</label>
                      <div className="bg-white rounded-md border border-gray-200 px-3 py-2 text-xs text-black">John</div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-800 mb-1 font-['ABeeZee']">Họ</label>
                      <div className="bg-white rounded-md border border-gray-200 px-3 py-2 text-xs text-black">Doe</div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-800 mb-1 font-['ABeeZee']">Địa chỉ email</label>
                      <div className="bg-white rounded-md border border-gray-200 px-3 py-2 text-xs text-black">John.Doe@example.com</div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-800 mb-1 font-['ABeeZee']">Số điện thoại</label>
                      <div className="bg-white rounded-md border border-gray-200 px-3 py-2 text-xs text-black">+84 081-123-4567</div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-800 mb-1 font-['ABeeZee']">Ngày sinh (tùy chọn)</label>
                      <div className="bg-white rounded-md border border-gray-200 px-3 py-2 text-xs text-black">1990-05-15</div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-800 mb-1 font-['ABeeZee']">Địa chỉ vận chuyển mặc định</label>
                      <div className="bg-white rounded-md border border-gray-200 px-3 py-2 text-sm text-black">123 Phố chính, APT 4B</div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-800 mb-1 font-['ABeeZee']">Thành phố</label>
                      <div className="bg-white rounded-md border border-gray-200 px-3 py-2 text-xs text-black">San Francisco</div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-800 mb-1 font-['ABeeZee']">Mã zip</label>
                      <div className="bg-white rounded-md border border-gray-200 px-3 py-2 text-xs text-black">94105</div>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 'rental' && (
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <input
                      type="text"
                      className="border border-gray-300 rounded-md px-3 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      placeholder="Tìm kiếm sản phẩm (ví dụ: Canon R6, DJI Mavic 3)"
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    {productsToShow.map((p, idx) => (
                      <div key={idx} className="bg-white border border-gray-200 rounded-xl shadow px-6 py-5 flex flex-col gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                            <Image src={p.image} alt={p.name} width={64} height={64} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <div className="font-bold text-lg text-gray-900 mb-1">{p.name}</div>
                            <div className="text-sm text-gray-600">{p.date}</div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 mt-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-700">Trạng thái:</span>
                            <span className={`px-2 py-1 rounded bg-${p.statusColor}-100 text-${p.statusColor}-700 text-xs font-semibold`}>{p.status}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-700">Tổng chi phí:</span>
                            <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold">{p.cost}</span>
                          </div>
                          <div className="flex gap-2 mt-2 justify-end">
                            {p.actions.map((action, i) => (
                              <button key={i} className={`px-4 py-2 rounded ${action === "Chi tiết" || action === "Xem chi tiết" ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-200 text-gray-700 hover:bg-gray-300"} font-medium transition`}>{action}</button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Hiển thị thông báo nếu không có sản phẩm */}
                  {productsToShow.length === 0 && (
                    <div className="text-center text-gray-500 mt-8">Không tìm thấy sản phẩm phù hợp.</div>
                  )}
                  <div className="mt-8 flex justify-end">
                    <button className="px-6 py-2 bg-zinc-900 text-white rounded font-medium hover:bg-zinc-800 transition">Thuê thêm</button>
                  </div>
                </div>
              )}
              {activeTab === 'payment' && (
                <div className="flex flex-col items-center justify-center h-full text-gray-700 text-lg">Nội dung phương thức thanh toán (thẻ, ví, thêm/xóa...)</div>
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

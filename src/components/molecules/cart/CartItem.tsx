import React from 'react';
import Image from 'next/image';
import { useAppDispatch } from '@/store/hooks';
import { removeFromCart, updateQuantity, updateRentalDays } from '@/store/slices/cartSlice';
import { moveFromCartToWishlist } from '@/store/slices/wishlistSlice';
import { CartItem as CartItemType } from '@/store/slices/cartSlice';
import { Button } from '@/components/ui/button';
import { RentalDatePicker } from './RentalDatePicker';
import { Minus, Plus, Trash2, Heart } from 'lucide-react';

interface CartItemProps {
  item: CartItemType;
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const dispatch = useAppDispatch();

  const handleRemove = () => {
    dispatch(removeFromCart(item.id));
  };

  const handleSaveForLater = () => {
    dispatch(moveFromCartToWishlist({
      id: item.id,
      name: item.name,
      price: item.dailyRate || item.price || 0,
      imageUrl: item.imageUrl,
      description: item.description,
      addedAt: new Date().toISOString(),
    }));
    dispatch(removeFromCart(item.id));
  };

  const handleUpdateQuantity = (newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemove();
    } else {
      dispatch(updateQuantity({ id: item.id, quantity: newQuantity }));
    }
  };

  const handleUpdateRentalDays = (newDays: number) => {
    if (newDays >= 1) {
      dispatch(updateRentalDays({ id: item.id, rentalDays: newDays }));
    }
  };

  const totalPrice = (item.dailyRate || item.price || 0) * item.quantity * item.rentalDays;

  return (
    <div className="bg-white p-6 border-b border-gray-200 last:border-b-0">
      <div className="flex gap-4">
        {/* Product Image */}
        <div className="flex-shrink-0">
          <div className="w-28 h-28 relative bg-gray-100 rounded-xl overflow-hidden">
            <Image
              src={item.imageUrl || '/images/placeholder.jpg'}
              alt={item.name}
              fill
              className="object-cover"
              sizes="112px"
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-gray-800 mb-2">
            {item.name}
          </h3>
          
          <div className="space-y-1 mb-4">
            <p className="text-xs text-gray-500">
              {(item.dailyRate || item.price || 0).toLocaleString('vi-VN')}đ/ngày
            </p>
            <p className="text-sm text-gray-500">
              Thuê từ NovaCMS
            </p>
            <p className="text-sm text-gray-500">
              Có sẵn
            </p>
          </div>

          {/* Rental Date Picker */}
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-2">Thời gian thuê:</label>
            <RentalDatePicker
              startDate={new Date()}
              endDate={new Date(Date.now() + item.rentalDays * 24 * 60 * 60 * 1000)}
              onDateChange={(startDate, endDate) => {
                const diffTime = endDate.getTime() - startDate.getTime();
                const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                handleUpdateRentalDays(days);
              }}
              className="max-w-xs"
            />
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-black font-medium">Số lượng:</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUpdateQuantity(item.quantity - 1)}
                  className="h-7 w-7 p-0 border-black hover:bg-gray-100"
                >
                  <Minus className="h-3 w-3 text-black" />
                </Button>
                <span className="font-bold text-black w-8 text-center">
                  {item.quantity}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUpdateQuantity(item.quantity + 1)}
                  className="h-7 w-7 p-0 border-black hover:bg-gray-100"
                >
                  <Plus className="h-3 w-3 text-black" />
                </Button>
              </div>
            </div>
          </div>

          {/* Total Price */}
          <div className="text-base font-bold text-gray-800">
            Tổng cộng: {totalPrice.toLocaleString('vi-VN')}đ trong {item.rentalDays} ngày
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex-shrink-0 flex flex-col gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSaveForLater}
            className="text-gray-500 hover:text-blue-500 p-2"
          >
            <Heart className="h-4 w-4" />
            <span className="ml-1 text-sm">Lưu</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="text-gray-500 hover:text-red-500 p-2"
          >
            <Trash2 className="h-4 w-4" />
            <span className="ml-1 text-sm">Xóa</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
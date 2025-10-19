'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Equipment } from '@/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addToCart, updateQuantity } from '@/store/slices/cartSlice';
import { Button } from '@/components/ui/button';
import { Calendar, Star, Heart, ShoppingCart, Minus, Plus } from 'lucide-react';

interface ProductCardProps {
  equipment: Equipment;
  onViewDetails?: (equipment: Equipment) => void;
  onToggleFavorite?: (equipmentId: string) => void;
  isFavorite?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  equipment,
  onToggleFavorite,
  isFavorite = false,
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  
  // Find quantity in cart
  const cartItem = cartItems.find((item) => item.id === equipment.id.toString());
  const quantityInCart = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    if (cartItem) {
      // If item already in cart, increase quantity
            dispatch(updateQuantity({ id: equipment.id.toString(), quantity: cartItem.quantity + 1 }));
    } else {
      // If new item, add to cart
      dispatch(addToCart({
        id: equipment.id.toString(),
        name: equipment.name,
        dailyRate: equipment.dailyRate,
        imageUrl: equipment.images?.[0]?.url || '',
        description: equipment.description,
        quantity: 1,
        rentalDays: 1,
      }));
    }
  };

  const handleRemoveFromCart = () => {
    if (cartItem) {
      dispatch(updateQuantity({ id: equipment.id.toString(), quantity: cartItem.quantity - 1 }));
    }
  };

  const handleViewDetails = () => {
    router.push(`/product/detail/${equipment.id}`);
  };

  const handleToggleFavorite = () => {
    onToggleFavorite?.(equipment.id.toString());
  };

  const isAvailable = equipment.availableQuantity > 0;
  const dailyPrice = equipment.dailyRate || 0;

  return (
    <div className="group hover:shadow-lg transition-all duration-300 overflow-hidden bg-white rounded-lg border border-gray-200">
      <div className="p-0 relative">
        {/* Product Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          <Image
            src={equipment.images[0]?.url || '/images/placeholder.jpg'}
            alt={equipment.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Availability Badge */}
          <span
            className={`absolute top-3 left-3 font-semibold text-xs px-2 py-1 rounded ${
              isAvailable 
                ? 'bg-green-500 text-white hover:bg-green-600' 
                : 'bg-red-500 text-white hover:bg-red-600'
            }`}
          >
            {isAvailable ? 'Có sẵn' : 'Hết hàng'}
          </span>

          {/* Quantity Badge */}
          {isAvailable && equipment.availableQuantity <= 5 && (
            <span className="absolute top-3 left-20 bg-orange-100 text-orange-800 font-medium text-xs px-2 py-1 rounded">
              Còn {equipment.availableQuantity}
            </span>
          )}

          {/* Cart Badge */}
          {quantityInCart > 0 && (
            <span className="absolute top-3 right-3 bg-blue-500 text-white font-bold text-xs px-2 py-1 rounded-full">
              {quantityInCart}
            </span>
          )}

          {/* Favorite Button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute bottom-3 right-3 h-8 w-8 p-0 bg-white/80 hover:bg-white"
            onClick={handleToggleFavorite}
          >
            <Heart
              className={`h-4 w-4 ${
                isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
              }`}
            />
          </Button>
        </div>
      </div>

      <div className="p-4">
        {/* Category */}
        <div className="text-sm text-gray-500 mb-1">
          {equipment.category || 'Thiết bị'}
        </div>

        {/* Product Name */}
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 cursor-pointer text-gray-900 hover:text-blue-600" onClick={handleViewDetails}>
          {equipment.name}
        </h3>

        {/* Price */}
        <div className="mb-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-blue-600">
              {dailyPrice.toLocaleString('vi-VN')}₫
            </span>
            <span className="text-sm text-gray-500">/ngày</span>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          </div>
          <span className="text-sm text-gray-700">
            4.8 • 124 đánh giá
          </span>
        </div>

        {/* Description */}
        {equipment.description && (
          <p className="text-sm text-gray-700 line-clamp-2 mb-3">
            {equipment.description}
          </p>
        )}
      </div>

      <div className="p-4 pt-0 space-y-2">
        {/* Cart Controls */}
        {isAvailable ? (
          quantityInCart > 0 ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRemoveFromCart}
                  className="h-8 w-8 p-0"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="font-medium text-center min-w-[2rem]">
                  {quantityInCart}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddToCart}
                  className="h-8 w-8 p-0"
                  disabled={quantityInCart >= equipment.availableQuantity}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-sm text-gray-700">
                trong giỏ hàng
              </span>
            </div>
          ) : (
            <Button
              onClick={handleAddToCart}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              size="sm"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Thêm vào giỏ
            </Button>
          )
        ) : (
          <Button disabled className="w-full" size="sm">
            Hết hàng
          </Button>
        )}

        {/* View Details Button */}
        <Button
          variant="outline"
          onClick={handleViewDetails}
          className="w-full"
          size="sm"
        >
          <Calendar className="h-4 w-4 mr-2" />
          Xem chi tiết
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
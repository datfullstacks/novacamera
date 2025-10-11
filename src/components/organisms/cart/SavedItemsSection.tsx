'use client';

import React from 'react';
import Image from 'next/image';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { removeFromWishlist } from '@/store/slices/wishlistSlice';
import { addToCart } from '@/store/slices/cartSlice';
import { Button } from '@/components/ui/button';
import { ShoppingCart, X } from 'lucide-react';

import { WishlistItem } from '@/store/slices/wishlistSlice';

export const SavedItemsSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.wishlist);

  const handleMoveToCart = (item: WishlistItem) => {
    dispatch(addToCart({
      id: item.id,
      name: item.name,
      dailyRate: item.price, // Convert price to dailyRate
      imageUrl: item.imageUrl,
      description: item.description,
      rentalDays: 1,
      quantity: 1,
    }));
    dispatch(removeFromWishlist(item.id));
  };

  const handleRemoveFromSaved = (itemId: string) => {
    dispatch(removeFromWishlist(itemId));
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <h2 className="text-lg font-bold text-gray-800 mb-4">
        Sản phẩm đã lưu ({items.length})
      </h2>
      
      <div className="bg-white rounded-xl shadow-sm">
        {items.map((item, index) => (
          <div 
            key={item.id} 
            className={`p-4 flex gap-4 ${index !== items.length - 1 ? 'border-b border-gray-200' : ''}`}
          >
            {/* Product Image */}
            <div className="flex-shrink-0">
              <div className="w-20 h-20 relative bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={item.imageUrl || '/images/placeholder.jpg'}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
            </div>

            {/* Product Details */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-800 mb-1 truncate">
                {item.name}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                {(item.price || 0).toLocaleString('vi-VN')}đ/ngày
              </p>
              <p className="text-xs text-gray-500">
                Lưu ngày {new Date(item.addedAt).toLocaleDateString('vi-VN')}
              </p>
            </div>

            {/* Actions */}
            <div className="flex-shrink-0 flex gap-2">
              <Button
                onClick={() => handleMoveToCart(item)}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-xs"
              >
                <ShoppingCart className="w-3 h-3 mr-1" />
                Thêm vào giỏ
              </Button>
              <Button
                onClick={() => handleRemoveFromSaved(item.id)}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-red-500 p-1"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
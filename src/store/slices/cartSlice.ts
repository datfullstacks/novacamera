import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  equipmentId?: number; // New API format
  id?: string; // Legacy format
  name: string;
  pricePerDay?: number; // New API format
  dailyRate?: number; // Legacy format
  depositFee?: number; // New API format
  price?: number; // Legacy field for backward compatibility
  quantity: number;
  totalDays?: number; // New API format
  rentalDays?: number; // Legacy format
  imageUrl: string | null;
  brand?: string | null;
  category?: string | null;
  description?: string;
  rentalStartDate?: string | null;
  rentalEndDate?: string | null;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isOpen: boolean;
}

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  isOpen: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Omit<CartItem, 'quantity'> & { quantity?: number }>) => {
      const { quantity = 1, ...item } = action.payload;
      console.log('addToCart reducer called with:', { item, quantity });
      console.log('Current cart items before:', state.items.map(i => ({ 
        id: i.id || i.equipmentId, 
        name: i.name, 
        quantity: i.quantity 
      })));
      
      // Normalize ID for comparison (support both formats)
      const itemId = item.id || item.equipmentId?.toString() || '';
      const existingItem = state.items.find(i => 
        (i.id || i.equipmentId?.toString()) === itemId
      );
      
      console.log('Found existing item:', existingItem);
      
      if (existingItem) {
        console.log('Updating existing item quantity from', existingItem.quantity, 'to', existingItem.quantity + quantity);
        existingItem.quantity += quantity;
      } else {
        console.log('Adding new item to cart');
        // Normalize the item before adding
        const normalizedItem: CartItem = {
          ...item,
          id: itemId,
          equipmentId: item.equipmentId,
          dailyRate: item.dailyRate || item.pricePerDay || 0,
          pricePerDay: item.pricePerDay || item.dailyRate || 0,
          rentalDays: item.rentalDays || item.totalDays || 1,
          totalDays: item.totalDays || item.rentalDays || 1,
          quantity,
        };
        state.items.push(normalizedItem);
      }
      
      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalPrice = state.items.reduce((sum, item) => {
        const price = item.dailyRate || item.pricePerDay || 0;
        const days = item.rentalDays || item.totalDays || 1;
        return sum + (price * item.quantity * days);
      }, 0);
      
      console.log('Cart items after:', state.items.map(i => ({ 
        id: i.id || i.equipmentId, 
        name: i.name, 
        quantity: i.quantity 
      })));
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => 
        (item.id || item.equipmentId?.toString()) !== action.payload
      );
      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalPrice = state.items.reduce((sum, item) => {
        const price = item.dailyRate || item.pricePerDay || 0;
        const days = item.rentalDays || item.totalDays || 1;
        return sum + (price * item.quantity * days);
      }, 0);
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find(i => 
        (i.id || i.equipmentId?.toString()) === action.payload.id
      );
      if (item) {
        item.quantity = Math.max(0, action.payload.quantity);
        if (item.quantity === 0) {
          state.items = state.items.filter(i => 
            (i.id || i.equipmentId?.toString()) !== action.payload.id
          );
        }
      }
      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalPrice = state.items.reduce((sum, item) => {
        const price = item.dailyRate || item.pricePerDay || 0;
        const days = item.rentalDays || item.totalDays || 1;
        return sum + (price * item.quantity * days);
      }, 0);
    },
    updateRentalDays: (state, action: PayloadAction<{ id: string; rentalDays: number }>) => {
      const item = state.items.find(i => 
        (i.id || i.equipmentId?.toString()) === action.payload.id
      );
      if (item) {
        const days = Math.max(1, action.payload.rentalDays);
        item.rentalDays = days;
        item.totalDays = days;
      }
      state.totalPrice = state.items.reduce((sum, item) => {
        const price = item.dailyRate || item.pricePerDay || 0;
        const days = item.rentalDays || item.totalDays || 1;
        return sum + (price * item.quantity * days);
      }, 0);
    },
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    openCart: (state) => {
      state.isOpen = true;
    },
    closeCart: (state) => {
      state.isOpen = false;
    },
  },
});

export const { 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  updateRentalDays, 
  clearCart, 
  toggleCart, 
  openCart, 
  closeCart 
} = cartSlice.actions;

export default cartSlice.reducer;
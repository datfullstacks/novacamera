import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  id: string;
  name: string;
  dailyRate: number;
  price?: number; // Legacy field for backward compatibility
  quantity: number;
  rentalDays: number;
  imageUrl: string;
  description?: string;
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
      console.log('Current cart items before:', state.items.map(i => ({ id: i.id, name: i.name, quantity: i.quantity })));
      
      const existingItem = state.items.find(i => i.id === item.id);
      console.log('Found existing item:', existingItem);
      
      if (existingItem) {
        console.log('Updating existing item quantity from', existingItem.quantity, 'to', existingItem.quantity + quantity);
        existingItem.quantity += quantity;
      } else {
        console.log('Adding new item to cart');
        state.items.push({ ...item, quantity });
      }
      
      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
        state.totalPrice = state.items.reduce((sum, item) => sum + (item.dailyRate * item.quantity * item.rentalDays), 0);      console.log('Cart items after:', state.items.map(i => ({ id: i.id, name: i.name, quantity: i.quantity })));
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalPrice = state.items.reduce((sum, item) => sum + (item.dailyRate * item.quantity * item.rentalDays), 0);
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find(i => i.id === action.payload.id);
      if (item) {
        item.quantity = Math.max(0, action.payload.quantity);
        if (item.quantity === 0) {
          state.items = state.items.filter(i => i.id !== action.payload.id);
        }
      }
      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalPrice = state.items.reduce((sum, item) => sum + (item.dailyRate * item.quantity * item.rentalDays), 0);
    },
    updateRentalDays: (state, action: PayloadAction<{ id: string; rentalDays: number }>) => {
      const item = state.items.find(i => i.id === action.payload.id);
      if (item) {
        item.rentalDays = Math.max(1, action.payload.rentalDays);
      }
      state.totalPrice = state.items.reduce((sum, item) => sum + (item.dailyRate * item.quantity * item.rentalDays), 0);
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
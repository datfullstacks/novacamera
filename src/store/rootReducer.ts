import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import filtersReducer from './slices/filtersSlice';
import uiReducer from './slices/uiSlice';
import preferencesReducer from './slices/preferencesSlice';
import wishlistReducer from './slices/wishlistSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  filters: filtersReducer,
  ui: uiReducer,
  preferences: preferencesReducer,
  wishlist: wishlistReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
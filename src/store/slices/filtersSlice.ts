import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FilterState {
  categories: string[];
  brands: string[];
  priceRange: [number, number];
  rating: number;
  availability: boolean;
  sortBy: string;
  viewMode: 'grid' | 'list';
  searchQuery: string;
}

const initialState: FilterState = {
  categories: [],
  brands: [],
  priceRange: [0, 10000000], // 0 to 10M VND
  rating: 0,
  availability: true, // Mặc định chỉ hiển thị thiết bị có sẵn
  sortBy: 'newest', // Mặc định hiển thị sản phẩm mới nhất trước
  viewMode: 'grid',
  searchQuery: '',
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    updateCategories: (state, action: PayloadAction<string[]>) => {
      state.categories = action.payload;
    },
    toggleCategory: (state, action: PayloadAction<string>) => {
      const category = action.payload;
      if (state.categories.includes(category)) {
        state.categories = state.categories.filter(c => c !== category);
      } else {
        state.categories.push(category);
      }
    },
    updateBrands: (state, action: PayloadAction<string[]>) => {
      state.brands = action.payload;
    },
    toggleBrand: (state, action: PayloadAction<string>) => {
      const brand = action.payload;
      if (state.brands.includes(brand)) {
        state.brands = state.brands.filter(b => b !== brand);
      } else {
        state.brands.push(brand);
      }
    },
    updatePriceRange: (state, action: PayloadAction<[number, number]>) => {
      state.priceRange = action.payload;
    },
    updateRating: (state, action: PayloadAction<number>) => {
      state.rating = action.payload;
    },
    updateAvailability: (state, action: PayloadAction<boolean>) => {
      state.availability = action.payload;
    },
    updateSortBy: (state, action: PayloadAction<string>) => {
      state.sortBy = action.payload;
    },
    updateViewMode: (state, action: PayloadAction<'grid' | 'list'>) => {
      state.viewMode = action.payload;
    },
    updateSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    clearFilters: (state) => {
      state.categories = [];
      state.brands = [];
      state.priceRange = [0, 10000000];
      state.rating = 0;
      state.availability = true; // Luôn giữ mặc định chỉ hiển thị thiết bị có sẵn
      state.searchQuery = '';
    },
    resetToDefaults: () => initialState,
  },
});

export const {
  updateCategories,
  toggleCategory,
  updateBrands,
  toggleBrand,
  updatePriceRange,
  updateRating,
  updateAvailability,
  updateSortBy,
  updateViewMode,
  updateSearchQuery,
  clearFilters,
  resetToDefaults,
} = filtersSlice.actions;

export default filtersSlice.reducer;
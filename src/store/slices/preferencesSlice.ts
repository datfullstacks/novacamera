import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PreferencesState {
  theme: 'light' | 'dark' | 'system';
  language: 'vi' | 'en';
  currency: 'VND' | 'USD';
  defaultLocation: string;
  notifications: {
    email: boolean;
    push: boolean;
    marketing: boolean;
  };
  autoSaveFilters: boolean;
}

const initialState: PreferencesState = {
  theme: 'system',
  language: 'vi',
  currency: 'VND',
  defaultLocation: '',
  notifications: {
    email: true,
    push: true,
    marketing: false,
  },
  autoSaveFilters: true,
};

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    updateTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.theme = action.payload;
    },
    updateLanguage: (state, action: PayloadAction<'vi' | 'en'>) => {
      state.language = action.payload;
    },
    updateCurrency: (state, action: PayloadAction<'VND' | 'USD'>) => {
      state.currency = action.payload;
    },
    updateDefaultLocation: (state, action: PayloadAction<string>) => {
      state.defaultLocation = action.payload;
    },
    updateNotificationSettings: (state, action: PayloadAction<Partial<PreferencesState['notifications']>>) => {
      state.notifications = { ...state.notifications, ...action.payload };
    },
    updateAutoSaveFilters: (state, action: PayloadAction<boolean>) => {
      state.autoSaveFilters = action.payload;
    },
    updatePreferences: (state, action: PayloadAction<Partial<PreferencesState>>) => {
      return { ...state, ...action.payload };
    },
    resetPreferences: () => initialState,
  },
});

export const {
  updateTheme,
  updateLanguage,
  updateCurrency,
  updateDefaultLocation,
  updateNotificationSettings,
  updateAutoSaveFilters,
  updatePreferences,
  resetPreferences,
} = preferencesSlice.actions;

export default preferencesSlice.reducer;
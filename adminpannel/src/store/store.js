import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { apiSlice } from './api/apiSlice';
import dashboardReducer from './slices/dashboardSlice';
import productsReducer from './slices/productsSlice';
import categoriesReducer from './slices/categoriesSlice';
import brandsReducer from './slices/brandsSlice';

export const store = configureStore({
  reducer: {
    api: apiSlice.reducer,
    dashboard: dashboardReducer,
    products: productsReducer,
    categories: categoriesReducer,
    brands: brandsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }).concat(apiSlice.middleware),
});

setupListeners(store.dispatch);

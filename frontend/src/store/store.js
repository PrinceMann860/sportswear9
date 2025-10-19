import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth/authSlice';
import productReducer from '../Components/Product/productslice';
import ProductdetailReducer from "../Components/Product/Productdetailslice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    productdetail: ProductdetailReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

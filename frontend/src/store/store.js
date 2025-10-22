import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth/authSlice';
import productReducer from '../Components/Product/productslice';
import ProductdetailReducer from "../Components/Product/Productdetailslice";
import brandReducer from "../Components/Brands/brandlistslice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    productdetail: ProductdetailReducer,
    brandlist: brandReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

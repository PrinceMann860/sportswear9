import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth/authSlice';
import productReducer from '../Components/Product/productslice';
import ProductdetailReducer from "../Components/Product/Productdetailslice";
import brandReducer from "../Components/Brands/brandlistslice";
import homepagereducer from "../Components/Home/HomePageSlice";
import profileReducer from '../Components/Profile/Profileslice';
import cartReducer from '../Components/Cart/Cartslice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    productdetail: ProductdetailReducer,
    brandlist: brandReducer,
    homepage: homepagereducer,
    profile: profileReducer,
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

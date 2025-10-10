import React from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import ScrollToTop from "./Components/fix/ScrollToTop";
import Navbar from "./Components/Common/Navbar";
import Footer from "./Components/Common/Footer";
import BottomNav from "./Components/Common/BottomNav";
import Home from "./Components/Home/Home";
import Product from "./Components/Product/Product";
import ProductInfo from "./Components/Product/ProductInfo";
import PrivacyPolicy from "./Components/Terms&Policy/PrivacyPolicy";
import TermsOfUse from "./Components/Terms&Policy/TermsOfUse";
import ContactUs  from "./Components/Pages/ContactUs";
import SearchPage from "./Components/Pages/SearchPage";
import CartPage from "./Components/Cart/CartPage";
import CategoriesPage from "./Components/Categories/CategoriesPage";
import WishlistPage from "./Components/Wishlist/WishlistPage";
import OrdersPage from "./Components/Orders/OrdersPage";
import BrandPage from "./Components/Brands/BrandPage";
import ProfilePage from "./Components/Profile/ProfilePage";
import CheckoutPage from "./Components/Checkout/CheckoutPage";


export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element:
        <>
          <ScrollToTop />
          <Navbar />
          <Outlet />
          <Footer />
          <BottomNav />
        </>,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/Product",
          element: <Product />,
        },
        {
          path: '/ProductInfo',
          element: <ProductInfo />
        },
        {
          path: '/privacy',
          element: <PrivacyPolicy />
        },
        {
          path: '/privacypolicy',
          element: <PrivacyPolicy />
        },
        {
          path: '/terms',
          element: <TermsOfUse />
        },
        {
          path: '/termsofuse',
          element: <TermsOfUse />
        },
        {
          path: '/contact',
          element: <ContactUs />
        },
        {
          path: '/contactus',
          element: <ContactUs />
        },
        {
          path: '/search',
          element: <SearchPage />
        },
        {
          path: '/categories',
          element: <CategoriesPage />
        },
        {
          path: '/wishlist',
          element: <WishlistPage />
        },
        {
          path: '/orders',
          element: <OrdersPage />
        },
        {
          path: '/brand/:brandName',
          element: <BrandPage />
        },
        {
          path: '/profile',
          element: <ProfilePage />
        },
        {
          path: '/cart',
          element: <CartPage />
        },
        {
          path: '/checkout',
          element: <CheckoutPage />
        },
      ],
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

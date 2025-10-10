import React from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Navbar from "./Components/Common/Navbar";
import Footer from "./Components/Common/Footer";
import BottomNav from "./Components/Common/BottomNav";
import Home from "./Components/Home/Home";
import Product from "./Components/Product/Product";
import ProductInfo from "./Components/Product/ProductInfo";
import PrivacyPolicy from "./Components/Pages/PrivacyPolicy";
import TermsOfUse from "./Components/Pages/TermsOfUse";
import ContactUs from "./Components/Pages/ContactUs";
import SearchPage from "./Components/Pages/SearchPage";
import CategoriesPage from "./Components/Pages/CategoriesPage";
import WishlistPage from "./Components/Pages/WishlistPage";
import OrdersPage from "./Components/Pages/OrdersPage";
import BrandPage from "./Components/Pages/BrandPage";
import ProfilePage from "./Components/Pages/ProfilePage";
import CartPage from "./Components/Pages/CartPage";
import CheckoutPage from "./Components/Pages/CheckoutPage";
import ScrollToTop from "./Components/fix/ScrollToTop";


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

import React from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import ScrollToTop from "./Components/fix/ScrollToTop";
import Navbar from "./Components/Common/Navbar";
import Footer from "./Components/Common/Footer";
import BottomNav from "./Components/Common/BottomNav";
import Product from "./Components/Product/Product";
import ProductInfo from "./Components/Product/ProductInfo";
import PrivacyPolicy from "./Components/Terms&Policy/PrivacyPolicy";
import TermsOfUse from "./Components/Terms&Policy/TermsOfUse";
import ContactUs  from "./Components/Pages/ContactUs";
import SearchPage from "./Components/Pages/SearchPage";
import CartPage from "./Components/Cart/CartPage";
import CategoriesPage from "./Components/Categories/CategoriesPage";
import OrdersPage from "./Components/Orders/OrdersPage";
import BrandPage from "./Components/Brands/BrandPage";
import ProfilePage from "./Components/Profile/ProfilePage";
import CheckoutPage from "./Components/Checkout/CheckoutPage";
import Error404 from "./Components/Pages/Error404page";
import Home2 from "./Components/Home/Home2";

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
          element: <Home2 />,
        },
        {
          path: "*",
          element: <Error404 />
        },
        {
          path: "/product/*",
          element: <Product />,
        },
        {
          path: "/sports",
          element: <Product />
        },
        {
          path: "/categories",
          element: <CategoriesPage />
        },
        // Other routes remain the same
        {
          path: '/ProductInfo/:id',
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

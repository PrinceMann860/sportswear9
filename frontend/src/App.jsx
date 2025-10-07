import React from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Navbar from "./Components/Common/Navbar";
import Footer from "./Components/Common/Footer";
import Home from "./Components/Home/Home";
import Product from "./Components/Product/Product";
import ProductInfo from "./Components/Product/ProductInfo";


export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: 
        <>
          <Navbar />
          <Outlet />
          <Footer />
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
      ],
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

import React from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Navbar from "./Components/Common/Navbar";
import Footer from "./Components/Common/Footer";
import Home from "./Components/Home/Home";
import Product from "./Components/Product/Product";

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
      ],
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

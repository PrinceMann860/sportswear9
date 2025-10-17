// /src/components/Product/Product.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  selectAllProducts,
  selectProductsLoading,
  selectProductsError,
} from "./productslice";
import banner from "../../assets/productbanner.png";
import { Heart } from "lucide-react";

// Your original ProductCard component (unchanged)
function ProductCard({ product }) {
  const rating = product.rating?.rate || 4.5;
  const count = product.rating?.count || 100;

  return (
    <Link to={"/ProductInfo"}>
      <div className="relative max-w-[300px] bg-white overflow-hidden border border-gray-200 hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col rounded-lg">
        
        {/* Image - group moved here */}
        <div className="group relative w-full h-46 md:h-54 lg:h-70 flex items-center justify-center bg-gray-50">
          <img
            src={product.img}
            alt={product.title}
            className="absolute w-full h-full object-fill transition-opacity duration-500 group-hover:opacity-0"
          />
          {product.img2 && (
            <img
              src={product.img2}
              alt={`${product.title} Hover`}
              className="absolute w-full h-full object-fill opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          )}
        </div>

        {/* Rating */}
        <div className="flex justify-between">
          <div className="px-4 pt-3 text-sm font-medium text-gray-700">
            ⭐ {rating} <span className="text-gray-500">| {count}</span>
          </div>
          <button className="mx-4 mt-3 w-6 h-6 sm:w-7 sm:h-7 bg-white rounded-full flex items-center justify-center border border-gray-300 hover:border-primary hover:bg-primary/5 transition-all duration-300">
            <Heart className="w-3 h-3 sm:w-4 sm:h-4 transition-all duration-300" />
          </button>
        </div>

        {/* Content */}
        <div className="px-4 text-start flex flex-col flex-grow min-h-[120px]">
          <p className="text-xs font-semibold text-gray-600 uppercase">
            {product.brand}
          </p>
          <h3 className="font-semibold text-gray-900 line-clamp-2 mt-1">
            {product.title}
          </h3>

          {/* Price */}
          <div className="mt-1">
            <p className="text-lg font-bold text-gray-900">{product.price}</p>
            <p className="text-sm text-gray-500">
              <span className="line-through mr-1">{product.original}</span>
              <span className="text-red-500 font-medium">
                {product.discount}
              </span>
            </p>
          </div>
        </div>

        {/* Add to Cart Button */}
        <button className="w-[95%] mx-auto py-2 my-2 text-sm font-bold uppercase border border-gray-300 bg-white hover:bg-gray-100 transition">
          Add to Cart
        </button>
      </div>
    </Link>
  );
}


// Helper function to transform API data to match your ProductCard expectations
const transformProductData = (apiProduct) => {
  return {
    id: apiProduct.product_uuid,
    title: apiProduct.name,
    price: `$${apiProduct.price}`,
    original:
      apiProduct.disc > 0
        ? `$${(
            parseFloat(apiProduct.price) + parseFloat(apiProduct.disc)
          ).toFixed(2)}`
        : "",
    discount: apiProduct.disc > 0 ? `Save $${apiProduct.disc}` : "",
    category: apiProduct.category?.name || "Uncategorized",
    // You'll need to provide an image - using a placeholder for now
    img:
      apiProduct.thumbnail ||
      "https://via.placeholder.com/300x300?text=No+Image",
  };
};

function Product() {
  const dispatch = useDispatch();
  const apiProducts = useSelector(selectAllProducts);
  const loading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);

  console.log("API Products:", apiProducts);
  console.log("Number of products:", apiProducts.length);

  // Transform API data to match your ProductCard component
  const products = apiProducts.map(transformProductData);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center mt-10">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-blue-500 text-lg">Error: {error}</p>
          <button
            onClick={() => dispatch(fetchProducts())}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <span className="bg-black text-white px-3 py-1 text-xs rounded">
          FLAT 60% OFF
        </span>
        <span className="bg-yellow-400 text-black px-3 py-1 text-xs rounded font-medium">
          BEST SELLERS ⚡
        </span>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Show message if no products */}
      {products.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found</p>
          <button
            onClick={() => dispatch(fetchProducts())}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Reload Products
          </button>
        </div>
      )}

      <div className="flex justify-between mt-10">
        <h2 className="font-bold text-xl lg:text-3xl underline underline-offset-4 decoration-4">
          TRENDING PRODUCTS
        </h2>
        <Link
          to={"#"}
          className="text-sm font-bold underline decoration-2 underline-offset-4"
        >
          Shop now
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="max-w-7xl h-auto flex">
        <img src={banner} alt="" className="" />
      </div>
    </div>
  );
}

export default Product;
export { ProductCard };

const product = {
  id: 3,
  title: "Compression T-shirt",
  category: "Performance",
  price: "₹2,499.00",
  original: "₹6,599.00",
  discount: "-65%",
  images: [
    "https://assets.myntassets.com/dpr_1.5,q_30,w_800,c_limit,fl_progressive/assets/images/2025/FEBRUARY/3/L7GEjRDH_b510caa934e949b78484e8cfb577804d.jpg",
    "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?auto=format&fit=crop&w=800&q=80",
  ],
  description:
    "Engineeblue with moisture-wicking fabric, our Compression T-shirt provides superior breathability, flexibility, and comfort during intense workouts.",
};

import React from "react";
import { Link } from "react-router-dom";
import banner from "../../assets/productbanner.png";

function ProductCard({ product }) {
  return (
    <Link to={'/ProductInfo'}>
      <div className="group relative bg-white overflow-hidden shadow-sm border-gray-100 hover:shadow-2xl transition-all duration-500 cursor-pointer hover:-translate-y-1">
        {/* Product Image */}
        <div className="relative flex items-center justify-center">
          <img
            src={product.img}
            alt={product.title}
            className="w-full h-auto object-contain transition-transform duration-500 "
          />

          {/* Wishlist Icon */}
          <button className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.6}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.015-4.5-4.5-4.5S12 5.765 12 8.25c0-2.485-2.015-4.5-4.5-4.5S3 5.765 3 8.25c0 7.125 9 11.25 9 11.25s9-4.125 9-11.25z"
              />
            </svg>
          </button>
        </div>

        {/* Product Details */}
        <div className="p-4 text-start">
          <h3 className="font-semibold text-gray-900 group-hover:text-black transition">
            {product.title}
          </h3>
          <p className="text-sm text-gray-500 mt-1">{product.category}</p>

          {/* Price Section */}
          <div className="mt-3">
            <p className="text-lg font-bold text-gray-900">{product.price}</p>
            <p className="text-sm text-gray-500">
              <span className="line-through mr-1">{product.original}</span>
              <span className="text-red-500 font-medium">
                {product.discount}
              </span>
            </p>
          </div>
        </div>

        {/* Subtle Bottom Border Accent */}
        <div className="absolute bottom-0 left-0 w-0 h-1 bg-red-500 transition-all duration-500 group-hover:w-full"></div>
      </div>
    </Link>
  );
}

function Product() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
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
      <div className="flex justify-between mt-10">
        <h2
          className="font-bold text-xl lg:text-3xl underline underline-offset-4 decoration-4
      "
        >
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
      <div className="max-w-7xl h-auto">
        <img src={banner} alt="" className="" />
      </div>
    </div>
  );
}

export default Product;
export { ProductCard };

import React from "react";
import { Link } from "react-router-dom";
import banner from '../../assets/productbanner.png'


function ProductCard({ product }) {
  return (
    <div className="group relative rounded-lg p-4 lg:border shadow hover:shadow-xl transition bg-white cursor-pointer">
      {/* Product Image */}
      <div className="relative">
        <img
          src={product.img}
          alt={product.title}
          className="w-full h-46 lg:64 object-contain"
        />
        {/* Wishlist Icon */}
        <button className="absolute top-2 right-2 text-gray-500 hover:text-red-500">
          ♥
        </button>
      </div>

      {/* Price Section */}
      <div className="mt-3">
        <p className="text-red-600 font-bold">{product.price}</p>
        <p className="text-sm text-gray-500">
          <span className="line-through">{product.original}</span>{" "}
          <span className="text-red-500">{product.discount}</span>
        </p>
      </div>

      {/* Title */}
      <h3 className="mt-1 font-semibold text-gray-800">{product.title}</h3>
      <p className="text-sm text-gray-500">{product.category}</p>
    </div>
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
      <h2 className="font-bold text-xl lg:text-3xl underline underline-offset-4 decoration-4
      ">TRENDING PRODUCTS</h2>
      <Link to={'#'} className="text-sm font-bold underline decoration-2 underline-offset-4">Shop now</Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <div className="max-w-7xl h-auto">
        <img src={banner} alt="" className=""/>
      </div>
    </div>
  );
}

export default Product;
export { ProductCard };


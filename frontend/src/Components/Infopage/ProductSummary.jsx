// src/components/Product/ProductSummary.jsx
import React from "react";
import { Star, Heart } from "lucide-react";

const ProductSummary = ({ product }) => {
  const {
    name,
    brand,
    price,
    disc,
    net,
    category,
    average_rating,
    description,
  } = product;

  return (
    <div className="space-y-4 md:pl-6">
      {/* Brand + Category */}
      <div className="flex items-center gap-3">
        {brand?.logo && (
          <img
            src={brand.logo}
            alt={brand.name}
            className="w-10 h-10 object-contain"
          />
        )}
        <div>
          <h2 className="text-xs text-gray-500 uppercase">{category?.name}</h2>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800 leading-tight">
            {name}
          </h1>
        </div>
      </div>

      {/* Ratings */}
      <div className="flex items-center gap-1 text-yellow-500">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < Math.round(average_rating || 4) ? "fill-yellow-500" : ""
            }`}
          />
        ))}
        <span className="text-sm text-gray-600 ml-1">
          ({average_rating || "4.0"})
        </span>
      </div>

      {/* Price */}
      <div className="space-y-1">
        <div className="flex items-end gap-2">
          <h2 className="text-3xl font-bold text-gray-900">₹{net}</h2>
          {disc !== "0.00" && (
            <span className="text-lg text-gray-500 line-through">₹{price}</span>
          )}
        </div>
        <p className="text-xs text-gray-500">Inclusive of all taxes</p>
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-3 mt-4">
        <button className="flex-1 bg-[#2563EB] text-white py-3 rounded-lg text-sm font-semibold hover:bg-blue-700 transition">
          Add to Cart
        </button>
        <button className="w-12 h-12 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 transition">
          <Heart className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Description */}
      {description && (
        <div className="mt-4">
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      )}
    </div>
  );
};

export default ProductSummary;

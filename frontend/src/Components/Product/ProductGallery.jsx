// src/components/Product/ProductGallery.jsx
import React, { useState } from "react";

const BASE_URL = "http://127.0.0.1:8000";

const ProductGallery = ({ images = [], brandLogo }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const hasImages = Array.isArray(images) && images.length > 0;

  // Convert objects like { url: "/media/..." } to full URLs
  const parsedImages = hasImages
    ? images.map((img) =>
        typeof img === "string"
          ? img
          : img?.url
          ? `${BASE_URL}${img.url}`
          : null
      ).filter(Boolean)
    : [];

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Left Thumbnails */}
      <div className="flex md:flex-col gap-3 md:w-24 overflow-x-auto md:overflow-y-auto scrollbar-hide">
        {(parsedImages.length > 0 ? parsedImages : [brandLogo]).map(
          (img, index) => (
            <div
              key={index}
              className={`border rounded-lg overflow-hidden cursor-pointer transition-all ${
                selectedIndex === index
                  ? "border-[#2563EB] ring-2 ring-[#2563EB]"
                  : "border-gray-300"
              }`}
              onClick={() => setSelectedIndex(index)}
            >
              <img
                src={img || brandLogo}
                alt={`Thumbnail ${index + 1}`}
                className="w-20 h-20 object-cover hover:opacity-90"
              />
            </div>
          )
        )}
      </div>

      {/* Main Image */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200 p-2">
        <img
          src={
            parsedImages.length > 0
              ? parsedImages[selectedIndex]
              : brandLogo || "https://via.placeholder.com/500x500"
          }
          alt="Main product"
          className="object-contain w-full h-[400px] md:h-[520px] rounded-lg"
        />
      </div>
    </div>
  );
};

export default ProductGallery;

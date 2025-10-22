// src/components/Product/ProductTabs.jsx
import React, { useState } from "react";

const ProductTabs = ({ product }) => {
  const [activeTab, setActiveTab] = useState("details");

  const tabs = [
    { id: "details", label: "Product Details" },
    { id: "specs", label: "Specifications" },
    { id: "reviews", label: "Reviews" },
  ];

  return (
    <div className="mt-10">
      {/* Tab Headers */}
      <div className="border-b border-gray-200 flex gap-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`pb-2 text-sm font-medium transition ${
              activeTab === tab.id
                ? "text-[#2563EB] border-b-2 border-[#2563EB]"
                : "text-gray-600 hover:text-[#2563EB]"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4 text-sm text-gray-700">
        {activeTab === "details" && (
          <p>{product.description || "No product details available."}</p>
        )}
        {activeTab === "specs" && (
          <ul className="list-disc pl-5 space-y-1">
            {product.specifications?.length ? (
              product.specifications.map((s, i) => <li key={i}>{s}</li>)
            ) : (
              <p>No specifications available.</p>
            )}
          </ul>
        )}
        {activeTab === "reviews" && (
          <p>
            {product.reviews?.length
              ? `${product.reviews.length} reviews`
              : "No reviews yet."}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;

// src/components/Product/DeliveryInfo.jsx
import React from "react";
import { Truck, RotateCcw } from "lucide-react";

const DeliveryInfo = () => {
  return (
    <div className="mt-6 border-t border-gray-200 pt-4">
      <div className="flex flex-col sm:flex-row gap-6 text-sm text-gray-700">
        <div className="flex items-center gap-3">
          <Truck className="w-5 h-5 text-[#2563EB]" />
          <p>Free delivery on orders above ₹499</p>
        </div>
        <div className="flex items-center gap-3">
          <RotateCcw className="w-5 h-5 text-[#2563EB]" />
          <p>Easy 30-day returns & exchanges</p>
        </div>
      </div>
    </div>
  );
};

export default DeliveryInfo;

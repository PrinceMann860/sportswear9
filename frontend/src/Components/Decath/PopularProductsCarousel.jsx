import React from "react";
import { ProductCard } from "../Product/Product"; // ✅ Update path if needed

const PopularProductsGrid = ({ 
  title = "Best Selling",
  subtitle = "",
  products = [] 
}) => {
  // ✅ Map products to ProductCard format
  const mappedProducts = products.map((product) => ({
    id: product.id,
    title: product.title,
    img: product.img,
    img2: product.img2,
    brand: product.brand,
    price: product.price,
    original: product.original,
    discount: product.discount,
    rating: { rate: product.rating, count: product.reviews },
    category: product.category || ""
  }));

  return (
    <div className="mb-10">
      <div className="px-4 mx-auto md:px-4 lg:px-12 xl:px-16">
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold">
            {subtitle && (
              <span className="text-muted-foreground text-sm md:text-base block">
                {subtitle}
              </span>
            )}
            <p className="font-bold uppercase text-base md:text-xl text-foreground">
              {title}
            </p>
          </h2>
        </div>

        {/* ✅ Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {mappedProducts.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopularProductsGrid;

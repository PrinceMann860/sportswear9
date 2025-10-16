import React, { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "../Product/Product"; // ✅ Update this path manually if needed

const PopularProductsCarousel = ({ 
  title = "Most Popular Products",
  subtitle = "",
  products = [] 
}) => {
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scroll = (direction) => {
      const container = scrollRef.current;
      if (container) {
        const scrollAmount = direction === "left" ? -300 : 300;
        container.scrollBy({ left: scrollAmount, behavior: "smooth" });
        
        setTimeout(() => {
          checkScrollPosition();
        }, 300);
      }
  };

  const checkScrollPosition = () => {
      const container = scrollRef.current;
      if (container) {
        setShowLeftArrow(container.scrollLeft > 0);
        setShowRightArrow(
          container.scrollLeft < container.scrollWidth - container.clientWidth - 10
        );
      }
  };

  // ✅ Map products to ProductCard format
  const mappedProducts = products.map((product) => ({
    title: product.name,
    img: product.img,
    img2: product.img2, // Hover image
    brand: product.brand,
    price: product.price,
    original: product.originalPrice,
    discount: product.discount,
    rating: { rate: product.rating, count: product.reviews },
    category: product.category || "" // fallback if missing
  }));

  return (
    <div className="mb-10">
      <div className="px-2 mx-auto md:px-4 lg:px-12 xl:px-16">
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold">
            {subtitle && <span className="text-muted-foreground text-sm md:text-base">{subtitle}</span>}
            <p className="font-bold uppercase text-base md:text-xl text-foreground">{title}</p>
          </h2>

          {/* Arrows */}
          <div className="hidden md:flex gap-2">
            {showLeftArrow && (
              <button
                onClick={() => scroll("left")}
                className="w-8 h-8 rounded-full border border-border bg-background hover:bg-accent flex items-center justify-center transition-colors"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            {showRightArrow && (
              <button
                onClick={() => scroll("right")}
                className="w-8 h-8 rounded-full border border-border bg-background hover:bg-accent flex items-center justify-center transition-colors"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Product Scroll Row */}
        <div
          ref={scrollRef}
          onScroll={checkScrollPosition}
          className="flex overflow-x-auto gap-4 md:gap-6 pb-4 scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {mappedProducts.map((product, index) => (
            <div key={index} className="flex-shrink-0 w-[160px] lg:w-[300px]">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopularProductsCarousel;

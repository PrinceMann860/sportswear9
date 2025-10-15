import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Star, Heart } from "lucide-react";

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

  return (
    <div className="mb-10">
      <div className="container px-2 mx-auto md:px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold">
            {subtitle && <span className="text-muted-foreground text-sm md:text-base">{subtitle}</span>}
            <p className="font-bold uppercase text-base md:text-xl text-foreground">{title}</p>
          </h2>
          
          {/* Navigation Arrows for Desktop */}
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

        {/* Products Carousel */}
        <div
          ref={scrollRef}
          onScroll={checkScrollPosition}
          className="flex overflow-x-auto gap-4 md:gap-10 pb-4 scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.map((product, index) => (
            <Link
              key={index}
              to={product.link || "/ProductInfo"}
              className="flex-shrink-0 w-[160px] lg:w-[206px] bg-card border border-border rounded hover:shadow-lg transition-shadow duration-300 block"
            >
              {/* Product Image Container */}
              <div className="relative">
                <img
                  alt={product.name}
                  loading="lazy"
                  src={product.image}
                  className="w-full mix-blend-multiply"
                />
                
                {/* Rating & Wishlist */}
                <div className="absolute bottom-0 right-0 z-10 px-2 mb-2 w-full flex justify-between">
                  {/* Rating */}
                  {product.rating && (
                    <div className="border border-border flex items-center bg-background/85 px-2 py-0.5 rounded">
                      <Star className="w-3 lg:w-4 h-3 lg:h-4 fill-primary text-primary -mt-0.5" />
                      <span className="ml-1 font-normal text-primary text-xs lg:text-sm">
                        {product.rating} | {product.reviews}
                      </span>
                    </div>
                  )}
                  
                  {/* Wishlist */}
                  <button 
                    className="w-7 h-7 bg-background rounded-full cursor-pointer flex items-center justify-center border border-border hover:bg-accent transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      // Add to wishlist logic
                    }}
                  >
                    <Heart className="w-4 h-4 text-primary" />
                  </button>
                </div>

                {/* Product Sticker/Badge */}
                {product.badge && (
                  <div className="absolute top-0 left-0 z-10">
                    <img src={product.badge} className="h-5 w-auto" alt="" />
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="py-4 px-2">
                {/* Brand */}
                <p className="text-sm lg:text-base text-foreground font-semibold py-1">
                  {product.brand}
                </p>
                
                {/* Product Name */}
                <p className="text-xs lg:text-sm text-foreground capitalize whitespace-nowrap overflow-hidden text-ellipsis mt-1">
                  {product.name}
                </p>
                
                {/* Price */}
                <div className="mt-1 text-foreground flex items-center gap-1 text-sm lg:text-base">
                  <p className="font-semibold">{product.price}</p>
                  {product.originalPrice && (
                    <p className="text-xs lg:text-xs line-through text-muted-foreground">
                      {product.originalPrice}
                    </p>
                  )}
                  {product.discount && (
                    <p className="text-xs bg-yellow-400 text-black px-1 rounded">
                      {product.discount}
                    </p>
                  )}
                </div>

                {/* Add to Cart Button */}
                <button 
                  className="flex justify-center items-center text-center p-2 border border-border w-full bg-transparent mt-4 lg:mt-7 cursor-pointer hover:bg-accent transition-colors text-xs lg:text-sm font-medium"
                  onClick={(e) => {
                    e.preventDefault();
                    // Add to cart logic
                  }}
                >
                  ADD TO CART
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopularProductsCarousel;

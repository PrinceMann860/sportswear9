import React, { useRef, useState, useEffect } from "react";
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
  const [cardWidth, setCardWidth] = useState(160); // Default mobile width

  // Calculate card width based on screen size
  useEffect(() => {
    const updateCardWidth = () => {
      if (window.innerWidth < 768) {
        // For mobile: show 2.3 cards (100vw / 2.3) with some padding
        const containerWidth = window.innerWidth - 32; // accounting for padding
        setCardWidth((containerWidth / 2.2) - 16); // 16px for gap
      } else {
        // For larger screens, use fixed width
        setCardWidth(300);
      }
    };

    updateCardWidth();
    window.addEventListener('resize', updateCardWidth);
    return () => window.removeEventListener('resize', updateCardWidth);
  }, []);

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (container) {
      // Scroll by approximately 1 card width + gap
      const scrollAmount = direction === "left" ? -(cardWidth + 16) : cardWidth + 16;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
      
      setTimeout(() => {
        checkScrollPosition();
      }, 300);
    }
  };

  const checkScrollPosition = () => {
    const container = scrollRef.current;
    if (container) {
      setShowLeftArrow(container.scrollLeft > 10);
      setShowRightArrow(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 10
      );
    }
  };

  // ✅ Map products to ProductCard format
  const mappedProducts = products.map((product) => ({
    id: product.id,
    title: product.title,
    img: product.img,
    img2: product.img2, // Hover image
    brand: product.brand,
    price: product.price,
    original: product.original,
    discount: product.discount,
    rating: { rate: product.rating, count: product.reviews },
    category: product.category || "" // fallback if missing
  }));

  return (
    <div className="mb-10">
      <div className="px-4 mx-auto md:px-4 lg:px-12 xl:px-16">
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold">
            {subtitle && <span className="text-muted-foreground text-sm md:text-base">{subtitle}</span>}
            <p className="font-bold uppercase text-base md:text-xl text-foreground">{title}</p>
          </h2>

          {/* Arrows - Show on all screens */}
          <div className="flex gap-2">
            {showLeftArrow && (
              <button
                onClick={() => scroll("left")}
                className="w-8 h-8 rounded-full border border-border bg-background hover:bg-accent flex items-center justify-center transition-colors shadow-sm"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            )}
            {showRightArrow && (
              <button
                onClick={() => scroll("right")}
                className="w-8 h-8 rounded-full border border-border bg-background hover:bg-accent flex items-center justify-center transition-colors shadow-sm"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Product Scroll Row */}
        <div
          ref={scrollRef}
          onScroll={checkScrollPosition}
          className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide scroll-smooth snap-x snap-mandatory"
          style={{ 
            scrollbarWidth: "none", 
            msOverflowStyle: "none",
            scrollPadding: "0 16px"
          }}
        >
          {mappedProducts.map((product, index) => (
            <div 
              key={index} 
              className="flex-shrink-0 snap-start"
              style={{ width: `${cardWidth}px` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Mobile indicator dots */}
        {mappedProducts.length > 0 && window.innerWidth < 768 && (
          <div className="flex justify-center gap-2 mt-4 md:hidden">
            {Array.from({ length: Math.ceil(mappedProducts.length / 2) }).map((_, index) => (
              <div
                key={index}
                className="w-2 h-2 rounded-full bg-gray-300 transition-colors"
              />
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        /* Snap scrolling for better mobile experience */
        .snap-x {
          scroll-snap-type: x mandatory;
        }
        
        .snap-start {
          scroll-snap-align: start;
        }
      `}</style>
    </div>
  );
};

export default PopularProductsCarousel;
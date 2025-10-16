import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductCard } from "../Product/Product"; // ✅ Update path if needed

const ProductCarouselWithTitle = ({ 
  title = "The perfect product is waiting",
  subtitle = "Pick yours now!",
  products = [],
  className = ""
}) => {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkScroll, 100);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [products]);

  return (
    <div className={`w-full mx-auto mb-6 sm:mb-8 md:mb-12 px-2 sm:px-4 md:px-6 xl:px-8 ${className}`}>
      <div className="flex flex-col lg:flex-row lg:items-start mb-4 sm:mb-6 md:mb-8">

        {/* Title Section */}
        <div className="relative w-full lg:w-1/5 mb-4 lg:mb-0 lg:pr-6 text-center">
          <h2 className="relative z-10">
            <p className="text-gray-500 font-semibold text-xs sm:text-sm md:text-base leading-tight">
              {title}
            </p>
            <p className="font-bold uppercase text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-900 leading-tight">
              {subtitle}
            </p>
          </h2>

          {/* Background Vertical Text */}
          <div 
            className="absolute inset-y-0 right-0 hidden lg:flex rotate-180 opacity-10 pointer-events-none"
            style={{ writingMode: 'vertical-rl' }}
          >
            <p className="font-semibold uppercase text-3xl">{title}</p>
            <p className="text-4xl font-semibold uppercase">{subtitle}</p>
          </div>
        </div>

        {/* Product Carousel */}
        <div className="relative flex-1">

          {/* Scroll Buttons */}
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={`hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 w-10 h-10 lg:w-12 lg:h-12 bg-white rounded-full shadow-lg items-center justify-center transition-all duration-300 ${
              canScrollLeft 
                ? 'opacity-0 group-hover:opacity-100 hover:bg-primary hover:text-white' 
                : 'opacity-0 pointer-events-none'
            }`}
          >
            <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6" />
          </button>

          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={`hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 w-10 h-10 lg:w-12 lg:h-12 bg-white rounded-full shadow-lg items-center justify-center transition-all duration-300 ${
              canScrollRight 
                ? 'opacity-0 group-hover:opacity-100 hover:bg-primary hover:text-white' 
                : 'opacity-0 pointer-events-none'
            }`}
          >
            <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6" />
          </button>

          {/* Scroll Container */}
          <div 
            ref={scrollContainerRef}
            onScroll={checkScroll}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3"
            style={{ 
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {products.map((product, index) => (
              <ProductCard key={product.id || index} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCarouselWithTitle;

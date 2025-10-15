import React, { useState } from 'react';
import { Star, Heart, ChevronLeft, ChevronRight } from 'lucide-react';

const ProductCard = ({ product }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <div className="flex-shrink-0 w-[180px] sm:w-[220px] md:w-[260px] lg:w-[300px] mr-2 sm:mr-3 md:mr-4">
      <div className="bg-white rounded-lg overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300">
        {/* Product Image Section */}
        <div className="relative">
          {/* Badge */}
          {product.badge && (
            <div className="absolute top-0 left-0 z-10">
              <img 
                src={product.badge} 
                alt={product.badgeAlt || "badge"} 
                className="h-4 sm:h-5 w-auto"
              />
            </div>
          )}

          {/* Main Image */}
          <a href={product.link || "#"} className="block">
            <div className="relative bg-gray-50 aspect-square">
              <img
                src={product.images?.[currentImageIndex] || product.image}
                alt={product.name}
                className="w-full h-full object-cover mix-blend-multiply hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>

            {/* Rating & Wishlist Overlay */}
            <div className="absolute bottom-0 right-0 left-0 px-2 mb-2 flex justify-between items-center">
              {/* Rating */}
              {product.rating && (
                <div className="px-2 py-0.5 flex items-center bg-white/85 backdrop-blur-sm border border-gray-200 rounded">
                  <Star className="w-3 h-3 lg:w-4 lg:h-4 fill-current text-secondary" />
                  <span className="ml-1 text-[10px] sm:text-xs lg:text-sm font-medium text-primary">
                    {product.rating}
                  </span>
                </div>
              )}

              {/* Wishlist Button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setIsWishlisted(!isWishlisted);
                }}
                className="w-6 h-6 sm:w-7 sm:h-7 bg-white rounded-full flex items-center justify-center border border-gray-300 hover:border-primary hover:bg-primary/5 transition-all duration-300"
              >
                <Heart 
                  className={`w-3 h-3 sm:w-4 sm:h-4 transition-all duration-300 ${
                    isWishlisted ? 'fill-red-500 text-red-500' : 'text-primary'
                  }`}
                />
              </button>
            </div>
          </a>

          {/* Thumbnail Images */}
          {product.images && product.images.length > 1 && (
            <div className="w-full mt-1 px-2">
              <div className="flex gap-1 sm:gap-2 overflow-x-auto scrollbar-hide">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded overflow-hidden border-2 transition-all ${
                      currentImageIndex === idx 
                        ? 'border-primary' 
                        : 'border-gray-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Product Info Section */}
        <div className="p-2 sm:p-3 md:p-4 border-t border-gray-100">
          {/* Brand */}
          {product.brand && (
            <div className="font-semibold text-text text-xs sm:text-sm md:text-base mb-1">
              {product.brand}
            </div>
          )}

          {/* Product Name */}
          <a href={product.link || "#"} className="block">
            <p className="text-[10px] sm:text-xs md:text-sm text-text-secondary capitalize line-clamp-2 hover:text-primary transition-colors duration-300 mb-2">
              {product.name}
            </p>

            {/* Pricing */}
            <div className="flex items-center flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
              <span className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-text">
                {product.price}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-[9px] sm:text-[10px] md:text-xs text-gray-500 line-through">
                    {product.originalPrice}
                  </span>
                  {product.discount && (
                    <span className="px-1 sm:px-1.5 py-0.5 bg-secondary text-text text-[9px] sm:text-[10px] md:text-xs font-medium rounded">
                      {product.discount}
                    </span>
                  )}
                </>
              )}
            </div>
          </a>

          {/* Add to Cart Button */}
          <button 
            className="w-full py-1.5 sm:py-2 md:py-2.5 border border-primary text-primary hover:bg-primary hover:text-text-light text-[10px] sm:text-xs md:text-sm font-medium rounded transition-all duration-300"
            aria-label="Add to cart"
          >
            ADD TO CART
          </button>
        </div>
      </div>
    </div>
  );
};

const ProductCarouselWithTitle = ({ 
  title = "The perfect product is waiting",
  subtitle = "Pick yours now!",
  products = [],
  className = ""
}) => {
  const scrollContainerRef = React.useRef(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);

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

  React.useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [products]);

  return (
    <div className={`container mx-auto mb-6 sm:mb-8 md:mb-12 px-2 sm:px-4 md:px-6 xl:px-0 ${className}`}>
      <div className="flex flex-wrap mb-4 sm:mb-6 md:mb-8">
        {/* Title Section - Left Side */}
        <div className="relative w-full lg:w-1/6 lg:flex lg:items-center mb-4 lg:mb-0">
          <h2 className="relative z-10 px-2">
            <p className="text-text-secondary lg:text-text-secondary font-semibold text-xs sm:text-sm md:text-base leading-tight">
              {title}
            </p>
            <p className="font-bold leading-tight uppercase text-lg sm:text-xl md:text-2xl lg:text-3xl text-text">
              {subtitle}
            </p>
          </h2>
          
          {/* Vertical Text - Desktop Only */}
          <div 
            className="absolute right-0 hidden lg:block rotate-180 opacity-5"
            style={{ writingMode: 'vertical-rl' }}
          >
            <p className="font-semibold uppercase text-2xl md:text-3xl lg:text-4xl">
              {title}
            </p>
            <p className="text-3xl md:text-4xl lg:text-5xl font-semibold uppercase">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Products Carousel - Right Side */}
        <div className="w-full lg:w-5/6 relative group">
          {/* Scroll Buttons - Hidden on Mobile, Visible on Desktop */}
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={`hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 w-10 h-10 lg:w-12 lg:h-12 bg-white rounded-full shadow-lg items-center justify-center transition-all duration-300 ${
              canScrollLeft 
                ? 'opacity-0 group-hover:opacity-100 hover:bg-primary hover:text-text-light' 
                : 'opacity-0 pointer-events-none'
            }`}
            aria-label="Previous products"
          >
            <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6" />
          </button>

          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={`hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 w-10 h-10 lg:w-12 lg:h-12 bg-white rounded-full shadow-lg items-center justify-center transition-all duration-300 ${
              canScrollRight 
                ? 'opacity-0 group-hover:opacity-100 hover:bg-primary hover:text-text-light' 
                : 'opacity-0 pointer-events-none'
            }`}
            aria-label="Next products"
          >
            <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6" />
          </button>

          {/* Products Container */}
          <div 
            ref={scrollContainerRef}
            onScroll={checkScroll}
            className="flex overflow-x-auto scrollbar-hide pb-2"
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

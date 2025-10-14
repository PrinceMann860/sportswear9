import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import AnimatedSection from './AnimatedSection';

const RecommendedProducts = () => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const products = [
    {
      id: 1,
      brand: "MAISON FRANCIS KURKDJIAN",
      name: "Baccarat Rouge 540 edp spray 70ml",
      price: "£255.00",
      badge: "Bestseller",
      image: "https://images.selfridges.com/is/image/selfridges/496-83022651-MFK1022302_M?defaultimage=image-not-found-selfridges&fmt=webp&dpr=on%2C2",
      imageAlt: "https://images.selfridges.com/is/image/selfridges/496-83022651-MFK1022302_ALT01?defaultimage=496-83022651-mfk1022302_m&fmt=webp&dpr=on%2C2"
    },
    {
      id: 2,
      brand: "CREED",
      name: "Aventus eau de parfum",
      price: "£220.00",
      badge: "Bestseller",
      image: "https://images.selfridges.com/is/image/selfridges/365-83022651-AVENTUS_M?defaultimage=image-not-found-selfridges&fmt=webp&dpr=on%2C2",
      imageAlt: "https://images.selfridges.com/is/image/selfridges/365-83022651-AVENTUS_ALT01?defaultimage=365-83022651-aventus_m&fmt=webp&dpr=on%2C2"
    },
    {
      id: 3,
      brand: "VICTORIA BECKHAM BEAUTY",
      name: "Satin Kajal Liner 1.1g",
      price: "£32.00",
      image: "https://images.selfridges.com/is/image/selfridges/R04225647_BLACK_M?defaultimage=image-not-found-selfridges&fmt=webp&dpr=on%2C2",
      imageAlt: "https://images.selfridges.com/is/image/selfridges/R04225647_BLACK_ALT01?defaultimage=r04225647_black_m&fmt=webp&dpr=on%2C2"
    },
    {
      id: 4,
      brand: "VIVIENNE WESTWOOD JEWELLERY",
      name: "Mini Bas Relief brass and cubic zirconia pendant necklace",
      price: "£105.00",
      badge: "Bestseller",
      image: "https://images.selfridges.com/is/image/selfridges/R03834594_PLATINUMCRYSTAL_M?defaultimage=image-not-found-selfridges&fmt=webp&dpr=on%2C2",
      imageAlt: "https://images.selfridges.com/is/image/selfridges/R03834594_PLATINUMCRYSTAL_ALT01?defaultimage=r03834594_platinumcrystal_m&fmt=webp&dpr=on%2C2"
    },
    {
      id: 5,
      brand: "VEUVE CLICQUOT",
      name: "City Arrow limited-edition Brut NV champagne with personalised tin 750ml",
      price: "£74.99",
      badge: "Personalise me",
      image: "https://images.selfridges.com/is/image/selfridges/R04168618_M?defaultimage=image-not-found-selfridges&fmt=webp&dpr=on%2C2",
      imageAlt: "https://images.selfridges.com/is/image/selfridges/R04168618_ALT01?defaultimage=r04168618_m&fmt=webp&dpr=on%2C2"
    },
    {
      id: 6,
      brand: "DIOR",
      name: "DIOR Addict Lip Glow Oil 6ml",
      price: "£33.00",
      image: "https://images.selfridges.com/is/image/selfridges/R00076248_001_M?defaultimage=image-not-found-selfridges&fmt=webp&dpr=on%2C2",
      imageAlt: "https://images.selfridges.com/is/image/selfridges/R00076248_001_ALT01?defaultimage=r00076248_001_m&fmt=webp&dpr=on%2C2"
    },
    {
      id: 7,
      brand: "COMME DES GARCONS",
      name: "Comme des Garçons PLAY x Converse canvas high-top trainers",
      price: "£140.00",
      badge: "Bestseller",
      image: "https://images.selfridges.com/is/image/selfridges/R03759080_BLACK_M?defaultimage=image-not-found-selfridges&fmt=webp&dpr=on%2C2",
      imageAlt: "https://images.selfridges.com/is/image/selfridges/R03759080_BLACK_ALT01?defaultimage=r03759080_black_m&fmt=webp&dpr=on%2C2"
    },
    {
      id: 8,
      brand: "DIOR",
      name: "Sauvage eau de parfum",
      price: "£87.00",
      badge: "Bestseller",
      image: "https://images.selfridges.com/is/image/selfridges/360-84011246-F078524009_M?defaultimage=image-not-found-selfridges&fmt=webp&dpr=on%2C2",
      imageAlt: "https://images.selfridges.com/is/image/selfridges/360-84011246-F078524009_ALT01?defaultimage=360-84011246-f078524009_m&fmt=webp&dpr=on%2C2"
    }
  ];

  const checkScrollPosition = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkScrollPosition, 300);
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <AnimatedSection>
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Recommended for you
          </h3>
        </AnimatedSection>

        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center transition-all ${
              canScrollLeft ? 'opacity-100 hover:bg-gray-100' : 'opacity-50 cursor-not-allowed'
            }`}
            aria-label="previous-button"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Products Scroll Container */}
          <div
            ref={scrollRef}
            onScroll={checkScrollPosition}
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            aria-label="slider"
          >
            {products.map((product, index) => (
              <div
                key={product.id}
                className="flex-shrink-0 w-[160px] sm:w-[180px] md:w-[220px] lg:w-[250px] group"
              >
                <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                  {/* Images Container */}
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:opacity-0 transition-opacity duration-300"
                    />
                    <img
                      src={product.imageAlt}
                      alt={product.name}
                      className="w-full h-full object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />
                    {product.badge && (
                      <span className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded">
                        {product.badge}
                      </span>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-3">
                    <h2 className="text-xs font-semibold text-gray-900 uppercase mb-1 truncate">
                      {product.brand}
                    </h2>
                    <h3 className="text-sm text-gray-700 line-clamp-2 mb-2 min-h-[2.5rem]">
                      {product.name}
                    </h3>
                    <p className="text-base font-bold text-gray-900">
                      {product.price}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center transition-all ${
              canScrollRight ? 'opacity-100 hover:bg-gray-100' : 'opacity-50 cursor-not-allowed'
            }`}
            aria-label="next-button"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default RecommendedProducts;

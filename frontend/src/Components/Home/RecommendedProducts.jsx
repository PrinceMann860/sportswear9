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
    brand: "NIKE",
    name: "Nike Air Zoom Pegasus 40 Running Shoes",
    price: "₹7999.00",
    badge: "Bestseller",
    image: "data:image/jpeg;base64,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",
    imageAlt: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRY1AqqKKMmqxUtCyZqOCnvkHOR7e79RWhOMg&s"
  },
  {
    id: 2,
    brand: "ADIDAS",
    name: "Adidas Essentials 3-Stripes Training T-Shirt",
    price: "₹1999.00",
    badge: "Trending",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxT4CafOugzF4saFXKHoa__z9wT2xc1cR5tg&s",
    imageAlt: "https://5.imimg.com/data5/OB/FW/UZ/SELLER-45023883/20-500x500.jpg"
  },
  {
    id: 3,
    brand: "PUMA",
    name: "Puma Training Bag",
    price: "₹2499.00",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3P7ZvnImb5UYzhnBE_Kt2f6dHQa4a4sNUeA&s",
    imageAlt: "https://images.puma.com/image/upload/f_auto,q_auto,w_600/global/079527/01/bv/fmt/png"
  },
  {
    id: 4,
    brand: "UNDER ARMOUR",
    name: "UA HeatGear Compression Leggings",
    price: "₹3499.00",
    badge: "Bestseller",
    image: "https://underarmour.scene7.com/is/image/Underarmour/V5-6003983-004_FC?rp=standard-0pad|gridTileDesktop&scl=1&fmt=jpg&qlt=50&resMode=sharp2&cache=on,on&bgc=F0F0F0&wid=512&hei=640&size=512,640",
    imageAlt: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTao4xN6NKvgBcx-1FW6nvOA3ZGTURYKqJ_wi_88ACXMJ02sJNFlwoAIUkQ_-fYODxNSDM&usqp=CAU"
  },
  {
    id: 5,
    brand: "DECATHLON",
    name: "Domyos Adjustable Dumbbell Set 10kg",
    price: "₹4999.00",
    badge: "Popular",
    image: "https://contents.mediadecathlon.com/p2555562/921e3feb8e104ccdcb3803b9d91cb403/p2555562.jpg",
    imageAlt: "https://www.lifelinefitness.com/cdn/shop/files/f0042ds_1.jpg?v=1732652746"
  },
  {
    id: 6,
    brand: "HRX BY HRITHIK ROSHAN",
    name: "Men's Training Joggers",
    price: "₹1599.00",
    badge: "Bestseller",
    image: "https://images-na.ssl-images-amazon.com/images/I/41TsU7eV4%2BL.jpg",
    imageAlt: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpx4-sN1_zO0AVok-_Y-XZAVrUvMXd4CSLQDtSGk-Ld11P1c9t3XpVsroICmFjKRtd5Dw&usqp=CAU"
  },
  {
    id: 7,
    brand: "REEBOK",
    name: "Reebok Yoga Mat 6mm",
    price: "₹1899.00",
    badge: "Trending",
    image: "data:image/jpeg;base64,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",
    imageAlt: "data:image/jpeg;base64,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"
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
            className={`hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg items-center justify-center transition-all ${
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
            className={`hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg items-center justify-center transition-all ${
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

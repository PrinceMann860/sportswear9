import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SportsGearCarousel = ({ title = "Unite & Play: Shop Sports Gear", items = [] }) => {
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (container) {
      const scrollAmount = direction === "left" ? -300 : 300;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
      setTimeout(checkScrollPosition, 300);
    }
  };

  const checkScrollPosition = () => {
    const container = scrollRef.current;
    setShowLeftArrow(container.scrollLeft > 0);
    setShowRightArrow(container.scrollLeft < container.scrollWidth - container.clientWidth - 10);
  };

  return (
    <div className="my-8">
      <div className="mx-auto px-2 sm:px-4 md:px-6 lg:px-12 xl:px-14">
        <div className="flex flex-wrap">
          <div className="w-full px-4 mb-4">
            <h2 className="font-semibold text-base sm:text-lg md:text-xl">
              {title}
            </h2>
          </div>
          <div className="w-full px-4 relative">

            {/* Left Arrow */}
            {showLeftArrow && (
              <button
                onClick={() => scroll("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-md hidden md:block"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Right Arrow */}
            {showRightArrow && (
              <button
                onClick={() => scroll("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-md hidden md:block"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}

            {/* Carousel */}
            <div
              ref={scrollRef}
              onScroll={checkScrollPosition}
              className="flex overflow-x-auto gap-3 md:gap-4 pb-4 scrollbar-hide scroll-smooth"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {items.map((item, index) => (
                <Link
                  key={index}
                  to={item.link || "#"}
                  className="flex-shrink-0 w-[160px] sm:w-[200px] md:w-[256px] lg:w-[280px]"
                >
                  <div className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300">
                    
                    {/* Fixed Aspect Ratio Image Wrapper */}
                    <div className="aspect-square w-full overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>

                    {/* Optional Label */}
                    <div className="p-2 text-center">
                      <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                    </div>

                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SportsGearCarousel;

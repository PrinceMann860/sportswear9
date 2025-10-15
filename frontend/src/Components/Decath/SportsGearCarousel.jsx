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
    <div className="my-8">
      <div className="container mx-auto px-2 md:px-4">
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
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background p-2 rounded-full shadow-lg hidden md:block"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Right Arrow */}
            {showRightArrow && (
              <button
                onClick={() => scroll("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background p-2 rounded-full shadow-lg hidden md:block"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}

            {/* Carousel Container */}
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
                  className="flex-shrink-0 w-[160px] sm:w-[200px] md:w-[256px] lg:w-[320px]"
                >
                  <div className="relative flex flex-col break-words bg-background border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    <img
                      alt={item.name}
                      loading="lazy"
                      src={item.image}
                      className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
                    />
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

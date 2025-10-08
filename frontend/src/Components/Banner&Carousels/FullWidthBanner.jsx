import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const FullWidthBanner = ({ banners }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef(null);
  const intervalRef = useRef(null);

  // Function to scroll to a given index smoothly
  const scrollToIndex = (index) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const width = container.clientWidth;

    // Temporarily disable snapping to prevent it from bouncing back
    container.style.scrollSnapType = "none";
    container.scrollTo({ left: width * index, behavior: "smooth" });

    // Re-enable snapping after animation finishes
    setTimeout(() => {
      container.style.scrollSnapType = "x mandatory";
    }, 600);
  };

  // Auto slide every 5s
  useEffect(() => {
    if (banners.length <= 1) return;
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % banners.length;
        scrollToIndex(next);
        return next;
      });
    }, 5000);

    return () => clearInterval(intervalRef.current);
  }, [banners.length]);

  const nextSlide = () => {
    const next = (currentIndex + 1) % banners.length;
    setCurrentIndex(next);
    scrollToIndex(next);
  };

  const prevSlide = () => {
    const prev = (currentIndex - 1 + banners.length) % banners.length;
    setCurrentIndex(prev);
    scrollToIndex(prev);
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto sm:px-4 group">
      {/* Banner container */}
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory"
        style={{
          scrollBehavior: "smooth",
          WebkitOverflowScrolling: "touch",
        }}
        onScroll={() => {
          const container = scrollContainerRef.current;
          if (!container) return;
          const width = container.clientWidth;
          const index = Math.round(container.scrollLeft / width);
          setCurrentIndex(index);
        }}
      >
        {banners.map((banner, index) => (
          <div
            key={banner.id || index}
            className="flex-shrink-0 w-full snap-start cursor-pointer border border-gray-200 shadow-md"
          >
            <div
              className="w-full relative overflow-hidden"
              style={{
                aspectRatio: "980/500",
                backgroundColor: banner.bgColor || "#f8f3ed",
              }}
            >
              <picture className="w-full h-full">
                <source
                  type="image/webp"
                  srcSet={banner.imageWebp || banner.image}
                />
                <img
                  src={banner.image}
                  alt={banner.alt || ""}
                  loading="lazy"
                  className="w-full h-full object-cover"
                  draggable="false"
                />
              </picture>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination dots */}
      {banners.length > 1 && (
        <div className="flex justify-center items-center mt-3 gap-1.5">
          {banners.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentIndex === index
                  ? "w-5 bg-gray-700"
                  : "w-1.5 bg-gray-300"
              }`}
            />
          ))}
        </div>
      )}

      {/* Prev / Next buttons (minimal, only on hover) */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="hidden group-hover:flex items-center justify-center absolute top-1/2 left-6 -translate-y-1/2  text-white rounded-full bg-black/30 p-2 transition-opacity"
          >
            <ChevronLeft size={40} />
          </button>
          <button
            onClick={nextSlide}
            className="hidden group-hover:flex items-center justify-center absolute top-1/2 right-6 -translate-y-1/2 text-white rounded-full bg-black/30 p-2 transition-opacity"
          >
            <ChevronRight size={40} />
          </button>
        </>
      )}
    </div>
  );
};

export default FullWidthBanner;

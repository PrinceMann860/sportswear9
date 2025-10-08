import { useRef, useState } from 'react';

const HorizontalScrollCarousel = ({ items, itemWidth = 91, itemHeight = 182, gap = 12 }) => {
  const scrollContainerRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollLeft = scrollContainerRef.current.scrollLeft;
      const maxScroll = scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth;
      const scrollPercentage = (scrollLeft / maxScroll) * 100;
      setScrollPosition(scrollPercentage);
    }
  };

  return (
    <div className="relative w-full">
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory"
        style={{
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <div className="flex gap-3 px-4">
          {items.map((item, index) => (
            <div
              key={item.id || index}
              className="flex-shrink-0 snap-start rounded-xl overflow-hidden cursor-pointer transition-transform active:scale-95"
              style={{
                width: `${itemWidth}px`,
                height: `${itemHeight}px`
              }}
            >
              <div
                className="w-full h-full relative"
                style={{ backgroundColor: item.bgColor || '#f5f5f5' }}
              >
                <picture className="w-full h-full">
                  <source type="image/webp" srcSet={item.imageWebp || item.image} />
                  <img
                    src={item.image}
                    alt={item.alt || ''}
                    loading="lazy"
                    className="w-full h-full object-cover"
                    draggable="false"
                  />
                </picture>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center items-center mt-3 gap-1">
        {Array.from({ length: Math.ceil(items.length / 3) }).map((_, index) => (
          <div
            key={index}
            className={`h-1 rounded-full transition-all duration-300 ${
              scrollPosition >= (index * 33.33) && scrollPosition < ((index + 1) * 33.33)
                ? 'w-4 bg-blue-400'
                : 'w-1 bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HorizontalScrollCarousel;

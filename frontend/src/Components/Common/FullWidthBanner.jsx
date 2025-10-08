import { useState, useRef } from 'react';

const FullWidthBanner = ({ banners }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef(null);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollLeft = scrollContainerRef.current.scrollLeft;
      const itemWidth = scrollContainerRef.current.clientWidth;
      const index = Math.round(scrollLeft / itemWidth);
      setCurrentIndex(index);
    }
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto px-2 sm:px-4">
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory rounded-lg"
        style={{
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {banners.map((banner, index) => (
          <div
            key={banner.id || index}
            className="flex-shrink-0 w-full snap-start cursor-pointer"
          >
            <div
              className="w-full relative rounded-lg overflow-hidden"
              style={{
                aspectRatio: '980/500',
                backgroundColor: banner.bgColor || '#f8f3ed'
              }}
            >
              <picture className="w-full h-full">
                <source type="image/webp" srcSet={banner.imageWebp || banner.image} />
                <img
                  src={banner.image}
                  alt={banner.alt || ''}
                  loading="lazy"
                  className="w-full h-full object-cover"
                  draggable="false"
                />
              </picture>
            </div>
          </div>
        ))}
      </div>

      {banners.length > 1 && (
        <div className="flex justify-center items-center mt-3 gap-1.5">
          {banners.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentIndex === index
                  ? 'w-5 bg-gray-700'
                  : 'w-1.5 bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FullWidthBanner;

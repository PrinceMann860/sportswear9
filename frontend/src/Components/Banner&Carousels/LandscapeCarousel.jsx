import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ANIMATION_DURATION_MS = 600;
const AUTO_SLIDE_INTERVAL = 5000;

const LandscapeCarousel = ({ items = [] }) => {
  const [slideState, setSlideState] = useState({
    index: 0,
    prevIndex: -1,
    direction: 'next',
  });
  const isAnimating = useRef(false);

  const Maps = (newIndex, direction) => {
    if (isAnimating.current || items.length <= 1) return;
    isAnimating.current = true;

    setSlideState({
      index: newIndex,
      prevIndex: slideState.index,
      direction,
    });
  };

  const nextSlide = () => {
    const newIndex = (slideState.index + 1) % items.length;
    Maps(newIndex, 'next');
  };

  const prevSlide = () => {
    const newIndex = (slideState.index - 1 + items.length) % items.length;
    Maps(newIndex, 'prev');
  };

  const goToSlide = (index) => {
    const direction = index > slideState.index ? 'next' : 'prev';
    Maps(index, direction);
  };

  useEffect(() => {
    if (slideState.prevIndex !== -1) {
      const timer = setTimeout(() => {
        setSlideState((s) => ({ ...s, prevIndex: -1 }));
        isAnimating.current = false;
      }, ANIMATION_DURATION_MS);
      return () => clearTimeout(timer);
    }
  }, [slideState.index, slideState.prevIndex]);

  useEffect(() => {
    if (items.length <= 1) return;
    const interval = setInterval(nextSlide, AUTO_SLIDE_INTERVAL);
    return () => clearInterval(interval);
  }, [slideState.index, items.length]);

  const getSlideClasses = (itemIndex) => {
    const baseClasses = 'carousel-slide absolute inset-0 w-full h-full';

    if (itemIndex === slideState.index) {
      return `${baseClasses} ${
        slideState.direction === 'next' ? 'slide-in-right' : 'slide-in-left'
      }`;
    }

    if (itemIndex === slideState.prevIndex) {
      return `${baseClasses} ${
        slideState.direction === 'next' ? 'slide-out-left' : 'slide-out-right'
      }`;
    }

    return `${baseClasses} opacity-0 invisible pointer-events-none`;
  };

  if (!items || items.length === 0) {
    return (
      <div className="w-full h-[200px] md:h-[350px] lg:h-[500px] flex items-center justify-center bg-gray-100 rounded-xl">
        <p className="text-gray-500 text-sm md:text-base">No banners to display</p>
      </div>
    );
  }

  return (
    <div className="relative w-full group">
      <div className="relative w-full overflow-hidden rounded-xl md:rounded-2xl shadow-2xl">
        <div
          className="relative w-full bg-gray-900"
          style={{ aspectRatio: '21/9' }}
        >
          {items.map((item, index) => (
            <div key={item.id || index} className={getSlideClasses(index)}>
              <div className="relative w-full h-full">
                <img
                  src={item.image}
                  alt={item.alt || item.title || `Banner ${index + 1}`}
                  className="w-full h-full object-cover"
                  draggable="false"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                {(item.title || item.subtitle) && (
                  <div className="absolute inset-0 flex items-center justify-center text-center px-4 md:px-8 lg:px-12">
                    <div className="max-w-4xl animate-fade-in">
                      {item.title && (
                        <h2 className="text-white text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight drop-shadow-2xl mb-2 md:mb-4">
                          {item.title}
                        </h2>
                      )}
                      {item.subtitle && (
                        <p className="text-white/95 text-sm sm:text-base md:text-xl lg:text-2xl xl:text-3xl font-medium drop-shadow-xl">
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {items.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            disabled={isAnimating.current}
            className="absolute top-1/2 left-2 md:left-4 lg:left-6 -translate-y-1/2 z-10
                       opacity-0 group-hover:opacity-100
                       bg-white/90 hover:bg-white text-gray-900
                       rounded-full shadow-xl hover:shadow-2xl
                       p-2 md:p-3 lg:p-4 transition-all duration-300
                       disabled:opacity-50 disabled:cursor-not-allowed
                       backdrop-blur-sm"
            aria-label="Previous banner"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8" />
          </button>
          <button
            onClick={nextSlide}
            disabled={isAnimating.current}
            className="absolute top-1/2 right-2 md:right-4 lg:right-6 -translate-y-1/2 z-10
                       opacity-0 group-hover:opacity-100
                       bg-white/90 hover:bg-white text-gray-900
                       rounded-full shadow-xl hover:shadow-2xl
                       p-2 md:p-3 lg:p-4 transition-all duration-300
                       disabled:opacity-50 disabled:cursor-not-allowed
                       backdrop-blur-sm"
            aria-label="Next banner"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8" />
          </button>

          <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex justify-center items-center gap-2 md:gap-3 z-10">
            {items.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                disabled={isAnimating.current}
                className={`h-2 md:h-2.5 rounded-full transition-all duration-300 ${
                  slideState.index === index
                    ? 'w-10 md:w-12 bg-white shadow-lg'
                    : 'w-2 md:w-2.5 bg-white/60 hover:bg-white/80'
                }`}
                aria-label={`Go to banner ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}

      <style>{`
        .carousel-slide {
          transition: transform ${ANIMATION_DURATION_MS}ms cubic-bezier(0.4, 0, 0.2, 1),
                      opacity ${ANIMATION_DURATION_MS}ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .slide-in-right {
          animation: slideInRight ${ANIMATION_DURATION_MS}ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .slide-in-left {
          animation: slideInLeft ${ANIMATION_DURATION_MS}ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .slide-out-left {
          animation: slideOutLeft ${ANIMATION_DURATION_MS}ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .slide-out-right {
          animation: slideOutRight ${ANIMATION_DURATION_MS}ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        @keyframes slideInRight {
          0% {
            transform: translateX(100%) scale(0.95);
            opacity: 0;
          }
          100% {
            transform: translateX(0) scale(1);
            opacity: 1;
          }
        }

        @keyframes slideInLeft {
          0% {
            transform: translateX(-100%) scale(0.95);
            opacity: 0;
          }
          100% {
            transform: translateX(0) scale(1);
            opacity: 1;
          }
        }

        @keyframes slideOutLeft {
          0% {
            transform: translateX(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateX(-100%) scale(0.95);
            opacity: 0;
          }
        }

        @keyframes slideOutRight {
          0% {
            transform: translateX(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateX(100%) scale(0.95);
            opacity: 0;
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .carousel-slide img {
            image-rendering: -webkit-optimize-contrast;
          }
        }
      `}</style>
    </div>
  );
};

export default LandscapeCarousel;

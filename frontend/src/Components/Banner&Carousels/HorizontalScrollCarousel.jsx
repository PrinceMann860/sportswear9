import React, { useEffect, useRef, useState } from "react";

const HorizontalScrollCarousel = ({ items = [] }) => {
  const containerRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const resumeTimer = useRef(null);

  const loopedItems = [...items, ...items]; // duplicate for infinite loop

  // 🧠 Detect manual scroll or touch interaction
  const handleUserInteractionStart = () => {
    if (isUserInteracting) return;
    setIsUserInteracting(true);
    setPaused(true);
    clearTimeout(resumeTimer.current);
  };

  const handleUserInteractionEnd = () => {
    clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => {
      setIsUserInteracting(false);
      setPaused(false);
    }, 4000); // resume after 4s idle
  };

  // 🧹 Cleanup
  useEffect(() => {
    return () => clearTimeout(resumeTimer.current);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-x-auto no-scrollbar"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleUserInteractionStart}
      onTouchEnd={handleUserInteractionEnd}
      onMouseDown={handleUserInteractionStart}
      onMouseUp={handleUserInteractionEnd}
      onScroll={handleUserInteractionStart}
    >
      <div
        className="flex w-max whitespace-nowrap"
        style={{
          animation: `scroll 30s linear infinite`,
          animationPlayState: paused ? "paused" : "running",
        }}
      >
        {loopedItems.map((item, i) => (
          <div
            key={i}
            className="flex flex-col items-center text-center flex-shrink-0 w-[160px] lg:w-[220px] mx-3"
          >
            <div className="w-full h-[220px] lg:h-[300px] rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
              <img
                src={item.image || item.img}
                alt={item.title || ""}
                className="w-full h-full object-cover select-none pointer-events-none"
                draggable="false"
              />
            </div>
            <p className="mt-3 text-sm lg:text-base text-black font-bold underline decoration-2">
              {item.title}
            </p>
          </div>
        ))}
      </div>

      {/* Smooth infinite scroll animation */}
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default HorizontalScrollCarousel;

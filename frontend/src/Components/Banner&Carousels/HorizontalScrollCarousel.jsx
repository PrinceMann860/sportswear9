import React, { useState } from "react";

const HorizontalScrollCarousel = ({ items = [] }) => {
  const [paused, setPaused] = useState(false);
  const loopedItems = [...items, ...items]; // duplicate for smooth infinite effect

  return (
    <div
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
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
                className="w-full h-full object-cover"
                draggable="false"
              />
            </div>
            <p className="mt-3 text-sm lg:text-base text-black font-bold underline decoration-2">
              {item.title}
            </p>
          </div>
        ))}
      </div>

      {/* Inline keyframes for scroll animation */}
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default HorizontalScrollCarousel;

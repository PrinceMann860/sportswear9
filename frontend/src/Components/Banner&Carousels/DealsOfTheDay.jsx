import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PromotionCard = ({ image, deal, look, logo }) => {
    return (
        <div className="relative w-[260px] sm:w-[280px] md:w-[300px] lg:w-[320px] flex-shrink-0 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 bg-white">

            {/* Full Image */}
            <div className="relative h-[380px] sm:h-[420px] md:h-[450px] overflow-hidden">
                <img
                    src={image}
                    alt={deal}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />

                {/* Inner Dashed Frame Overlay */}
                <div className="pointer-events-none absolute inset-3 border-4 border-dashed text-white">
                    
                </div>

                {/* Offer Text Overlay */}
                <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-center">
                    <p className="text-white font-bold text-xl sm:text-2xl md:text-3xl drop-shadow-lg uppercase">
                        {deal}
                    </p>
                    <p className="text-white text-sm sm:text-base drop-shadow-md mt-1">
                        {look}
                    </p>
                </div>

                {/* Logo Strip */}
                <div className="absolute bottom-0 w-full bg-white py-2 flex items-center justify-center">
                    {logo && <img src={logo} alt="Brand Logo" className="h-8 object-contain" />}
                </div>
            </div>
        </div>
    );
};

const DealsOfTheDay = ({ title, items }) => {
    const scrollRef = useRef(null);

    const scrollBy = (amount) => {
        if (scrollRef.current) {
            const scrollDistance = scrollRef.current.clientWidth * amount;
            scrollRef.current.scrollBy({ left: scrollDistance, behavior: "smooth" });
        }
    };

    return (
        <div className="mt-8 relative mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-4">
                {title}
            </h2>

            <div className="relative">
                {/* Left Scroll */}
                <button
                    onClick={() => scrollBy(-0.8)}
                    className="absolute -left-2 sm:-left-4 md:-left-6 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 sm:p-3 rounded-full shadow-lg hidden sm:flex hover:scale-105 border border-gray-200 transition-all z-40"
                >
                    <ChevronLeft className="text-gray-700 w-6 h-6" />
                </button>

                {/* Cards Row */}
                <div
                    ref={scrollRef}
                    className="flex overflow-x-auto snap-x snap-mandatory gap-4 scrollbar-hide pb-4"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    {items.map((item, index) => (
                        <div key={index} className="flex-shrink-0 snap-start">
                            <PromotionCard
                                image={item.image}
                                deal={item.deal}
                                look={item.look}
                                logo={item.logo}
                            />
                        </div>
                    ))}
                </div>

                {/* Right Scroll */}
                <button
                    onClick={() => scrollBy(0.8)}
                    className="absolute -right-2 sm:-right-4 md:-right-6 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 sm:p-3 rounded-full shadow-lg hidden sm:flex hover:scale-105 border border-gray-200 transition-all"
                >
                    <ChevronRight className="text-gray-700 w-6 h-6" />
                </button>
            </div>

            
        </div>
    );
};

export { PromotionCard, DealsOfTheDay };

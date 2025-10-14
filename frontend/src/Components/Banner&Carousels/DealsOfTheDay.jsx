import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';



// --- PromotionCard Component (Single card display logic) ---
const PromotionCard = ({ image, deal, look, logo }) => {
    // w-[33.33%] (3 cards on mobile) -> sm:w-[25%] (4 cards on tablet) -> lg:w-[22.22%] (4.5 cards on desktop)
    return (
        <div className="w-[33.33%] sm:w-[25%] lg:w-[22.22%] flex-shrink-0 rounded-xl snap-start bg-white shadow-lg">
            
            {/* 1. Image Container with Dotted Border (Main visual part) */}
            <div className="relative w-full aspect-[3/4.5] p-2 m-1 border-2 border-dotted border-gray-400 rounded-xl"> 
                
                {/* Inner image content wrapper */}
                <div className="w-full h-full relative rounded-lg overflow-hidden">
                    <img
                        src={image}
                        alt={deal}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/400x550/6b7280/ffffff?text=Image+Failed+to+Load"; }}
                    />

                    {/* Text Overlay & Gradient */}
                    <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 pt-16 sm:pt-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white">
                        {/* Responsive font size for deal text */}
                        <p className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-1 leading-none text-shadow-lg">
                            {deal}
                        </p>
                        <p className="text-sm sm:text-base font-medium opacity-90 text-shadow-md">
                            {look}
                        </p>
                    </div>
                </div>
            </div>

            {/* 2. Bottom Logo Rectangle */}
            <div className=" bg-white border-t border-gray-200 flex justify-center items-center rounded-b-xl">
                <img 
                    src={logo}
                    alt="Brand Logo"
                    className="w-1/2 h-auto object-contain max-h-8"
                    onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/100x100/ffffff/374151?text=LOGO"; }}
                />
            </div>
        </div>
    );
};


// --- DealsOfTheDay (CategoryRow logic component) ---
const DealsOfTheDay = ({ title, items }) => {
    const scrollRef = useRef(null);

    // Function to handle smooth scrolling by roughly 80% of the container width
    const scrollBy = (amount) => {
        if (scrollRef.current) {
            const scrollDistance = scrollRef.current.clientWidth * amount;
            scrollRef.current.scrollBy({ left: scrollDistance, behavior: 'smooth' });
        }
    };

    const scrollLeft = () => scrollBy(-0.8);
    const scrollRight = () => scrollBy(0.8);
    
    return (
        <div className="mt-8 relative"> 
            <h2 className="text-3xl font-bold text-gray-800 mb-6 px-4 sm:px-0 text-center">
                {title}
            </h2>
            
            {/* Left Scroll Arrow (Visible on tablet/desktop only) */}
            <button
                onClick={scrollLeft}
                className="absolute -left-1 sm:left-1 md:-left-4 top-1/2 -translate-y-1/2 bg-white/70 backdrop-blur p-2 rounded-full shadow-xl z-20 hidden sm:block hover:bg-white transition-all transform hover:scale-110"
                aria-label="Scroll left"
            >
                <ChevronLeft size={24} className="text-gray-800" />
            </button>
            
            {/* Scrollable Container - attached ref here */}
            <div 
                ref={scrollRef} 
                className="flex overflow-x-auto snap-x snap-mandatory pb-4 gap-4 px-4 sm:px-0 scrollbar-hide"
            >
                {items.map((item, index) => (
                    <PromotionCard 
                        key={index} 
                        image={item.image} 
                        deal={item.deal} 
                        look={item.look} 
                        logo={item.logo}
                    />
                ))}
            </div>

            {/* Right Scroll Arrow (Visible on tablet/desktop only) */}
            <button
                onClick={scrollRight}
                className="absolute -right-1 sm:right-1 md:-right-4 top-1/2 -translate-y-1/2 bg-white/70 backdrop-blur p-2 rounded-full shadow-xl z-20 hidden sm:block hover:bg-white transition-all transform hover:scale-110"
                aria-label="Scroll right"
            >
                <ChevronRight size={24} className="text-gray-800" />
            </button>
        </div>
    );
};

export { PromotionCard, DealsOfTheDay };
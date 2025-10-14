import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';



// --- PromotionCard Component (Single card display logic) ---
const PromotionCard = ({ image, deal, look, logo }) => {
    return (
        <div className="relative bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 w-[280px] sm:w-[300px] md:w-[320px] lg:w-[340px] flex-shrink-0 border border-gray-100">
            {/* Image Container */}
            <div className="relative aspect-[4/3] sm:aspect-[3/2] overflow-hidden">
                <img 
                    src={image} 
                    alt={deal}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                
                {/* Logo Badge */}
                {logo && (
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-sm">
                        <img 
                            src={logo} 
                            alt="Brand logo" 
                            className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                        />
                    </div>
                )}
            </div>
            
            {/* Content */}
            <div className="p-3 sm:p-4">
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-2 mb-2">
                    {deal}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm line-clamp-2">
                    {look}
                </p>
                
                {/* CTA Button */}
                <button className="w-full mt-3 sm:mt-4 bg-gray-900 hover:bg-black text-white py-2 sm:py-2.5 rounded-lg text-sm font-medium transition-colors duration-200">
                    Shop Now
                </button>
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
        <div className="mt-8 relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> 
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 text-center sm:text-left">
                {title}
            </h2>
            
            {/* Container with proper positioning */}
            <div className="relative">
                {/* Left Scroll Arrow (Visible on tablet/desktop only) */}
                <button
                    onClick={scrollLeft}
                    className="absolute -left-2 sm:-left-4 md:-left-6 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 sm:p-3 rounded-full shadow-lg z-20 hidden sm:flex items-center justify-center hover:bg-white transition-all duration-200 transform hover:scale-105 border border-gray-200"
                    aria-label="Scroll left"
                >
                    <ChevronLeft size={20} className="text-gray-700 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </button>
                
                {/* Scrollable Container */}
                <div 
                    ref={scrollRef} 
                    className="flex overflow-x-auto snap-x snap-mandatory pb-4 gap-3 sm:gap-4 lg:gap-6 scrollbar-hide px-1"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
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

                {/* Right Scroll Arrow (Visible on tablet/desktop only) */}
                <button
                    onClick={scrollRight}
                    className="absolute -right-2 sm:-right-4 md:-right-6 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 sm:p-3 rounded-full shadow-lg z-20 hidden sm:flex items-center justify-center hover:bg-white transition-all duration-200 transform hover:scale-105 border border-gray-200"
                    aria-label="Scroll right"
                >
                    <ChevronRight size={20} className="text-gray-700 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </button>
            </div>

            {/* Mobile scroll indicators */}
            <div className="sm:hidden flex justify-center mt-4 space-x-2">
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            </div>
        </div>
    );
};

export { PromotionCard, DealsOfTheDay };
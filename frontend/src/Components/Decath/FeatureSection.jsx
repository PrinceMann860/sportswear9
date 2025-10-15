import React from 'react';
import { ArrowRight } from 'lucide-react';

const FeatureSection = ({ 
  title = "",
  subtitle = "",
  description = "",
  buttonText = "Explore Now",
  buttonLink = "#",
  image = "",
  reverse = false,
  variant = "default", // default, accent, gradient
  className = ""
}) => {
  const bgVariants = {
    default: "bg-background",
    accent: "bg-accent-cream",
    gradient: "bg-gradient-to-br from-primary/5 via-secondary/5 to-accent-orange/5"
  };

  return (
    <div className={`w-full ${bgVariants[variant]} py-6 sm:py-8 md:py-12 lg:py-16 ${className}`}>
      <div className="container mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        <div className={`flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-4 sm:gap-6 md:gap-8 lg:gap-12`}>
          
          {/* Content Side */}
          <div className="w-full lg:w-1/2 space-y-3 sm:space-y-4 md:space-y-6">
            {/* Vertical Text - Desktop Only */}
            <div className="hidden xl:block absolute left-0 -rotate-90 origin-left">
              <p className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-background-dark/10 uppercase whitespace-nowrap">
                {title}
              </p>
            </div>
            
            {subtitle && (
              <p className="text-xs sm:text-sm md:text-base text-text-secondary uppercase tracking-wide">
                {subtitle}
              </p>
            )}
            
            {title && (
              <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold text-text uppercase leading-tight">
                {title}
              </h2>
            )}
            
            {description && (
              <p className="text-[10px] sm:text-xs md:text-sm lg:text-base text-text-secondary leading-relaxed max-w-xl">
                {description}
              </p>
            )}
            
            {buttonText && (
              <a
                href={buttonLink}
                className="inline-flex items-center gap-2 px-4 sm:px-5 md:px-6 lg:px-8 py-2 sm:py-2.5 md:py-3 bg-primary text-text-light rounded-full hover:bg-primary-dark transition-all duration-300 group text-xs sm:text-sm md:text-base font-medium"
              >
                {buttonText}
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            )}
          </div>
          
          {/* Image Side */}
          <div className="w-full lg:w-1/2">
            <div className="relative overflow-hidden rounded-2xl aspect-video sm:aspect-[4/3] lg:aspect-square shadow-xl">
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default FeatureSection;

import React from 'react';
import { Shield, CreditCard, Users, Package, RotateCcw } from 'lucide-react';

const TrustBadges = ({ 
  title = "Our Promise",
  badges = [
    { icon: CreditCard, text: "No Cost EMI Available", link: "#" },
    { icon: RotateCcw, text: "Easy Returns*", link: "#" },
    { icon: Users, text: "1 million+ happy Customers", link: "#" }
  ],
  className = ""
}) => {
  return (
    <div className={`w-full bg-accent-cream rounded-lg p-4 sm:p-6 md:p-8 ${className}`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
        {/* Title - Hidden on mobile, shown on desktop */}
        <div className="hidden md:flex items-center min-w-fit">
          <h3 className="text-sm md:text-base lg:text-lg font-bold uppercase text-text tracking-wide">
            {title}
          </h3>
        </div>
        
        {/* Mobile Title */}
        <div className="block md:hidden">
          <h3 className="text-xs sm:text-sm font-bold uppercase text-text tracking-wide">
            {title}
          </h3>
        </div>
        
        {/* Badges Grid */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {badges.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <a
                key={index}
                href={badge.link}
                className="flex items-center gap-2 md:gap-3 p-2 rounded-lg hover:bg-white/50 transition-all duration-300 group"
              >
                <div className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-primary" />
                </div>
                <span className="text-[10px] sm:text-xs md:text-sm lg:text-base text-text-secondary font-medium">
                  {badge.text}
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TrustBadges;

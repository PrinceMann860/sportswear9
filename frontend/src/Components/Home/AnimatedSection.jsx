import React from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const AnimatedSection = ({ 
  children, 
  className = '', 
  animation = 'fade-in-up',
  delay = 0,
  once = true 
}) => {
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.1, once });

  const animations = {
    'fade-in-up': 'opacity-0 translate-y-20',
    'fade-in': 'opacity-0',
    'scale-in': 'opacity-0 scale-95',
    'slide-in-left': 'opacity-0 -translate-x-20',
    'slide-in-right': 'opacity-0 translate-x-20',
  };

  const visibleState = {
    'fade-in-up': 'opacity-100 translate-y-0',
    'fade-in': 'opacity-100',
    'scale-in': 'opacity-100 scale-100',
    'slide-in-left': 'opacity-100 translate-x-0',
    'slide-in-right': 'opacity-100 translate-x-0',
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${
        isVisible ? visibleState[animation] : animations[animation]
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;

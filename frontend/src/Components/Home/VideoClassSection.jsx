import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import AnimatedSection from './AnimatedSection';

const VideoClassSection = () => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const classes = [
    {
      id: 1,
      title: "Designing a Home That Tells Your Story",
      instructor: "Joanna Gaines",
      image: "https://www.masterclass.com/course-images/attachments/8wkkuv9jd22cnfwbvb3waxzf3h8n?width=395&height=702&quality=75&dpr=1",
      instructorImage: "https://www.masterclass.com/course-images/attachments/2qy65hf0a8mc9j69s1uos1my6fbn?width=200&quality=75&dpr=2"
    },
    {
      id: 2,
      title: "Teaches Building and Owning Your Personal Style",
      instructor: "Karla Welch",
      image: "https://www.masterclass.com/course-images/attachments/ef9xhe5s68ihuf6u2i6rky1l4jh3?width=395&height=702&quality=75&dpr=1",
      instructorImage: "https://www.masterclass.com/course-images/attachments/tyzov7may6dwi5xhw6w0uuhp178d?width=200&quality=75&dpr=2"
    },
    {
      id: 3,
      title: "Teaches Photography",
      instructor: "Annie Leibovitz",
      image: "https://www.masterclass.com/course-images/attachments/kfZpCZ2BBhEEDKHZMhwCdXB9?width=395&height=702&quality=75&dpr=1",
      instructorImage: "https://www.masterclass.com/course-images/attachments/ycGSPAPHkfDjBQcGtRDcMyo5?width=200&quality=75&dpr=2"
    },
    {
      id: 4,
      title: "Teaches Interior Design",
      instructor: "Kelly Wearstler",
      image: "https://www.masterclass.com/course-images/attachments/En7Tb7eP5TpVVSRMooAdkLac?width=395&height=702&quality=75&dpr=1",
      instructorImage: "https://www.masterclass.com/course-images/attachments/gxcisXqi7qVBZo8fnpW41w3t?width=200&quality=75&dpr=2"
    },
    {
      id: 5,
      title: "Teaches Storytelling Through Portrait Photography",
      instructor: "Tyler Mitchell",
      image: "https://www.masterclass.com/course-images/attachments/jesu450ohznlgam3f2p7upm01efn?width=395&height=702&quality=75&dpr=1",
      instructorImage: "https://www.masterclass.com/course-images/attachments/ikspv8pqp0i0dac1r169zfbyobjc?width=200&quality=75&dpr=2"
    },
    {
      id: 6,
      title: "Teaches Art and Creativity",
      instructor: "Jeff Koons",
      image: "https://www.masterclass.com/course-images/attachments/fYujXGmVDeofoP6oqiNeHCNC?width=395&height=702&quality=75&dpr=1",
      instructorImage: "https://www.masterclass.com/course-images/attachments/gxcisXqi7qVBZo8fnpW41w3t?width=200&quality=75&dpr=2"
    }
  ];

  const checkScrollPosition = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkScrollPosition, 300);
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center md:text-left flex-1">
              Other Classes in Art &amp; Design
            </h2>
          </AnimatedSection>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                canScrollLeft
                  ? 'border-gray-900 hover:bg-gray-100'
                  : 'border-gray-300 cursor-not-allowed opacity-50'
              }`}
              aria-label="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                canScrollRight
                  ? 'border-gray-900 hover:bg-gray-100'
                  : 'border-gray-300 cursor-not-allowed opacity-50'
              }`}
              aria-label="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div
          ref={scrollRef}
          onScroll={checkScrollPosition}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
          aria-label="design-creative-arts"
        >
          {classes.map((item, index) => (
            <div
              key={item.id}
              className="flex-shrink-0 w-[160px] sm:w-[180px] md:w-[200px] lg:w-[220px]"
              data-testid={`tile-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
              tabIndex={index < 4 ? 0 : -1}
              aria-hidden={index >= 4}
              role="group"
              aria-label={`${index + 1} of ${classes.length} in design-creative-arts`}
            >
              <a className="block rounded-lg overflow-hidden cursor-pointer" href="#">
                <div className="relative group">
                  <div className="aspect-[9/16] relative">
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                    
                    {/* Image */}
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Content Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                      {/* Instructor Info */}
                      <div className="flex items-center gap-2 mb-3">
                        <img
                          src={item.instructorImage}
                          alt={item.instructor}
                          className="w-10 h-10 rounded-full border-2 border-white"
                        />
                        <div className="h-8 w-px bg-white/50" />
                        <p className="text-white text-xs font-medium line-clamp-2 flex-1">
                          {item.title}
                        </p>
                      </div>

                      {/* Watch Trailer Button */}
                      <button
                        type="button"
                        className="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold py-2 px-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                      >
                        <Play className="w-4 h-4" fill="currentColor" />
                        Watch Trailer
                      </button>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideoClassSection;


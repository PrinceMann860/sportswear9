import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import AnimatedSection from './AnimatedSection';

const ComingSoon = () => {
  const scrollRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const comingSoonItems = [
    {
      id: 1,
      date: "Nov 20",
      instructor: "with Ramit Sethi",
      image: "https://www.masterclass.com/course-images/attachments/5o12l653b1pydxgoif21rrx5asrl?width=1920&quality=75&format=webp",
      portraitImage: "https://www.masterclass.com/course-images/attachments/5o12l653b1pydxgoif21rrx5asrl?width=750&quality=75&format=webp"
    },
    {
      id: 2,
      date: "Nov 25",
      instructor: "with Former NSA and US Cyber Command leaders",
      image: "https://www.masterclass.com/course-images/attachments/eykwhv5x816om6iwog9o85cthtp4?width=1920&quality=75&format=webp",
      portraitImage: "https://www.masterclass.com/course-images/attachments/eykwhv5x816om6iwog9o85cthtp4?width=750&quality=75&format=webp"
    },
    {
      id: 3,
      date: "Oct",
      instructor: "with Futurist Amy Webb & Other Experts",
      image: "https://www.masterclass.com/course-images/attachments/jesu450ohznlgam3f2p7upm01efn?width=1920&quality=75&format=webp",
      portraitImage: "https://www.masterclass.com/course-images/attachments/jesu450ohznlgam3f2p7upm01efn?width=750&quality=75&format=webp"
    },
    {
      id: 4,
      date: "Oct",
      instructor: "with renowned behavioral expert Vanessa Van Edwards",
      image: "https://www.masterclass.com/course-images/attachments/ikspv8pqp0i0dac1r169zfbyobjc?width=1920&quality=75&format=webp",
      portraitImage: "https://www.masterclass.com/course-images/attachments/ikspv8pqp0i0dac1r169zfbyobjc?width=750&quality=75&format=webp"
    },
    {
      id: 5,
      date: "Nov",
      instructor: "with Dr. Peter Attia",
      image: "https://www.masterclass.com/course-images/attachments/5o12l653b1pydxgoif21rrx5asrl?width=1920&quality=75&format=webp",
      portraitImage: "https://www.masterclass.com/course-images/attachments/5o12l653b1pydxgoif21rrx5asrl?width=750&quality=75&format=webp"
    }
  ];

  const checkScrollPosition = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
      const itemWidth = scrollRef.current.querySelector('.coming-soon-item')?.offsetWidth || 300;
      const page = Math.round(scrollLeft / itemWidth);
      setCurrentPage(page);
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

  const totalPages = Math.ceil(comingSoonItems.length / 2);

  return (
    <section className="py-16 bg-white" data-testid="coming-soon">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Coming Soon
            </h2>
          </AnimatedSection>

          <div className="hidden md:flex gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                canScrollLeft
                  ? 'border-gray-900 hover:bg-gray-100'
                  : 'border-gray-300 cursor-not-allowed opacity-50'
              }`}
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                canScrollRight
                  ? 'border-gray-900 hover:bg-gray-100'
                  : 'border-gray-300 cursor-not-allowed opacity-50'
              }`}
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          onScroll={checkScrollPosition}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
          aria-label="Coming Soon"
        >
          {comingSoonItems.map((item, index) => (
            <div
              key={item.id}
              className="coming-soon-item flex-shrink-0 w-[80%] sm:w-[50%]"
              role="group"
              aria-label={`${index + 1} of ${comingSoonItems.length} in Coming Soon`}
            >
              {/* ✅ MOBILE: Fixed aspect to prevent height jump */}
              <div className="block md:hidden rounded-lg overflow-hidden shadow-lg relative group cursor-pointer hover:shadow-xl transition-shadow">
                <div className="aspect-[16/9] relative">
                  <img
                    src={item.portraitImage}
                    alt={item.instructor}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-4 left-4 bg-white text-black text-xs px-3 py-1 rounded capitalize">
                    {item.date}
                  </span>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                    <p className="text-white font-medium text-base">{item.instructor}</p>
                  </div>
                </div>
              </div>

              {/* ✅ DESKTOP: Stable aspect ratio */}
              <div className="hidden md:block rounded-lg overflow-hidden shadow-lg relative group cursor-pointer hover:shadow-xl transition-shadow">
                <div className="aspect-[16/9] relative">
                  <img
                    src={item.image}
                    alt={item.instructor}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-4 left-4 bg-white text-black text-xs px-3 py-1 rounded capitalize">
                    {item.date}
                  </span>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <p className="text-white font-medium">{item.instructor}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-2 mt-6">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                currentPage === index ? 'bg-gray-900 w-6' : 'bg-gray-300'
              }`}
              aria-current={currentPage === index}
              aria-label={`Page ${index + 1} of ${totalPages}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ComingSoon;

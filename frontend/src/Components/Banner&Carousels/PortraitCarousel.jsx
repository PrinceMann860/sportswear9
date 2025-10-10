// src/components/PortraitCarousel.jsx
import { Swiper, SwiperSlide } from "swiper/react";
import { useState } from "react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/autoplay";
import { FreeMode, Autoplay } from "swiper/modules";

const slides = [
  {
    image: "https://plus.unsplash.com/premium_photo-1661439604043-c069303164dd?fm=jpg&q=60&w=3000",
    title: "Strength Training",
    subtitle: "Build Power"
  },
  {
    image: "https://i1.feedspot.com/original/5609738.jpg",
    title: "Athletic Gear",
    subtitle: "Elite Performance"
  },
  {
    image: "https://images.bike24.com/i/mb/28/06/f4/merrell-agility-peak-5-trail-running-shoes-tahoe-cloud-6-1538531.jpg",
    title: "Running Shoes",
    subtitle: "Peak Comfort"
  },
  {
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQX7e1vGcr9bxr1SKJ-R4GDVcjdBPRz8zjMMg&s",
    title: "Workout Wear",
    subtitle: "Style & Fit"
  },
  {
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmfJ2XftbuhcjSXB9wQ_LC4UsomAiLtkdOmA&s",
    title: "Combat Fitness",
    subtitle: "Boxing & MMA"
  }
];

export default function PortraitCarousel() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="w-full py-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Swiper
        slidesPerView={2.5}
        spaceBetween={16}
        centeredSlides={true}
        freeMode={true}
        grabCursor={true}
        loop={true} // ✅ continuous autoplay loop
        autoplay={{
          delay: 2500,
          disableOnInteraction: false, // ✅ keeps autoplay even after swipe
          pauseOnMouseEnter: false, // ✅ ensures mobile consistency
        }}
        speed={600}
        modules={[FreeMode, Autoplay]}
        className="portrait-carousel"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-[240px] object-cover"
              />

              {/* Text Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <h3 className="text-white font-bold text-lg mb-1">
                  {slide.title}
                </h3>
                <p className="text-red-300 text-sm">{slide.subtitle}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

// ProductVideoCarousel.jsx
import React, { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css"; // ✅ Core CSS

const sampleVideoData = [
  {
    id: "vid1",
    src: "https://www.w3schools.com/html/mov_bbb.mp4",
    caption: "Street style fit #1",
    products: [
      {
        id: "p1",
        title: "Bomber Jacket",
        img: "https://via.placeholder.com/200x250",
        price: "₹2,499",
      },
      {
        id: "p2",
        title: "Ribbed Tee",
        img: "https://via.placeholder.com/200x250",
        price: "₹799",
      },
      {
        id: "p3",
        title: "Slim Jeans",
        img: "https://via.placeholder.com/200x250",
        price: "₹1,299",
      },
    ],
  },
  {
    id: "vid3",
    src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    caption: "Monochrome outfit",
    products: [
      {
        id: "p6",
        title: "High-Neck Sweater",
        img: "https://via.placeholder.com/200x250",
        price: "₹1,899",
      },
      {
        id: "p7",
        title: "Cargo Pants",
        img: "https://via.placeholder.com/200x250",
        price: "₹1,299",
      },
    ],
  },
  {
    id: "vid4",
    src: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
    caption: "Night-out ensemble",
    products: [
      {
        id: "p8",
        title: "Leather Jacket",
        img: "https://via.placeholder.com/200x250",
        price: "₹5,999",
      },
      {
        id: "p9",
        title: "Graphic Tee",
        img: "https://via.placeholder.com/200x250",
        price: "₹699",
      },
    ],
  },
  {
    id: "vid1",
    src: "https://www.w3schools.com/html/mov_bbb.mp4",
    caption: "Street style fit #1",
    products: [
      {
        id: "p1",
        title: "Bomber Jacket",
        img: "https://via.placeholder.com/200x250",
        price: "₹2,499",
      },
      {
        id: "p2",
        title: "Ribbed Tee",
        img: "https://via.placeholder.com/200x250",
        price: "₹799",
      },
      {
        id: "p3",
        title: "Slim Jeans",
        img: "https://via.placeholder.com/200x250",
        price: "₹1,299",
      },
    ],
  },
  {
    id: "vid3",
    src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    caption: "Monochrome outfit",
    products: [
      {
        id: "p6",
        title: "High-Neck Sweater",
        img: "https://via.placeholder.com/200x250",
        price: "₹1,899",
      },
      {
        id: "p7",
        title: "Cargo Pants",
        img: "https://via.placeholder.com/200x250",
        price: "₹1,299",
      },
    ],
  },
  {
    id: "vid4",
    src: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
    caption: "Night-out ensemble",
    products: [
      {
        id: "p8",
        title: "Leather Jacket",
        img: "https://via.placeholder.com/200x250",
        price: "₹5,999",
      },
      {
        id: "p9",
        title: "Graphic Tee",
        img: "https://via.placeholder.com/200x250",
        price: "₹699",
      },
    ],
  },
];

export default function ProductVideoCarousel({
  videoData = sampleVideoData,
  onAddToCart = null,
}) {
  const [openProductsFor, setOpenProductsFor] = useState(null);
  const swiperRef = useRef(null);

  // ✅ Force restart autoplay every few seconds in case it stops
  useEffect(() => {
    const interval = setInterval(() => {
      swiperRef.current?.autoplay?.start();
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  function handleAddToCart(product) {
    if (typeof onAddToCart === "function") {
      onAddToCart(product);
    } else {
      console.log("Add to cart:", product);
    }
  }

  return (
    <>
      <style>{`
        .swiper-wrapper { transition-timing-function: ease-in-out !important; }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Insta Looks</h3>
          <p className="text-sm text-gray-500">Tap a look to shop the items</p>
        </div>

        <Swiper
          modules={[Autoplay]}
          spaceBetween={12}
          slidesPerView={2}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
          }}
          speed={400}
          loop={true}
          loopedSlides={videoData.length}
          grabCursor={true}
          touchStartPreventDefault={false}
          allowTouchMove={true}
          touchRatio={1}
          watchOverflow={true}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
          className="py-2"
        >
          {videoData.map((v) => (
            <SwiperSlide key={v.id}>
              <div className="group relative bg-white rounded-md overflow-hidden shadow-sm cursor-pointer">
                <div className="relative w-full" style={{ paddingTop: "177.78%" }}>
                  <video src={v.src} muted loop playsInline autoPlay className="absolute inset-0 w-full h-full object-cover rounded-xl" />
                  <div className="absolute inset-0 "/>
                  <div className="absolute left-3 bottom-3 text-white text-xs bg-black/40 backdrop-blur-sm px-2 py-1 rounded">
                    {v.caption}
                  </div>
                </div>

                <div className="sm:p-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium truncate">{v.caption}</div>

                    {/* Desktop Button */}
                    <button
                      onClick={() => setOpenProductsFor(v.id)}
                      className="hidden sm:inline-flex text-sm px-2 py-1 border rounded hover:bg-black hover:text-white"
                    >
                      Get this look
                    </button>
                  </div>

                  {/* Mobile Button */}
                  <button
                    onClick={() => setOpenProductsFor(v.id)}
                    className="mt-2 w-full bg-black text-white text-sm py-2 rounded sm:hidden"
                  >
                    Get this look
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Modal */}
      {openProductsFor && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpenProductsFor(null)} />
          <div className="relative w-full md:max-w-3xl bg-white rounded-t-lg md:rounded-lg shadow-xl overflow-auto max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h4 className="font-semibold">Shop the look</h4>
              <button onClick={() => setOpenProductsFor(null)}>✕</button>
            </div>

            {/* Products Grid */}
            <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
              {(videoData.find((x) => x.id === openProductsFor)?.products || []).map((p) => (
                <div key={p.id} className="flex flex-col bg-gray-50 rounded p-3">
                  <img src={p.img} className="w-full h-40 object-cover rounded" />
                  <div className="mt-2 flex-1">
                    <div className="text-sm font-medium">{p.title}</div>
                    <div className="text-sm text-gray-500">{p.price}</div>
                  </div>
                  <button onClick={() => handleAddToCart(p)} className="mt-3 w-full bg-black text-white py-2 rounded">
                    Add to cart
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ShopTheLookCarousel.jsx
import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import instavideo from "../../assets/instavideo.mp4";

/**
 * ShopTheLookCarousel
 *
 * - Visual style from VideoClassSection (tall posters, gradient overlay, left/right controls)
 * - Data + modal functionality from ProductVideoCarousel
 *
 * Notes:
 * - Videos autoplay muted loop playsInline for quick previews.
 * - Overlay shows only the caption (per your choice).
 * - "Get This Look" opens a modal with product cards and Add to cart handler.
 */

const sampleVideoData = [
  {
    id: "vid1",
    src: instavideo,
    caption: "Street style fit #1",
    products: [
      { id: "p1", title: "Bomber Jacket", img: "https://via.placeholder.com/300x400", price: "₹2,499" },
      { id: "p2", title: "Ribbed Tee", img: "https://via.placeholder.com/300x400", price: "₹799" },
      { id: "p3", title: "Slim Jeans", img: "https://via.placeholder.com/300x400", price: "₹1,299" },
    ],
  },
  {
    id: "vid2",
    src: instavideo,
    caption: "Monochrome outfit",
    products: [
      { id: "p6", title: "High-Neck Sweater", img: "https://via.placeholder.com/300x400", price: "₹1,899" },
      { id: "p7", title: "Cargo Pants", img: "https://via.placeholder.com/300x400", price: "₹1,299" },
    ],
  },
  {
    id: "vid3",
    src: instavideo,
    caption: "Night-out ensemble",
    products: [
      { id: "p8", title: "Leather Jacket", img: "https://via.placeholder.com/300x400", price: "₹5,999" },
      { id: "p9", title: "Graphic Tee", img: "https://via.placeholder.com/300x400", price: "₹699" },
    ],
  },
  {
    id: "vid4",
    src: instavideo,
    caption: "Casual weekend look",
    products: [
      { id: "p10", title: "Denim Shirt", img: "https://via.placeholder.com/300x400", price: "₹1,399" },
      { id: "p11", title: "Chinos", img: "https://via.placeholder.com/300x400", price: "₹1,199" },
    ],
  },
  {
    id: "vid1",
    src: instavideo,
    caption: "Street style fit #1",
    products: [
      { id: "p1", title: "Bomber Jacket", img: "https://via.placeholder.com/300x400", price: "₹2,499" },
      { id: "p2", title: "Ribbed Tee", img: "https://via.placeholder.com/300x400", price: "₹799" },
      { id: "p3", title: "Slim Jeans", img: "https://via.placeholder.com/300x400", price: "₹1,299" },
    ],
  },
  {
    id: "vid2",
    src: instavideo,
    caption: "Monochrome outfit",
    products: [
      { id: "p6", title: "High-Neck Sweater", img: "https://via.placeholder.com/300x400", price: "₹1,899" },
      { id: "p7", title: "Cargo Pants", img: "https://via.placeholder.com/300x400", price: "₹1,299" },
    ],
  },
  {
    id: "vid3",
    src: instavideo,
    caption: "Night-out ensemble",
    products: [
      { id: "p8", title: "Leather Jacket", img: "https://via.placeholder.com/300x400", price: "₹5,999" },
      { id: "p9", title: "Graphic Tee", img: "https://via.placeholder.com/300x400", price: "₹699" },
    ],
  },
  {
    id: "vid4",
    src: instavideo,
    caption: "Casual weekend look",
    products: [
      { id: "p10", title: "Denim Shirt", img: "https://via.placeholder.com/300x400", price: "₹1,399" },
      { id: "p11", title: "Chinos", img: "https://via.placeholder.com/300x400", price: "₹1,199" },
    ],
  },
];

export default function ShopTheLookCarousel({ videoData = sampleVideoData, onAddToCart = null }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [openProductsFor, setOpenProductsFor] = useState(null);

  // Check scroll position for enabling/disabling nav buttons
  const checkScrollPosition = () => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  // Scroll by 80% of visible container width
  const scroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.8;
    el.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
    // schedule a check after smooth scroll
    setTimeout(checkScrollPosition, 350);
  };

  useEffect(() => {
    checkScrollPosition();
    const handleResize = () => checkScrollPosition();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Keep autoplaying videos playing if browser pauses them when offscreen:
  // We'll attempt to call play on visible videos periodically.
  useEffect(() => {
    const interval = setInterval(() => {
      if (!scrollRef.current) return;
      const videos = scrollRef.current.querySelectorAll("video");
      videos.forEach((v) => {
        // try to ensure muted autoplay keeps playing
        try {
          if (v.paused) v.play().catch(() => {});
        } catch (e) {}
      });
    }, 2500);
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
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Insta Looks</h2>

          <div className="hidden sm:flex gap-2">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              aria-label="Scroll left"
              className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all ${
                canScrollLeft ? "border-gray-900 hover:bg-gray-100" : "border-gray-300 cursor-not-allowed opacity-50"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              aria-label="Scroll right"
              className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all ${
                canScrollRight ? "border-gray-900 hover:bg-gray-100" : "border-gray-300 cursor-not-allowed opacity-50"
              }`}
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
          aria-label="shop-the-look-carousel"
        >
          {videoData.map((item, index) => (
            <article
              key={item.id}
              className="flex-shrink-0 w-[160px] sm:w-[180px] md:w-[200px] lg:w-[220px]"
              role="group"
            >
              <div className="block rounded-lg overflow-hidden cursor-pointer">
                <div className="relative group">
                  <div className="aspect-[9/16] relative bg-gray-200">
                    {/* Video background */}
                    <video
                      src={item.src}
                      muted
                      loop
                      playsInline
                      autoPlay
                      preload="metadata"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />

                    {/* Caption + Button Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 z-20">
                      <p className="text-white text-sm font-medium line-clamp-2 mb-3">{item.caption}</p>

                      <button
                        type="button"
                        onClick={() => setOpenProductsFor(item.id)}
                        className="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold py-2 px-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                        aria-label={`Get this look: ${item.caption}`}
                      >
                        <Play className="w-4 h-4" />
                        Get This Look
                      </button>
                    </div>
                  </div>
                </div>

                {/* Caption below card for small screens (optional) */}
                <div className="sm:hidden mt-2 text-sm font-medium truncate">{item.caption}</div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Modal */}
      {openProductsFor && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpenProductsFor(null)} />

          <div className="relative w-full md:max-w-3xl bg-white rounded-t-lg md:rounded-lg shadow-xl overflow-auto max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h4 className="font-semibold">Shop the look</h4>
              <button
                onClick={() => setOpenProductsFor(null)}
                aria-label="Close"
                className="text-2xl leading-none px-2"
              >
                ✕
              </button>
            </div>

            {/* Products grid */}
            <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
              {(videoData.find((x) => x.id === openProductsFor)?.products || []).map((p) => (
                <div key={p.id} className="flex flex-col bg-gray-50 rounded p-3">
                  <img src={p.img} alt={p.title} className="w-full h-40 object-cover rounded" />
                  <div className="mt-2 flex-1">
                    <div className="text-sm font-medium">{p.title}</div>
                    <div className="text-sm text-gray-500">{p.price}</div>
                  </div>
                  <button
                    onClick={() => handleAddToCart(p)}
                    className="mt-3 w-full bg-black text-white py-2 rounded"
                  >
                    Add to cart
                  </button>
                </div>
              ))}

              {/* Fallback when no products */}
              {(videoData.find((x) => x.id === openProductsFor)?.products || []).length === 0 && (
                <div className="col-span-full p-6 text-center text-gray-600">No products to show.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

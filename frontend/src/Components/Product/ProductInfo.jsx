// ProductInfo.jsx
import React, { useState } from "react";
import { Star, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "./Product";
import RecommendedProducts from "../Home/RecommendedProducts";

const ProductInfo = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [showAllReviews, setShowAllReviews] = useState(false);

  // Mock product data
  const product = {
    id: 3,
    title: "Compression T-shirt",
    category: "Performance",
    price: "₹2,499.00",
    original: "₹6,599.00",
    discount: "-65%",
    images: [
      "https://assets.myntassets.com/dpr_1.5,q_30,w_800,c_limit,fl_progressive/assets/images/2025/FEBRUARY/3/L7GEjRDH_b510caa934e949b78484e8cfb577804d.jpg",
      "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?auto=format&fit=crop&w=800&q=80",
    ],
    description:
      "Engineered with moisture-wicking fabric, our Compression T-shirt provides superior breathability, flexibility, and comfort during intense workouts.",
  };

  const relatedProducts = [
    {
      id: 1,
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkBKlnopY_VdoiRKoHyB4pSTlZCnTRwpngwQ&s",
      title: "Full sleeve compression",
      category: 'GYM Sports',
      price: "₹1,499",
      discount: "-45",
      original: "₹2,450"
    },
    {
      id: 2,
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkBKlnopY_VdoiRKoHyB4pSTlZCnTRwpngwQ&s",
      title: "Full sleeve compression",
      category: 'GYM Sports',
      price: "₹1,499",
      discount: "-45",
      original: "₹2,450"
    },
    {
      id: 3,
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkBKlnopY_VdoiRKoHyB4pSTlZCnTRwpngwQ&s",
      title: "Full sleeve compression",
      category: 'GYM Sports',
      price: "₹1,499",
      discount: "-45",
      original: "₹2,450"
    },
    {
      id: 4,
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkBKlnopY_VdoiRKoHyB4pSTlZCnTRwpngwQ&s",
      title: "Full sleeve compression",
      category: 'GYM Sports',
      price: "₹1,499",
      discount: "-45",
      original: "₹2,450"
    },
  ];

  const reviews = [
    {
      name: "Aman Verma",
      rating: 5,
      text: "Superb quality and fit. The compression feels great and keeps me cool even during intense workouts!",
      images: ["https://m.media-amazon.com/images/I/71lBfyRqZ6L._UY350_.jpg"],
      date: "Sep 18, 2025",
    },
    {
      name: "Priya Sharma",
      rating: 4,
      text: "Good product! Comfortable and stretchable. Worth the price.",
      date: "Aug 29, 2025",
    },
    {
      name: "Rohit Singh",
      rating: 5,
      text: "Perfect fit and material. Love it!",
      images: ["https://m.media-amazon.com/images/I/71lBfyRqZ6L._UY350_.jpg"],
      date: "Jul 12, 2025",
    },
    {
      name: "Swarna Anand",
      rating: 5,
      text: "Very good product",
      date: "Sep 8, 2025"
    },
    {
      name: "Tao Subramanyan",
      rating: 2,
      text: "I have very subtle palms, but even for me this gloves fit small. Maybe it's for kids?",
      date: "Nov 20, 2023"
    },
    {
      name: "ANURADHA",
      rating: 2,
      text: "and scratching the fabric out .. not good",
      date: "Oct 28, 2024"
    },
    {
      name: "Amazon Customer",
      rating: 5,
      text: "Nice",
      date: "Sep 27, 2025"
    },
    {
      name: "Tarun P.",
      rating: 4,
      text: "Good for gym but stitching could be better",
      date: "Oct 19, 2023"
    },
    {
      name: "santosh kumar",
      rating: 2,
      text: "Quality was really not good",
      date: "Oct 6, 2025"
    }
  ];

  // ----- Review stats (auto-calculated) -----
  const totalReviews = reviews.length;
  const ratingSum = reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
  const averageRating = totalReviews ? (ratingSum / totalReviews) : 0;
  const roundedAverage = Math.round(averageRating * 10) / 10; // one decimal

  const ratingsCount = [0,0,0,0,0]; // index 0 -> 5 stars, index 4 -> 1 star mapping
  // We'll map index 0 -> 5 stars for easier display
  reviews.forEach(r => {
    const rt = Math.max(1, Math.min(5, Math.floor(r.rating || 0)));
    ratingsCount[5 - rt] += 1;
  });

  const ratingPercentages = ratingsCount.map(c => Math.round((c / (totalReviews || 1)) * 100));

  // Collect all review images
  const reviewImages = reviews.flatMap(r => (r.images || []));

  // Navigation functions
  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <div className="pt-24 bg-gradient-to-b from-gray-200 to-white text-gray-900">
      {/* Product Section */}
      <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 py-10">
        {/* Left: Image Gallery - Gymshark Style */}
        <div className="relative">
          {/* Main Image Container */}
          <div className="relative aspect-[3/4] bg-white rounded-lg overflow-hidden group">
            <img
              src={product.images[selectedImage]}
              alt="product"
              className="w-full h-full object-cover transition-opacity duration-300"
            />
            
            {/* Navigation Arrows */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
            >
              <ChevronLeft size={20} className="text-gray-800" />
            </button>
            
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
            >
              <ChevronRight size={20} className="text-gray-800" />
            </button>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
              {selectedImage + 1} / {product.images.length}
            </div>
          </div>

          {/* Thumbnail Gallery - Horizontal Scroll */}
          <div className="flex gap-3 mt-6 overflow-x-auto pb-2 scrollbar-hide">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`flex-shrink-0 w-20 h-24 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  selectedImage === i
                    ? "border-black scale-105 shadow-md"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          {/* Product Actions */}
          <div className="flex gap-3 mt-6">
            <button className="flex-1 bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-200">
              Add to Cart
            </button>
            <button className="px-6 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <Heart className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="flex flex-col justify-center space-y-6">
          <div>
            <span className="inline-block bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium mb-3">
              {product.category}
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-2">
              {product.title}
            </h1>
          </div>

          {/* Price Section */}
          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-black">
              {product.price}
            </span>
            <span className="text-lg text-gray-500 line-through">
              {product.original}
            </span>
            <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
              {product.discount}
            </span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  className={i < 4 ? "text-yellow-400" : "text-gray-300"}
                  fill={i < 4 ? "currentColor" : "none"}
                />
              ))}
            </div>
            <span className="text-gray-600">4.2 • 128 Reviews</span>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Product Description</h3>
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>

          {/* Size Guide */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Size</h3>
              <button className="text-sm text-gray-600 underline hover:text-black">
                Size Guide
              </button>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {['S', 'M', 'L', 'XL'].map((size) => (
                <button
                  key={size}
                  className="border-2 border-gray-200 rounded-lg py-3 font-medium hover:border-black transition-colors duration-200"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color Options */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Color</h3>
            <div className="flex gap-3">
              {['bg-black', 'bg-gray-400', 'bg-blue-500'].map((color, i) => (
                <button
                  key={i}
                  className={`w-10 h-10 rounded-full border-2 border-gray-300 ${color} hover:scale-110 transition-transform duration-200`}
                />
              ))}
            </div>
          </div>

          {/* Add to Cart Button */}
          <button className="w-full bg-black text-white py-4 rounded-lg font-semibold text-lg hover:bg-gray-800 transition-colors duration-200 shadow-lg">
            Add to Cart
          </button>

          {/* Delivery Info */}
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Free delivery for orders above ₹999</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>30-day returns & exchanges</span>
            </div>
          </div>
        </div>
      </div>

      {/* Rest of the component remains the same... */}
      {/* Banners */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-6">
        <div className="relative bg-black text-white rounded-2xl p-10 overflow-hidden">
          <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1400&q=80')] bg-cover" />
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-3">Train Hard. Look Good.</h3>
            <p className="text-sm mb-4 text-gray-200">
              Push your limits with SportsWear9's high-performance collection.
            </p>
            <button className="bg-white text-black px-5 py-2 rounded-full font-semibold hover:bg-gray-200 transition">
              Shop Now
            </button>
          </div>
        </div>

        <div className="relative bg-gray-900 text-white rounded-2xl p-10 overflow-hidden">
          <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1400&q=80')] bg-cover" />
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-3 text-red-500">
              New Season Drop
            </h3>
            <p className="text-sm mb-4 text-gray-200">
              Discover the latest designs crafted for speed and comfort.
            </p>
            <button className="bg-white text-black px-5 py-2 rounded-full font-semibold hover:bg-gray-200 transition">
              Explore
            </button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <RecommendedProducts />

      {/* Reviews Section */}
      <div className="max-w-7xl mx-auto px-4 py-12 border-t border-gray-300">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Ratings summary */}
          <div className="col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div>
                  <div className="text-4xl font-bold text-black">{roundedAverage}</div>
                  <div className="flex items-center mt-1">
                    <div className="flex -space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < Math.round(averageRating) ? "text-yellow-500" : "text-gray-300"}
                          fill={i < Math.round(averageRating) ? "currentColor" : "none"}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500 ml-3">{totalReviews} global ratings</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                {[5,4,3,2,1].map((star, idx) => {
                  const pct = ratingPercentages[idx] ?? 0;
                  return (
                    <div key={star} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {Array.from({ length: star }).map((__, i) => (
                            <Star key={i} size={14} className="text-yellow-500" fill="currentColor" />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600 ml-2">{pct}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6">
                <button className="w-full border border-gray-300 py-2 rounded-md text-sm font-medium hover:bg-gray-50">
                  Write a product review
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h4 className="font-semibold text-lg">Customers say</h4>
              <p className="text-sm text-gray-600 mt-2">
                Customers find the workout gloves have a nice fit. However, the quality receives mixed feedback, with some customers finding them good while others say they are not of good quality.
              </p>
              <div className="mt-3 flex gap-3 text-sm text-blue-600">
                <button className="underline">Fit</button>
                <button className="underline">Quality</button>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Reviews with images</h4>
                <a href="#" className="text-sm text-blue-600 underline">See all photos</a>
              </div>

              {reviewImages.length > 0 ? (
                <div className="mt-4 overflow-x-auto flex gap-3 py-2">
                  {reviewImages.map((img, i) => (
                    <img key={i} src={img} alt={`review-img-${i}`} className="w-28 h-28 object-cover rounded-md border border-gray-200" />
                  ))}
                </div>
              ) : (
                <div className="mt-4 text-sm text-gray-500">No review images yet</div>
              )}
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm space-y-6">
              <h4 className="font-semibold text-lg">Top reviews from India</h4>

              {(showAllReviews ? reviews : reviews.slice(0, 3)).map((r, idx) => (
                <div key={idx} className="border-b last:border-b-0 pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                        {r.name ? r.name.charAt(0).toUpperCase() : "U"}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center -space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                className={i < r.rating ? "text-yellow-500" : "text-gray-300"}
                                fill={i < r.rating ? "currentColor" : "none"}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">{r.name}</span>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">{r.date}</div>
                      </div>
                    </div>

                    {r.rating >= 4 && (
                      <div className="text-sm text-green-600 font-medium">Verified Purchase</div>
                    )}
                  </div>

                  <p className="text-gray-700 mt-3">{r.text}</p>

                  {r.images && r.images.length > 0 && (
                    <div className="mt-3 flex gap-3">
                      {r.images.map((img, j) => (
                        <img key={j} src={img} alt={`rev-${idx}-img-${j}`} className="w-24 h-24 object-cover rounded-md border border-gray-200" />
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {reviews.length > 3 && (
                <div className="text-center mt-2">
                  <button
                    onClick={() => setShowAllReviews(!showAllReviews)}
                    className="text-sm text-blue-600 underline"
                  >
                    {showAllReviews ? "See less reviews" : "See more reviews"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
// ProductInfo.jsx
import React, { useState } from "react";
import { Star, Heart, Truck, Shield, RefreshCw, ChevronDown } from "lucide-react";
import { ProductCard } from "./Product";
import RecommendedProducts from "../Home/RecommendedProducts";
import { Check, Info, Ruler } from "lucide-react";

const ProductInfo = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("Black");
  const [quantity, setQuantity] = useState(1);

  // Mock product data - Enhanced with additional fields
  const product = {
    id: 3,
    title: "Compression T-shirt",
    category: "Performance",
    price: "₹2,499.00",
    original: "₹6,599.00",
    discount: "-65%",
    images: [
      "https://assets.myntassets.com/dpr_1.5,q_30,w_800,c_limit,fl_progressive/assets/images/2025/FEBRUARY/3/L7GEjRDH_b510caa934e949b78484e8cfb577804d.jpg",
      "https://assets.myntassets.com/dpr_1.5,q_30,w_800,c_limit,fl_progressive/assets/images/2025/FEBRUARY/3/L7GEjRDH_b510caa934e949b78484e8cfb577804d.jpg",
      "https://assets.myntassets.com/dpr_1.5,q_30,w_800,c_limit,fl_progressive/assets/images/2025/FEBRUARY/3/L7GEjRDH_b510caa934e949b78484e8cfb577804d.jpg",
      "https://assets.myntassets.com/dpr_1.5,q_30,w_800,c_limit,fl_progressive/assets/images/2025/FEBRUARY/3/L7GEjRDH_b510caa934e949b78484e8cfb577804d.jpg",
    ],
    description: "Engineered with moisture-wicking fabric, our Compression T-shirt provides superior breathability, flexibility, and comfort during intense workouts.",
    features: [
      "Moisture-wicking technology",
      "4-way stretch fabric",
      "Anti-odor treatment",
      "UPF 50+ sun protection",
      "Flatlock seams for comfort"
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Black", value: "#000000" },
      { name: "Navy Blue", value: "#1e3a8a" },
      { name: "Charcoal", value: "#374151" },
      { name: "Burgundy", value: "#831843" }
    ],
    specifications: {
      "Material": "92% Polyester, 8% Spandex",
      "Fit": "Compression Fit",
      "Care": "Machine Wash Cold",
      "Weight": "Lightweight (150 GSM)",
      "Origin": "Made in India"
    },
    inStock: true,
    deliveryDate: "2-3 business days",
    rating: 4.5,
    reviewCount: 128
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
  const roundedAverage = Math.round(averageRating * 10) / 10;

  const ratingsCount = [0,0,0,0,0];
  reviews.forEach(r => {
    const rt = Math.max(1, Math.min(5, Math.floor(r.rating || 0)));
    ratingsCount[5 - rt] += 1;
  });

  const ratingPercentages = ratingsCount.map(c => Math.round((c / (totalReviews || 1)) * 100));
  const reviewImages = reviews.flatMap(r => (r.images || []));

  return (
    <div className="pt-20 bg-gradient-to-b from-gray-50 to-white text-gray-900 overflow-x-hidden">
      {/* Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-8 lg:gap-16 py-8 lg:py-12">
        
        {/* Left: Image Gallery */}
        <div className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden bg-white shadow-lg border border-gray-200">
            <img
              src={product.images[selectedImage]}
              alt="product"
              className="w-full h-auto object-cover aspect-[3/4]"
            />
          </div>
          <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-thin">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                  selectedImage === i
                    ? "border-red-500 shadow-md scale-105 ring-2 ring-red-200"
                    : "border-gray-300 hover:border-gray-400 hover:scale-102"
                }`}
              >
                <img
                  src={img}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Modern Product Information */}
        <div className="flex flex-col space-y-8">
          {/* Product Header */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="inline-block bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md">
                {product.category}
              </span>
              <div className="flex items-center gap-2 bg-white rounded-full px-3 py-1 shadow-sm border border-gray-200">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-semibold text-gray-700">{product.rating}</span>
                <span className="text-xs text-gray-500">({product.reviewCount})</span>
              </div>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              {product.title}
            </h1>
          </div>
          
          {/* Pricing - Modern Card Style */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-3xl sm:text-4xl font-bold text-gray-900">
                {product.price}
              </span>
              <span className="text-xl text-gray-500 line-through">
                {product.original}
              </span>
              <span className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-md">
                {product.discount} OFF
              </span>
            </div>
            <p className="text-red-600 text-sm font-medium mt-2 flex items-center gap-1">
              <Check className="w-4 h-4" />
              You save ₹4,100.00
            </p>
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Info className="w-5 h-5 text-red-500" />
              Product Description
            </h3>
            <p className="text-gray-700 leading-relaxed text-base">
              {product.description}
            </p>
          </div>

          {/* Key Features - Modern Grid */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {product.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-200">
                  <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-800">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Color Selection - Modern Cards */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Color</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {product.colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color.name)}
                  className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all duration-300 ${
                    selectedColor === color.name 
                      ? "border-red-500 bg-red-50 shadow-md scale-105 ring-2 ring-red-200" 
                      : "border-gray-300 hover:border-gray-400 hover:shadow-sm"
                  }`}
                >
                  <div
                    className="w-12 h-12 rounded-full border-2 border-gray-300 shadow-sm"
                    style={{ backgroundColor: color.value }}
                  ></div>
                  <span className="text-sm font-medium text-gray-700">{color.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Size Selection - Modern Grid */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Select Size</h3>
              <button className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium text-sm">
                <Ruler className="w-4 h-4" />
                Size Guide
              </button>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-4 rounded-xl border-2 font-semibold transition-all duration-300 ${
                    selectedSize === size
                      ? "bg-gray-900 text-white border-gray-900 shadow-md scale-105"
                      : "border-gray-300 text-gray-700 hover:border-gray-400 hover:shadow-sm hover:scale-102 bg-white"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & Actions - Modern Layout */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quantity Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Quantity</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden shadow-sm">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-3 text-gray-600 hover:text-gray-800 transition-colors hover:bg-gray-50"
                    >
                      -
                    </button>
                    <span className="px-6 py-3 border-l border-r border-gray-300 min-w-12 text-center font-semibold bg-white">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-3 text-gray-600 hover:text-gray-800 transition-colors hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                  <div className={`px-3 py-2 rounded-full text-sm font-medium ${
                    product.inStock 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                  }`}>
                    {product.inStock ? "✓ In Stock" : "Out of Stock"}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button className="flex-1 bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-black transition-all duration-300 transform hover:scale-105 shadow-md">
                  Add to Cart
                </button>
                <button className="p-4 border-2 border-gray-300 rounded-xl hover:border-red-300 hover:bg-red-50 transition-all duration-300 group">
                  <Heart className="w-6 h-6 text-red-500 group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* Services - Modern Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center">
                  <Truck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Free Delivery</p>
                  <p className="text-sm text-gray-600">By {product.deliveryDate}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">1 Year Warranty</p>
                  <p className="text-sm text-gray-600">Quality Assured</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center">
                  <RefreshCw className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Easy Returns</p>
                  <p className="text-sm text-gray-600">30-Day Policy</p>
                </div>
              </div>
            </div>
          </div>

          {/* Specifications - Modern Table */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h3>
            <div className="space-y-3">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0">
                  <span className="text-gray-600 font-medium">{key}</span>
                  <span className="text-gray-900 font-semibold bg-gray-50 px-3 py-1 rounded-lg">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Banners */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 grid md:grid-cols-2 gap-4 sm:gap-6">
        <div className="relative bg-gray-900 text-white rounded-2xl p-6 sm:p-8 lg:p-10 overflow-hidden min-h-[200px]">
          <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1400&q=80')] bg-cover bg-center" />
          <div className="relative z-10 h-full flex flex-col justify-center">
            <h3 className="text-xl sm:text-2xl font-bold mb-3">Train Hard. Look Good.</h3>
            <p className="text-sm mb-4 text-gray-200 max-w-md">
              Push your limits with SportsWear9's high-performance collection.
            </p>
            <button className="bg-white text-gray-900 px-5 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors w-fit text-sm">
              Shop Now
            </button>
          </div>
        </div>

        <div className="relative bg-gray-800 text-white rounded-2xl p-6 sm:p-8 lg:p-10 overflow-hidden min-h-[200px]">
          <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1400&q=80')] bg-cover bg-center" />
          <div className="relative z-10 h-full flex flex-col justify-center">
            <h3 className="text-xl sm:text-2xl font-bold mb-3 text-red-500">
              New Season Drop
            </h3>
            <p className="text-sm mb-4 text-gray-200 max-w-md">
              Discover the latest designs crafted for speed and comfort.
            </p>
            <button className="bg-white text-gray-900 px-5 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors w-fit text-sm">
              Explore
            </button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <RecommendedProducts />

      {/* Reviews Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 border-t border-gray-200">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left: Ratings summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
              <div className="flex items-center gap-4">
                <div>
                  <div className="text-3xl sm:text-4xl font-bold text-gray-900">{roundedAverage}</div>
                  <div className="flex items-center mt-2">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={18}
                          className={i < Math.round(averageRating) ? "text-yellow-500" : "text-gray-300"}
                          fill={i < Math.round(averageRating) ? "currentColor" : "none"}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500 ml-3">{totalReviews} global ratings</span>
                  </div>
                </div>
              </div>

              {/* Rating breakdown */}
              <div className="mt-6 space-y-3">
                {[5,4,3,2,1].map((star, idx) => {
                  const pct = ratingPercentages[idx] ?? 0;
                  return (
                    <div key={star} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {Array.from({ length: star }).map((__, i) => (
                            <Star key={i} size={14} className="text-yellow-500" fill="currentColor" />
                          ))}
                        </div>
                        <span className="text-gray-600 text-sm w-8">{pct}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Write a review button */}
              <div className="mt-6">
                <button className="w-full border border-gray-300 py-3 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                  Write a product review
                </button>
              </div>
            </div>
          </div>

          {/* Middle + Right: Enhanced Comments Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customers say */}
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
              <h4 className="font-semibold text-lg text-gray-900 mb-3">Customers say</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Customers find the workout gloves have a nice fit. However, the quality receives mixed feedback, with some customers finding them good while others say they are not of good quality.
              </p>
              <div className="mt-4 flex gap-4 text-sm">
                <button className="text-red-600 hover:text-red-700 font-medium px-3 py-1 bg-red-50 rounded-full transition-colors">
                  Fit
                </button>
                <button className="text-red-600 hover:text-red-700 font-medium px-3 py-1 bg-red-50 rounded-full transition-colors">
                  Quality
                </button>
              </div>
            </div>

            {/* Reviews with images */}
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-900">Reviews with images</h4>
                <button className="text-sm text-red-600 hover:text-red-700 font-medium">
                  See all photos
                </button>
              </div>

              {reviewImages.length > 0 ? (
                <div className="mt-4 overflow-x-auto flex gap-3 py-2 scrollbar-thin">
                  {reviewImages.map((img, i) => (
                    <img 
                      key={i} 
                      src={img} 
                      alt={`review-img-${i}`} 
                      className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-lg border border-gray-200 flex-shrink-0" 
                    />
                  ))}
                </div>
              ) : (
                <div className="mt-4 text-sm text-gray-500 text-center py-4">
                  No review images yet
                </div>
              )}
            </div>

            {/* Enhanced Reviews list */}
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
              <h4 className="font-semibold text-lg text-gray-900 mb-6">Top reviews from India</h4>

              <div className="space-y-6">
                {(showAllReviews ? reviews : reviews.slice(0, 3)).map((r, idx) => (
                  <div key={idx} className="pb-6 border-b border-gray-200 last:border-b-0 last:pb-0">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-semibold text-sm border border-gray-300">
                          {r.name ? r.name.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={14}
                                  className={i < r.rating ? "text-yellow-500" : "text-gray-300"}
                                  fill={i < r.rating ? "currentColor" : "none"}
                                />
                              ))}
                            </div>
                            <span className="text-sm font-medium text-gray-900 truncate">{r.name}</span>
                            <span className="text-xs text-gray-500">{r.date}</span>
                          </div>
                          
                          {/* Enhanced Comment Text */}
                          <p className="text-gray-700 mt-2 leading-relaxed text-sm sm:text-base">
                            {r.text}
                          </p>

                          {/* Review Images */}
                          {r.images && r.images.length > 0 && (
                            <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
                              {r.images.map((img, j) => (
                                <img 
                                  key={j} 
                                  src={img} 
                                  alt={`rev-${idx}-img-${j}`} 
                                  className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border border-gray-200 flex-shrink-0" 
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Verified tag */}
                      {r.rating >= 4 && (
                        <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium whitespace-nowrap ml-2">
                          Verified
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* See more / see less */}
              {reviews.length > 3 && (
                <div className="text-center mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowAllReviews(!showAllReviews)}
                    className="text-sm text-red-600 hover:text-red-700 font-medium px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {showAllReviews ? "Show Less Reviews" : `Show More Reviews (${reviews.length - 3})`}
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
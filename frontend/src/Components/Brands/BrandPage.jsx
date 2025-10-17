import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Star,
  Heart,
  ShoppingCart,
  ListFilter as Filter,
  Grid2x2 as Grid,
  List,
} from "lucide-react";
import { ProductCard } from "../Product/Product";
import VideoClassSection from "../Home/VideoClassSection";
import RecommendedProducts from "../Home/RecommendedProducts";
import ShopTheLookCarousel from "../Banner&Carousels/ShopTheLookCarousel";

import logo1 from "../../assets/1.svg";
import logo2 from "../../assets/2.svg";
import logo3 from "../../assets/3.svg";
import logo4 from "../../assets/4.svg";
import logo5 from "../../assets/5.svg";
import logo6 from "../../assets/6.svg";
import logo7 from "../../assets/7.svg";
import logo8 from "../../assets/8.svg";
import logo9 from "../../assets/9.svg";

const BrandPage = () => {
  const { brandName } = useParams();
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    priceRange: "",
    size: "",
    color: "",
  });

  // Brand data mapping
  const brandData = {
    "Work For It": {
      name: "Work For It",
      logo: logo1,
      description:
        "Built for relentless achievers. Work For It inspires dedication and discipline through every rep.",
      banner:
        "https://images.unsplash.com/photo-1571019613576-2b22c76fd955?auto=format&fit=crop&w=1200&q=80",
      founded: "2018",
      headquarters: "USA",
      rating: 4.4,
      totalProducts: 540,
    },
    U: {
      name: "U",
      logo: logo2,
      description:
        "Minimal yet bold. U represents individuality and personal fitness expression.",
      banner:
        "https://images.unsplash.com/photo-1594737625785-c5c3e7f87a58?auto=format&fit=crop&w=1200&q=80",
      founded: "2020",
      headquarters: "UK",
      rating: 4.2,
      totalProducts: 320,
    },
    WMX: {
      name: "WMX",
      logo: logo3,
      description:
        "High-performance activewear engineered for durability and power.",
      banner:
        "https://images.unsplash.com/photo-1571731956672-f2b94d7dd0cb?auto=format&fit=crop&w=1200&q=80",
      founded: "2016",
      headquarters: "Germany",
      rating: 4.5,
      totalProducts: 410,
    },
    SportInger: {
      name: "SportInger",
      logo: logo4,
      description:
        "Versatile sports essentials designed for training, recovery and lifestyle.",
      banner:
        "https://images.unsplash.com/photo-1616279969859-6a0f8f2940f2?auto=format&fit=crop&w=1200&q=80",
      founded: "2014",
      headquarters: "Canada",
      rating: 4.3,
      totalProducts: 600,
    },
    Ninq: {
      name: "Ninq",
      logo: logo5,
      description:
        "Sleek athleisure with a futuristic touch. Ninq blends comfort and performance.",
      banner:
        "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=1200&q=80",
      founded: "2019",
      headquarters: "Japan",
      rating: 4.1,
      totalProducts: 280,
    },
    "Never Lose": {
      name: "Never Lose",
      logo: logo6,
      description:
        "A mindset, not just a brand. Built for fighters, grinders and comeback kings.",
      banner:
        "https://images.unsplash.com/photo-1609899532197-d8c9e6529a7c?auto=format&fit=crop&w=1200&q=80",
      founded: "2017",
      headquarters: "USA",
      rating: 4.6,
      totalProducts: 450,
    },
    GYMFIC: {
      name: "GYMFIC",
      logo: logo7,
      description:
        "Raw strength meets aesthetics. Gymfic crafts bold designs for lifters.",
      banner:
        "https://images.unsplash.com/photo-1546484959-f9a53a360a5c?auto=format&fit=crop&w=1200&q=80",
      founded: "2015",
      headquarters: "Australia",
      rating: 4.4,
      totalProducts: 390,
    },
    KYK: {
      name: "KYK",
      logo: logo8,
      description: "Street-style gymwear with a touch of rebellion.",
      banner:
        "https://images.unsplash.com/photo-1549045337-967927d923c8?auto=format&fit=crop&w=1200&q=80",
      founded: "2021",
      headquarters: "South Korea",
      rating: 4.0,
      totalProducts: 230,
    },
    "Train Hard": {
      name: "Train Hard",
      logo: logo9,
      description:
        "No excuses. Only progress. Train Hard delivers top-tier fitness gear.",
      banner:
        "https://images.unsplash.com/photo-1556817411-31ae72fa3ea0?auto=format&fit=crop&w=1200&q=80",
      founded: "2013",
      headquarters: "USA",
      rating: 4.7,
      totalProducts: 520,
    },
  };

  const currentBrand = brandData[brandName] || brandData["Work For It"];

  // Mock products for the brand
  const brandProducts = [
    {
      id: 1,
      img: "https://assets.myntassets.com/dpr_1.5,q_30,w_400,c_limit,fl_progressive/assets/images/2025/FEBRUARY/3/L7GEjRDH_b510caa934e949b78484e8cfb577804d.jpg",
      price: "₹2,499.00",
      original: "₹6,599.00",
      discount: "-65%",
      title: `${currentBrand.name} Running Shoes`,
      category: "Performance",
    },
    {
      id: 2,
      img: "https://www.cyclop.in/cdn/shop/files/1_d5b00990-6b2a-4365-849b-084d14380580_1080x.jpg?v=1689009277",
      price: "₹1,999.00",
      original: "₹3,999.00",
      discount: "-50%",
      title: `${currentBrand.name} Training T-shirt`,
      category: "Training",
    },
    {
      id: 3,
      img: "https://assets.myntassets.com/dpr_1.5,q_30,w_400,c_limit,fl_progressive/assets/images/2025/FEBRUARY/3/L7GEjRDH_b510caa934e949b78484e8cfb577804d.jpg",
      price: "₹3,499.00",
      original: "₹6,999.00",
      discount: "-50%",
      title: `${currentBrand.name} Sports Shorts`,
      category: "Performance",
    },
    {
      id: 4,
      img: "https://www.cyclop.in/cdn/shop/files/1_d5b00990-6b2a-4365-849b-084d14380580_1080x.jpg?v=1689009277",
      price: "₹4,499.00",
      original: "₹8,999.00",
      discount: "-50%",
      title: `${currentBrand.name} Athletic Jacket`,
      category: "Originals",
    },
    {
      id: 5,
      img: "https://assets.myntassets.com/dpr_1.5,q_30,w_400,c_limit,fl_progressive/assets/images/2025/FEBRUARY/3/L7GEjRDH_b510caa934e949b78484e8cfb577804d.jpg",
      price: "₹1,799.00",
      original: "₹3,599.00",
      discount: "-50%",
      title: `${currentBrand.name} Casual Sneakers`,
      category: "Lifestyle",
    },
    {
      id: 6,
      img: "https://www.cyclop.in/cdn/shop/files/1_d5b00990-6b2a-4365-849b-084d14380580_1080x.jpg?v=1689009277",
      price: "₹2,299.00",
      original: "₹4,599.00",
      discount: "-50%",
      title: `${currentBrand.name} Compression Leggings`,
      category: "Training",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16 md:pt-20">
      {/* Brand Header */}
      <div className="relative">
        <div
          className="h-48 sm:h-56 md:h-64 lg:h-72 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${currentBrand.banner})` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          
          <div className="relative z-10 h-full flex items-end">
            <div className="w-full px-4 sm:px-6 lg:px-8 pb-6 md:pb-8">
              <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 sm:gap-6">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-white rounded-xl p-3 shadow-lg flex-shrink-0">
                    <img
                      src={currentBrand.logo}
                      alt={currentBrand.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="text-white flex-1">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
                      {currentBrand.name}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3 text-sm sm:text-base">
                      <div className="flex items-center gap-1 bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{currentBrand.rating}</span>
                      </div>
                      <div className="bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full">
                        <span className="font-medium">{currentBrand.totalProducts}+ Products</span>
                      </div>
                      <div className="bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full">
                        <span>Est. {currentBrand.founded}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Brand Description */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
          <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-4">
            {currentBrand.description}
          </p>
          <div className="flex flex-wrap gap-4 md:gap-6 text-sm text-gray-600 border-t border-gray-100 pt-4">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">Founded:</span>
              <span>{currentBrand.founded}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">Headquarters:</span>
              <span>{currentBrand.headquarters}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">Products:</span>
              <span>{currentBrand.totalProducts}+</span>
            </div>
          </div>
        </div>

        {/* Recommended Products Section */}
        <div className="mb-8">
          <RecommendedProducts />
        </div>

        {/* Filters and Sort Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
            >
              <Filter size={18} />
              Filters
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm font-medium bg-white"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "grid" 
                  ? "bg-white text-gray-900 shadow-sm" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "list" 
                  ? "bg-white text-gray-900 shadow-sm" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <List size={18} />
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div
            className={`${
              showFilters ? "block" : "hidden"
            } lg:block w-full lg:w-80 flex-shrink-0 bg-white rounded-xl shadow-sm p-6 border border-gray-100 h-fit sticky top-24`}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-lg text-gray-900">Filters</h3>
              <button 
                onClick={() => setShowFilters(false)}
                className="lg:hidden text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              {/* Category Filter */}
              <div>
                <h4 className="font-medium mb-3 text-gray-900">Category</h4>
                <div className="space-y-2">
                  {["Performance", "Training", "Originals", "Lifestyle"].map(
                    (cat) => (
                      <label key={cat} className="flex items-center text-sm cursor-pointer group">
                        <input
                          type="radio"
                          name="category"
                          value={cat}
                          checked={filters.category === cat}
                          onChange={(e) =>
                            setFilters({ ...filters, category: e.target.value })
                          }
                          className="mr-3 w-4 h-4 text-red-500 focus:ring-red-500"
                        />
                        <span className="group-hover:text-gray-900 transition-colors">
                          {cat}
                        </span>
                      </label>
                    )
                  )}
                </div>
              </div>

              {/* Price Range Filter */}
              <div>
                <h4 className="font-medium mb-3 text-gray-900">Price Range</h4>
                <div className="space-y-2">
                  {[
                    "Under ₹1000",
                    "₹1000 - ₹3000",
                    "₹3000 - ₹5000",
                    "Above ₹5000",
                  ].map((range) => (
                    <label key={range} className="flex items-center text-sm cursor-pointer group">
                      <input
                        type="radio"
                        name="priceRange"
                        value={range}
                        checked={filters.priceRange === range}
                        onChange={(e) =>
                          setFilters({ ...filters, priceRange: e.target.value })
                        }
                        className="mr-3 w-4 h-4 text-red-500 focus:ring-red-500"
                      />
                      <span className="group-hover:text-gray-900 transition-colors">
                        {range}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Size Filter */}
              <div>
                <h4 className="font-medium mb-3 text-gray-900">Size</h4>
                <div className="grid grid-cols-3 gap-2">
                  {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                    <button
                      key={size}
                      onClick={() =>
                        setFilters({
                          ...filters,
                          size: filters.size === size ? "" : size,
                        })
                      }
                      className={`py-2 px-3 border rounded-lg text-sm font-medium transition-all ${
                        filters.size === size
                          ? "border-red-500 bg-red-50 text-red-600 shadow-sm"
                          : "border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-900"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="mb-6">
              <p className="text-sm md:text-base text-gray-600">
                Showing {brandProducts.length} products for{" "}
                <span className="font-semibold text-gray-900">{currentBrand.name}</span>
              </p>
            </div>

            <div
              className={`grid gap-4 ${
                viewMode === "grid"
                  ? "grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1"
              }`}
            >
              {brandProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <button className="px-8 py-3.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all font-semibold text-sm md:text-base shadow-sm hover:shadow-md">
                Load More Products
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandPage;
import React, { useEffect, useMemo, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import {
  fetchProducts,
  selectAllProducts,
  selectProductsLoading,
} from "../Product/productslice";

import { fetchSearchResults, setSearchQuery } from "./Searchslice";

import { ProductCard } from "../Product/Product";
import SkeletonLoader from "../Home/SkeletonLoader";

const FIXED_BRANDS = [
  "All",
  "Gymific",
  "KyK",
  "NeverLose",
  "Ninq",
  "Sportsinger",
  "Train Hard",
  "U",
  "WMX",
  "Work for it",
];

const FIXED_GENDERS = ["All", "Men", "Women", "Unisex"];

const placeholders = [
  "running shoes...",
  "your perfect sportswear...",
  "trending styles...",
  "athletic wear...",
  "latest collections...",
];

const transformProductData = (p) => ({
  id: p.product_uuid,
  product_uuid: p.product_uuid,
  title: p.name || p.title,
  price: p.price ? String(p.price) : `₹${p.net || p.price || ""}`,
  original: p.original || "",
  discount: p.discount || p.disc || "",
  brand: typeof p.brand === "object" ? p.brand?.name : p.brand,
  category: p.category?.name || p.category || "Uncategorized",
  gender: p.gender || null,
  img: p.img ? p.img : null,
  img2: p.img2 ? p.img2 : null,
  rating: parseFloat(p.average_rating || p.rating) || 4.2,
  priceValue: Number(p.price || p.net || 0),
  isFeatured: p.is_featured,
  tags: Array.isArray(p.tags) ? p.tags : [],
});

export default function CategoriesPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const urlParams = new URLSearchParams(location.search);
  const initialQ = urlParams.get("q") || "";

  const [searchTerm, setSearchTerm] = useState(initialQ);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeGender, setActiveGender] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeBrand, setActiveBrand] = useState("All");
  const [maxPrice, setMaxPrice] = useState(5000);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("-created_at");
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);

  const suggestionsRef = useRef(null);
  const inputRef = useRef(null);

  const productsStateRaw = useSelector(
    (state) => state.product?.products ?? state.products?.products ?? []
  );

  const loadingProducts = useSelector(
    (state) => state.product?.loading ?? state.products?.loading ?? false
  );

  const searchSliceResults = useSelector(
    (state) => state.search?.results ?? []
  );
  const searchSliceLoading = useSelector(
    (state) => state.search?.loading ?? false
  );

  const normalizeProductsArray = (raw) => {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    if (Array.isArray(raw.results)) return raw.results;
    return [];
  };

  const productsRawArray = normalizeProductsArray(productsStateRaw);
  const products = useMemo(
    () => productsRawArray.map(transformProductData),
    [productsRawArray]
  );

  // ✅ FIX: Use search results when available, otherwise use regular products
  const searchArray = Array.isArray(searchSliceResults?.results)
    ? searchSliceResults.results
    : Array.isArray(searchSliceResults)
    ? searchSliceResults
    : [];

  const displayProducts = useMemo(() => {
    if (searchTerm && searchArray.length > 0) {
      return searchArray.map(transformProductData);
    }
    return products;
  }, [searchTerm, searchArray, products]);

  const categories = useMemo(() => {
    const set = new Set();
    displayProducts.forEach((p) => p.category && set.add(p.category));
    return ["All", ...Array.from(set)];
  }, [displayProducts]);

  const allBrands = useMemo(() => {
    const set = new Set();
    displayProducts.forEach(
      (p) => p.brand && p.brand !== "Unbranded" && set.add(p.brand)
    );
    return Array.from(set);
  }, [displayProducts]);

  const buildBackendParams = () => {
    const params = {};

    if (searchTerm && searchTerm.trim().length > 0) {
      params.search = searchTerm.trim();
    }

    if (activeGender && activeGender !== "All") {
      params.gender = activeGender.toLowerCase();
    }

    if (activeCategory && activeCategory !== "All") {
      params.category = activeCategory;
    }

    if (activeBrand && activeBrand !== "All") {
      params.brand = activeBrand;
    }

    if (maxPrice) {
      params.max_price = Number(maxPrice);
    }

    if (minRating > 0) {
      params.min_rating = Number(minRating);
    }

    if (sortBy) {
      params.ordering = sortBy;
    }

    return params;
  };

  const fetchWithCurrentFilters = () => {
    const params = buildBackendParams();
    dispatch(fetchProducts(params));
  };

  useEffect(() => {
    fetchWithCurrentFilters();
  }, [
    searchTerm,
    activeGender,
    activeCategory,
    activeBrand,
    maxPrice,
    minRating,
    sortBy,
  ]);

  useEffect(() => {
    if (searchTerm && searchTerm.trim().length > 0) {
      dispatch(setSearchQuery(searchTerm));
      dispatch(fetchSearchResults(searchTerm));
    } else {
      dispatch(setSearchQuery(""));
    }
  }, [searchTerm, dispatch]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onClick = (e) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target) &&
        inputRef.current &&
        e.target !== inputRef.current
      ) {
        setShowSuggestions(false);
      }
    };
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, []);

  const handleSearchSubmit = (e) => {
    e?.preventDefault?.();
    const params = new URLSearchParams(location.search);
    if (searchTerm && searchTerm.trim().length > 0) {
      params.set("q", searchTerm.trim());
    } else {
      params.delete("q");
    }
    navigate(
      { pathname: location.pathname, search: params.toString() },
      { replace: true }
    );
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (val) => {
    setSearchTerm(val);
    setShowSuggestions(false);
    const params = new URLSearchParams(location.search);
    params.set("q", val);
    navigate(
      { pathname: location.pathname, search: params.toString() },
      { replace: true }
    );
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setShowSuggestions(false);
    const params = new URLSearchParams(location.search);
    params.delete("q");
    navigate(
      { pathname: location.pathname, search: params.toString() },
      { replace: true }
    );
  };

  const resetAllFilters = () => {
    setSearchTerm("");
    setActiveGender("");
    setActiveCategory("All");
    setActiveBrand("All");
    setMaxPrice(5000);
    setMinRating(0);
    setSortBy("-created_at");
    setShowSuggestions(false);

    const params = new URLSearchParams(location.search);
    params.delete("q");
    navigate(
      { pathname: location.pathname, search: params.toString() },
      { replace: true }
    );
  };

  // ✅ FIX: Use displayProducts count instead of products count
  const filteredProductsCount = displayProducts.length;
  const isLoading = loadingProducts || (searchTerm && searchSliceLoading);

  return (
    <>
      <style>{`
        @keyframes placeholderFade {
          0% { opacity: 0; transform: translateY(-5px); }
          10% { opacity: 1; transform: translateY(0); }
          90% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(5px); }
        }
        .placeholder-animate::placeholder {
          animation: placeholderFade 3s ease-in-out;
        }
        .filter-section {
          transition: all 0.3s ease;
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white text-gray-900 pt-16">
        <div className="bg-white/80 backdrop-blur-sm border-b border-blue-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  {searchTerm
                    ? `Search: "${searchTerm}"`
                    : activeCategory === "All"
                    ? "All Products"
                    : `${activeCategory} Collection`}
                </h1>
                <p className="mt-2 text-gray-600 max-w-2xl">
                  Discover premium sportswear and athletic gear tailored for
                  performance and style
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="hidden sm:flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-full">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-blue-700">
                    {filteredProductsCount}{" "}
                    {filteredProductsCount === 1 ? "product" : "products"}
                  </span>
                </div>

                <form
                  onSubmit={handleSearchSubmit}
                  className="relative flex-1 sm:flex-none min-w-[280px]"
                >
                  <input
                    ref={inputRef}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder={`Search for ${placeholders[currentPlaceholder]}`}
                    className="w-full border border-gray-200 rounded-full py-3 px-5 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder-animate bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-300"
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      ×
                    </button>
                  )}
                  <button
                    type="submit"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500"
                  >
                    <svg
                      className="w-5 h-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                      />
                    </svg>
                  </button>
                </form>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-200 rounded-full py-3 px-4 bg-white focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm"
                >
                  <option value="-created_at">Latest Arrivals</option>
                  <option value="price">Price: Low → High</option>
                  <option value="-price">Price: High → Low</option>
                  <option value="-rating">Top Rated</option>
                </select>
              </div>
            </div>

            {showSuggestions && searchSliceResults.length > 0 && (
              <div
                ref={suggestionsRef}
                className="absolute z-50 mt-2 w-full max-w-md bg-white rounded-xl shadow-lg border border-gray-200"
              >
                <div className="py-2">
                  {searchSliceResults.slice(0, 5).map((result, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        handleSuggestionClick(result.title || result.name)
                      }
                      className="w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors"
                    >
                      {result.title || result.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100 filter-section">
                <h3 className="font-bold text-lg text-gray-900 mb-4">Gender</h3>
                <div className="space-y-2">
                  {FIXED_GENDERS.map((gender) => (
                    <button
                      key={gender}
                      onClick={() =>
                        setActiveGender(gender === "All" ? "" : gender)
                      }
                      className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                        (gender === "All" && !activeGender) ||
                        activeGender === gender
                          ? "bg-blue-50 border-blue-200 text-blue-700"
                          : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {gender}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100 filter-section">
                <h3 className="font-bold text-lg text-gray-900 mb-4">
                  Categories
                </h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                        activeCategory === category
                          ? "bg-blue-50 border-blue-200 text-blue-700"
                          : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100 filter-section">
                <h3 className="font-bold text-lg text-gray-900 mb-4">Brands</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {FIXED_BRANDS.map((brand) => (
                    <button
                      key={brand}
                      onClick={() => setActiveBrand(brand)}
                      className={`w-full text-left p-2 rounded-lg transition-all duration-200 ${
                        activeBrand === brand
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100 filter-section">
                <h3 className="font-bold text-lg text-gray-900 mb-4">
                  Price Range
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Max: ₹{maxPrice}
                    </span>
                    <span className="text-xs text-gray-500">₹100 - ₹5000</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="5000"
                    step="100"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600"
                  />
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100 filter-section">
                <h3 className="font-bold text-lg text-gray-900 mb-4">
                  Customer Rating
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {[0, 3, 4, 4.5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setMinRating(rating)}
                      className={`p-3 rounded-xl border transition-all duration-200 ${
                        minRating === rating
                          ? "bg-blue-600 text-white border-blue-700 shadow-sm"
                          : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {rating === 0 ? (
                        <span className="text-sm font-medium">Any Rating</span>
                      ) : (
                        <div className="flex items-center justify-center space-x-1">
                          <span className="text-sm font-medium">{rating}+</span>
                          <span>⭐</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={resetAllFilters}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-[1.02] active:scale-95"
              >
                Reset All Filters
              </button>
            </div>

            <div className="lg:col-span-3">
              {isLoading ? (
                <SkeletonLoader count={8} />
              ) : displayProducts.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
                  <div className="w-24 h-24 mx-auto mb-6 text-blue-300">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 2a8 8 0 100 16 8 8 0 000-16zM4 10a6 6 0 1112 0 6 6 0 01-12 0z"
                        clipRule="evenodd"
                      />
                      <path
                        fillRule="evenodd"
                        d="M10 12a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    No products found
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Try adjusting your filters or search terms to find what
                    you're looking for.
                  </p>
                  <button
                    onClick={resetAllFilters}
                    className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 font-medium shadow-lg"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <>
                  <div className="sm:hidden flex items-center justify-between mb-6 p-4 bg-white rounded-xl shadow-sm">
                    <span className="text-sm font-medium text-gray-700">
                      {displayProducts.length} products
                    </span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="text-sm border border-gray-200 rounded-lg py-1 px-3"
                    >
                      <option value="-created_at">Latest</option>
                      <option value="price">Price: Low → High</option>
                      <option value="-price">Price: High → Low</option>
                      <option value="-rating">Top Rated</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayProducts.map((product) => (
                      <div
                        key={product.id}
                        className="transform hover:scale-[1.02] transition-transform duration-300"
                      >
                        <ProductCard product={product} />
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

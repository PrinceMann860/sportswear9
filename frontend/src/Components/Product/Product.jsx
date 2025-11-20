// FULL UPDATED PRODUCT.JSX WITH SKELETON LOADERS
import React, { useState, useEffect, useMemo } from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
} from "./productslice";
import {
  fetchHomepageLevels,
  selectHomepageLevels,
  selectHomepageLoading,
  selectHomepageError,
} from "../Home/HomePageSlice";
import { Filter, X, Search, ChevronDown, ChevronUp } from "lucide-react";
import banner from "../../assets/productbanner.png";
import LandscapeCarousel from "../Banner&Carousels/LandscapeCarousel";

// fallback banners (unchanged)
const fallbackBanners = [
  { id: 1, image: "https://contents.mediadecathlon.com/s1320107/k$c54604171dd875f3b0ea65cd781b3827/defaut.jpg?format=auto&quality=70&f=1920x0" },
  { id: 2, image: "https://contents.mediadecathlon.com/s1319184/k$8f796bb36f174a5def19954deb82ea21/defaut.jpg?format=auto&quality=70&f=1920x0" },
  { id: 3, image: "https://contents.mediadecathlon.com/s1319183/k$49524bae0ca31288ebeece35e8592f5d/defaut.jpg?format=auto&quality=70&f=1920x0" },
];

// Product Card
function ProductCard({ product }) {
  const rating = product.rating?.rate || 4.5;
  const count = product.rating?.count || 100;

  return (
    <Link to={`/ProductInfo/${product.product_uuid || product.id}`}>
      <div className="relative max-w-[300px] bg-white overflow-hidden border border-gray-200 hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col rounded-lg">
        <div className="group relative w-full h-46 md:h-54 lg:h-70 flex items-center justify-center bg-gray-50">
          {product.isFeatured && (
            <div className="absolute bg-yellow-400 text-black text-xs font-bold px-2 py-1 top-0 left-0 shadow z-10">
              FEATURED
            </div>
          )}

          <img
            src={product.img}
            alt={product.title}
            className="absolute w-full h-full object-fill transition-opacity duration-500 group-hover:opacity-0"
          />

          {product.img2 && (
            <img
              src={product.img2}
              alt={`${product.title} Hover`}
              className="absolute w-full h-full object-fill opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          )}
        </div>

        <div className="relative bottom-11 left-2">
          <div className="flex p-2 text-sm font-semibold text-gray-900 bg-white/70 w-16">
            ⭐ {rating}
          </div>
        </div>

        <div className="mt-[-22px] px-4 text-start flex flex-col flex-grow min-h-[120px]">
          <p className="font-bold text-gray-900 uppercase">
            {typeof product.brand === "object" ? product.brand?.name : product.brand}
          </p>
          <h3 className="font-semibold text-gray-900 line-clamp-2 mt-1">{product.title}</h3>

          <div className="mt-1 flex items-center gap-2">
            <p className="text-lg font-bold text-gray-900">{product.price}</p>
            <p className="text-sm text-gray-500">
              <span className="line-through mr-1">{product.original}</span>
              <span className="text-red-500 font-medium">{product.discount}</span>
            </p>
          </div>
        </div>

        <button className="w-[95%] mx-auto py-2 my-2 text-sm font-bold uppercase border border-gray-300 bg-white hover:bg-gray-100 transition">
          Add to Cart
        </button>
      </div>
    </Link>
  );
}

// Skeleton Product Card
function SkeletonProductCard() {
  return (
    <div className="relative max-w-[300px] bg-white overflow-hidden border border-gray-200 flex flex-col rounded-lg animate-pulse">
      <div className="w-full h-46 md:h-54 lg:h-70 bg-gray-300 flex items-center justify-center">
        <div className="w-full h-full bg-gray-300"></div>
      </div>

      <div className="relative bottom-11 left-2">
        <div className="flex p-2 text-sm font-semibold bg-gray-300 w-16 h-6 rounded"></div>
      </div>

      <div className="mt-[-22px] px-4 text-start flex flex-col flex-grow min-h-[120px] space-y-2 py-2">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-full"></div>
        <div className="h-4 bg-gray-300 rounded w-2/3"></div>
        
        <div className="mt-2 flex items-center gap-2">
          <div className="h-6 bg-gray-300 rounded w-1/3"></div>
          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
        </div>
      </div>

      <div className="w-[95%] mx-auto py-2 my-2 bg-gray-300 rounded h-10"></div>
    </div>
  );
}

// Skeleton Banner
function SkeletonBanner() {
  return (
    <div className="mb-10 animate-pulse">
      <div className="w-full h-64 bg-gray-300 rounded-xl"></div>
    </div>
  );
}

// Skeleton Filter Section
function SkeletonFilterSection() {
  return (
    <div className="w-full lg:w-64 bg-white p-4 rounded-lg border border-gray-200 h-fit sticky top-4 animate-pulse">
      <div className="flex justify-between items-center mb-4">
        <div className="h-6 bg-gray-300 rounded w-20"></div>
        <div className="h-4 bg-gray-300 rounded w-16"></div>
      </div>

      {/* Search Skeleton */}
      <div className="mb-6">
        <div className="w-full h-10 bg-gray-300 rounded-lg"></div>
      </div>

      {/* Brand Filter Skeleton */}
      <div className="mb-6 border-b border-gray-200 pb-4">
        <div className="h-5 bg-gray-300 rounded w-16 mb-2"></div>
        <div className="w-full h-8 bg-gray-300 rounded"></div>
      </div>

      {/* Price Range Skeleton */}
      <div className="mb-6 border-b border-gray-200 pb-4">
        <div className="h-5 bg-gray-300 rounded w-24 mb-2"></div>
        <div className="flex gap-2">
          <div className="w-1/2 h-8 bg-gray-300 rounded"></div>
          <div className="w-1/2 h-8 bg-gray-300 rounded"></div>
        </div>
      </div>

      {/* Discount Range Skeleton */}
      <div className="mb-6 border-b border-gray-200 pb-4">
        <div className="h-5 bg-gray-300 rounded w-28 mb-2"></div>
        <div className="flex gap-2">
          <div className="w-1/2 h-8 bg-gray-300 rounded"></div>
          <div className="w-1/2 h-8 bg-gray-300 rounded"></div>
        </div>
      </div>

      {/* Product Status Skeleton */}
      <div className="mb-6 border-b border-gray-200 pb-4">
        <div className="h-5 bg-gray-300 rounded w-24 mb-2"></div>
        <div className="space-y-3">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-300 rounded mr-3"></div>
            <div className="h-4 bg-gray-300 rounded w-24"></div>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-300 rounded mr-3"></div>
            <div className="h-4 bg-gray-300 rounded w-20"></div>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-300 rounded mr-3"></div>
            <div className="h-4 bg-gray-300 rounded w-16"></div>
          </div>
        </div>
      </div>

      {/* Sorting Skeleton */}
      <div className="mb-6">
        <div className="h-5 bg-gray-300 rounded w-16 mb-2"></div>
        <div className="w-full h-8 bg-gray-300 rounded"></div>
      </div>

      {/* Apply Button Skeleton */}
      <div className="w-full h-12 bg-gray-300 rounded-lg"></div>
    </div>
  );
}

// transform API → UI
const transformProductData = (apiProduct) => ({
  id: apiProduct.product_uuid,
  product_uuid: apiProduct.product_uuid,
  title: apiProduct.name,
  price: apiProduct.price || `₹${apiProduct.net}`,
  original: apiProduct.original || "",
  discount: apiProduct.discount || "",
  brand: apiProduct.brand,
  category: apiProduct.category?.name || "Uncategorized",
  img: apiProduct.img ? `http://127.0.0.1:8000${apiProduct.img}` : "",
  img2: apiProduct.img2 ? `http://127.0.0.1:8000${apiProduct.img2}` : "",
  rating: { rate: apiProduct.average_rating || 4.5, count: 120 },
  isFeatured: apiProduct.is_featured,
});

const FIXED_BRANDS = ["All", "Gymific", "KyK", "NeverLose", "Ninq", "Sportsinger", "Train Hard", "U", "WMX", "Work for it"];

// Filter Section Component
function FilterSection({ 
  searchTerm, 
  setSearchTerm, 
  selectedBrand, 
  setSelectedBrand, 
  priceRange, 
  setPriceRange, 
  discountRange, 
  setDiscountRange, 
  filters, 
  setFilters, 
  sortBy, 
  setSortBy, 
  applyFilters, 
  clearFilters,
  showMobileFilters,
  setShowMobileFilters 
}) {
  const [expandedSections, setExpandedSections] = useState({
    brand: true,
    price: true,
    discount: true,
    status: true,
    sort: true
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition w-full justify-center"
        >
          <Filter className="w-4 h-4" />
          {showMobileFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {/* Filter Sidebar */}
      <div className={`
        ${showMobileFilters ? 'block' : 'hidden'} 
        lg:block w-full lg:w-64 bg-white p-4 rounded-lg border border-gray-200 h-fit sticky top-4
      `}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Filters</h2>
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Clear All
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Brand Filter */}
        <div className="mb-6 border-b border-gray-200 pb-4">
          <button
            onClick={() => toggleSection('brand')}
            className="flex justify-between items-center w-full mb-2 font-semibold text-gray-900"
          >
            <span>Brand</span>
            {expandedSections.brand ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {expandedSections.brand && (
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            >
              {FIXED_BRANDS.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          )}
        </div>

        {/* Price Range */}
        <div className="mb-6 border-b border-gray-200 pb-4">
          <button
            onClick={() => toggleSection('price')}
            className="flex justify-between items-center w-full mb-2 font-semibold text-gray-900"
          >
            <span>Price Range</span>
            {expandedSections.price ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {expandedSections.price && (
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min ₹"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                  className="w-1/2 p-2 border border-gray-300 rounded text-sm"
                />
                <input
                  type="number"
                  placeholder="Max ₹"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                  className="w-1/2 p-2 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>
          )}
        </div>

        {/* Discount Range */}
        <div className="mb-6 border-b border-gray-200 pb-4">
          <button
            onClick={() => toggleSection('discount')}
            className="flex justify-between items-center w-full mb-2 font-semibold text-gray-900"
          >
            <span>Discount Range</span>
            {expandedSections.discount ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {expandedSections.discount && (
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min %"
                  value={discountRange.min}
                  onChange={(e) => setDiscountRange(prev => ({ ...prev, min: e.target.value }))}
                  className="w-1/2 p-2 border border-gray-300 rounded text-sm"
                />
                <input
                  type="number"
                  placeholder="Max %"
                  value={discountRange.max}
                  onChange={(e) => setDiscountRange(prev => ({ ...prev, max: e.target.value }))}
                  className="w-1/2 p-2 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>
          )}
        </div>

        {/* Product Status */}
        <div className="mb-6 border-b border-gray-200 pb-4">
          <button
            onClick={() => toggleSection('status')}
            className="flex justify-between items-center w-full mb-2 font-semibold text-gray-900"
          >
            <span>Product Status</span>
            {expandedSections.status ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {expandedSections.status && (
            <div className="space-y-3">
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={filters.is_new}
                  onChange={(e) => setFilters(prev => ({ ...prev, is_new: e.target.checked }))}
                  className="mr-3 w-4 h-4 text-blue-600"
                />
                New Arrivals
              </label>
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={filters.is_featured}
                  onChange={(e) => setFilters(prev => ({ ...prev, is_featured: e.target.checked }))}
                  className="mr-3 w-4 h-4 text-blue-600"
                />
                Featured
              </label>
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={filters.is_popular}
                  onChange={(e) => setFilters(prev => ({ ...prev, is_popular: e.target.checked }))}
                  className="mr-3 w-4 h-4 text-blue-600"
                />
                Popular
              </label>
            </div>
          )}
        </div>

        {/* Sorting */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('sort')}
            className="flex justify-between items-center w-full mb-2 font-semibold text-gray-900"
          >
            <span>Sort By</span>
            {expandedSections.sort ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {expandedSections.sort && (
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            >
              <option value="">Default</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
              <option value="-created_at">Newest First</option>
              <option value="created_at">Oldest First</option>
            </select>
          )}
        </div>

        {/* Apply Filters Button */}
        <button
          onClick={applyFilters}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
        >
          Apply Filters
        </button>
      </div>
    </>
  );
}

// ⬇️ MAIN COMPONENT WITH SKELETON LOADERS
function Product() {
  const dispatch = useDispatch();
  const { "*": path } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const apiProductsState = useSelector((state) => state.product?.products ?? []);
  const loading = useSelector((state) => state.product?.loading ?? false);
  const error = useSelector((state) => state.product?.error ?? null);

  const homepageData = useSelector(selectHomepageLevels);
  const homepageLoading = useSelector(selectHomepageLoading);
  const homepageError = useSelector(selectHomepageError);

  // Filter states
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [discountRange, setDiscountRange] = useState({ min: "", max: "" });
  const [filters, setFilters] = useState({
    is_new: false,
    is_featured: false,
    is_popular: false,
  });
  const [sortBy, setSortBy] = useState("");

  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);

  const activePath = useMemo(() => {
    if (!path) return "all";
    return path.toLowerCase();
  }, [path]);

  // Apply filters and fetch products
  const applyFilters = () => {
    const filterParams = {};

    // Gender filter from URL path
    if (activePath.includes("men")) filterParams.gender = "men";
    else if (activePath.includes("women")) filterParams.gender = "women";
    else if (activePath.includes("kids")) filterParams.gender = "kids";

    // Search filter
    if (searchTerm) filterParams.search = searchTerm;

    // Brand filter
    if (selectedBrand && selectedBrand !== "All") {
      filterParams.brand = selectedBrand;
    }

    // Price range
    if (priceRange.min) filterParams.min_price = priceRange.min;
    if (priceRange.max) filterParams.max_price = priceRange.max;

    // Discount range
    if (discountRange.min) filterParams.min_disc = discountRange.min;
    if (discountRange.max) filterParams.max_disc = discountRange.max;

    // Boolean filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) filterParams[key] = "true";
    });

    // Sorting
    if (sortBy) filterParams.ordering = sortBy;

    console.log("🔄 Applying filters:", filterParams);
    dispatch(fetchProducts(filterParams));
    
    // Close mobile filters after applying
    setShowMobileFilters(false);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedBrand("All");
    setPriceRange({ min: "", max: "" });
    setDiscountRange({ min: "", max: "" });
    setFilters({
      is_new: false,
      is_featured: false,
      is_popular: false,
    });
    setSortBy("");
    
    // Fetch all products without filters
    const genderFilter = activePath.includes("men") ? { gender: "men" } 
      : activePath.includes("women") ? { gender: "women" } 
      : activePath.includes("kids") ? { gender: "kids" } 
      : {};
    
    dispatch(fetchProducts(genderFilter));
  };

  // Fetch products when component mounts or path changes
  useEffect(() => {
    const genderFilter = activePath.includes("men") ? { gender: "men" } 
      : activePath.includes("women") ? { gender: "women" } 
      : activePath.includes("kids") ? { gender: "kids" } 
      : {};
    
    dispatch(fetchProducts(genderFilter));
    dispatch(fetchHomepageLevels());
  }, [dispatch, activePath]);

  const products = useMemo(() => {
    return Array.isArray(apiProductsState)
      ? apiProductsState.map(transformProductData)
      : [];
  }, [apiProductsState]);

  // --- DEBUG: Check homepage data structure ---
  useEffect(() => {
    console.log("🏠 Homepage Data:", homepageData);
    console.log("🔍 Active Path:", activePath);
  }, [homepageData, activePath]);

  // --- FIXED BANNER FILTERING LOGIC ---
  const getProductSection = () => {
    if (!homepageData || homepageData.length === 0) {
      console.log("❌ No homepage data found");
      return [];
    }

    // Find the level with name "product section" (case insensitive)
    const level = homepageData.find(
      (lvl) => lvl.name?.toLowerCase().includes("product section")
    );
    
    if (!level) {
      console.log("❌ No 'product section' level found in homepage data");
      console.log("Available levels:", homepageData.map(l => l.name));
      return [];
    }

    console.log("✅ Found product section:", level);
    return level.sections || [];
  };

  const productSections = getProductSection();

  // --- IMPROVED GENDER HANDLING LOGIC ---
  const genderKey = useMemo(() => {
  const segments = activePath.split("/");

  if (segments.includes("men")) return "men";
  if (segments.includes("women")) return "women";
  if (segments.includes("kids")) return "kids";

  return null;
}, [activePath]);


  const genderBannerItems = useMemo(() => {
    if (!productSections || productSections.length === 0) {
      console.log("❌ No product sections found, using fallback banners");
      return fallbackBanners;
    }

    console.log("📋 Available sections:", productSections.map(s => s.title));

    // If gender is present → return only that section
    if (genderKey) {
      // Try exact match first
      let match = productSections.find(
        (sec) => sec.title?.toLowerCase() === genderKey
      );

      // If no exact match, try partial match
      if (!match) {
        match = productSections.find(
          (sec) => sec.title?.toLowerCase().includes(genderKey)
        );
      }

      // If still no match, try with 's' suffix
      if (!match) {
        match = productSections.find(
          (sec) => sec.title?.toLowerCase().includes(genderKey + 's')
        );
      }

      console.log(`🎯 Gender '${genderKey}' match:`, match);
      return match ? match.items : [];
    }

    // No gender → return ALL banners from product section
    console.log("🌐 No gender filter, showing all banners");
    const allItems = productSections.flatMap((sec) => sec.items || []);
    return allItems.length > 0 ? allItems : fallbackBanners;
  }, [productSections, genderKey]);

  // Debug banner items
  useEffect(() => {
    console.log("🖼️ Final banner items to display:", genderBannerItems);
  }, [genderBannerItems]);

  // Show loading state
  if (error)
    return <div className="p-10 text-red-500 text-center">Error: {error}</div>;

  return (
    <div className="mx-auto mt-10 px-4 sm:px-8 md:px-12 lg:px-16 py-16 bg-gray-50">
      {/* Skeleton Banner or Actual Banner */}
      {homepageLoading ? (
        <SkeletonBanner />
      ) : (
        genderBannerItems && genderBannerItems.length > 0 && (
          <div className="mb-10">
            <LandscapeCarousel
              items={genderBannerItems.map((i) => ({ 
                id: i.item_uuid || i.id, 
                image: i.image 
              }))}
            />
          </div>
        )
      )}

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {genderKey ? `${genderKey.toUpperCase()} PRODUCTS` : "ALL PRODUCTS"}
        </h1>
        {!loading && (
          <p className="text-gray-600">Showing {products.length} products</p>
        )}
      </div>

      {/* Main Content with Sidebar Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Sidebar - Filters */}
        <div className="lg:w-64 flex-shrink-0">
          {loading ? (
            <SkeletonFilterSection />
          ) : (
            <FilterSection
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedBrand={selectedBrand}
              setSelectedBrand={setSelectedBrand}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              discountRange={discountRange}
              setDiscountRange={setDiscountRange}
              filters={filters}
              setFilters={setFilters}
              sortBy={sortBy}
              setSortBy={setSortBy}
              applyFilters={applyFilters}
              clearFilters={clearFilters}
              showMobileFilters={showMobileFilters}
              setShowMobileFilters={setShowMobileFilters}
            />
          )}
        </div>

        {/* Right Content - Products */}
        <div className="flex-1">
          {/* Skeleton Product Grid or Actual Product Grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <SkeletonProductCard key={index} />
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>

              {/* No Products Message */}
              {products.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No products found matching your filters.</p>
                  <button
                    onClick={clearFilters}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Bottom Banner */}
      {!loading && (
        <div className="mt-14 rounded-2xl overflow-hidden">
          <img src={banner} alt="Promo Banner" className="w-full object-cover" />
        </div>
      )}
    </div>
  );
}

export default Product;
export { ProductCard };
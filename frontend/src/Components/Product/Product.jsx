// Product.jsx (listing page) — fixed-filters + server-filtered version
import React, { useState, useEffect, useMemo } from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  // selectors not used here because we directly read state.product
} from "./productslice";
import {
  fetchHomepageLevels,
  selectHomepageLevels,
  selectHomepageLoading,
  selectHomepageError,
} from "../Home/HomePageSlice";
import { Filter, SlidersHorizontal, X } from "lucide-react";
import banner from "../../assets/productbanner.png";
import LandscapeCarousel from "../Banner&Carousels/LandscapeCarousel";

// fallback banners/homepage (unchanged)
const fallbackBanners = [
  {
    id: 1,
    image:
      "https://contents.mediadecathlon.com/s1320107/k$c54604171dd875f3b0ea65cd781b3827/defaut.jpg?format=auto&quality=70&f=1920x0",
  },
  {
    id: 2,
    image:
      "https://contents.mediadecathlon.com/s1319184/k$8f796bb36f174a5def19954deb82ea21/defaut.jpg?format=auto&quality=70&f=1920x0",
  },
  {
    id: 3,
    image:
      "https://contents.mediadecathlon.com/s1319183/k$49524bae0ca31288ebeece35e8592f5d/defaut.jpg?format=auto&quality=70&f=1920x0",
  },
];
const fallbackHomepageData = [
  /* omitted for brevity — keep your existing fallback data if used */
];

// ProductCard and skeleton (unchanged, exactly as you had)
function ProductCard({ product }) {
  const rating = product.rating?.rate || 4.5;
  const count = product.rating?.count || 100;

  return (
    <Link to={`/ProductInfo/${product.product_uuid || product.id}`}>
      <div className="relative max-w-[300px] bg-white overflow-hidden border border-gray-200 hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col rounded-lg">
        <div className="group relative w-full h-46 md:h-54 lg:h-70 flex items-center justify-center bg-gray-50">
          {product.isFeatured && (
            <div className="absolute bg-yellow-400 text-black text-xs font-bold px-2 py-1 top-0 left-0 shadow">
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
          <h3 className="font-semibold text-gray-900 line-clamp-2 mt-1">
            {product.title}
          </h3>
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

function ProductCardSkeleton() {
  return (
    <div className="relative max-w-[300px] bg-white overflow-hidden border border-gray-200 flex flex-col rounded-lg animate-pulse">
      <div className="w-full h-46 md:h-54 lg:h-70 bg-gray-300 flex items-center justify-center"></div>
      <div className="flex justify-between px-4 pt-3">
        <div className="h-4 w-20 bg-gray-300 rounded"></div>
        <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
      </div>
      <div className="px-4 text-start flex flex-col flex-grow min-h-[120px] space-y-2 pt-2">
        <div className="h-3 w-16 bg-gray-300 rounded"></div>
        <div className="h-4 w-32 bg-gray-300 rounded"></div>
        <div className="space-y-1">
          <div className="h-5 w-20 bg-gray-300 rounded"></div>
          <div className="h-3 w-24 bg-gray-300 rounded"></div>
        </div>
      </div>
      <div className="w-[95%] mx-auto py-2 my-2 bg-gray-300 rounded"></div>
    </div>
  );
}

// Transform API → UI product (keeps your mapping)
const transformProductData = (apiProduct) => ({
  id: apiProduct.product_uuid,
  product_uuid: apiProduct.product_uuid,
  title: apiProduct.name,
  price: apiProduct.price ? String(apiProduct.price) : `₹${apiProduct.net || apiProduct.price}`,
  original: apiProduct.original || "",
  discount: apiProduct.discount || "",
  brand: apiProduct.brand,
  category: apiProduct.category?.name || "Uncategorized",
  img:
    
       `http://127.0.0.1:8000${apiProduct.img}`
      || "https://static.nike.com/a/images/t_PDP_936_v1/f_auto,q_auto:eco/022814da-3098-4c8e-b6f9-3692dc1b4207/W+FLEX+EXPERIENCE+RN+12.png",
  img2:
     `http://127.0.0.1:8000${apiProduct.img2}`
    || "https://acrossports.s3.amazonaws.com/productPhotos/NIKE/DV0746004/DV0746004_6.jpg",
  rating: {
    rate: apiProduct.average_rating || 4.5,
    count: 120,
  },
  isFeatured: apiProduct.is_featured,
});

// -----------------------
// FIXED FILTER LISTS (from you)
// -----------------------
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




function Product() {
  const dispatch = useDispatch();
  const { "*": path } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // selectors from slice (state key is `product`)
  const apiProductsState = useSelector((state) => state.product?.products ?? []);
  const loading = useSelector((state) => state.product?.loading ?? false);
  const error = useSelector((state) => state.product?.error ?? null);

  const homepageData = useSelector(selectHomepageLevels);
  const homepageLoading = useSelector(selectHomepageLoading);
  const homepageError = useSelector(selectHomepageError);

  // UI state
  const [filtersOpen, setFiltersOpen] = useState(false);

  // initialize from URL params if present
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const initialCategory = params.get("category") || "All";
  const initialBrand = params.get("brand") || "All";
  const initialMaxPrice = params.get("max_price") ? Number(params.get("max_price")) : 5000;
  const initialOrdering = params.get("ordering") || "relevance";

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedBrand, setSelectedBrand] = useState(initialBrand);
  const [priceRange, setPriceRange] = useState(initialMaxPrice);
  const [sortOption, setSortOption] = useState(
    initialOrdering === "price"
      ? "priceLowToHigh"
      : initialOrdering === "-price"
      ? "priceHighToLow"
      : "relevance"
  );

  // Build activePath (your original logic)
  const activePath = useMemo(() => {
    if (location.pathname === "/sports") return "sports";
    if (!path) return "all";
    return path.toLowerCase();
  }, [path, location.pathname]);

  // When filters / sort / path change -> dispatch fetchProducts with backend params
  useEffect(() => {
    const filters = {};

    // category: send name only (or keep 'All' to not send)
    if (selectedCategory && selectedCategory !== "All") {
      filters.category = selectedCategory;
    }

    // brand: send brand name
    if (selectedBrand && selectedBrand !== "All") {
      filters.brand = selectedBrand;
    }

    // price: send max_price
    if (priceRange !== undefined && priceRange !== null) {
      filters.max_price = Number(priceRange);
    }

    // sort mapping to ordering param
    if (sortOption === "priceLowToHigh") filters.ordering = "price";
    else if (sortOption === "priceHighToLow") filters.ordering = "-price";
    else filters.ordering = "-created_at"; // relevance => latest

    // path special cases: new-drops -> is_new
    if (
      activePath.includes("new-drops") ||
      activePath.includes("new-arrivals") ||
      activePath.includes("new-in")
    ) {
      filters.is_new = true;
    }

    // If path appears to be a category slug (not 'all' or 'sports'), send as category too (only if user hasn't explicitly selected)
    if (
      activePath !== "all" &&
      activePath !== "sports" &&
      !activePath.includes("new") &&
      (!selectedCategory || selectedCategory === "All")
    ) {
      filters.category = activePath;
    }

    // Update URL search params (reflect current filters)
    const paramsObj = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      paramsObj.set(k, String(v));
    });
    // Keep the pathname same and update only search
    navigate({ pathname: location.pathname, search: paramsObj.toString() }, { replace: true });

    // Dispatch fetch
    dispatch(fetchProducts(filters));
  }, [
    dispatch,
    selectedCategory,
    selectedBrand,
    priceRange,
    sortOption,
    activePath,
    navigate,
    location.pathname,
  ]);

  // Transform server products into UI product objects safely
  const products = useMemo(() => {
    const arr = Array.isArray(apiProductsState) ? apiProductsState : [];
    return arr.map(transformProductData);
  }, [apiProductsState]);

  // extract banners from homepageData (unchanged from your code)
  const getBannerData = () => {
    const dataToUse = homepageData && homepageData.length > 0 ? homepageData : fallbackHomepageData;
    if (!dataToUse || !dataToUse[0]?.sections) return fallbackBanners;
    const level = dataToUse[0];
    const carouselSections = level.sections.filter((sec) => sec.section_type === "floor-1");
    if (carouselSections.length > 0) {
      const carouselSection = carouselSections[0];
      return carouselSection.items.map((item) => ({ id: item.item_uuid, image: item.image, title: item.title, link: item.link }));
    }
    return fallbackBanners;
  };
  const bannerItems = getBannerData();

  // Use fixed filters instead of deriving from products
  const categories = useMemo(() => {
  const arr = Array.isArray(apiProductsState) ? apiProductsState : [];

  const unique = [
    ...new Set(
      arr
        .map((p) => p?.category?.name || p?.category || null)
        .filter(Boolean)
    ),
  ];

  return ["All", ...unique];
}, [apiProductsState]);

  const brands = useMemo(() => FIXED_BRANDS, []);

  // displayedProducts is server filtered
  const displayedProducts = products;

  if (loading || homepageLoading)
    return (
      <div className="mx-auto px-4 sm:px-8 md:px-12 lg:px-16 py-16 lg:py-20 bg-gray-50 animate-pulse">
        {/* skeletons unchanged */}
        <div className="mb-10">
          <div className="w-full h-48 md:h-64 lg:h-80 bg-gray-300 rounded-xl"></div>
        </div>
        <div className="mb-6">
          <div className="h-8 w-64 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 w-32 bg-gray-300 rounded"></div>
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="hidden md:block md:w-1/4 lg:w-1/5 border border-gray-200 rounded-xl p-4">
            <div className="h-6 w-20 bg-gray-300 rounded mb-4"></div>
          </aside>
          <main className="flex-1">
            <div className="flex items-center justify-between mb-4 border-b pb-3">
              <div className="md:hidden h-8 w-20 bg-gray-300 rounded"></div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-300 rounded"></div>
                <div className="h-8 w-40 bg-gray-300 rounded"></div>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {[1,2,3,4,5,6,7,8,9,10].map(i => <ProductCardSkeleton key={i} />)}
            </div>
          </main>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <p className="text-red-500 mb-4">Error: {error}</p>
        <button onClick={() => dispatch(fetchProducts())} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
          Retry
        </button>
      </div>
    );

  return (
    <div className="mx-auto px-4 sm:px-8 md:px-12 lg:px-16 py-16 lg:py-20 bg-gray-50">
      {/* Hero Carousel */}
      <div className="mb-10">
        <LandscapeCarousel items={bannerItems} />
      </div>

      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {activePath === "sports" ? "Sports & Lifestyle" : activePath === "all" ? "All Products" : activePath.split("/").map(part => part.split("-").map(w => w.charAt(0).toUpperCase()+w.slice(1)).join(" ")).join(" → ")}
        </h1>
        <p className="text-gray-600">
          Showing {displayedProducts.length} products
          {(activePath.includes("new-drops") || activePath.includes("new-arrivals") || activePath.includes("new-in")) && (
            <span className="text-blue-600 font-medium"> {" • Latest Arrivals"}</span>
          )}
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className={`${filtersOpen ? "fixed inset-0 bg-white z-50 p-6 overflow-y-auto" : "hidden md:block md:w-1/4 lg:w-1/5"} border border-gray-200 rounded-xl md:p-4`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Filters</h3>
            <button className="md:hidden text-gray-500" onClick={() => setFiltersOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Category Filter */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-700 mb-2">Category</h4>
            <div className="space-y-1">
              {categories.map((cat) => (
                <label key={cat} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value={cat}
                    checked={selectedCategory === cat}
                    onChange={() => setSelectedCategory(cat)}
                    className="accent-blue-600"
                  />
                  {cat}
                </label>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-700 mb-2">Brand</h4>
            <div className="space-y-1">
              {brands.map((b) => (
                <label key={b} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="brand"
                    value={b}
                    checked={selectedBrand === b}
                    onChange={() => setSelectedBrand(b)}
                    className="accent-blue-600"
                  />
                  {b}
                </label>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Price Range</h4>
            <input
              type="range"
              min="0"
              max="5000"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>₹0</span>
              <span>₹{priceRange}</span>
            </div>
          </div>
        </aside>

        {/* Main Product Grid */}
        <main className="flex-1">
          <div className="flex items-center justify-between mb-4 border-b pb-3">
            <button className="md:hidden flex items-center gap-2 text-sm font-medium border border-gray-300 px-3 py-1.5 rounded-lg" onClick={() => setFiltersOpen(true)}>
              <Filter className="w-4 h-4" /> Filters
            </button>

            <div className="flex items-center gap-2 text-sm">
              <SlidersHorizontal className="w-4 h-4 text-gray-500" />
              <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="border border-gray-300 rounded-lg px-2 py-1 focus:outline-none">
                <option value="relevance">Sort by Relevance</option>
                <option value="priceLowToHigh">Price: Low to High</option>
                <option value="priceHighToLow">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {displayedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {displayedProducts.length === 0 && (
            <div className="text-center py-20 text-gray-500">No products found matching your filters.</div>
          )}
        </main>
      </div>

      {/* Bottom Banner */}
      <div className="mt-14 rounded-2xl overflow-hidden">
        <img src={banner} alt="Promo Banner" className="w-full object-cover" />
      </div>
    </div>
  );
}

export default Product;
export { ProductCard };

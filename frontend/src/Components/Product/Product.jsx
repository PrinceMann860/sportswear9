import React, { useState, useEffect, useMemo } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  selectAllProducts,
  selectProductsLoading,
  selectProductsError,
} from "./productslice";
import {
  fetchHomepageLevels,
  selectHomepageLevels,
  selectHomepageLoading,
  selectHomepageError,
} from "../Home/HomePageSlice"; // Import from your slice
import { Filter, SlidersHorizontal, X } from "lucide-react";
import banner from "../../assets/productbanner.png";
import { Heart } from "lucide-react";
import LandscapeCarousel from "../Banner&Carousels/LandscapeCarousel";

// ✅ Fallback banner data in case API fails
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

// ✅ Fallback data for homepage sections (similar to homepage)
const fallbackHomepageData = [
  {
    level_uuid: "LVL-3F3NNHU6RQ",
    name: "Level 1",
    order: 1,
    sections: [
      {
        section_uuid: "SEC-JRJ3BTA81YDS",
        title: "section 1",
        section_type: "carousel",
        order: 2,
        extra_config: {},
        items: [
          {
            item_uuid: "ITM-JH23SY0KK0ZWGJ",
            image: "http://127.0.0.1:8000/media/homepage/defaut.avif",
            title: "banner 1",
            link: "",
            order: 1
          },
          {
            item_uuid: "ITM-F4AA2NB2JUMOT0",
            image: "http://127.0.0.1:8000/media/homepage/defaut_1.avif",
            title: "banner 1",
            link: "",
            order: 2
          },
          {
            item_uuid: "ITM-QG9LXY841QZVFP",
            image: "http://127.0.0.1:8000/media/homepage/defaut_1_SZpsUR6.avif",
            title: "banner 3",
            link: "",
            order: 3
          }
        ]
      }
    ]
  }
];

// ✅ Product Card (unchanged)
function ProductCard({ product }) {
  const rating = product.rating?.rate || 4.5;
  const count = product.rating?.count || 100;

  return (
    <Link to={`/ProductInfo/${product.id}`}>
      <div className="relative max-w-[300px] bg-white overflow-hidden border border-gray-200 hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col rounded-lg">
        <div className="group relative w-full h-46 md:h-54 lg:h-70 flex items-center justify-center bg-gray-50">
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

        <div className="flex justify-between">
          <div className="px-4 pt-3 text-sm font-medium text-gray-700">
            ⭐ {rating} <span className="text-gray-500">| {count}</span>
          </div>
          <button className="mx-4 mt-3 w-6 h-6 sm:w-7 sm:h-7 bg-white rounded-full flex items-center justify-center border border-gray-300 hover:border-primary hover:bg-primary/5 transition-all duration-300">
            <Heart className="w-3 h-3 sm:w-4 sm:h-4 transition-all duration-300" />
          </button>
        </div>

        <div className="px-4 text-start flex flex-col flex-grow min-h-[120px]">
          <p className="text-xs font-semibold text-gray-600 uppercase">
            {typeof product.brand === "object"
              ? product.brand?.name
              : product.brand}
          </p>
          <h3 className="font-semibold text-gray-900 line-clamp-2 mt-1">
            {product.title}
          </h3>
          <div className="mt-1">
            <p className="text-lg font-bold text-gray-900">{product.price}</p>
            <p className="text-sm text-gray-500">
              <span className="line-through mr-1">{product.original}</span>
              <span className="text-red-500 font-medium">
                {product.discount}
              </span>
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
      {/* Image Skeleton */}
      <div className="w-full h-46 md:h-54 lg:h-70 bg-gray-300 flex items-center justify-center"></div>

      {/* Rating and Wishlist Skeleton */}
      <div className="flex justify-between px-4 pt-3">
        <div className="h-4 w-20 bg-gray-300 rounded"></div>
        <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
      </div>

      {/* Product Info Skeleton */}
      <div className="px-4 text-start flex flex-col flex-grow min-h-[120px] space-y-2 pt-2">
        <div className="h-3 w-16 bg-gray-300 rounded"></div>
        <div className="h-4 w-32 bg-gray-300 rounded"></div>
        <div className="space-y-1">
          <div className="h-5 w-20 bg-gray-300 rounded"></div>
          <div className="h-3 w-24 bg-gray-300 rounded"></div>
        </div>
      </div>

      {/* Button Skeleton */}
      <div className="w-[95%] mx-auto py-2 my-2 bg-gray-300 rounded"></div>
    </div>
  );
}

// ✅ Transform API data for ProductCard
const transformProductData = (apiProduct) => ({
  id: apiProduct.product_uuid,
  title: apiProduct.name,
  price: `₹${apiProduct.net || apiProduct.price}`,
  original:
    apiProduct.disc && apiProduct.disc !== "0.00"
      ? `₹${(
          parseFloat(apiProduct.net || apiProduct.price) /
          (1 - parseFloat(apiProduct.disc) / 100)
        ).toFixed(2)}`
      : "",
  discount:
    apiProduct.disc && apiProduct.disc !== "0.00"
      ? `${apiProduct.disc}% OFF`
      : "",
  brand: apiProduct.brand,
  category: apiProduct.category?.name || "Uncategorized",
  img:
    apiProduct.thumbnail ||
    "https://static.nike.com/a/images/t_PDP_936_v1/f_auto,q_auto:eco/022814da-3098-4c8e-b6f9-3692dc1b4207/W+FLEX+EXPERIENCE+RN+12.png",
  img2:
    apiProduct.thumbnail ||
    "https://acrossports.s3.amazonaws.com/productPhotos/NIKE/DV0746004/DV0746004_6.jpg",
  rating: {
    rate: apiProduct.average_rating || 4.5,
    count: 120,
  },
  is_featured: apiProduct.is_featured,
});

function Product() {
  const dispatch = useDispatch();
  const { '*': path } = useParams();
  const location = useLocation();
  const apiProducts = useSelector(selectAllProducts);
  const loading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);

  // ✅ Use Redux for homepage data (same as homepage)
  const homepageData = useSelector(selectHomepageLevels);
  const homepageLoading = useSelector(selectHomepageLoading);
  const homepageError = useSelector(selectHomepageError);

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [priceRange, setPriceRange] = useState(5000);
  const [sortOption, setSortOption] = useState("relevance");

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchHomepageLevels()); // Use Redux action to fetch homepage data
  }, [dispatch]);

  const products = apiProducts.map(transformProductData);

  // ✅ Extract banners from API data with fallback (same as homepage)
  const getBannerData = () => {
    const dataToUse = homepageData && homepageData.length > 0 ? homepageData : fallbackHomepageData;
    
    if (!dataToUse || !dataToUse[0]?.sections) return fallbackBanners;
    
    const level = dataToUse[0];
    
    // Look for carousel sections
    const carouselSections = level.sections.filter(sec => sec.section_type === "floor-1");
    
    if (carouselSections.length > 0) {
      // Use the first carousel section found
      const carouselSection = carouselSections[0];
      return carouselSection.items.map(item => ({
        id: item.item_uuid,
        image: item.image,
        title: item.title,
        link: item.link,
      }));
    }
    
    // Fallback to predefined banners if no carousel sections found
    return fallbackBanners;
  };

  const bannerItems = getBannerData();

  const categories = useMemo(() => {
    const unique = [...new Set(products.map((p) => p.category))];
    return ["All", ...unique];
  }, [products]);

  const brands = useMemo(() => {
    const unique = [
      ...new Set(products.map((p) => p.brand?.name || "Unbranded")),
    ];
    return ["All", ...unique];
  }, [products]);

  // ✅ Simple path detection
  const activePath = useMemo(() => {
    if (location.pathname === '/sports') return 'sports';
    if (!path) return 'all';
    return path.toLowerCase();
  }, [path, location.pathname]);

  // ✅ Simple display name
  const getDisplayName = () => {
    if (activePath === 'sports') return 'Sports & Lifestyle';
    if (activePath === 'all') return 'All Products';
    
    return activePath.split('/')
      .map(part => part.split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
      )
      .join(' → ');
  };

  // ✅ Enhanced filtering with New Drops logic
  const filteredProducts = useMemo(() => {
    let filtered = products.filter((p) => {
      const priceValue = parseFloat(p.price.replace("₹", "")) || 0;
      const productText = `${p.category} ${p.brand?.name} ${p.title}`.toLowerCase();

      // ✅ Filter by active path with special logic for new drops
      let matchesPath = false;
      
      if (activePath === 'all') {
        matchesPath = true;
      } else if (activePath === 'sports') {
        matchesPath = productText.includes('sports') || productText.includes('lifestyle');
      } else if (activePath.includes('new-drops') || activePath.includes('new-arrivals') || activePath.includes('new-in')) {
        // ✅ Show only first 6 products for new drops/arrivals categories
        const productIndex = products.findIndex(prod => prod.id === p.id);
        matchesPath = productIndex < 6; // First 6 products
      } else {
        // Regular category filtering
        matchesPath = productText.includes(activePath);
      }

      // Filter by user selections
      const matchesFilters =
        (selectedCategory === "All" || p.category === selectedCategory) &&
        (selectedBrand === "All" || p.brand?.name === selectedBrand) &&
        priceValue <= priceRange;

      return matchesPath && matchesFilters;
    });

    // Sort products
    filtered.sort((a, b) => {
      const priceA = parseFloat(a.price.replace("₹", "")) || 0;
      const priceB = parseFloat(b.price.replace("₹", "")) || 0;
      if (sortOption === "priceLowToHigh") return priceA - priceB;
      if (sortOption === "priceHighToLow") return priceB - priceA;
      return 0;
    });

    return filtered;
  }, [products, selectedCategory, selectedBrand, priceRange, sortOption, activePath]);

  if (loading || homepageLoading)
    return (
      <div className="mx-auto px-4 sm:px-8 md:px-12 lg:px-16 py-16 lg:py-20 bg-gray-50 animate-pulse">
      {/* Hero Carousel Skeleton */}
      <div className="mb-10">
        <div className="w-full h-48 md:h-64 lg:h-80 bg-gray-300 rounded-xl"></div>
      </div>

      {/* Page Title Skeleton */}
      <div className="mb-6">
        <div className="h-8 w-64 bg-gray-300 rounded mb-2"></div>
        <div className="h-4 w-32 bg-gray-300 rounded"></div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters Skeleton */}
        <aside className="hidden md:block md:w-1/4 lg:w-1/5 border border-gray-200 rounded-xl p-4">
          {/* Filters Title */}
          <div className="h-6 w-20 bg-gray-300 rounded mb-4"></div>

          {/* Category Filter Skeleton */}
          <div className="mb-6">
            <div className="h-5 w-24 bg-gray-300 rounded mb-2"></div>
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-300 rounded"></div>
                  <div className="h-3 w-20 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Brand Filter Skeleton */}
          <div className="mb-6">
            <div className="h-5 w-20 bg-gray-300 rounded mb-2"></div>
            <div className="space-y-2">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-300 rounded"></div>
                  <div className="h-3 w-24 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Price Filter Skeleton */}
          <div>
            <div className="h-5 w-28 bg-gray-300 rounded mb-2"></div>
            <div className="w-full h-2 bg-gray-300 rounded mb-1"></div>
            <div className="flex justify-between">
              <div className="h-3 w-8 bg-gray-300 rounded"></div>
              <div className="h-3 w-12 bg-gray-300 rounded"></div>
            </div>
          </div>
        </aside>

        {/* Main Product Grid Skeleton */}
        <main className="flex-1">
          {/* Filter Bar Skeleton */}
          <div className="flex items-center justify-between mb-4 border-b pb-3">
            <div className="md:hidden h-8 w-20 bg-gray-300 rounded"></div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-300 rounded"></div>
              <div className="h-8 w-40 bg-gray-300 rounded"></div>
            </div>
          </div>

          {/* Product Grid Skeleton */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
              <ProductCardSkeleton key={item} />
            ))}
          </div>
        </main>
      </div>

      {/* Bottom Banner Skeleton */}
      <div className="mt-14 rounded-2xl overflow-hidden">
        <div className="w-full h-32 md:h-48 bg-gray-300"></div>
      </div>
    </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <p className="text-red-500 mb-4">Error: {error}</p>
        <button
          onClick={() => dispatch(fetchProducts())}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
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
          {getDisplayName()}
        </h1>
        <p className="text-gray-600">
          Showing {filteredProducts.length} products
          {(activePath.includes('new-drops') || activePath.includes('new-arrivals') || activePath.includes('new-in')) && (
            <span className="text-blue-600 font-medium"> • Latest Arrivals</span>
          )}
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside
          className={`${
            filtersOpen
              ? "fixed inset-0 bg-white z-50 p-6 overflow-y-auto"
              : "hidden md:block md:w-1/4 lg:w-1/5"
          } border border-gray-200 rounded-xl md:p-4`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Filters</h3>
            <button
              className="md:hidden text-gray-500"
              onClick={() => setFiltersOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Category Filter */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-700 mb-2">Category</h4>
            <div className="space-y-1">
              {categories.map((cat) => (
                <label
                  key={cat}
                  className="flex items-center gap-2 text-sm cursor-pointer"
                >
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
                <label
                  key={b}
                  className="flex items-center gap-2 text-sm cursor-pointer"
                >
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
            <button
              className="md:hidden flex items-center gap-2 text-sm font-medium border border-gray-300 px-3 py-1.5 rounded-lg"
              onClick={() => setFiltersOpen(true)}
            >
              <Filter className="w-4 h-4" /> Filters
            </button>

            <div className="flex items-center gap-2 text-sm">
              <SlidersHorizontal className="w-4 h-4 text-gray-500" />
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="border border-gray-300 rounded-lg px-2 py-1 focus:outline-none"
              >
                <option value="relevance">Sort by Relevance</option>
                <option value="priceLowToHigh">Price: Low to High</option>
                <option value="priceHighToLow">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              No products found matching your filters.
            </div>
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
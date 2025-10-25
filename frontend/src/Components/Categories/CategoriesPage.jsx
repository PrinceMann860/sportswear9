// ✅ CategoriesPage.jsx — upgraded with Product.jsx-style filtering logic (tags + rating preserved)

import React, { useMemo, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  fetchProducts,
  selectAllProducts,
  selectProductsLoading,
  selectProductsError,
} from "../Product/productslice";
import { ProductCard } from "../Product/Product";
import SkeletonLoader from "../Home/SkeletonLoader";

function CategoriesPage() {
  const dispatch = useDispatch();
  const apiProducts = useSelector(selectAllProducts);
  const loading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // ✅ Unified transform — consistent with Product.jsx
  const transformProductData = (p) => ({
    id: p.product_uuid,
    title: p.name,
    brand: p.brand?.name || "Unbranded",
    category: p.category?.name || "Uncategorized",
    priceValue: parseFloat(p.net || p.price) || 0,
    price: `₹${parseFloat(p.net || p.price).toFixed(2)}`,
    discount: p.disc && p.disc !== "0.00" ? `${p.disc}% OFF` : "",
    original:
      p.disc && p.disc !== "0.00"
        ? `₹${(
            parseFloat(p.net || p.price) /
            (1 - parseFloat(p.disc) / 100)
          ).toFixed(2)}`
        : "",
    tags: Array.isArray(p.tags)
      ? p.tags
      : typeof p.tags === "string"
      ? p.tags.split(",").map((t) => t.trim())
      : [],
    rating: parseFloat(p.rating) || parseFloat(p.average_rating) || 4.2,
    img:
      p.thumbnail ||
      "https://static.nike.com/a/images/t_PDP_936_v1/f_auto,q_auto:eco/022814da-3098-4c8e-b6f9-3692dc1b4207/W+FLEX+EXPERIENCE+RN+12.png",
    img2:
      p.thumbnail ||
      "https://acrossports.s3.amazonaws.com/productPhotos/NIKE/DV0746004/DV0746004_6.jpg",
  });

  const products = apiProducts.map(transformProductData);

  // ✅ Sidebar data
  const categories = [
    {
      id: "all",
      name: "All",
      image:
        "https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg?auto=compress&cs=tinysrgb&w=1600",
    },
    {
      id: "men",
      name: "Men",
      image:
        "https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=1600",
    },
    {
      id: "women",
      name: "Women",
      image:
        "https://images.pexels.com/photos/3761022/pexels-photo-3761022.jpeg?auto=compress&cs=tinysrgb&w=1600",
    },
    {
      id: "kids",
      name: "Kids",
      image:
        "https://rukminim2.flixcart.com/image/368/490/xif0q/track-suit/c/i/y/5-6-years-set-056-teddy-hoodie-faizam-collection-original-imahf4yzrmwdzrhn.jpeg?q=90&crop=false",
    },
    {
      id: "sports",
      name: "Sports",
      image:
        "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1600",
    },
  ];

  // ✅ States (unchanged UI)
  const [activeCategory, setActiveCategory] = useState("all");
  const [priceMax, setPriceMax] = useState(5000);
  const [minRating, setMinRating] = useState(0);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [selectedTags, setSelectedTags] = useState([]);

  const location = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q") || "";
    setQuery(q);
  }, [location.search]);

  // ✅ Extract unique tags
  const allTags = useMemo(() => {
    const setTags = new Set();
    products.forEach((p) => {
      if (Array.isArray(p.tags)) p.tags.forEach((t) => setTags.add(t));
    });
    return Array.from(setTags);
  }, [products]);

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // ✅ Modernized filtering (Product.jsx logic + your tags/rating)
  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      const categoryKey = activeCategory.toLowerCase();

      const matchesCategory =
        activeCategory === "all" ||
        p.category?.toLowerCase().includes(categoryKey) ||
        p.title?.toLowerCase().includes(categoryKey) ||
        p.brand?.toLowerCase().includes(categoryKey);

      const matchesTags =
        selectedTags.length === 0 ||
        (Array.isArray(p.tags) &&
          selectedTags.every((tag) => p.tags.includes(tag)));

      const matchesPrice = p.priceValue <= priceMax;
      const matchesRating = p.rating >= minRating;

      const q = query.trim().toLowerCase();
      const matchesQuery =
        q.length === 0 ||
        p.title.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (Array.isArray(p.tags) && p.tags.join(" ").toLowerCase().includes(q));

      return (
        matchesCategory &&
        matchesTags &&
        matchesPrice &&
        matchesRating &&
        matchesQuery
      );
    });

    // ✅ Sorting (same pattern as Product.jsx)
    list.sort((a, b) => {
      if (sortBy === "price-asc") return a.priceValue - b.priceValue;
      if (sortBy === "price-desc") return b.priceValue - a.priceValue;
      if (sortBy === "rating") return b.rating - a.rating;
      return b.id.localeCompare(a.id); // latest by UUID
    });

    return list;
  }, [
    products,
    activeCategory,
    selectedTags,
    priceMax,
    minRating,
    query,
    sortBy,
  ]);

  const resetAllFilters = () => {
    setActiveCategory("all");
    setSelectedTags([]);
    setPriceMax(5000);
    setMinRating(0);
    setQuery("");
    setSortBy("latest");
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 mt-10">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto px-4 pt-16 pb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              {query
                ? `Search results for "${query}"`
                : activeCategory === "all"
                ? "All Products"
                : `${
                    activeCategory.charAt(0).toUpperCase() +
                    activeCategory.slice(1)
                  } Collection`}
            </h1>
            <p className="mt-2 text-gray-600 max-w-xl">
              High-performance sportswear and gear. Filter by category, tags, or
              sort by price and rating.
            </p>
          </div>

          {/* Search + Sort */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products, tags or models"
                className="w-full md:w-80 border border-gray-200 rounded-full py-2 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <svg
                className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
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
            </div>

            <div className="hidden md:flex items-center gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-200 rounded-full py-2 px-3 bg-white"
              >
                <option value="latest">Latest</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="max-w-7xl mx-auto px-4 pb-20 grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* LEFT SIDEBAR */}
        <aside className="md:col-span-4 lg:col-span-3 space-y-6 hidden md:block">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            {/* Categories */}
            <h3 className="font-semibold text-lg">Categories</h3>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveCategory(c.id)}
                  className={`relative h-28 rounded-lg overflow-hidden shadow-sm transform transition hover:scale-[1.02] ${
                    activeCategory === c.id ? "ring-2 ring-blue-300" : ""
                  }`}
                >
                  <img
                    src={c.image}
                    alt={c.name}
                    className="w-full h-full object-cover opacity-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  <div className="absolute left-3 bottom-3 text-white font-semibold">
                    {c.name}
                  </div>
                </button>
              ))}
            </div>

            {/* TAGS */}
            <div className="mt-5">
              <h4 className="text-sm text-gray-600">Tags</h4>
              <div className="mt-3 flex flex-wrap gap-2">
                {allTags.map((t) => (
                  <button
                    key={t}
                    onClick={() => toggleTag(t)}
                    className={`px-3 py-1 rounded-full border text-sm ${
                      selectedTags.includes(t)
                        ? "bg-blue-50 border-blue-200 text-blue-700"
                        : "bg-white border-gray-200 text-gray-700"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* PRICE */}
            <div className="mt-5">
              <h4 className="text-sm text-gray-600">Max Price</h4>
              <div className="mt-3 flex items-center gap-3">
                <input
                  type="range"
                  min={100}
                  max={12000}
                  step={100}
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="w-full"
                />
                <div className="whitespace-nowrap font-semibold">
                  ₹{priceMax}
                </div>
              </div>
            </div>

            {/* RATING */}
            <div className="mt-5">
              <h4 className="text-sm text-gray-600">Min Rating</h4>
              <div className="mt-2 flex gap-2">
                {[0, 3, 4, 4.5].map((r) => (
                  <button
                    key={r}
                    onClick={() => setMinRating(r)}
                    className={`px-3 py-1 rounded-lg border ${
                      minRating === r
                        ? "bg-blue-600 text-white border-blue-700"
                        : "bg-white border-gray-200 text-gray-700"
                    }`}
                  >
                    {r === 0 ? "Any" : `${r}+`}
                  </button>
                ))}
              </div>
            </div>

            {/* RESET */}
            <div className="mt-5 flex gap-2">
              <button
                onClick={resetAllFilters}
                className="flex-1 py-2 rounded-lg border border-gray-200"
              >
                Reset
              </button>
            </div>
          </div>
        </aside>

        {/* RIGHT: GRID */}
        <div className="md:col-span-8 lg:col-span-9">
          {loading ? (
            <SkeletonLoader count={8} />
          ) : error ? (
            <div className="text-center py-10 text-blue-600 font-medium">
              Failed to load products. Please try again.
            </div>
          ) : filtered.length === 0 ? (
            <div className="mt-8 bg-white p-8 rounded-lg shadow text-center">
              <h3 className="text-lg font-semibold">No results</h3>
              <p className="text-gray-600 mt-2">
                Try adjusting filters or clearing search.
              </p>
              <div className="mt-4">
                <button
                  onClick={resetAllFilters}
                  className="px-4 py-2 border rounded"
                >
                  Reset
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CategoriesPage;

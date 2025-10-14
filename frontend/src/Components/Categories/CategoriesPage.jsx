// /src/pages/ExplorePage.jsx
import React, { useMemo, useState } from "react";
import CategoryCarousel from "../Home/CategoryCarousel";
import { ProductCard } from "../Product/Product";

function CategoriesPage() {
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

  // Final 9-item sportswear product list (realistic product images)
  const products = [
    {
      id: 1,
      title: "Black Performance Hoodie",
      price: 2499,
      category: "men",
      rating: 4.7,
      tags: ["hoodie", "training"],
      img: "https://gymtier.com/cdn/shop/files/feralfitnessfront-black-front-hoodie-2_5f06c2be-8172-4809-8aa9-359f68b83427.jpg?v=1709201936",
    },
    {
      id: 2,
      title: "Grey Tech-Fit Joggers",
      price: 1999,
      category: "men",
      rating: 4.5,
      tags: ["joggers", "running"],
      img: "https://1565619539.rsc.cdn77.org/temp/1756134447_369089d95fcb0bf6ed8a9bb009ae48ea.jpg",
    },
    {
      id: 3,
      title: "Red Mesh Training Tee",
      price: 1499,
      category: "women",
      rating: 4.6,
      tags: ["tee", "workout"],
      img: "https://bullshakefit.com/cdn/shop/files/mesh-panel-oversized-training-tee-red-oversized-tee-bullshake-117191.jpg?v=1727876645&width=480",
    },
    {
      id: 4,
      title: "Oversized Gym Crop Top",
      price: 1799,
      category: "women",
      rating: 4.4,
      tags: ["crop", "yoga"],
      img: "https://i.pinimg.com/736x/20/c4/30/20c430b6f3718ce3c23aeecc085bb4a2.jpg",
    },
    {
      id: 5,
      title: "Kids Soccer Jersey Set",
      price: 1299,
      category: "kids",
      rating: 4.3,
      tags: ["jersey", "team"],
      img: "https://img.kwcdn.com/product/fancy/da06e076-439b-4681-8f1e-ebc2bc35fa4b.jpg?imageView2/2/w/500/q/60/format/webp",
    },
    {
      id: 6,
      title: "Kids Running Tracksuit",
      price: 1599,
      category: "kids",
      rating: 4.2,
      tags: ["tracksuit", "running"],
      img: "https://xcdn.next.co.uk/common/items/default/default/itemimages/3_4Ratio/product/lge/F14329s.jpg?im=Resize,width=750",
    },
    {
      id: 7,
      title: "Unisex Adjustable Cap",
      price: 799,
      category: "sports",
      rating: 4.1,
      tags: ["cap", "accessory"],
      img: "https://m.media-amazon.com/images/I/61QVQ2nqeFL._AC_UY1100_.jpg",
    },
    {
      id: 8,
      title: "Lightweight Gym Duffel",
      price: 2299,
      category: "sports",
      rating: 4.6,
      tags: ["duffel", "bag"],
      img: "https://dynamic.zacdn.com/FSOwLQCbTIehL_lLxxCuaTUnqzE=/filters:quality(70):format(webp)/https://static-ph.zacdn.com/p/nike-3785-4204442-6.jpg",
    },
    {
      id: 9,
      title: "Performance Wrist Wraps",
      price: 699,
      category: "sports",
      rating: 4.0,
      tags: ["wraps", "accessory"],
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmoYe8hGDuThNA5B1_yEZoBGyjNDE8uH3K2Q&s",
    },
  ];

  // filter state
  const [activeCategory, setActiveCategory] = useState("all");
  const [priceMax, setPriceMax] = useState(5000);
  const [minRating, setMinRating] = useState(0);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);

  const allTags = useMemo(() => {
    const s = new Set();
    products.forEach((p) => p.tags.forEach((t) => s.add(t)));
    return Array.from(s);
  }, [products]);

  function toggleTag(tag) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  // filtering + sorting
  const filtered = useMemo(() => {
    let list = products.slice();

    if (activeCategory !== "all")
      list = list.filter((p) => p.category === activeCategory);
    list = list.filter((p) => p.price <= priceMax);
    list = list.filter((p) => p.rating >= minRating);
    if (selectedTags.length)
      list = list.filter((p) => selectedTags.every((t) => p.tags.includes(t)));
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.tags.join(" ").toLowerCase().includes(q)
      );
    }

    if (sortBy === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (sortBy === "rating") list.sort((a, b) => b.rating - a.rating);
    else if (sortBy === "latest") list.sort((a, b) => b.id - a.id);

    return list;
  }, [
    activeCategory,
    priceMax,
    minRating,
    selectedTags,
    query,
    sortBy,
    products,
  ]);

  // Close mobile filters
  const closeMobileFilters = () => {
    setShowMobileFilters(false);
  };

  // Reset all filters
  const resetAllFilters = () => {
    setActiveCategory("all");
    setSelectedTags([]);
    setPriceMax(5000);
    setMinRating(0);
    setQuery("");
    setSortBy("latest");
    setShowMobileFilters(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 mt-10">
      {/* HERO / TOP */}
      <div className="max-w-7xl mx-auto px-4 pt-16 pb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Explore — Performance & Training
            </h1>
            <p className="mt-2 text-gray-600 max-w-xl">
              High-performance sportswear and gear. Filter by category, tags or
              sort by price and rating.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products, tags or models"
                className="w-full md:w-80 border border-gray-200 rounded-full py-2 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-red-400"
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

      {/* MAIN: sidebar (filters) + products */}
      <div className="max-w-7xl mx-auto px-4 pb-20 grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* LEFT: Filters & categories */}
        <aside className="md:col-span-4 lg:col-span-3 space-y-6 hidden md:block">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-lg">Categories</h3>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveCategory(c.id)}
                  className={`relative h-28 rounded-lg overflow-hidden shadow-sm transform transition hover:scale-[1.02] ${
                    activeCategory === c.id ? "ring-2 ring-red-300" : ""
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

            <div className="mt-5">
              <h4 className="text-sm text-gray-600">Tags</h4>
              <div className="mt-3 flex flex-wrap gap-2">
                {allTags.map((t) => (
                  <button
                    key={t}
                    onClick={() => toggleTag(t)}
                    className={`px-3 py-1 rounded-full border text-sm ${
                      selectedTags.includes(t)
                        ? "bg-red-50 border-red-200 text-red-700"
                        : "bg-white border-gray-200 text-gray-700"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <h4 className="text-sm text-gray-600">Max Price</h4>
              <div className="mt-3 flex items-center gap-3">
                <input
                  type="range"
                  min={500}
                  max={5000}
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

            <div className="mt-5">
              <h4 className="text-sm text-gray-600">Min Rating</h4>
              <div className="mt-2 flex gap-2">
                {[0, 3, 4, 4.5].map((r) => (
                  <button
                    key={r}
                    onClick={() => setMinRating(r)}
                    className={`px-3 py-1 rounded-lg border ${
                      minRating === r
                        ? "bg-red-600 text-white border-red-700"
                        : "bg-white border-gray-200 text-gray-700"
                    }`}
                  >
                    {r === 0 ? "Any" : `${r}+`}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 flex gap-2">
              <button
                onClick={resetAllFilters}
                className="flex-1 py-2 rounded-lg border border-gray-200"
              >
                Reset
              </button>
              <button
                onClick={() => {}}
                className="flex-1 py-2 rounded-lg bg-black text-white"
              >
                Apply
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-lg">Featured Picks</h3>
            <div className="mt-4 space-y-3">
              {products.slice(0, 3).map((p) => (
                <div key={p.id} className="flex items-center gap-3">
                  <img
                    src={p.img}
                    alt={p.title}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div>
                    <div className="font-medium">{p.title}</div>
                    <div className="text-sm text-gray-500">₹{p.price}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* RIGHT: products */}
        <div className="md:col-span-8 lg:col-span-9">
          {/* sticky control bar */}
          <div className="sticky top-20 z-20 bg-white/60 backdrop-blur-md border border-gray-100 rounded-lg px-4 py-3 mb-4 flex items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">Showing</div>
              <div className="font-semibold">{filtered.length} results</div>
              <div className="h-6 w-px bg-gray-200 mx-3" />
              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={() => setSortBy("latest")}
                  className={`px-3 py-1 rounded ${
                    sortBy === "latest"
                      ? "bg-black text-white"
                      : "bg-white border border-gray-200"
                  }`}
                >
                  Latest
                </button>
                <button
                  onClick={() => setSortBy("price-asc")}
                  className={`px-3 py-1 rounded ${
                    sortBy === "price-asc"
                      ? "bg-black text-white"
                      : "bg-white border border-gray-200"
                  }`}
                >
                  Low Price
                </button>
                <button
                  onClick={() => setSortBy("price-desc")}
                  className={`px-3 py-1 rounded ${
                    sortBy === "price-desc"
                      ? "bg-black text-white"
                      : "bg-white border border-gray-200"
                  }`}
                >
                  High Price
                </button>
                <button
                  onClick={() => setSortBy("rating")}
                  className={`px-3 py-1 rounded ${
                    sortBy === "rating"
                      ? "bg-black text-white"
                      : "bg-white border border-gray-200"
                  }`}
                >
                  Top Rated
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2">
                <select
                  value={activeCategory}
                  onChange={(e) => setActiveCategory(e.target.value)}
                  className="border border-gray-200 rounded-full py-2 px-3 bg-white"
                >
                  <option value="all">All</option>
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                  <option value="kids">Kids</option>
                  <option value="sports">Sports</option>
                </select>
              </div>
              <button
                onClick={() => setShowMobileFilters(true)}
                className="md:hidden px-3 py-2 rounded-full border border-gray-200 bg-white"
              >
                Filters
              </button>
            </div>
          </div>

          {/* product grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* empty state */}
          {filtered.length === 0 && (
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
          )}
        </div>
      </div>

      {/* MOBILE: slide-up filter sheet */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50">
          {/* backdrop */}
          <div
            onClick={closeMobileFilters}
            className="absolute inset-0 bg-black/40"
          />

          {/* sheet */}
          <div className="absolute left-0 right-0 bottom-0 bg-white rounded-t-2xl shadow-xl transform transition-transform">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h4 className="text-lg font-semibold">Filters</h4>
              <button
                onClick={closeMobileFilters}
                className="text-gray-600 px-2 py-1 rounded"
              >
                ✕
              </button>
            </div>

            <div className="p-4 space-y-4 max-h-[60vh] overflow-auto">
              <div>
                <h5 className="text-sm font-medium">Category</h5>
                <div className="mt-2 flex gap-2 flex-wrap">
                  <button
                    onClick={() => setActiveCategory("all")}
                    className={`px-3 py-1 rounded-full border ${
                      activeCategory === "all"
                        ? "bg-red-50 border-red-200 text-red-700"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setActiveCategory("men")}
                    className={`px-3 py-1 rounded-full border ${
                      activeCategory === "men"
                        ? "bg-red-50 border-red-200 text-red-700"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    Men
                  </button>
                  <button
                    onClick={() => setActiveCategory("women")}
                    className={`px-3 py-1 rounded-full border ${
                      activeCategory === "women"
                        ? "bg-red-50 border-red-200 text-red-700"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    Women
                  </button>
                  <button
                    onClick={() => setActiveCategory("kids")}
                    className={`px-3 py-1 rounded-full border ${
                      activeCategory === "kids"
                        ? "bg-red-50 border-red-200 text-red-700"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    Kids
                  </button>
                  <button
                    onClick={() => setActiveCategory("sports")}
                    className={`px-3 py-1 rounded-full border ${
                      activeCategory === "sports"
                        ? "bg-red-50 border-red-200 text-red-700"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    Sports
                  </button>
                </div>
              </div>

              <div>
                <h5 className="text-sm font-medium">Tags</h5>
                <div className="mt-2 flex gap-2 flex-wrap">
                  {allTags.map((t) => (
                    <button
                      key={t}
                      onClick={() => toggleTag(t)}
                      className={`px-3 py-1 rounded-full border ${
                        selectedTags.includes(t)
                          ? "bg-red-50 border-red-200 text-red-700"
                          : "bg-white border-gray-200 text-gray-700"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="text-sm font-medium">Max Price</h5>
                <div className="mt-2">
                  <input
                    type="range"
                    min={500}
                    max={5000}
                    step={100}
                    value={priceMax}
                    onChange={(e) => setPriceMax(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="mt-2 text-sm font-semibold">
                    Up to ₹{priceMax}
                  </div>
                </div>
              </div>

              <div>
                <h5 className="text-sm font-medium">Minimum rating</h5>
                <div className="mt-2 flex gap-2">
                  {[0, 3, 4, 4.5].map((r) => (
                    <button
                      key={r}
                      onClick={() => setMinRating(r)}
                      className={`px-3 py-1 rounded-lg border ${
                        minRating === r
                          ? "bg-red-600 text-white border-red-700"
                          : "bg-white border-gray-200 text-gray-700"
                      }`}
                    >
                      {r === 0 ? "Any" : `${r}+`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 flex gap-3">
              <button
                onClick={resetAllFilters}
                className="flex-1 py-3 rounded-lg border"
              >
                Reset
              </button>
              <button
                onClick={closeMobileFilters}
                className="flex-1 py-3 rounded-lg bg-black text-white"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CategoriesPage;
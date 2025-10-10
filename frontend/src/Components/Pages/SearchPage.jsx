import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, ListFilter as Filter, X } from 'lucide-react';
import { ProductCard } from '../Product/Product';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    brand: '',
    size: '',
    color: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');

  // Mock search results - in real app, this would come from API
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mock products for search results
  const mockProducts = [
    {
      id: 1,
      img: 'https://assets.myntassets.com/dpr_1.5,q_30,w_400,c_limit,fl_progressive/assets/images/2025/FEBRUARY/3/L7GEjRDH_b510caa934e949b78484e8cfb577804d.jpg',
      price: '₹2,499.00',
      original: '₹6,599.00',
      discount: '-65%',
      title: 'Duramo 10 Running Shoes',
      category: 'Performance',
    },
    {
      id: 2,
      img: 'https://www.cyclop.in/cdn/shop/files/1_d5b00990-6b2a-4365-849b-084d14380580_1080x.jpg?v=1689009277',
      price: '₹1,999.00',
      original: '₹3,999.00',
      discount: '-50%',
      title: 'Compression T-shirt',
      category: 'Training',
    },
    {
      id: 3,
      img: 'https://assets.myntassets.com/dpr_1.5,q_30,w_400,c_limit,fl_progressive/assets/images/2025/FEBRUARY/3/L7GEjRDH_b510caa934e949b78484e8cfb577804d.jpg',
      price: '₹3,499.00',
      original: '₹6,999.00',
      discount: '-50%',
      title: 'Training Shorts',
      category: 'Performance',
    },
    {
      id: 4,
      img: 'https://www.cyclop.in/cdn/shop/files/1_d5b00990-6b2a-4365-849b-084d14380580_1080x.jpg?v=1689009277',
      price: '₹4,499.00',
      original: '₹8,999.00',
      discount: '-50%',
      title: 'Athletic Jacket',
      category: 'Originals',
    },
  ];

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
      performSearch(query);
    }
  }, [searchParams]);

  const performSearch = async (query) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      if (query.trim()) {
        const filtered = mockProducts.filter(product =>
          product.title.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(filtered);
      } else {
        setSearchResults([]);
      }
      setLoading(false);
    }, 500);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery });
      performSearch(searchQuery);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchParams({});
    setSearchResults([]);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      priceRange: '',
      brand: '',
      size: '',
      color: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Search Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products, brands, categories..."
                className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition flex items-center gap-2"
            >
              <Search size={20} />
              Search
            </button>
          </form>
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter size={20} />
            Filters
          </button>

          <div className="flex-1 flex flex-wrap gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="relevance">Sort by Relevance</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest First</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <div className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-64 bg-white rounded-lg shadow-sm p-4 h-fit`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Filters</h3>
              <button
                onClick={clearFilters}
                className="text-sm text-red-500 hover:text-red-600"
              >
                Clear All
              </button>
            </div>

            <div className="space-y-6">
              {/* Category Filter */}
              <div>
                <h4 className="font-medium mb-3">Category</h4>
                <div className="space-y-2">
                  {['Performance', 'Training', 'Originals', 'Lifestyle'].map(cat => (
                    <label key={cat} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value={cat}
                        checked={filters.category === cat}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div>
                <h4 className="font-medium mb-3">Price Range</h4>
                <div className="space-y-2">
                  {['Under ₹1000', '₹1000 - ₹3000', '₹3000 - ₹5000', 'Above ₹5000'].map(range => (
                    <label key={range} className="flex items-center">
                      <input
                        type="radio"
                        name="priceRange"
                        value={range}
                        checked={filters.priceRange === range}
                        onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm">{range}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Size Filter */}
              <div>
                <h4 className="font-medium mb-3">Size</h4>
                <div className="grid grid-cols-3 gap-2">
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
                    <button
                      key={size}
                      onClick={() => handleFilterChange('size', filters.size === size ? '' : size)}
                      className={`py-2 px-3 border rounded text-sm ${
                        filters.size === size
                          ? 'border-red-500 bg-red-50 text-red-600'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Search Results */}
          <div className="flex-1">
            {searchQuery && (
              <div className="mb-4">
                <p className="text-gray-600">
                  {loading ? 'Searching...' : `${searchResults.length} results for "${searchQuery}"`}
                </p>
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
                    <div className="aspect-square bg-gray-200 rounded mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {searchResults.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : searchQuery ? (
              <div className="text-center py-12">
                <Search size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-600 mb-4">
                  We couldn't find any products matching "{searchQuery}"
                </p>
                <button
                  onClick={clearSearch}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                >
                  Clear Search
                </button>
              </div>
            ) : (
              <div className="text-center py-12">
                <Search size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Start your search</h3>
                <p className="text-gray-600">
                  Enter a product name, brand, or category to find what you're looking for
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
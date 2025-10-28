import React, { useState } from 'react';
import { Heart, ShoppingCart, X, Share2, Trash2 } from 'lucide-react';
import { ProductCard } from '../Product/Product';

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 1,
      img: 'https://assets.myntassets.com/dpr_1.5,q_30,w_400,c_limit,fl_progressive/assets/images/2025/FEBRUARY/3/L7GEjRDH_b510caa934e949b78484e8cfb577804d.jpg',
      price: '₹2,499.00',
      original: '₹6,599.00',
      discount: '-65%',
      title: 'Duramo 10 Running Shoes',
      category: 'Performance',
      inStock: true,
    },
    {
      id: 2,
      img: 'https://www.cyclop.in/cdn/shop/files/1_d5b00990-6b2a-4365-849b-084d14380580_1080x.jpg?v=1689009277',
      price: '₹1,999.00',
      original: '₹3,999.00',
      discount: '-50%',
      title: 'Compression T-shirt',
      category: 'Training',
      inStock: true,
    },
    {
      id: 3,
      img: 'https://assets.myntassets.com/dpr_1.5,q_30,w_400,c_limit,fl_progressive/assets/images/2025/FEBRUARY/3/L7GEjRDH_b510caa934e949b78484e8cfb577804d.jpg',
      price: '₹3,499.00',
      original: '₹6,999.00',
      discount: '-50%',
      title: 'Training Shorts',
      category: 'Performance',
      inStock: false,
    }
  ]);

  const removeFromWishlist = (id) => {
    setWishlistItems(items => items.filter(item => item.id !== id));
  };

  const addToCart = (item) => {
    console.log('Added to cart:', item);
    // Here you would typically dispatch to cart state
  };

  const clearWishlist = () => {
    if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
      setWishlistItems([]);
    }
  };

  const shareWishlist = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Wishlist',
        text: 'Check out my wishlist!',
        url: window.location.href,
      });
    } else {
      alert('Share functionality not supported on this browser');
    }
  };

  const addAllToCart = () => {
    const inStockItems = wishlistItems.filter(item => item.inStock);
    if (inStockItems.length > 0) {
      inStockItems.forEach(item => addToCart(item));
      alert(`Added ${inStockItems.length} items to cart!`);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-20 pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        {/* Header Section */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                My Wishlist
              </h1>
              <p className="text-gray-600 text-sm md:text-base">
                {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
              </p>
            </div>
            
            {wishlistItems.length > 0 && (
              <div className="flex gap-3">
                <button
                  onClick={shareWishlist}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  <Share2 size={16} />
                  Share
                </button>
                <button
                  onClick={clearWishlist}
                  className="flex items-center gap-2 px-4 py-2 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
                >
                  <Trash2 size={16} />
                  Clear All
                </button>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-200"></div>
        </div>

        {wishlistItems.length > 0 ? (
          <>
            {/* Product Grid using ProductCard */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
              {wishlistItems.map((item) => (
                <div key={item.id} className="relative group">
                  {/* Use the existing ProductCard component */}
                  <ProductCard product={item} />
                  
                  {/* Overlay Actions */}
                  <div className="absolute top-2 right-2 flex flex-col gap-2 z-10">
                    {/* Remove from Wishlist Button */}
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="p-2 bg-white rounded-full shadow-md hover:bg-blue-50 transition-all hover:scale-110"
                      title="Remove from wishlist"
                    >
                      <X size={16} className="text-black" />
                    </button>
                    
                  
                  </div>

                  {/* Out of Stock Overlay */}
                  {!item.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                      <span className="bg-red-400 text-white px-4 py-2 rounded-lg font-semibold text-sm">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Bottom Action Bar */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <p className="text-gray-600 text-sm">
                  Continue shopping to add more items to your wishlist
                </p>
                <button
                  onClick={addAllToCart}
                  disabled={!wishlistItems.some(item => item.inStock)}
                  className={`px-8 py-3 rounded-lg transition-all font-semibold text-sm shadow-md hover:shadow-lg whitespace-nowrap ${
                    wishlistItems.some(item => item.inStock)
                      ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Add All to Cart ({wishlistItems.filter(item => item.inStock).length})
                </button>
              </div>
            </div>
          </>
        ) : (
          // Empty Wishlist State
          <div className="text-center py-16 md:py-24">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Heart size={48} className="text-gray-300" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Your wishlist is empty
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Save your favorite sports gear and equipment by clicking the heart icon on any product
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold shadow-md hover:shadow-lg active:scale-95"
            >
              Start Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
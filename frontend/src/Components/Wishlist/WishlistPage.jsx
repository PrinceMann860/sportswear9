import React, { useState } from 'react';
import { Heart, ShoppingCart, X } from 'lucide-react';
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
    }
  ]);

  const removeFromWishlist = (id) => {
    setWishlistItems(items => items.filter(item => item.id !== id));
  };

  const addToCart = (item) => {
    console.log('Added to cart:', item);
    // Here you would typically dispatch to cart state
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="text-blue-500" size={28} />
          <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
            {wishlistItems.length} items
          </span>
        </div>

        {wishlistItems.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {wishlistItems.map((item) => (
                <div key={item.id} className="relative group">
                  <ProductCard product={item} />
                  <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="p-2 bg-white rounded-full shadow-md hover:bg-blue-50 transition-colors"
                      title="Remove from wishlist"
                    >
                      <X size={16} className="text-blue-500" />
                    </button>
                    <button
                      onClick={() => addToCart(item)}
                      className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                      title="Add to cart"
                    >
                      <ShoppingCart size={16} className="text-gray-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <button className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition font-semibold">
                Add All to Cart
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <Heart size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-6">
              Save items you love by clicking the heart icon on any product
            </p>
            <button
              onClick={() => window.history.back()}
              className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition font-semibold"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
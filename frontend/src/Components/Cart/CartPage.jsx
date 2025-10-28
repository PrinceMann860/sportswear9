import React, { useState } from 'react';
import { Minus, Plus, Trash2, ShoppingCart, ArrowLeft, Heart, Truck, Shield, RefreshCw, Package, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import RecommendedProducts from '../Home/RecommendedProducts';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Running Shoes - Duramo SL',
      image: 'https://contents.mediadecathlon.com/p2238708/k$7d6789e9f7a5c7183c6b00c72c9475b2/sq/Running+Shoes+Duramo+SL+Men+s+Grey+Orange.jpg',
      price: 2499,
      originalPrice: 3499,
      quantity: 1,
      size: 'UK 9',
      color: 'Grey/Orange',
      category: 'Running',
      inStock: true,
    },
    {
      id: 2,
      name: 'Training T-Shirt - Dry',
      image: 'https://contents.mediadecathlon.com/p2106687/k$f8b116e0a5e5b7a5b5f5e5c5b5a595857/sq/Training+T-Shirt+Dry+Men+s+Black.jpg',
      price: 599,
      originalPrice: 899,
      quantity: 2,
      size: 'L',
      color: 'Black',
      category: 'Training',
      inStock: true,
    },
    {
      id: 3,
      name: 'Training Shorts - Light',
      image: 'https://contents.mediadecathlon.com/p2288347/k$853116e0a5e5b7a5b5f5e5c5b5a595857/sq/Training+Shorts+Light+Men+s+Blue.jpg',
      price: 799,
      originalPrice: 1299,
      quantity: 1,
      size: 'M',
      color: 'Blue',
      category: 'Training',
      inStock: true,
    }
  ]);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity === 0) {
      removeItem(id);
      return;
    }
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const moveToWishlist = (id) => {
    const item = cartItems.find(item => item.id === id);
    console.log('Moving to wishlist:', item);
    removeItem(id);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const savings = cartItems.reduce((sum, item) => sum + ((item.originalPrice - item.price) * item.quantity), 0);
  const shipping = subtotal > 999 ? 0 : 49;
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white pt-20 pb-20 md:pb-0">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart size={64} className="text-gray-300" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
              Discover our sports products and find the perfect gear for your activities
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-semibold text-lg shadow-md hover:shadow-lg"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-6">
          <Link to="/" className="text-gray-600 hover:text-blue-600">Home</Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-medium">Shopping Cart</span>
        </div>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
          <p className="text-gray-600">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart</p>
        </div>

        {/* Free Shipping Progress Bar */}
        {shipping > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3 mb-3">
              <Truck className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-semibold text-blue-900 mb-1">
                  You're ₹{(1000 - subtotal).toLocaleString()} away from FREE shipping!
                </p>
                <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((subtotal / 1000) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Cart Items */}
          <div className="flex-1">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 hover:shadow-md transition-shadow">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    
                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-base md:text-lg mb-1 line-clamp-2">
                            {item.name}
                          </h3>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 mb-3">
                            <span>Size: <strong className="text-gray-900">{item.size}</strong></span>
                            <span>Color: <strong className="text-gray-900">{item.color}</strong></span>
                          </div>
                        </div>
                        
                        {/* Delete Button */}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                          title="Remove item"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                      
                      {/* Price and Quantity Section */}
                      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                        {/* Price */}
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-xl text-gray-900">
                              ₹{(item.price * item.quantity).toLocaleString()}
                            </span>
                            {item.originalPrice > item.price && (
                              <span className="text-sm text-gray-500 line-through">
                                ₹{(item.originalPrice * item.quantity).toLocaleString()}
                              </span>
                            )}
                          </div>
                          {item.originalPrice > item.price && (
                            <span className="text-sm text-green-600 font-medium">
                              You save ₹{((item.originalPrice - item.price) * item.quantity).toLocaleString()}
                            </span>
                          )}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-4">
                          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="w-12 text-center font-semibold text-gray-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus size={16} />
                            </button>
                          </div>

                          {/* Move to Wishlist */}
                          <button
                            onClick={() => moveToWishlist(item.id)}
                            className="p-2.5 text-gray-600 hover:text-pink-500 hover:bg-pink-50 rounded-lg transition-colors"
                            title="Move to wishlist"
                          >
                            <Heart size={20} />
                          </button>
                        </div>
                      </div>

                      {/* Stock Status */}
                      {item.inStock && (
                        <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                          <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                          In Stock
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Continue Shopping */}
            <Link
              to="/"
              className="inline-flex items-center gap-2 mt-6 text-blue-600 hover:text-blue-700 font-medium"
            >
              <ArrowLeft size={20} />
              Continue Shopping
            </Link>
          </div>

          {/* Order Summary - Sticky Sidebar */}
          <div className="w-full lg:w-96">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24">
              <h3 className="font-bold text-xl text-gray-900 mb-6">Order Summary</h3>
              
              {/* Price Breakdown */}
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between text-base">
                  <span className="text-gray-600">Subtotal ({cartItems.length} items)</span>
                  <span className="font-semibold text-gray-900">₹{subtotal.toLocaleString()}</span>
                </div>
                
                {savings > 0 && (
                  <div className="flex justify-between text-base">
                    <span className="text-green-600">Discount</span>
                    <span className="font-semibold text-green-600">-₹{savings.toLocaleString()}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-base">
                  <span className="text-gray-600">Shipping</span>
                  <span className={`font-semibold ${shipping === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                    {shipping === 0 ? 'FREE' : `₹${shipping}`}
                  </span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-200">
                <span className="text-lg font-bold text-gray-900">Total Amount</span>
                <span className="text-2xl font-bold text-blue-600">₹{total.toLocaleString()}</span>
              </div>

              {/* Checkout Button */}
              <Link
                to="/checkout"
                className="w-full block text-center py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-bold text-lg mb-4 shadow-md hover:shadow-lg active:scale-[0.98]"
              >
                Proceed to Checkout
              </Link>

              {/* Payment Methods */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-xs text-gray-500">We accept:</span>
                <div className="flex gap-2">
                  <div className="w-8 h-6 bg-gray-100 rounded flex items-center justify-center">
                    <CreditCard size={14} className="text-gray-600" />
                  </div>
                  <div className="w-8 h-6 bg-gray-100 rounded"></div>
                  <div className="w-8 h-6 bg-gray-100 rounded"></div>
                </div>
              </div>

              <p className="text-xs text-gray-500 text-center leading-relaxed">
                Secure checkout • 100% safe transactions
              </p>
            </div>
          </div>
        </div>
        <RecommendedProducts />
      </div>
    </div>
  );
};

export default CartPage;
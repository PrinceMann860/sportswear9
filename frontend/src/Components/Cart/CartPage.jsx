import React, { useState } from 'react';
import { Minus, Plus, Trash2, ShoppingCart, ArrowLeft, Tag, Truck, Shield, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

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
      category: 'Running'
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
      category: 'Training'
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
      category: 'Training'
    }
  ]);

  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);

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

  const applyPromoCode = () => {
    if (promoCode === 'WELCOME10') {
      setAppliedPromo({ code: 'WELCOME10', discount: 10 });
    } else if (promoCode === 'SPORTS20') {
      setAppliedPromo({ code: 'SPORTS20', discount: 20 });
    } else {
      alert('Invalid promo code');
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    setPromoCode('');
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const savings = cartItems.reduce((sum, item) => sum + ((item.originalPrice - item.price) * item.quantity), 0);
  const promoDiscount = appliedPromo ? (subtotal * appliedPromo.discount) / 100 : 0;
  const shipping = subtotal > 999 ? 0 : 49;
  const total = subtotal - promoDiscount + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white pt-20">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart size={48} className="text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Discover our sports products and find the perfect gear for your activities
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-lg"
            >
              <ArrowLeft size={20} />
              Discover Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <ArrowLeft size={20} />
            Continue Shopping
          </Link>
          <div className="h-6 w-px bg-gray-300"></div>
          <h1 className="text-2xl font-bold text-gray-900">My Cart</h1>
          <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="flex-1">
            {/* Free Shipping Banner */}
            {shipping > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-blue-600" />
                  <div className="flex-1">
                    <p className="font-medium text-blue-900">
                      Add ₹{(999 - subtotal).toLocaleString()} more for FREE shipping!
                    </p>
                    <p className="text-sm text-blue-700">
                      You're almost there to get free delivery
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Cart Items List */}
            <div className="bg-white rounded-lg border border-gray-200">
              {cartItems.map((item, index) => (
                <div key={item.id} className={`p-6 ${index !== cartItems.length - 1 ? 'border-b border-gray-100' : ''}`}>
                  <div className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <span className="inline-block bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium mb-2">
                            {item.category}
                          </span>
                          <h3 className="font-semibold text-gray-900 text-lg mb-1">
                            {item.name}
                          </h3>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                        <span>Size: <strong>{item.size}</strong></span>
                        <span>Color: <strong>{item.color}</strong></span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-4">
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="w-12 text-center font-medium text-gray-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          
                          {/* Price */}
                          <div className="text-right">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-lg text-gray-900">
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
                                Save ₹{((item.originalPrice - item.price) * item.quantity).toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {/* Unit Price */}
                        <div className="text-right">
                          <span className="text-sm text-gray-600">Unit price:</span>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900">
                              ₹{item.price.toLocaleString()}
                            </span>
                            {item.originalPrice > item.price && (
                              <span className="text-sm text-green-600 font-medium">
                                {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% off
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Services */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Truck className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Free Shipping</h4>
                <p className="text-sm text-gray-600">On orders above ₹999</p>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">2 Year Warranty</h4>
                <p className="text-sm text-gray-600">Quality guaranteed</p>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <RefreshCw className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Easy Returns</h4>
                <p className="text-sm text-gray-600">30-day return policy</p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-80">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24">
              <h3 className="font-bold text-xl text-gray-900 mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({cartItems.length} items)</span>
                  <span className="font-medium">₹{subtotal.toLocaleString()}</span>
                </div>
                
                {savings > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">You save</span>
                    <span className="font-medium text-green-600">-₹{savings.toLocaleString()}</span>
                  </div>
                )}

                {appliedPromo && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Promo code ({appliedPromo.code})</span>
                    <span className="font-medium text-green-600">-₹{promoDiscount.toLocaleString()}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className={shipping === 0 ? 'text-green-600 font-medium' : 'font-medium'}>
                    {shipping === 0 ? 'FREE' : `₹${shipping}`}
                  </span>
                </div>
              </div>

              {/* Promo Code */}
              <div className="mb-6">
                {appliedPromo ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">
                        {appliedPromo.code} applied
                      </span>
                    </div>
                    <button
                      onClick={removePromoCode}
                      className="text-green-600 hover:text-green-800 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Promo Code</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Enter code"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                      <button
                        onClick={applyPromoCode}
                        className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition font-medium text-sm"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Total Amount</span>
                  <span className="text-blue-600">₹{total.toLocaleString()}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="w-full block text-center py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-bold text-lg mb-4"
              >
                Proceed to Checkout
              </Link>

              <p className="text-xs text-gray-500 text-center">
                By proceeding, you agree to our Terms & Conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
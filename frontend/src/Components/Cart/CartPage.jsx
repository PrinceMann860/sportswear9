import React, { useState } from 'react';
import { Minus, Plus, Trash2, ShoppingCart, ArrowLeft, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Duramo 10 Running Shoes',
      image: 'https://assets.myntassets.com/dpr_1.5,q_30,w_400,c_limit,fl_progressive/assets/images/2025/FEBRUARY/3/L7GEjRDH_b510caa934e949b78484e8cfb577804d.jpg',
      price: 2499,
      originalPrice: 6599,
      quantity: 1,
      size: 'UK 9',
      color: 'Black/White'
    },
    {
      id: 2,
      name: 'Compression T-shirt',
      image: 'https://www.cyclop.in/cdn/shop/files/1_d5b00990-6b2a-4365-849b-084d14380580_1080x.jpg?v=1689009277',
      price: 1999,
      originalPrice: 3999,
      quantity: 2,
      size: 'L',
      color: 'Navy Blue'
    },
    {
      id: 3,
      name: 'Training Shorts',
      image: 'https://assets.myntassets.com/dpr_1.5,q_30,w_400,c_limit,fl_progressive/assets/images/2025/FEBRUARY/3/L7GEjRDH_b510caa934e949b78484e8cfb577804d.jpg',
      price: 3499,
      originalPrice: 6999,
      quantity: 1,
      size: 'M',
      color: 'Black'
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
    if (promoCode === 'SAVE10') {
      setAppliedPromo({ code: 'SAVE10', discount: 10 });
    } else if (promoCode === 'FIRST20') {
      setAppliedPromo({ code: 'FIRST20', discount: 20 });
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
  const shipping = subtotal > 2000 ? 0 : 99;
  const total = subtotal - promoDiscount + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 md:pt-20 pb-16 md:pb-0">
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          <div className="text-center">
            <ShoppingCart size={64} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-sm md:text-base text-gray-600 mb-6">
              Looks like you haven't added anything to your cart yet
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition font-semibold text-sm md:text-base"
            >
              <ArrowLeft size={20} />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16 md:pt-20 pb-16 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 py-4 md:py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 md:mb-8">
          <Link to="/" className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs md:text-sm font-medium">
            {cartItems.length} items
          </span>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          {/* Cart Items */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm">
              {cartItems.map((item, index) => (
                <div key={item.id} className={`p-4 md:p-6 ${index !== cartItems.length - 1 ? 'border-b border-gray-200' : ''}`}>
                  <div className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm md:text-base text-gray-900 mb-1 line-clamp-2">
                        {item.name}
                      </h3>
                      <div className="flex flex-wrap gap-2 md:gap-4 text-xs md:text-sm text-gray-600 mb-2">
                        <span>Size: {item.size}</span>
                        <span>Color: {item.color}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <span className="font-semibold text-sm md:text-base text-gray-900">
                          ₹{item.price.toLocaleString()}
                        </span>
                        <span className="text-xs md:text-sm text-gray-500 line-through">
                          ₹{item.originalPrice.toLocaleString()}
                        </span>
                        <span className="text-xs md:text-sm text-green-600 font-medium">
                          {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% off
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 md:gap-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 md:w-12 text-center font-medium text-sm md:text-base">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo Code */}
            <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mt-4 md:mt-6">
              <h3 className="font-semibold text-base md:text-lg mb-4">Promo Code</h3>
              {appliedPromo ? (
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-green-600" />
                    <span className="text-sm md:text-base font-medium text-green-800">
                      {appliedPromo.code} - {appliedPromo.discount}% off applied
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
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter promo code"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm md:text-base"
                  />
                  <button
                    onClick={applyPromoCode}
                    className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition font-medium text-sm md:text-base"
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-96">
            <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 sticky top-24">
              <h3 className="font-semibold text-lg md:text-xl mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm md:text-base">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between text-sm md:text-base text-green-600">
                  <span>You're saving</span>
                  <span>-₹{savings.toLocaleString()}</span>
                </div>

                {appliedPromo && (
                  <div className="flex justify-between text-sm md:text-base text-green-600">
                    <span>Promo discount ({appliedPromo.code})</span>
                    <span>-₹{promoDiscount.toLocaleString()}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-sm md:text-base">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-green-600' : ''}>
                    {shipping === 0 ? 'FREE' : `₹${shipping}`}
                  </span>
                </div>

                {shipping > 0 && (
                  <p className="text-xs md:text-sm text-gray-600">
                    Add ₹{(2000 - subtotal).toLocaleString()} more for free shipping
                  </p>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between font-semibold text-base md:text-lg">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="w-full block text-center py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition font-semibold text-sm md:text-base mb-3"
              >
                Proceed to Checkout
              </Link>

              <Link
                to="/"
                className="w-full block text-center py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium text-sm md:text-base"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
import React, { useEffect } from "react";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingCart,
  ArrowLeft,
  Heart,
  Truck,
  CreditCard,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCartItems } from "./Cartslice"; // update path if needed
import RecommendedProducts from "../Home/RecommendedProducts";

const CartPage = () => {
  const dispatch = useDispatch();
  const { items: cartData, loading } = useSelector((state) => state.cart);

  // fetch on mount
  useEffect(() => {
    dispatch(fetchCartItems());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading your cart...</p>
      </div>
    );
  }

  if (!cartData || !cartData.items || cartData.items.length === 0) {
    return (
      <div className="min-h-screen bg-white pt-20 pb-20 md:pb-0">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart size={64} className="text-gray-300" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
              Discover our products and find the perfect gear for your needs
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

  const cartItems = cartData.items;
  const subtotal = parseFloat(cartData.subtotal || 0);
  const total = parseFloat(cartData.total_price || subtotal);
  const totalItems = cartData.total_items || cartItems.length;
  const shipping = subtotal > 999 ? 0 : 49;

  const updateQuantity = (id, newQuantity) => {
    console.log("update quantity", id, newQuantity);
  };

  const removeItem = (id) => {
    console.log("remove item", id);
  };

  const moveToWishlist = (id) => {
    console.log("move to wishlist", id);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-6">
          <Link to="/" className="text-gray-600 hover:text-blue-600">
            Home
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-medium">Shopping Cart</span>
        </div>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-600">
            {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        {/* Free Shipping Bar */}
        {shipping > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3 mb-3">
              <Truck className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-semibold text-blue-900 mb-1">
                  You're ₹{(1000 - subtotal).toLocaleString()} away from FREE
                  shipping!
                </p>
                <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min((subtotal / 1000) * 100, 100)}%`,
                    }}
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
              {cartItems.map((item) => {
                const variant = item.variant;
                const mainImage =
                  variant.images?.find((img) => img.is_main)?.image_url ||
                  variant.images?.[0]?.image_url;
                const color =
                  variant.attributes?.find((a) => a.attribute)?.value || "N/A";

                return (
                  <div
                    key={item.cart_item_id}
                    className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex gap-4">
                      {/* Image */}
                      <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0">
                        <img
                          src={mainImage}
                          alt={variant.sku}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 text-base md:text-lg mb-1 line-clamp-2">
                              {variant.sku}
                            </h3>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 mb-3">
                              <span>
                                Color:{" "}
                                <strong className="text-gray-900">
                                  {color}
                                </strong>
                              </span>
                              <span>
                                Qty:{" "}
                                <strong className="text-gray-900">
                                  {item.quantity}
                                </strong>
                              </span>
                            </div>
                          </div>

                          {/* Delete */}
                          <button
                            onClick={() => removeItem(item.cart_item_id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                            title="Remove item"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>

                        {/* Price & Quantity */}
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-xl text-gray-900">
                                ₹{item.subtotal?.toLocaleString()}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.cart_item_id,
                                    item.quantity - 1
                                  )
                                }
                                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                              >
                                <Minus size={16} />
                              </button>
                              <span className="w-12 text-center font-semibold text-gray-900">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.cart_item_id,
                                    item.quantity + 1
                                  )
                                }
                                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                              >
                                <Plus size={16} />
                              </button>
                            </div>

                            <button
                              onClick={() => moveToWishlist(item.cart_item_id)}
                              className="p-2.5 text-gray-600 hover:text-pink-500 hover:bg-pink-50 rounded-lg transition-colors"
                              title="Move to wishlist"
                            >
                              <Heart size={20} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <Link
              to="/"
              className="inline-flex items-center gap-2 mt-6 text-blue-600 hover:text-blue-700 font-medium"
            >
              <ArrowLeft size={20} />
              Continue Shopping
            </Link>
          </div>

          {/* Summary */}
          <div className="w-full lg:w-96">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24">
              <h3 className="font-bold text-xl text-gray-900 mb-6">
                Order Summary
              </h3>

              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between text-base">
                  <span className="text-gray-600">
                    Subtotal ({totalItems} items)
                  </span>
                  <span className="font-semibold text-gray-900">
                    ₹{subtotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-base">
                  <span className="text-gray-600">Shipping</span>
                  <span
                    className={`font-semibold ${
                      shipping === 0 ? "text-green-600" : "text-gray-900"
                    }`}
                  >
                    {shipping === 0 ? "FREE" : `₹${shipping}`}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-200">
                <span className="text-lg font-bold text-gray-900">
                  Total Amount
                </span>
                <span className="text-2xl font-bold text-blue-600">
                  ₹{total.toLocaleString()}
                </span>
              </div>

              <Link
                to="/checkout"
                className="w-full block text-center py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-bold text-lg mb-4 shadow-md hover:shadow-lg active:scale-[0.98]"
              >
                Proceed to Checkout
              </Link>

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

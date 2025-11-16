import React, { useEffect } from "react";
import SEO from "../Common/SEO";
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
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCartItems,
  deleteCartItem,
  updateCartItem,
} from "./Cartslice";
import RecommendedProducts from "../Home/RecommendedProducts";

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items, subtotal, total_price, total_items, loading } = useSelector(
    (state) => state.cart
  );

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

  if (!Array.isArray(items) || items.length === 0) {
    return (
      <div className="min-h-screen bg-white pt-20 pb-20 md:pb-0">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <ShoppingCart size={64} className="text-gray-300 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Your cart is empty
          </h2>
          <Link
            to="/"
            className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-semibold text-lg shadow-md"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  const cartItems = items;
  const total = Number(total_price || subtotal);
  const shipping = subtotal > 999 ? 0 : 49;

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;

    dispatch(updateCartItem({ id, quantity: newQuantity }))
      .unwrap()
      .then(() => dispatch(fetchCartItems()));
  };

  const removeItem = (id) => {
    dispatch(deleteCartItem(id))
      .unwrap()
      .then(() => dispatch(fetchCartItems()));
  };

  const moveToWishlist = () => {
    window.dispatchEvent(
      new CustomEvent("showToast", {
        detail: { message: "Wishlist feature coming soon!", type: "info" },
      })
    );
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
            {total_items} {total_items === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        {/* Free Shipping Progress */}
        {shipping > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3 mb-3">
              <Truck className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-blue-900 mb-1">
                  You're ₹{(1000 - subtotal).toLocaleString()} away from FREE shipping!
                </p>
                <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
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

          {/* LEFT SIDE */}
          <div className="flex-1">
            <div className="space-y-4">

              {cartItems.map((item) => {
                const variant = item.variant || {};

                const mainImage =
                  variant.images?.find((img) => img.is_main)?.image_url ||
                  variant.images?.[0]?.image_url ||
                  "/placeholder.png";

                const color =
                  variant.attributes?.[0]?.value || "N/A";

                return (
                  <div
                    key={item.cart_item_id}
                    className="bg-white rounded-lg border p-4 md:p-6 hover:shadow-md"
                  >
                    <div className="flex gap-4">

                      <div className="w-24 h-24 md:w-32 md:h-32">
                        <img
                          src={mainImage}
                          alt={variant.sku}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>

                      <div className="flex-1 min-w-0">

                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900 text-base md:text-lg mb-1 line-clamp-2">
                              {variant.sku}
                            </h3>

                            <div className="flex flex-wrap gap-x-4 text-sm text-gray-600 mb-3">
                              <span>
                                Color: <strong>{color}</strong>
                              </span>
                              <span>
                                Qty: <strong>{item.quantity}</strong>
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => removeItem(item.cart_item_id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">

                          <div>
                            <span className="font-bold text-xl text-gray-900">
                              ₹{item.subtotal?.toLocaleString()}
                            </span>
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
                                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100"
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
                                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                              >
                                <Plus size={16} />
                              </button>
                            </div>

                            <button
                              onClick={moveToWishlist}
                              className="p-2.5 text-gray-600 hover:text-pink-500 hover:bg-pink-50 rounded-lg"
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

          {/* RIGHT SIDE */}
          <div className="w-full lg:w-96">
            <div className="bg-white rounded-lg border p-6 sticky top-24">

              <h3 className="font-bold text-xl text-gray-900 mb-6">
                Order Summary
              </h3>

              <div className="space-y-3 mb-6 pb-6 border-b">
                <div className="flex justify-between text-base">
                  <span className="text-gray-600">
                    Subtotal ({total_items} items)
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

              <div className="flex justify-between items-center mb-6 pb-6 border-b">
                <span className="text-lg font-bold text-gray-900">
                  Total Amount
                </span>
                <span className="text-2xl font-bold text-blue-600">
                  ₹{total.toLocaleString()}
                </span>
              </div>

              <Link
                to="/checkout"
                className="w-full block text-center py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold text-lg mb-4"
              >
                Proceed to Checkout
              </Link>

              <p className="text-xs text-gray-500 text-center">
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

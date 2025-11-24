import React, { useState, useEffect } from 'react';
import { ArrowLeft, CreditCard, Truck, Shield, MapPin, Check, Plus, Trash2, Edit2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAddresses, addAddress, deleteAddress } from '../Profile/Profileslice';
import { placeOrder, resetOrderState } from './orderSlice';
import { fetchCartItems } from '../Cart/Cartslice';

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { addresses, loading: addressLoading } = useSelector(state => state.profile);
  const { loading: orderLoading, success: orderSuccess, error: orderError, message: orderMessage } = useSelector(state => state.order);
  const { items: cartItems, total_price, subtotal: cartSubtotal, total_items, loading: cartLoading } = useSelector(state => state.cart);

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);

  const [newAddress, setNewAddress] = useState({
    street_address: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'India',
    address_type: 'home',
    is_default: false
  });

  const [formData, setFormData] = useState({
    paymentMethod: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    upiId: '',
    deliveryOption: 'standard'
  });

  // Transform cart items for display - updated to handle nested variant structure
  const orderItems = cartItems.map(item => {
    const variant = item.variant || {};
    const mainImage = variant.images?.find(img => img.is_main) || variant.images?.[0];
    const sizeAttribute = variant.attributes?.find(attr => 
      attr.attribute === 'MZ2aiek9kr' || attr.value === 'XS' || attr.value === 'S' || attr.value === 'M' || 
      attr.value === 'L' || attr.value === 'XL' || attr.value === 'XXL'
    );
    const colorAttribute = variant.attributes?.find(attr => 
      attr.attribute === 'NpPQsJrWak' || attr.meta?.hex
    );

    return {
      id: item.cart_item_id,
      name: mainImage?.alt_text || `Product ${item.cart_name}`,
      image: mainImage?.image_url || 'https://via.placeholder.com/200x200?text=No+Image',
      price: Number(variant.effective_price) || Number(variant.price) || 0,
      quantity: Number(item.quantity),
      size: sizeAttribute?.value || 'Standard',
      color: colorAttribute?.value || '',
      colorHex: colorAttribute?.meta?.hex,
      subtotal: Number(item.subtotal) || 0
    };
  });

  // Calculate prices based on actual cart data
  const subtotal = Number(cartSubtotal) || orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 2000 ? 0 : 99;
  const tax = Math.round(subtotal * 0.18);
  const total = Number(total_price) || (subtotal + shipping + tax);
  
  // Calculate savings based on the difference between price and effective_price
  const savings = orderItems.reduce((sum, item) => {
    const variant = cartItems.find(cartItem => cartItem.cart_item_id === item.id)?.variant;
    if (variant && variant.price && variant.effective_price) {
      const originalPrice = Number(variant.price);
      const discountedPrice = Number(variant.effective_price);
      return sum + ((originalPrice - discountedPrice) * item.quantity);
    }
    return sum;
  }, 0);

  useEffect(() => {
    dispatch(fetchAddresses());
    dispatch(fetchCartItems());
  }, [dispatch]);

  useEffect(() => {
    if (addresses && addresses.length > 0 && !selectedAddressId) {
      const defaultAddress = addresses.find(addr => addr.is_default);
      setSelectedAddressId(defaultAddress?.address_id || addresses[0].address_id);
    }
  }, [addresses, selectedAddressId]);

  useEffect(() => {
    if (orderSuccess) {
      alert(`Order placed successfully! ${orderMessage || ''}`);
      dispatch(resetOrderState());
      navigate('/orders');
    }
  }, [orderSuccess, orderMessage, dispatch, navigate]);

  useEffect(() => {
    if (orderError) {
      alert(`Order failed: ${typeof orderError === 'string' ? orderError : JSON.stringify(orderError)}`);
    }
  }, [orderError]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleNewAddressChange = (e) => {
    setNewAddress({
      ...newAddress,
      [e.target.name]: e.target.value
    });
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      await dispatch(addAddress(newAddress)).unwrap();
      setShowAddAddressForm(false);
      setNewAddress({
        street_address: '',
        city: '',
        state: '',
        postal_code: '',
        country: 'India',
        address_type: 'home',
        is_default: false
      });
      dispatch(fetchAddresses());
    } catch (error) {
      alert('Failed to add address: ' + error);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await dispatch(deleteAddress(addressId)).unwrap();
        if (selectedAddressId === addressId) {
          setSelectedAddressId(null);
        }
      } catch (error) {
        alert('Failed to delete address: ' + error);
      }
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1 && !selectedAddressId) {
      alert('Please select or add a delivery address');
      return;
    }
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      alert('Please select a delivery address');
      return;
    }

    if (orderItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    try {
      await dispatch(placeOrder(selectedAddressId)).unwrap();
    } catch (error) {
      console.error('Order placement failed:', error);
    }
  };

  const steps = [
    { number: 1, title: 'Shipping', icon: Truck },
    { number: 2, title: 'Payment', icon: CreditCard },
    { number: 3, title: 'Review', icon: Shield }
  ];

  const selectedAddress = addresses?.find(addr => addr.address_id === selectedAddressId);

  if (cartLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16 md:pt-20 pb-16 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 py-4 md:py-8">
        <div className="flex items-center gap-3 mb-6 md:mb-8">
          <Link to="/cart" className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">Checkout</h1>
        </div>

        <div className="mb-6 md:mb-8">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex flex-col items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}>
                  <div className={`flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full border-2 ${
                    currentStep >= step.number
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'border-gray-300 text-gray-400'
                  } transition-all duration-300`}>
                    {currentStep > step.number ? (
                      <Check size={18} className="font-bold" />
                    ) : (
                      <step.icon size={18} />
                    )}
                  </div>
                  <span className={`mt-2 text-xs md:text-sm font-medium ${
                    currentStep >= step.number ? 'text-blue-600' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 md:w-24 h-1 mx-2 md:mx-4 rounded-full ${
                    currentStep > step.number ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-blue-50 px-4 md:px-6 py-4 border-b border-blue-100">
                <h2 className="text-lg md:text-xl font-bold text-blue-900 flex items-center gap-2">
                  {currentStep === 1 && <><Truck size={20} /> Delivery Address</>}
                  {currentStep === 2 && <><CreditCard size={20} /> Payment Method</>}
                  {currentStep === 3 && <><Shield size={20} /> Review Order</>}
                </h2>
              </div>

              <div className="p-4 md:p-6">
                {currentStep === 1 && (
                  <div>
                    {addressLoading ? (
                      <div className="text-center py-8">Loading addresses...</div>
                    ) : (
                      <>
                        <div className="space-y-3 mb-6">
                          {addresses && addresses.length > 0 ? (
                            addresses.map((address) => (
                              <label
                                key={address.address_id}
                                className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                  selectedAddressId === address.address_id
                                    ? 'border-blue-600 bg-blue-50'
                                    : 'border-gray-300 hover:bg-gray-50'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="selectedAddress"
                                  value={address.address_id}
                                  checked={selectedAddressId === address.address_id}
                                  onChange={() => setSelectedAddressId(address.address_id)}
                                  className="mt-1 mr-4 text-blue-600 focus:ring-blue-500"
                                />
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-sm md:text-base capitalize">
                                      {address.address_type || 'Home'}
                                    </span>
                                    {address.is_default && (
                                      <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded">
                                        Default
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-700">
                                    {address.street_address}
                                  </p>
                                  <p className="text-sm text-gray-700">
                                    {address.city}, {address.state} {address.postal_code}
                                  </p>
                                  <p className="text-sm text-gray-700">{address.country}</p>
                                </div>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleDeleteAddress(address.address_id);
                                  }}
                                  className="ml-2 p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </label>
                            ))
                          ) : (
                            <div className="text-center py-8 text-gray-600">
                              No saved addresses. Please add a new address.
                            </div>
                          )}
                        </div>

                        {!showAddAddressForm ? (
                          <button
                            onClick={() => setShowAddAddressForm(true)}
                            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 font-medium"
                          >
                            <Plus size={20} />
                            Add New Address
                          </button>
                        ) : (
                          <form onSubmit={handleAddAddress} className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
                            <h3 className="font-semibold mb-4 text-lg">Add New Address</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Street Address *
                                </label>
                                <input
                                  type="text"
                                  name="street_address"
                                  value={newAddress.street_address}
                                  onChange={handleNewAddressChange}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  required
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                                <input
                                  type="text"
                                  name="city"
                                  value={newAddress.city}
                                  onChange={handleNewAddressChange}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  required
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                                <input
                                  type="text"
                                  name="state"
                                  value={newAddress.state}
                                  onChange={handleNewAddressChange}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  required
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">PIN Code *</label>
                                <input
                                  type="text"
                                  name="postal_code"
                                  value={newAddress.postal_code}
                                  onChange={handleNewAddressChange}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  required
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                                <input
                                  type="text"
                                  name="country"
                                  value={newAddress.country}
                                  onChange={handleNewAddressChange}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Address Type</label>
                                <select
                                  name="address_type"
                                  value={newAddress.address_type}
                                  onChange={handleNewAddressChange}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  <option value="home">Home</option>
                                  <option value="work">Work</option>
                                  <option value="other">Other</option>
                                </select>
                              </div>

                              <div className="md:col-span-2">
                                <label className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    name="is_default"
                                    checked={newAddress.is_default}
                                    onChange={(e) => setNewAddress({...newAddress, is_default: e.target.checked})}
                                    className="text-blue-600 focus:ring-blue-500"
                                  />
                                  <span className="text-sm">Set as default address</span>
                                </label>
                              </div>
                            </div>

                            <div className="flex gap-3">
                              <button
                                type="submit"
                                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                              >
                                Save Address
                              </button>
                              <button
                                type="button"
                                onClick={() => setShowAddAddressForm(false)}
                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        )}

                        <div className="mt-6">
                          <h3 className="text-base md:text-lg font-semibold mb-4">Delivery Options</h3>
                          <div className="space-y-3">
                            <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
                              <input
                                type="radio"
                                name="deliveryOption"
                                value="standard"
                                checked={formData.deliveryOption === 'standard'}
                                onChange={handleInputChange}
                                className="mr-4 text-blue-600 focus:ring-blue-500"
                              />
                              <div className="flex-1">
                                <div className="flex justify-between items-center">
                                  <span className="font-medium text-sm md:text-base">Standard Delivery</span>
                                  <span className="text-sm md:text-base font-semibold">{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                                </div>
                                <p className="text-xs md:text-sm text-gray-600 mt-1">5-7 business days</p>
                              </div>
                            </label>

                            <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
                              <input
                                type="radio"
                                name="deliveryOption"
                                value="express"
                                checked={formData.deliveryOption === 'express'}
                                onChange={handleInputChange}
                                className="mr-4 text-blue-600 focus:ring-blue-500"
                              />
                              <div className="flex-1">
                                <div className="flex justify-between items-center">
                                  <span className="font-medium text-sm md:text-base">Express Delivery</span>
                                  <span className="text-sm md:text-base font-semibold">₹199</span>
                                </div>
                                <p className="text-xs md:text-sm text-gray-600 mt-1">2-3 business days</p>
                              </div>
                            </label>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {currentStep === 2 && (
                  <div>
                    <div className="mb-6">
                      <h3 className="text-base md:text-lg font-medium mb-4">Payment Method</h3>
                      <div className="space-y-3">
                        <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="card"
                            checked={formData.paymentMethod === 'card'}
                            onChange={handleInputChange}
                            className="mr-4 text-blue-600 focus:ring-blue-500"
                          />
                          <CreditCard className="w-5 h-5 mr-3 text-gray-600" />
                          <span className="text-sm md:text-base">Credit/Debit Card</span>
                        </label>

                        <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="upi"
                            checked={formData.paymentMethod === 'upi'}
                            onChange={handleInputChange}
                            className="mr-4 text-blue-600 focus:ring-blue-500"
                          />
                          <div className="w-5 h-5 mr-3 bg-orange-500 rounded text-white text-xs flex items-center justify-center font-bold">
                            U
                          </div>
                          <span className="text-sm md:text-base">UPI</span>
                        </label>

                        <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="cod"
                            checked={formData.paymentMethod === 'cod'}
                            onChange={handleInputChange}
                            className="mr-4 text-blue-600 focus:ring-blue-500"
                          />
                          <Truck className="w-5 h-5 mr-3 text-gray-600" />
                          <span className="text-sm md:text-base">Cash on Delivery</span>
                        </label>
                      </div>
                    </div>

                    {formData.paymentMethod === 'card' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Card Number *</label>
                          <input
                            type="text"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleInputChange}
                            placeholder="1234 5678 9012 3456"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base transition"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date *</label>
                          <input
                            type="text"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleInputChange}
                            placeholder="MM/YY"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base transition"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">CVV *</label>
                          <input
                            type="text"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleInputChange}
                            placeholder="123"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base transition"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name *</label>
                          <input
                            type="text"
                            name="cardName"
                            value={formData.cardName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base transition"
                          />
                        </div>
                      </div>
                    )}

                    {formData.paymentMethod === 'upi' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">UPI ID *</label>
                        <input
                          type="text"
                          name="upiId"
                          value={formData.upiId}
                          onChange={handleInputChange}
                          placeholder="yourname@upi"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base transition"
                        />
                      </div>
                    )}

                    {formData.paymentMethod === 'cod' && (
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm md:text-base text-yellow-800">
                          You will pay ₹{total.toLocaleString()} when your order is delivered.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {currentStep === 3 && (
                  <div>
                    {selectedAddress && (
                      <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-blue-50">
                        <h3 className="font-medium text-base md:text-lg mb-2 flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          Shipping Address
                        </h3>
                        <p className="text-sm md:text-base text-gray-700 capitalize">
                          {selectedAddress.address_type || 'Home'}
                        </p>
                        <p className="text-sm md:text-base text-gray-700">
                          {selectedAddress.street_address}
                        </p>
                        <p className="text-sm md:text-base text-gray-700">
                          {selectedAddress.city}, {selectedAddress.state} {selectedAddress.postal_code}
                        </p>
                        <p className="text-sm md:text-base text-gray-700">{selectedAddress.country}</p>
                      </div>
                    )}

                    <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-blue-50">
                      <h3 className="font-medium text-base md:text-lg mb-2 flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        Payment Method
                      </h3>
                      <p className="text-sm md:text-base text-gray-700 capitalize">
                        {formData.paymentMethod === 'card' ? 'Credit/Debit Card' :
                         formData.paymentMethod === 'upi' ? 'UPI' : 'Cash on Delivery'}
                      </p>
                    </div>

                    <div className="mb-6">
                      <h3 className="font-medium text-base md:text-lg mb-4">Order Items ({total_items})</h3>
                      <div className="space-y-4">
                        {orderItems.map((item) => (
                          <div key={item.id} className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                              }}
                            />
                            <div className="flex-1">
                              <h4 className="font-medium text-sm md:text-base">{item.name}</h4>
                              <p className="text-xs md:text-sm text-gray-600">Size: {item.size}</p>
                              <p className="text-xs md:text-sm text-gray-600">Quantity: {item.quantity}</p>
                              <p className="font-medium text-sm md:text-base">
                                ₹{item.price.toLocaleString()} × {item.quantity} = ₹{(item.price * item.quantity).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 mt-6 md:mt-8">
                  {currentStep > 1 && (
                    <button
                      onClick={handlePrevStep}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium text-sm md:text-base"
                      disabled={orderLoading}
                    >
                      Previous
                    </button>
                  )}

                  {currentStep < 3 ? (
                    <button
                      onClick={handleNextStep}
                      className="flex-1 sm:flex-none px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-sm md:text-base shadow-md hover:shadow-lg"
                      disabled={orderLoading || orderItems.length === 0}
                    >
                      Continue
                    </button>
                  ) : (
                    <button
                      onClick={handlePlaceOrder}
                      className="flex-1 sm:flex-none px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-sm md:text-base shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                      disabled={orderLoading || !selectedAddressId || orderItems.length === 0}
                    >
                      {orderLoading ? 'Placing Order...' : 'Place Order'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-96">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24">
              <h3 className="font-bold text-xl text-gray-900 mb-6">Order Summary</h3>

              {orderItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Your cart is empty
                  <Link to="/products" className="block mt-4 text-blue-600 hover:text-blue-700 font-medium">
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-4 max-h-80 overflow-y-auto">
                    {orderItems.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm md:text-base line-clamp-2">{item.name}</h4>
                          <p className="text-xs md:text-sm text-gray-600">Qty: {item.quantity}</p>
                          <p className="text-xs md:text-sm text-gray-600">Size: {item.size}</p>
                          <p className="font-medium text-sm md:text-base">₹{(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 pt-4 space-y-2 mb-4">
                    <div className="flex justify-between text-sm md:text-base">
                      <span>Subtotal ({total_items} items)</span>
                      <span>₹{subtotal.toLocaleString()}</span>
                    </div>

                    {savings > 0 && (
                      <div className="flex justify-between text-sm md:text-base">
                        <span className="text-green-600">You Save</span>
                        <span className="font-semibold text-green-600">-₹{Math.round(savings).toLocaleString()}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-sm md:text-base">
                      <span>Shipping</span>
                      <span className={shipping === 0 ? 'text-green-600 font-semibold' : ''}>
                        {shipping === 0 ? 'FREE' : `₹${shipping}`}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm md:text-base">
                      <span>Tax (GST)</span>
                      <span>₹{tax.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between font-semibold text-base md:text-lg">
                      <span>Total</span>
                      <span className="text-blue-600">₹{total.toLocaleString()}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
import React, { useState } from 'react';
import { ArrowLeft, CreditCard, Truck, Shield, MapPin, User, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const CheckoutPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Shipping Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    
    // Payment Information
    paymentMethod: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    
    // UPI
    upiId: '',
    
    // Delivery Options
    deliveryOption: 'standard'
  });

  const [orderItems] = useState([
    {
      id: 1,
      name: 'Duramo 10 Running Shoes',
      image: 'https://assets.myntassets.com/dpr_1.5,q_30,w_400,c_limit,fl_progressive/assets/images/2025/FEBRUARY/3/L7GEjRDH_b510caa934e949b78484e8cfb577804d.jpg',
      price: 2499,
      quantity: 1,
      size: 'UK 9'
    },
    {
      id: 2,
      name: 'Compression T-shirt',
      image: 'https://www.cyclop.in/cdn/shop/files/1_d5b00990-6b2a-4365-849b-084d14380580_1080x.jpg?v=1689009277',
      price: 1999,
      quantity: 2,
      size: 'L'
    }
  ]);

  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 2000 ? 0 : 99;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePlaceOrder = () => {
    // Handle order placement
    alert('Order placed successfully!');
  };

  const steps = [
    { number: 1, title: 'Shipping', icon: Truck },
    { number: 2, title: 'Payment', icon: CreditCard },
    { number: 3, title: 'Review', icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16 md:pt-20 pb-16 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 py-4 md:py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 md:mb-8">
          <Link to="/cart" className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">Checkout</h1>
        </div>

        {/* Progress Steps */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full border-2 ${
                  currentStep >= step.number
                    ? 'bg-black border-black text-white'
                    : 'border-gray-300 text-gray-400'
                }`}>
                  <step.icon size={16} />
                </div>
                <span className={`ml-2 text-xs md:text-sm font-medium ${
                  currentStep >= step.number ? 'text-black' : 'text-gray-400'
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-8 md:w-16 h-0.5 mx-2 md:mx-4 ${
                    currentStep > step.number ? 'bg-black' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
              {/* Step 1: Shipping Information */}
              {currentStep === 1 && (
                <div>
                  <h2 className="text-lg md:text-xl font-semibold mb-6">Shipping Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm md:text-base"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm md:text-base"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm md:text-base"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm md:text-base"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm md:text-base"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm md:text-base"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm md:text-base"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">PIN Code *</label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm md:text-base"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm md:text-base"
                      >
                        <option value="India">India</option>
                      </select>
                    </div>
                  </div>

                  {/* Delivery Options */}
                  <div className="mt-6 md:mt-8">
                    <h3 className="text-base md:text-lg font-semibold mb-4">Delivery Options</h3>
                    <div className="space-y-3">
                      <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="deliveryOption"
                          value="standard"
                          checked={formData.deliveryOption === 'standard'}
                          onChange={handleInputChange}
                          className="mr-3"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-sm md:text-base">Standard Delivery</span>
                            <span className="text-sm md:text-base">{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                          </div>
                          <p className="text-xs md:text-sm text-gray-600">5-7 business days</p>
                        </div>
                      </label>

                      <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="deliveryOption"
                          value="express"
                          checked={formData.deliveryOption === 'express'}
                          onChange={handleInputChange}
                          className="mr-3"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-sm md:text-base">Express Delivery</span>
                            <span className="text-sm md:text-base">₹199</span>
                          </div>
                          <p className="text-xs md:text-sm text-gray-600">2-3 business days</p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Payment Information */}
              {currentStep === 2 && (
                <div>
                  <h2 className="text-lg md:text-xl font-semibold mb-6">Payment Information</h2>
                  
                  {/* Payment Method Selection */}
                  <div className="mb-6">
                    <h3 className="text-base md:text-lg font-medium mb-4">Payment Method</h3>
                    <div className="space-y-3">
                      <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="card"
                          checked={formData.paymentMethod === 'card'}
                          onChange={handleInputChange}
                          className="mr-3"
                        />
                        <CreditCard className="w-5 h-5 mr-3 text-gray-600" />
                        <span className="text-sm md:text-base">Credit/Debit Card</span>
                      </label>

                      <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="upi"
                          checked={formData.paymentMethod === 'upi'}
                          onChange={handleInputChange}
                          className="mr-3"
                        />
                        <div className="w-5 h-5 mr-3 bg-orange-500 rounded text-white text-xs flex items-center justify-center font-bold">
                          U
                        </div>
                        <span className="text-sm md:text-base">UPI</span>
                      </label>

                      <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cod"
                          checked={formData.paymentMethod === 'cod'}
                          onChange={handleInputChange}
                          className="mr-3"
                        />
                        <Truck className="w-5 h-5 mr-3 text-gray-600" />
                        <span className="text-sm md:text-base">Cash on Delivery</span>
                      </label>
                    </div>
                  </div>

                  {/* Card Details */}
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm md:text-base"
                          required
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm md:text-base"
                          required
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm md:text-base"
                          required
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name *</label>
                        <input
                          type="text"
                          name="cardName"
                          value={formData.cardName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm md:text-base"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {/* UPI Details */}
                  {formData.paymentMethod === 'upi' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">UPI ID *</label>
                      <input
                        type="text"
                        name="upiId"
                        value={formData.upiId}
                        onChange={handleInputChange}
                        placeholder="yourname@upi"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm md:text-base"
                        required
                      />
                    </div>
                  )}

                  {/* COD Message */}
                  {formData.paymentMethod === 'cod' && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm md:text-base text-yellow-800">
                        You will pay ₹{total.toLocaleString()} when your order is delivered.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Review Order */}
              {currentStep === 3 && (
                <div>
                  <h2 className="text-lg md:text-xl font-semibold mb-6">Review Your Order</h2>
                  
                  {/* Shipping Address */}
                  <div className="mb-6 p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-medium text-base md:text-lg mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Shipping Address
                    </h3>
                    <p className="text-sm md:text-base text-gray-700">
                      {formData.firstName} {formData.lastName}<br />
                      {formData.address}<br />
                      {formData.city}, {formData.state} {formData.pincode}<br />
                      {formData.country}
                    </p>
                  </div>

                  {/* Payment Method */}
                  <div className="mb-6 p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-medium text-base md:text-lg mb-2 flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      Payment Method
                    </h3>
                    <p className="text-sm md:text-base text-gray-700 capitalize">
                      {formData.paymentMethod === 'card' ? 'Credit/Debit Card' : 
                       formData.paymentMethod === 'upi' ? 'UPI' : 'Cash on Delivery'}
                    </p>
                  </div>

                  {/* Order Items */}
                  <div className="mb-6">
                    <h3 className="font-medium text-base md:text-lg mb-4">Order Items</h3>
                    <div className="space-y-4">
                      {orderItems.map((item) => (
                        <div key={item.id} className="flex gap-4 p-4 border border-gray-200 rounded-lg">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-sm md:text-base">{item.name}</h4>
                            <p className="text-xs md:text-sm text-gray-600">Size: {item.size}</p>
                            <p className="text-xs md:text-sm text-gray-600">Quantity: {item.quantity}</p>
                            <p className="font-medium text-sm md:text-base">₹{item.price.toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-6 md:mt-8">
                {currentStep > 1 && (
                  <button
                    onClick={handlePrevStep}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium text-sm md:text-base"
                  >
                    Previous
                  </button>
                )}
                
                {currentStep < 3 ? (
                  <button
                    onClick={handleNextStep}
                    className="flex-1 sm:flex-none px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition font-semibold text-sm md:text-base"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    onClick={handlePlaceOrder}
                    className="flex-1 sm:flex-none px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition font-semibold text-sm md:text-base"
                  >
                    Place Order
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-96">
            <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 sticky top-24">
              <h3 className="font-semibold text-lg md:text-xl mb-4">Order Summary</h3>
              
              <div className="space-y-4 mb-4">
                {orderItems.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm md:text-base line-clamp-2">{item.name}</h4>
                      <p className="text-xs md:text-sm text-gray-600">Qty: {item.quantity}</p>
                      <p className="font-medium text-sm md:text-base">₹{item.price.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2 mb-4">
                <div className="flex justify-between text-sm md:text-base">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between text-sm md:text-base">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                </div>
                
                <div className="flex justify-between text-sm md:text-base">
                  <span>Tax (GST)</span>
                  <span>₹{tax.toLocaleString()}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between font-semibold text-base md:text-lg">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
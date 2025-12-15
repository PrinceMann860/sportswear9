import React, { useState } from 'react';
import { Package, CheckCircle, Clock, Truck, RefreshCw, ChevronRight, ExternalLink, Filter, ShoppingBag, ArrowRight, MoreVertical, Star } from 'lucide-react';

const OrdersPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [showAllOrders, setShowAllOrders] = useState(false);

  // Static data
  const orders = [
    {
      id: 'ORD-784512',
      date: '2024-03-15',
      status: 'delivered',
      total: 2499.00,
      items: [
        {
          id: 1,
          name: 'Duramo 10 Running Shoes',
          image: 'https://assets.myntassets.com/dpr_1.5,q_30,w_400,c_limit,fl_progressive/assets/images/2025/FEBRUARY/3/L7GEjRDH_b510caa934e949b78484e8cfb577804d.jpg',
          quantity: 1,
          price: 2499,
          size: 'UK 9',
          color: 'Blue'
        },
        {
          id: 2,
          name: 'Sports Compression Socks',
          image: 'https://m.media-amazon.com/images/I/71XOB6hHheL._AC_SY675_.jpg',
          quantity: 2,
          price: 399,
          size: 'Free',
          color: 'Black'
        }
      ],
      shippingAddress: '123 Main St, Bangalore, Karnataka 560001',
      trackingNumber: 'TRK-7845123698'
    },
    {
      id: 'ORD-784513',
      date: '2024-03-12',
      status: 'shipped',
      total: 3899.00,
      items: [
        {
          id: 3,
          name: 'Training Hoodie',
          image: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/f8ac4e28-b7cc-4782-8492-0529ef6d5d81/dri-fit-adv-fitness-hoodie-6V61Gq.png',
          quantity: 1,
          price: 2899,
          size: 'M',
          color: 'Gray'
        },
        {
          id: 4,
          name: 'Training Shorts',
          image: 'https://assets.myntassets.com/dpr_1.5,q_30,w_400,c_limit,fl_progressive/assets/images/2025/FEBRUARY/3/L7GEjRDH_b510caa934e949b78484e8cfb577804d.jpg',
          quantity: 1,
          price: 999,
          size: 'M',
          color: 'Black'
        }
      ],
      shippingAddress: '456 Park Ave, Mumbai, Maharashtra 400001',
      trackingNumber: 'TRK-8974561230'
    },
    {
      id: 'ORD-784514',
      date: '2024-03-10',
      status: 'processing',
      total: 1499.00,
      items: [
        {
          id: 5,
          name: 'Sports Water Bottle',
          image: 'https://m.media-amazon.com/images/I/61A1d5Gg-3L.jpg',
          quantity: 1,
          price: 699,
          size: '750ml',
          color: 'Blue'
        },
        {
          id: 6,
          name: 'Gym Towel',
          image: 'https://m.media-amazon.com/images/I/71tEQjWFQkL.jpg',
          quantity: 2,
          price: 399,
          size: 'Medium',
          color: 'Gray'
        }
      ],
      shippingAddress: '789 MG Road, Delhi, Delhi 110001',
      trackingNumber: 'TRK-6547891230'
    },
    {
      id: 'ORD-784515',
      date: '2024-03-05',
      status: 'delivered',
      total: 12999.00,
      items: [
        {
          id: 7,
          name: 'Fitness Tracker',
          image: 'https://m.media-amazon.com/images/I/71XOB6hHheL._AC_SY675_.jpg',
          quantity: 1,
          price: 12999,
          size: 'Standard',
          color: 'Black'
        }
      ],
      shippingAddress: '321 Hill Road, Pune, Maharashtra 411001',
      trackingNumber: 'TRK-3216549870'
    }
  ];

  const displayOrders = showAllOrders ? orders : orders.slice(0, 4);

  const filters = [
    { id: 'all', label: 'All Orders', count: orders.length },
    { id: 'delivered', label: 'Delivered', count: orders.filter(order => order.status === 'delivered').length },
    { id: 'shipped', label: 'Shipped', count: orders.filter(order => order.status === 'shipped').length },
    { id: 'processing', label: 'Processing', count: orders.filter(order => order.status === 'processing').length },
    { id: 'pending', label: 'Pending', count: orders.filter(order => order.status === 'pending').length },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="text-green-600" size={20} />;
      case 'shipped': return <Truck className="text-blue-600" size={20} />;
      case 'processing': return <RefreshCw className="text-yellow-600" size={20} />;
      case 'pending': return <Clock className="text-orange-600" size={20} />;
      default: return <Clock className="text-gray-400" size={20} />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'delivered': return 'Delivered';
      case 'shipped': return 'Shipped';
      case 'processing': return 'Processing';
      case 'pending': return 'Pending';
      default: return 'Processing';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-50 text-green-700 border-green-200';
      case 'shipped': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'processing': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'pending': return 'bg-orange-50 text-orange-700 border-orange-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const filteredOrders = displayOrders.filter(order => {
    if (activeFilter === 'all') return true;
    return order.status === activeFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-600 rounded-lg">
                <ShoppingBag className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
                <p className="text-gray-600">Track, return, or buy things again</p>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              {orders.length} orders • Last 3 months
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            
            <button className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Buy Again
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex overflow-x-auto pb-2 mb-8 scrollbar-hide">
          <div className="flex space-x-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg whitespace-nowrap transition-all ${activeFilter === filter.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border'
                  }`}
              >
                <span className="font-medium">{filter.label}</span>
                <span className={`px-2 py-0.5 text-xs rounded-full ${activeFilter === filter.id
                    ? 'bg-blue-500'
                    : 'bg-gray-100 text-gray-600'
                  }`}>
                  {filter.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {/* Order Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-semibold text-gray-900">Order #{order.id}</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                          <span className="flex items-center gap-1.5">
                            {getStatusIcon(order.status)}
                            {getStatusText(order.status)}
                          </span>
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Placed on {formatDate(order.date)}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Total</p>
                        <p className="text-xl font-bold text-gray-900">{formatCurrency(order.total)}</p>
                      </div>
                      <button
                        onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <ChevronRight className={`transition-transform ${expandedOrder === order.id ? 'rotate-90' : ''}`} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="p-6">
                  <div className="flex -space-x-4">
                    {order.items.slice(0, 3).map((item, index) => (
                      <div key={item.id} className="relative">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 rounded-lg border-2 border-white object-cover"
                        />
                        {index === 2 && order.items.length > 3 && (
                          <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                              +{order.items.length - 3}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors">
                      View Order Details
                    </button>
                    <button className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-medium transition-colors">
                      Track Package
                    </button>
                    {order.status === 'delivered' && (
                      <button className="px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5">
                        <Star size={14} />
                        Rate & Review
                      </button>
                    )}
                    <button className="px-4 py-2 bg-white border hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors ml-auto">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedOrder === order.id && (
                  <div className="border-t border-gray-100 p-6 bg-gray-50">
                    <h3 className="font-semibold text-gray-900 mb-4">Order Details</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Items</h4>
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-3 p-3 bg-white rounded-lg mb-2">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 rounded object-cover"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{item.name}</p>
                              <p className="text-sm text-gray-600">
                                {item.quantity} × {formatCurrency(item.price)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-gray-900">{formatCurrency(item.price * item.quantity)}</p>
                              <p className="text-xs text-gray-500">{item.size} • {item.color}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div>
                        <div className="mb-6">
                          <h4 className="text-sm font-medium text-gray-900 mb-3">Shipping Address</h4>
                          <p className="text-gray-700 bg-white p-4 rounded-lg">{order.shippingAddress}</p>
                        </div>
                        
                        <div className="mb-6">
                          <h4 className="text-sm font-medium text-gray-900 mb-3">Tracking Information</h4>
                          <div className="flex items-center justify-between bg-white p-4 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-900">{order.trackingNumber}</p>
                              <p className="text-sm text-gray-600">Tracking ID</p>
                            </div>
                            <ExternalLink className="text-blue-600" size={18} />
                          </div>
                        </div>
                        
                        <div className="bg-white p-4 rounded-lg">
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="font-medium">{formatCurrency(order.total)}</span>
                          </div>
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-600">Shipping</span>
                            <span className="font-medium">FREE</span>
                          </div>
                          <div className="flex justify-between pt-3 border-t">
                            <span className="font-semibold">Total</span>
                            <span className="text-xl font-bold text-gray-900">{formatCurrency(order.total)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
              <ShoppingBag className="mx-auto text-gray-300 mb-4" size={64} />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">No orders found</h2>
              <p className="text-gray-600 mb-6">
                {activeFilter === 'all' 
                  ? "You haven't placed any orders yet"
                  : `You don't have any ${activeFilter} orders`
                }
              </p>
              <button
                onClick={() => window.location.href = '/products'}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2 mx-auto"
              >
                Start Shopping
                <ArrowRight size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Show More Button */}
        {orders.length > 4 && !showAllOrders && (
          <div className="text-center mt-8">
            <button
              onClick={() => setShowAllOrders(true)}
              className="px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              View All Orders ({orders.length})
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
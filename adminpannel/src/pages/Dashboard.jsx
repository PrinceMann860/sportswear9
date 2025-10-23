import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Package, DollarSign, ShoppingCart, TrendingUp } from 'lucide-react';
import { useGetDashboardStatsQuery, useGetRecentProductsQuery } from '../store/api/apiSlice';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { 
    data: stats, 
    isLoading: statsLoading, 
    error: statsError 
  } = useGetDashboardStatsQuery();
  
  const { 
    data: recentProducts, 
    isLoading: productsLoading, 
    error: productsError 
  } = useGetRecentProductsQuery();

  const statCards = stats ? [
    {
      title: 'Total Products',
      value: stats.total_products?.toLocaleString() || '0',
      icon: Package,
      color: 'bg-blue-500',
      change: stats.products_growth || '+0%',
    },
    {
      title: 'Revenue',
      value: `₹${stats.total_revenue?.toLocaleString() || '0'}`,
      icon: DollarSign,
      color: 'bg-green-500',
      change: stats.revenue_growth || '+0%',
    },
    {
      title: 'Orders',
      value: stats.total_orders?.toLocaleString() || '0',
      icon: ShoppingCart,
      color: 'bg-purple-500',
      change: stats.orders_growth || '+0%',
    },
    {
      title: 'Growth Rate',
      value: `${stats.growth_rate || 0}%`,
      icon: TrendingUp,
      color: 'bg-orange-500',
      change: stats.growth_change || '+0%',
    },
  ] : [];

  if (statsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (statsError) {
    return (
      <div className="text-center py-8 text-red-500">
        Failed to load dashboard data. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="card hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className={`text-sm ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change} from last month
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Products</h3>
          {productsLoading ? (
            <div className="flex justify-center py-4">
              <LoadingSpinner />
            </div>
          ) : productsError ? (
            <p className="text-red-500 text-sm">Failed to load recent products</p>
          ) : (
            <div className="space-y-3">
              {recentProducts?.slice(0, 4).map((product) => (
                <Link
                  key={product.product_uuid}
                  to={`/products/${product.product_uuid}`}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 rounded px-2 transition-colors duration-200"
                >
                  <div className="flex items-center">
                    {product.img ? (
                      <img
                        src={product.img}
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded-lg mr-3"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className="w-10 h-10 bg-gray-200 rounded-lg mr-3 flex items-center justify-center text-gray-400 text-xs" style={{ display: product.img ? 'none' : 'flex' }}>
                      No Img
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{product.name || product.title}</p>
                      <p className="text-sm text-gray-500">
                        {product.created_at ? new Date(product.created_at).toLocaleDateString() : 'Recently added'}
                      </p>
                    </div>
                  </div>
                  <span className={`text-sm font-medium ${
                    product.is_active !== false ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {product.is_active !== false ? 'Active' : 'Inactive'}
                  </span>
                </Link>
              ))}
              {(!recentProducts || recentProducts.length === 0) && (
                <p className="text-gray-500 text-sm text-center py-4">No recent products</p>
              )}
            </div>
          )}
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link 
              to="/products/new"
              className="block w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="font-medium text-gray-900">Add New Product</div>
              <div className="text-sm text-gray-500">Create a new product listing</div>
            </Link>
            <Link 
              to="/products"
              className="block w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="font-medium text-gray-900">Manage Inventory</div>
              <div className="text-sm text-gray-500">Update stock levels</div>
            </Link>
            <Link 
              to="/analytics"
              className="block w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="font-medium text-gray-900">View Analytics</div>
              <div className="text-sm text-gray-500">Check performance metrics</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
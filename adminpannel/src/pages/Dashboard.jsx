import { useState, useEffect } from 'react';
import { Package, DollarSign, ShoppingCart, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalRevenue: 0,
    totalOrders: 0,
    growthRate: 0,
  });

  useEffect(() => {
    // Simulate loading stats
    setStats({
      totalProducts: 1247,
      totalRevenue: 89432.50,
      totalOrders: 342,
      growthRate: 12.5,
    });
  }, []);

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts.toLocaleString(),
      icon: Package,
      color: 'bg-blue-500',
      change: '+12%',
    },
    {
      title: 'Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-green-500',
      change: '+8.2%',
    },
    {
      title: 'Orders',
      value: stats.totalOrders.toLocaleString(),
      icon: ShoppingCart,
      color: 'bg-purple-500',
      change: '+23%',
    },
    {
      title: 'Growth Rate',
      value: `${stats.growthRate}%`,
      icon: TrendingUp,
      color: 'bg-orange-500',
      change: '+2.1%',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-green-600">{stat.change} from last month</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Products</h3>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg mr-3"></div>
                  <div>
                    <p className="font-medium text-gray-900">Product Name {item}</p>
                    <p className="text-sm text-gray-500">Added 2 hours ago</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-green-600">Active</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200">
              <div className="font-medium text-gray-900">Add New Product</div>
              <div className="text-sm text-gray-500">Create a new product listing</div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200">
              <div className="font-medium text-gray-900">Manage Inventory</div>
              <div className="text-sm text-gray-500">Update stock levels</div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200">
              <div className="font-medium text-gray-900">View Analytics</div>
              <div className="text-sm text-gray-500">Check performance metrics</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Package, AlertTriangle, CheckCircle, XCircle, Edit, Trash2, Plus } from 'lucide-react';
import { inventoryService } from '../../services/inventoryService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useToast } from '../../hooks/useToast';

const InventoryList = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, available, low_stock, out_of_stock
  const { showSuccess, showError } = useToast();

  // Modal states
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [updateFormData, setUpdateFormData] = useState({
    stock: '',
    reserved_stock: '',
    low_stock_threshold: '',
    is_available: true,
  });

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const data = await inventoryService.getAllInventory();
      setInventory(data);
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
      showError('Failed to fetch inventory');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStock = async (e) => {
    e.preventDefault();
    try {
      await inventoryService.updateInventory(selectedItem.inventory_uuid, updateFormData);
      setShowUpdateModal(false);
      setSelectedItem(null);
      setUpdateFormData({ stock: '', reserved_stock: '', low_stock_threshold: '', is_available: true });
      fetchInventory();
      showSuccess('Inventory updated successfully');
    } catch (error) {
      console.error('Failed to update inventory:', error);
      showError('Failed to update inventory');
    }
  };

  const handleDeleteInventory = async (inventoryUuid, productName) => {
    if (window.confirm(`Are you sure you want to delete inventory for "${productName}"?`)) {
      try {
        await inventoryService.deleteInventory(inventoryUuid);
        fetchInventory();
        showSuccess('Inventory deleted successfully');
      } catch (error) {
        console.error('Failed to delete inventory:', error);
        showError('Failed to delete inventory');
      }
    }
  };

  const openUpdateModal = (item) => {
    setSelectedItem(item);
    setUpdateFormData({
      stock: item.stock.toString(),
      reserved_stock: item.reserved_stock.toString(),
      low_stock_threshold: item.low_stock_threshold.toString(),
      is_available: item.is_available,
    });
    setShowUpdateModal(true);
  };

  const getStockStatus = (item) => {
    if (!item.is_available) return 'unavailable';
    if (item.available_stock === 0) return 'out_of_stock';
    if (item.available_stock <= item.low_stock_threshold) return 'low_stock';
    return 'in_stock';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'in_stock': return 'text-green-600 bg-green-100';
      case 'low_stock': return 'text-yellow-600 bg-yellow-100';
      case 'out_of_stock': return 'text-red-600 bg-red-100';
      case 'unavailable': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'in_stock': return CheckCircle;
      case 'low_stock': return AlertTriangle;
      case 'out_of_stock': return XCircle;
      case 'unavailable': return XCircle;
      default: return Package;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'in_stock': return 'In Stock';
      case 'low_stock': return 'Low Stock';
      case 'out_of_stock': return 'Out of Stock';
      case 'unavailable': return 'Unavailable';
      default: return 'Unknown';
    }
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.variant_sku.toLowerCase().includes(searchTerm.toLowerCase());
    
    const status = getStockStatus(item);
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'available' && item.is_available) ||
                         (filterStatus === 'low_stock' && status === 'low_stock') ||
                         (filterStatus === 'out_of_stock' && status === 'out_of_stock');
    
    return matchesSearch && matchesFilter;
  });

  const getInventoryStats = () => {
    const total = inventory.length;
    const inStock = inventory.filter(item => getStockStatus(item) === 'in_stock').length;
    const lowStock = inventory.filter(item => getStockStatus(item) === 'low_stock').length;
    const outOfStock = inventory.filter(item => getStockStatus(item) === 'out_of_stock').length;
    const unavailable = inventory.filter(item => !item.is_available).length;
    
    return { total, inStock, lowStock, outOfStock, unavailable };
  };

  const stats = getInventoryStats();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600">Manage stock levels and availability</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-500">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-500">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Stock</p>
              <p className="text-2xl font-bold text-gray-900">{stats.inStock}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-yellow-500">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-gray-900">{stats.lowStock}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-red-500">
              <XCircle className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Out of Stock</p>
              <p className="text-2xl font-bold text-gray-900">{stats.outOfStock}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-gray-500">
              <XCircle className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Unavailable</p>
              <p className="text-2xl font-bold text-gray-900">{stats.unavailable}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by product name, SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 input-field"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field min-w-[150px]"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="low_stock">Low Stock</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="card">
        {loading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredInventory.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {searchTerm || filterStatus !== 'all' 
              ? 'No inventory items match your filters.' 
              : 'No inventory items found.'
            }
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Variant
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInventory.map((item) => {
                  const status = getStockStatus(item);
                  const StatusIcon = getStatusIcon(status);
                  
                  return (
                    <tr key={item.inventory_uuid} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {item.product_name}
                          </div>
                          <div className="text-xs text-gray-500">
                            SKU: {item.sku}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm text-gray-900">
                            {item.variant_sku}
                          </div>
                          <div className="text-xs text-gray-500">
                            {item.variant_attributes.map(attr => `${attr.attribute}: ${attr.value}`).join(', ')}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div>Available: <span className="font-medium">{item.available_stock}</span></div>
                          <div>Total: <span className="font-medium">{item.stock}</span></div>
                          <div>Reserved: <span className="font-medium">{item.reserved_stock}</span></div>
                          <div className="text-xs text-gray-500 mt-1">
                            Low threshold: {item.low_stock_threshold}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {getStatusText(status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(item.updated_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => openUpdateModal(item)}
                            className="text-blue-600 hover:text-blue-900 transition-colors duration-150"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteInventory(item.inventory_uuid, item.product_name)}
                            className="text-red-600 hover:text-red-900 transition-colors duration-150"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Update Stock Modal */}
      {showUpdateModal && selectedItem && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Update Inventory</h3>
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-900">{selectedItem.product_name}</p>
              <p className="text-xs text-gray-500">{selectedItem.variant_sku}</p>
            </div>
            <form onSubmit={handleUpdateStock} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={updateFormData.stock}
                    onChange={(e) => setUpdateFormData({ ...updateFormData, stock: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reserved Stock
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={updateFormData.reserved_stock}
                    onChange={(e) => setUpdateFormData({ ...updateFormData, reserved_stock: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Low Stock Threshold
                </label>
                <input
                  type="number"
                  min="0"
                  value={updateFormData.low_stock_threshold}
                  onChange={(e) => setUpdateFormData({ ...updateFormData, low_stock_threshold: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={updateFormData.is_available}
                    onChange={(e) => setUpdateFormData({ ...updateFormData, is_available: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Available for sale</span>
                </label>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowUpdateModal(false);
                    setSelectedItem(null);
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryList;
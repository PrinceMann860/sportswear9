import { useState, useEffect } from 'react';
import { Plus, CreditCard as Edit, Trash2 } from 'lucide-react';
import { brandService } from '../../services/brandService';

const BrandList = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const data = await brandService.getBrands();
      setBrands(data);
    } catch (error) {
      console.error('Failed to fetch brands:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBrand) {
        await brandService.updateBrand(editingBrand.brand_uuid, formData);
      } else {
        await brandService.createBrand(formData);
      }
      setShowForm(false);
      setEditingBrand(null);
      setFormData({ name: '', description: '' });
      fetchBrands();
    } catch (error) {
      console.error('Failed to save brand:', error);
    }
  };

  const handleEdit = (brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name,
      description: brand.description || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (uuid) => {
    if (window.confirm('Are you sure you want to delete this brand?')) {
      try {
        await brandService.deleteBrand(uuid);
        fetchBrands();
      } catch (error) {
        console.error('Failed to delete brand:', error);
      }
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingBrand(null);
    setFormData({ name: '', description: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Brands</h1>
          <p className="text-gray-600">Manage your product brands</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Brand
        </button>
      </div>

      {/* Brand Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingBrand ? 'Edit Brand' : 'Add New Brand'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  placeholder="Enter brand name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field"
                  placeholder="Enter brand description"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingBrand ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Brands Grid */}
      <div className="card">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : brands.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No brands found. Create your first brand to get started.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {brands.map((brand) => (
              <div key={brand.brand_uuid} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start mb-3">
                  {brand.logo && (
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="h-12 w-12 object-contain mr-3"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold text-gray-900">{brand.name}</h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(brand)}
                          className="text-yellow-600 hover:text-yellow-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(brand.brand_uuid)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${
                      brand.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {brand.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                {brand.description && (
                  <p className="text-gray-600 text-sm mb-3">{brand.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandList;
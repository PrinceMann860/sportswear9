import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowLeft, Save } from 'lucide-react';
import { 
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useGetBrandsQuery,
  useGetCategoriesQuery 
} from '../../store/api/apiSlice';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import NestedDropdown from '../../components/ui/NestedDropdown';
import { useToast } from '../../hooks/useToast';

const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const { showSuccess, showError } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    disc: '',
    brand: '',
    category: '',
    is_active: true,
    is_featured: false,
  });

  const [error, setError] = useState('');

  // API queries
  const { data: brands = [] } = useGetBrandsQuery();
  const { data: categories = [] } = useGetCategoriesQuery();
  
  const { 
    data: product, 
    isLoading: productLoading 
  } = useGetProductQuery(id, { skip: !isEdit });
  
  const [createProduct, { isLoading: createLoading }] = useCreateProductMutation();
  const [updateProduct, { isLoading: updateLoading }] = useUpdateProductMutation();

  const loading = createLoading || updateLoading;

  useEffect(() => {
    if (isEdit && product) {
      // Extract UUIDs from brand and category objects
      const brandUuid = typeof product.brand === 'object' ? product.brand.brand_uuid : product.brand;
      const categoryUuid = typeof product.category === 'object' ? product.category.category_uuid : product.category;

      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        disc: product.disc || '',
        brand: brandUuid || '',
        category: categoryUuid || '',
        is_active: product.is_active ?? true,
        is_featured: product.is_featured ?? false,
      });
    }
  }, [isEdit, product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Prepare data with string values for price and disc as expected by API
      const productData = {
        name: formData.name,
        description: formData.description,
        price: formData.price.toString(),
        disc: formData.disc.toString(),
        brand: formData.brand, // Send UUID directly
        category: formData.category, // Send UUID directly
        is_active: formData.is_active,
        is_featured: formData.is_featured,
      };

      if (isEdit) {
        await updateProduct({ id, ...productData }).unwrap();
        showSuccess('Product updated successfully');
      } else {
        await createProduct(productData).unwrap();
        showSuccess('Product created successfully');
      }

      navigate('/products');
    } catch (error) {
      console.error('API Error:', error);
      const errorMessage = error.data?.message || error.message || 'Failed to save product';
      setError(errorMessage);
      showError(errorMessage);
    }
  };

  if (isEdit && productLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <button
          onClick={() => navigate('/products')}
          className="mr-4 p-2 text-gray-400 hover:text-gray-600"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p className="text-gray-600">
            {isEdit ? 'Update product information' : 'Create a new product listing'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter product name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price *
              </label>
              <input
                type="number"
                name="price"
                required
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                className="input-field"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount (%)
              </label>
              <input
                type="number"
                name="disc"
                step="0.01"
                value={formData.disc}
                onChange={handleChange}
                className="input-field"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand *
              </label>
              <select
                name="brand"
                required
                value={formData.brand}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">Select a brand</option>
                {brands.map((brand) => (
                  <option key={brand.brand_uuid} value={brand.brand_uuid}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <NestedDropdown
                categories={categories}
                value={formData.category}
                onChange={(value) => setFormData({ ...formData, category: value })}
                placeholder="Select a category"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter product description"
            />
          </div>

          <div className="mt-6 flex space-x-6">
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    formData.is_active ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                      formData.is_active ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className={`ml-3 text-sm font-medium ${
                  formData.is_active ? 'text-green-700' : 'text-gray-500'
                }`}>
                  {formData.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, is_featured: !formData.is_featured })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    formData.is_featured ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                      formData.is_featured ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className={`ml-3 text-sm font-medium ${
                  formData.is_featured ? 'text-blue-700' : 'text-gray-500'
                }`}>
                  {formData.is_featured ? 'Featured' : 'Not Featured'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex items-center disabled:opacity-50"
          >
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
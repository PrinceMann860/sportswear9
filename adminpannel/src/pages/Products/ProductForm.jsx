import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { productService } from '../../services/productService';
import { brandService } from '../../services/brandService';
import { categoryService } from '../../services/categoryService';

const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

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

  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBrandsAndCategories();
    if (isEdit) {
      fetchProduct();
    }
  }, [id]);

  const fetchBrandsAndCategories = async () => {
    try {
      const [brandsData, categoriesData] = await Promise.all([
        brandService.getBrands(),
        categoryService.getCategories(),
      ]);
      setBrands(brandsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Failed to fetch brands and categories:', error);
    }
  };

  const fetchProduct = async () => {
    try {
      const product = await productService.getProduct(id);
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
    } catch (error) {
      console.error('Failed to fetch product:', error);
      setError('Failed to load product data');
    }
  };

  const renderCategoryOptions = (categories, level = 0) => {
    let options = [];
    categories.forEach((category) => {
      const prefix = '  '.repeat(level);
      options.push(
        <option key={category.category_uuid} value={category.category_uuid}>
          {prefix}{category.name}
        </option>
      );
      if (category.children && category.children.length > 0) {
        options = options.concat(renderCategoryOptions(category.children, level + 1));
      }
    });
    return options;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        disc: parseFloat(formData.disc) || 0,
      };

      if (isEdit) {
        await productService.updateProduct(id, productData);
      } else {
        await productService.createProduct(productData);
      }

      navigate('/products');
    } catch (error) {
      setError(error.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

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
              <select
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">Select a category</option>
                {renderCategoryOptions(categories)}
              </select>
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
            <label className="flex items-center">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">Active</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="is_featured"
                checked={formData.is_featured}
                onChange={handleChange}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">Featured</span>
            </label>
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
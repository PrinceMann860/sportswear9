import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, ListFilter as Filter, CreditCard as Edit, Trash2, Eye } from 'lucide-react';
import { productService } from '../../services/productService';
import { brandService } from '../../services/brandService';
import { categoryService } from '../../services/categoryService';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    brand: '',
    category: '',
  });

  useEffect(() => {
    fetchBrandsAndCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, filters]);

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

  const flattenCategories = (categories, flattened = []) => {
    categories.forEach((category) => {
      flattened.push(category);
      if (category.children && category.children.length > 0) {
        flattenCategories(category.children, flattened);
      }
    });
    return flattened;
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

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {
        ...(searchTerm && { search: searchTerm }),
        ...(filters.brand && { brand: filters.brand }),
        ...(filters.category && { category: filters.category }),
      };
      const data = await productService.getProducts(params);
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.deleteProduct(id);
        fetchProducts();
      } catch (error) {
        console.error('Failed to delete product:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">Manage your product catalog</p>
        </div>
        <Link to="/products/new" className="btn-primary flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 input-field"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filters.brand}
              onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
              className="input-field"
            >
              <option value="">All Brands</option>
              {brands.map((brand) => (
                <option key={brand.brand_uuid} value={brand.brand_uuid}>
                  {brand.name}
                </option>
              ))}
            </select>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="input-field"
            >
              <option value="">All Categories</option>
              {renderCategoryOptions(categories)}
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="card">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No products found. Create your first product to get started.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Brand
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {product.thumbnail ? (
                          <img
                            src={product.thumbnail}
                            alt={product.name}
                            className="h-10 w-10 object-cover rounded-lg mr-4"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="h-10 w-10 bg-gray-200 rounded-lg mr-4 flex items-center justify-center text-gray-400 text-xs">
                            No Img
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {product.product_uuid}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {typeof product.brand === 'object' ? product.brand.name : product.brand}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {typeof product.category === 'object' ? product.category.name : product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ${product.net?.toFixed(2)}
                      </div>
                      {product.disc > 0 && (
                        <div className="text-xs text-gray-500 line-through">
                          ${product.price?.toFixed(2)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        product.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          to={`/products/${product.id}`}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          to={`/products/${product.id}/edit`}
                          className="text-yellow-600 hover:text-yellow-900"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
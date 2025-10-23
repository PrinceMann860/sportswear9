import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, Search, CreditCard as Edit, Trash2 } from 'lucide-react';
import { 
  useGetProductsQuery, 
  useDeleteProductMutation,
  useGetBrandsQuery,
  useGetCategoriesQuery 
} from '../../store/api/apiSlice';
import { setFilters } from '../../store/slices/productsSlice';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import NestedDropdown from '../../components/ui/NestedDropdown';
import { useToast } from '../../hooks/useToast';

const ProductList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showSuccess, showError } = useToast();
  
  const filters = useSelector(state => state.products.filters);
  const [searchTerm, setSearchTerm] = useState('');
  const [localFilters, setLocalFilters] = useState({
    brand: '',
    category: '',
  });

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setFilters({ search: searchTerm }));
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, dispatch]);

  useEffect(() => {
    dispatch(setFilters(localFilters));
  }, [localFilters, dispatch]);

  // API queries
  const { 
    data: products = [], 
    isLoading: productsLoading, 
    error: productsError 
  } = useGetProductsQuery({
    search: filters.search,
    brand: filters.brand,
    category: filters.category,
  });

  const { data: brands = [] } = useGetBrandsQuery();
  const { data: categories = [] } = useGetCategoriesQuery();
  
  const [deleteProduct, { isLoading: deleteLoading }] = useDeleteProductMutation();

  const handleDelete = async (productUuid, productName) => {
    if (window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      try {
        await deleteProduct(productUuid).unwrap();
        showSuccess('Product deleted successfully');
      } catch (error) {
        showError('Failed to delete product');
        console.error('Failed to delete product:', error);
      }
    }
  };

  const handleRowClick = (productUuid, e) => {
    // Don't navigate if clicking on action buttons
    if (e.target.closest('.action-buttons')) {
      return;
    }
    navigate(`/products/${productUuid}`);
  };

  const formatPrice = (price) => {
    if (typeof price === 'string' && price.startsWith('₹')) {
      return price;
    }
    return `₹${parseFloat(price || 0).toFixed(2)}`;
  };

  if (productsError) {
    try {
      return (
        <div className="text-center py-8 text-red-500">
          Failed to load products. Please try again.
        </div>
      );
    } catch (error) {
      console.error('Products error:', error);
    }
  }

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
        <div className="flex flex-col lg:flex-row gap-4">
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
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={localFilters.brand}
              onChange={(e) => setLocalFilters({ ...localFilters, brand: e.target.value })}
              className="input-field min-w-[150px]"
            >
              <option value="">All Brands</option>
              {brands.map((brand) => (
                <option key={brand.brand_uuid} value={brand.brand_uuid}>
                  {brand.name}
                </option>
              ))}
            </select>
            <NestedDropdown
              categories={categories}
              value={localFilters.category}
              onChange={(value) => setLocalFilters({ ...localFilters, category: value })}
              placeholder="All Categories"
              className="min-w-[200px]"
            />
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="card">
        {productsLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="lg" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {filters.search || filters.brand || filters.category 
              ? 'No products match your filters.' 
              : 'No products found. Create your first product to get started.'
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
                    Brand
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr 
                    key={product.product_uuid} 
                    className="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                    onClick={(e) => handleRowClick(product.product_uuid, e)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {product.img ? (
                          <img
                            src={product.img}
                            alt={product.title}
                            className="h-12 w-12 object-cover rounded-lg mr-4 shadow-sm"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div 
                          className="h-12 w-12 bg-gray-200 rounded-lg mr-4 flex items-center justify-center text-gray-400 text-xs shadow-sm"
                          style={{ display: product.img ? 'none' : 'flex' }}
                        >
                            No Img
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {product.title || product.name}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            ID: {product.product_uuid.slice(-8)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {product.brand?.logo && (
                          <img
                            src={product.brand.logo}
                            alt={product.brand.name}
                            className="h-6 w-6 object-contain mr-2 rounded"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        )}
                        <span className="text-sm text-gray-900">
                          {product.brand?.name || product.brand}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.category?.name || product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatPrice(product.net || product.price)}
                      </div>
                      {product.discount && (
                        <div className="text-xs text-gray-500 line-through">
                          {formatPrice(product.original)}
                        </div>
                      )}
                      {product.discount && (
                        <div className="text-xs text-green-600 font-medium">
                          {product.discount}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          product.is_active !== false
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.is_active !== false ? 'Active' : 'Inactive'}
                        </span>
                        {product.is_featured && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium action-buttons">
                      <div className="flex space-x-3">
                        <Link
                          to={`/products/${product.product_uuid}/edit`}
                          className="text-blue-600 hover:text-blue-900 transition-colors duration-150"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(product.product_uuid, product.title || product.name);
                          }}
                          disabled={deleteLoading}
                          className="text-red-600 hover:text-red-900 transition-colors duration-150 disabled:opacity-50"
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
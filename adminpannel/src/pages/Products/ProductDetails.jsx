import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CreditCard as Edit, Trash2, Package, DollarSign, Calendar, Tag, Star, Plus, Image as ImageIcon } from 'lucide-react';
import { useGetProductQuery, useDeleteProductMutation } from '../../store/api/apiSlice';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import VariantManager from '../../components/Products/VariantManager';
import { useToast } from '../../hooks/useToast';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  
  const { 
    data: product, 
    isLoading, 
    error 
  } = useGetProductQuery(id);
  
  const [deleteProduct, { isLoading: deleteLoading }] = useDeleteProductMutation();

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${product?.name || product?.title}"?`)) {
      try {
        await deleteProduct(id).unwrap();
        showSuccess('Product deleted successfully');
        navigate('/products');
      } catch (error) {
        showError('Failed to delete product');
        console.error('Failed to delete product:', error);
      }
    }
  };

  const formatPrice = (price) => {
    if (typeof price === 'string' && price.startsWith('₹')) {
      return price;
    }
    return `₹${parseFloat(price || 0).toFixed(2)}`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-4">Failed to load product details</div>
        <button
          onClick={() => navigate('/products')}
          className="btn-secondary"
        >
          Back to Products
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 mb-4">Product not found</div>
        <button
          onClick={() => navigate('/products')}
          className="btn-secondary"
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/products')}
            className="mr-4 p-2 text-gray-400 hover:text-gray-600 transition-colors duration-150"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {product.title || product.name}
            </h1>
            <p className="text-gray-600">Product ID: {product.product_uuid}</p>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Link
            to={`/products/${id}/edit`}
            className="btn-secondary flex items-center"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleteLoading}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Image */}
        <div className="lg:col-span-1">
          <div className="card">
            {product.default_images && product.default_images.length > 0 ? (
              <img
                src={`http://127.0.0.1:8000${product.default_images[0].url}`}
                alt={product.title || product.name}
                className="w-full h-64 object-cover rounded-lg"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : product.img ? (
              <img
                src={product.img.startsWith('http') ? product.img : `http://127.0.0.1:8000${product.img}`}
                alt={product.title || product.name}
                className="w-full h-64 object-cover rounded-lg"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div 
              className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 flex-col"
              style={{ display: (product.default_images && product.default_images.length > 0) || product.img ? 'none' : 'flex' }}
            >
              <Package className="h-16 w-16" />
              <span className="mt-2 text-sm">No Image Available</span>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <p className="text-gray-900">{product.title || product.name}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <p className="text-lg font-semibold text-gray-900">
                    {product.price}
                  </p>
                  {product.discount && (
                    <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded">
                      {product.discount}
                    </span>
                  )}
                  {product.original && product.original !== product.price && (
                    <span className="text-sm text-gray-500 line-through">
                      {product.original}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
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
                  <p className="text-gray-900">{product.brand?.name}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <div className="flex items-center">
                  <Tag className="h-4 w-4 text-gray-400 mr-2" />
                  <p className="text-gray-900">{product.category?.name}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <p className="text-gray-900">{product.gender || 'Not specified'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <div className="flex flex-wrap gap-2">
                  {product.is_featured && (
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      Featured
                    </span>
                  )}
                  {product.is_new && (
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      New
                    </span>
                  )}
                  {product.is_popular && (
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                      Popular
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Created</label>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                  <p className="text-gray-900">
                    {product.created_at 
                      ? new Date(product.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : 'N/A'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>
          )}

          {/* Specifications */}
          {product.specifications && product.specifications.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.specifications.map((spec, index) => (
                  <div key={index} className="border-b border-gray-100 pb-2">
                    <dt className="text-sm font-medium text-gray-700">{spec.name}</dt>
                    <dd className="text-sm text-gray-900">{spec.value}</dd>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Variant Manager */}
      <VariantManager productUuid={id} product={product} />
    </div>
  );
};

export default ProductDetails;
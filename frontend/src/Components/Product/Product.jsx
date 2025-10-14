// /src/components/Product/Product.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { 
  fetchProducts, 
  selectAllProducts, 
  selectProductsLoading, 
  selectProductsError 
} from "./productslice";
import banner from "../../assets/productbanner.png";

// Your original ProductCard component (unchanged)
function ProductCard({ product }) {
  return (
    <Link to={'/ProductInfo'}>
      <div className="group relative bg-white overflow-hidden shadow-sm border-gray-100 hover:shadow-2xl transition-all duration-500 cursor-pointer hover:-translate-y-1 flex flex-col rounded-lg">

        {/* Fixed Image Container */}
        <div className="relative w-full h-64 flex items-center justify-center bg-gray-50">
          
          {/* Default Image */}
          <img
            src={product.img}
            alt={product.title}
            className="absolute inset-0 w-full h-full object-fill transition-opacity duration-500 group-hover:opacity-0"
          />

          {/* Hover Image */}
          {product.img2 && (
            <img
              src={product.img2}
              alt={`${product.title} Hover`}
              className="absolute inset-0 w-full h-full object-fill opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          )}

          {/* Wishlist Icon */}
          <button className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.015-4.5-4.5-4.5S12 5.765 12 8.25c0-2.485-2.015-4.5-4.5-4.5S3 5.765 3 8.25c0 7.125 9 11.25 9 11.25s9-4.125 9-11.25z" />
            </svg>
          </button>
        </div>

        {/* Text Section Fixed at Bottom */}
        <div className="p-4 text-start flex flex-col flex-grow">
          <h3 className="font-semibold text-gray-900 group-hover:text-black transition line-clamp-2">{product.title}</h3>
          <p className="text-sm text-gray-500 mt-1">{product.category}</p>

          {/* Price Section */}
          <div className="mt-auto">
            <p className="text-lg font-bold text-gray-900">{product.price}</p>
            <p className="text-sm text-gray-500">
              <span className="line-through mr-1">{product.original}</span>
              <span className="text-red-500 font-medium">{product.discount}</span>
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-0 h-1 bg-red-500 transition-all duration-500 group-hover:w-full"></div>
      </div>
    </Link>
  );
}


// Helper function to transform API data to match your ProductCard expectations
const transformProductData = (apiProduct) => {
  return {
    id: apiProduct.product_uuid,
    title: apiProduct.name,
    price: `$${apiProduct.price}`,
    original: apiProduct.disc > 0 ? `$${(parseFloat(apiProduct.price) + parseFloat(apiProduct.disc)).toFixed(2)}` : '',
    discount: apiProduct.disc > 0 ? `Save $${apiProduct.disc}` : '',
    category: apiProduct.category?.name || 'Uncategorized',
    // You'll need to provide an image - using a placeholder for now
    img: apiProduct.thumbnail || 'https://via.placeholder.com/300x300?text=No+Image'
  };
};

function Product() {
  const dispatch = useDispatch();
  const apiProducts = useSelector(selectAllProducts);
  const loading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);

  console.log('API Products:', apiProducts);
  console.log('Number of products:', apiProducts.length);

  // Transform API data to match your ProductCard component
  const products = apiProducts.map(transformProductData);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center mt-10">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg">Error: {error}</p>
          <button
            onClick={() => dispatch(fetchProducts())}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Debug Info - Remove this in production */}
      <div className="mb-4 p-4 bg-yellow-100 rounded-lg">
        <p className="text-sm text-yellow-800">
          Debug: Loaded {apiProducts.length} product(s) from API
        </p>
        {apiProducts.length > 0 && (
          <p className="text-sm text-yellow-800 mt-2">
            First product: {apiProducts[0].name} - ${apiProducts[0].price}
          </p>
        )}
      </div>

      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <span className="bg-black text-white px-3 py-1 text-xs rounded">
          FLAT 60% OFF
        </span>
        <span className="bg-yellow-400 text-black px-3 py-1 text-xs rounded font-medium">
          BEST SELLERS ⚡
        </span>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Show message if no products */}
      {products.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found</p>
          <button
            onClick={() => dispatch(fetchProducts())}
            className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Reload Products
          </button>
        </div>
      )}

      <div className="flex justify-between mt-10">
        <h2 className="font-bold text-xl lg:text-3xl underline underline-offset-4 decoration-4">
          TRENDING PRODUCTS
        </h2>
        <Link
          to={"#"}
          className="text-sm font-bold underline decoration-2 underline-offset-4"
        >
          Shop now
        </Link>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      <div className="max-w-7xl h-auto flex">
        <img src={banner} alt="" className="" />
      </div>
    </div>
  );
}

export default Product;
export { ProductCard };
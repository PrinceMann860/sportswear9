import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://127.0.0.1:8000',
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    headers.set('content-type', 'application/json');
    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['Product', 'Brand', 'Category', 'Dashboard', 'Homepage'],
  endpoints: (builder) => ({
    // Dashboard endpoints
    getDashboardStats: builder.query({
      query: () => '/api/products/',
      transformResponse: (response) => {
        // Transform products data into dashboard stats
        const products = Array.isArray(response) ? response : [];
        const totalProducts = products.length;
        const activeProducts = products.filter(p => p.is_active !== false).length;
        const featuredProducts = products.filter(p => p.is_featured).length;
        
        return {
          total_products: totalProducts,
          total_revenue: totalProducts * 1500, // Mock revenue calculation
          total_orders: Math.floor(totalProducts * 0.8), // Mock orders
          growth_rate: 12.5, // Mock growth rate
          products_growth: '+8%',
          revenue_growth: '+15%',
          orders_growth: '+12%',
          growth_change: '+2.5%'
        };
      },
      providesTags: ['Dashboard'],
    }),
    getRecentProducts: builder.query({
      query: () => '/api/products/',
      transformResponse: (response) => {
        // Return the most recent products (limit to 10)
        const products = Array.isArray(response) ? response : [];
        return products.slice(0, 10);
      },
      providesTags: ['Dashboard', 'Product'],
    }),

    // Products endpoints
    getProducts: builder.query({
      query: (params = {}) => ({
        url: '/api/products/',
        params,
      }),
      providesTags: ['Product'],
    }),
    getProduct: builder.query({
      query: (id) => `/api/products/${id}/`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),
    createProduct: builder.mutation({
      query: (productData) => ({
        url: '/api/products/admin/create/',
        method: 'POST',
        body: productData,
      }),
      invalidatesTags: ['Product', 'Dashboard'],
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...productData }) => ({
        url: `/api/products/admin/${id}/`,
        method: 'PATCH',
        body: productData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Product', id },
        'Product',
        'Dashboard',
      ],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/api/products/admin/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product', 'Dashboard'],
    }),

    // Categories endpoints
    getCategories: builder.query({
      query: () => '/api/categories/',
      providesTags: ['Category'],
    }),
    createCategory: builder.mutation({
      query: (categoryData) => ({
        url: '/api/categories/admin/create/',
        method: 'POST',
        body: categoryData,
      }),
      invalidatesTags: ['Category'],
    }),
    updateCategory: builder.mutation({
      query: ({ id, ...categoryData }) => ({
        url: `/api/categories/admin/${id}/update/`,
        method: 'PATCH',
        body: categoryData,
      }),
      invalidatesTags: ['Category'],
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/api/categories/admin/${id}/delete/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Category'],
    }),

    // Brands endpoints
    getBrands: builder.query({
      query: () => '/api/brands/',
      providesTags: ['Brand'],
    }),
    createBrand: builder.mutation({
      query: (brandData) => ({
        url: '/api/brands/admin/create/',
        method: 'POST',
        body: brandData,
      }),
      invalidatesTags: ['Brand'],
    }),
    updateBrand: builder.mutation({
      query: ({ id, ...brandData }) => ({
        url: `/api/brands/admin/${id}/update/`,
        method: 'PUT',
        body: brandData,
      }),
      invalidatesTags: ['Brand'],
    }),
    deleteBrand: builder.mutation({
      query: (id) => ({
        url: `/api/brands/admin/${id}/delete/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Brand'],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetRecentProductsQuery,
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetBrandsQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} = apiSlice;
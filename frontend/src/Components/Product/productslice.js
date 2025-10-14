// /src/store/slices/productSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for fetching products
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/products/');
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      console.log('Raw API data:', data);
      
      // If data is an array, return it directly
      if (Array.isArray(data)) {
        return data;
      }
      
      // If it's a single object, wrap it in an array
      if (typeof data === 'object' && data !== null) {
        return [data];
      }
      
      // Fallback to empty array
      return [];
      
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
  filters: {
    category: 'all',
    priceMax: 500,
    minRating: 0,
    selectedTags: [],
    searchQuery: '',
    sortBy: 'latest'
  }
};

const productSlice = createSlice({
  name: 'product', // This should match what's in your store configuration
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    setCategory: (state, action) => {
      state.filters.category = action.payload;
    },
    setPriceMax: (state, action) => {
      state.filters.priceMax = action.payload;
    },
    setMinRating: (state, action) => {
      state.filters.minRating = action.payload;
    },
    setSelectedTags: (state, action) => {
      state.filters.selectedTags = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.filters.searchQuery = action.payload;
    },
    setSortBy: (state, action) => {
      state.filters.sortBy = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        console.log('Products in state:', action.payload);
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { 
  setFilters, 
  clearFilters, 
  setCategory, 
  setPriceMax, 
  setMinRating, 
  setSelectedTags, 
  setSearchQuery, 
  setSortBy,
  clearError 
} = productSlice.actions;

// FIXED SELECTORS - using state.product instead of state.products
export const selectAllProducts = (state) => {
  console.log('Redux state:', state);
  console.log('Products in selector:', state?.product?.items);
  return state?.product?.items || [];
};
export const selectProductsLoading = (state) => state?.product?.loading || false;
export const selectProductsError = (state) => state?.product?.error || null;
export const selectProductsFilters = (state) => state?.product?.filters || initialState.filters;

export default productSlice.reducer;
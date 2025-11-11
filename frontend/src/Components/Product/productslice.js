import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api/products/";

// ✅ Fetch Products (with pagination support)
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (params = {}, { rejectWithValue }) => {
    try {
      // Supports query params like { page, category, search, gender, ... }
      const query = new URLSearchParams(params).toString();
      const response = await axios.get(`${BASE_URL}?${query}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch products"
      );
    }
  }
);

// ✅ Fetch Single Product
export const fetchProductDetail = createAsyncThunk(
  "products/fetchProductDetail",
  async (uuid, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}${uuid}/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch product detail"
      );
    }
  }
);

const initialState = {
  products: [],
  count: 0,
  next: null,
  previous: null,
  productDetail: null,
  loading: false,
  error: null,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearProducts: (state) => {
      state.products = [];
      state.count = 0;
      state.next = null;
      state.previous = null;
      state.error = null;
    },
    // ✅ Optional: append more products for infinite scroll
    appendProducts: (state, action) => {
      const newProducts = action.payload || [];
      if (Array.isArray(newProducts)) {
        state.products = [...state.products, ...newProducts];
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Fetch All Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;

        const data = action.payload;

        // ✅ Handle paginated or plain array responses safely
        if (data && Array.isArray(data.results)) {
          state.products = data.results;
          state.count = data.count || 0;
          state.next = data.next || null;
          state.previous = data.previous || null;
        } else if (Array.isArray(data)) {
          state.products = data;
          state.count = data.length;
          state.next = null;
          state.previous = null;
        } else if (typeof data === "object" && data !== null) {
          // Handle possible nested object responses
          const arr =
            Array.isArray(data.data) || Array.isArray(data.items)
              ? data.data || data.items
              : [];
          state.products = arr;
          state.count = arr.length;
          state.next = null;
          state.previous = null;
        } else {
          state.products = [];
          state.count = 0;
          state.next = null;
          state.previous = null;
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load products";
      })

      // ✅ Fetch Product Detail
      .addCase(fetchProductDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.productDetail = null;
      })
      .addCase(fetchProductDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.productDetail = action.payload;
      })
      .addCase(fetchProductDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load product detail";
      });
  },
});

export const { clearProducts, appendProducts } = productsSlice.actions;
export default productsSlice.reducer;

// ✅ Selectors
export const selectAllProducts = (state) => state.product.products;
export const selectProductsCount = (state) => state.product.count;
export const selectProductsLoading = (state) => state.product.loading;
export const selectProductDetail = (state) => state.product.productDetail;

// ✅ Add missing export for error selector
export const selectProductsError = (state) => state.product.error;


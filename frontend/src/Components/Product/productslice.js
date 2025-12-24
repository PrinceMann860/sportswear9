import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import BASE_URL from "../../store/Baseurl";

const URL = `${BASE_URL}/api/products/`;

// ----------------------------------------------------
// ✅ Fetch Products — Supports ALL Backend Filters
// ----------------------------------------------------
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (filters = {}, { rejectWithValue }) => {
    try {
      // Allowed filter keys (search excluded)
      const allowedFilters = [
        "category",
        "gender",
        "brand",
        "min_price",
        "max_price",
        "min_disc",
        "max_disc",
        "is_new",
        "is_featured",
        "is_popular",
        "is_in_cart",
        "ordering",
        "cursor",
        "page",
      ];

      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (
          value !== undefined &&
          value !== null &&
          value !== "" &&
          allowedFilters.includes(key)
        ) {
          params.append(key, value);
        }
      });

      const url = params.toString()
        ? `${URL}?${params.toString()}`
        : URL;

      console.log("📌 Fetching products:", url);

      const response = await axios.get(url);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch products");
    }
  }
);

// ----------------------------------------------------
// ✅ Fetch Single Product Detail
// ----------------------------------------------------
export const fetchProductDetail = createAsyncThunk(
  "products/fetchProductDetail",
  async (uuid, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}${uuid}/`);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to fetch product detail"
      );
    }
  }
);

// ----------------------------------------------------
// INITIAL STATE
// ----------------------------------------------------
const initialState = {
  products: [],
  count: 0,
  next: null,
  previous: null,
  productDetail: null,
  loading: false,
  error: null,
};

// ----------------------------------------------------
// SLICE
// ----------------------------------------------------
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
  },
  extraReducers: (builder) => {
    builder
      // ------------------------
      // FETCH PRODUCTS
      // ------------------------
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;

        const data = action.payload;

        // Django-style paginated response
        if (data && Array.isArray(data.results)) {
          state.products = data.results;
          state.count = data.count || 0;
          state.next = data.next || null;
          state.previous = data.previous || null;
          return;
        }

        // Non-paginated array
        if (Array.isArray(data)) {
          state.products = data;
          state.count = data.length;
          state.next = null;
          state.previous = null;
          return;
        }

        // Fallback empty
        state.products = [];
        state.count = 0;
        state.next = null;
        state.previous = null;
      })

      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load products";
      })

      // ------------------------
      // FETCH PRODUCT DETAIL
      // ------------------------
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

// ----------------------------------------------------
// EXPORTS
// ----------------------------------------------------
export const { clearProducts } = productsSlice.actions;

export default productsSlice.reducer;

// ----------------------------------------------------
// SELECTORS (Correct & Working)
// ----------------------------------------------------
export const selectAllProducts = (state) => state.product.products;
export const selectProductsLoading = (state) => state.product.loading;
export const selectProductsError = (state) => state.product.error;
export const selectProductsNext = (state) => state.product.next;
export const selectProductsPrevious = (state) => state.product.previous;
export const selectProductDetail = (state) => state.product.productDetail;

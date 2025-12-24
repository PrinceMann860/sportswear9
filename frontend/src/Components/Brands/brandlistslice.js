import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import BASE_URL from "../../store/Baseurl";

// ✅ Adjust API base URL as needed
const URL = `${BASE_URL}/api/brands/`;

// ✅ Thunk for fetching brands with pagination support
export const fetchBrands = createAsyncThunk(
  "brandlist/fetchBrands",
  async (page = 1, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${URL}?page=${page}`);
      // backend likely returns paginated data { count, next, previous, results: [] }
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch brand list"
      );
    }
  }
);

// ✅ Initial state
const initialState = {
  brands: [], // array of brands
  count: 0, // total brands
  next: null, // next page URL
  previous: null, // previous page URL
  loading: false,
  error: null,
};

// ✅ Slice
const brandlistSlice = createSlice({
  name: "brandlist",
  initialState,
  reducers: {
    clearBrands: (state) => {
      state.brands = [];
      state.count = 0;
      state.next = null;
      state.previous = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBrands.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload;

        // ✅ Handle paginated response safely
        if (data && Array.isArray(data.results)) {
          state.brands = data.results;
          state.count = data.count || 0;
          state.next = data.next || null;
          state.previous = data.previous || null;
        } else if (Array.isArray(data)) {
          // fallback in case API returns plain array
          state.brands = data;
        } else {
          state.brands = [];
        }
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load brands";
      });
  },
});

export const { clearBrands } = brandlistSlice.actions;

export default brandlistSlice.reducer;

// src/redux/slices/brandSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// API base URL
const BASE_URL = "http://127.0.0.1:8000/api/brands/";

// Async thunk to fetch brand list
export const fetchBrands = createAsyncThunk(
  "brands/fetchBrands",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(BASE_URL);
      return response.data; // Adjust if your response is nested like response.data.results
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch brands"
      );
    }
  }
);

const brandSlice = createSlice({
  name: "brands",
  initialState: {
    brands: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearBrands: (state) => {
      state.brands = [];
      state.error = null;
      state.loading = false;
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
        state.brands = action.payload;
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearBrands } = brandSlice.actions;
export default brandSlice.reducer;

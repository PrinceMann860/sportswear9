// src/redux/slices/orderSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// API endpoint
const PLACE_ORDER_URL = "http://127.0.0.1:8000/api/v1/orders/place_order/";

// -----------------------------
// Async Thunk
// -----------------------------
export const placeOrder = createAsyncThunk(
  "orders/placeOrder",
  async (address_id, { getState, rejectWithValue }) => {
    try {
      // Get access token from profile slice
      const token = getState().profile?.accessToken;

      if (!token) {
        return rejectWithValue("User is not authenticated");
      }

      const response = await axios.post(
        PLACE_ORDER_URL,
        { address_id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data; // { message, task_id }
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message || "Something went wrong"
      );
    }
  }
);

// -----------------------------
// Slice
// -----------------------------
const orderSlice = createSlice({
  name: "orders",
  initialState: {
    loading: false,
    success: false,
    error: null,
    taskId: null,
    message: null,
  },

  reducers: {
    resetOrderState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.taskId = null;
      state.message = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // ---- Pending ----
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
        state.taskId = null;
        state.message = null;
      })

      // ---- Fulfilled ----
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload?.message || null;
        state.taskId = action.payload?.task_id || null;
      })

      // ---- Rejected ----
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || "Order failed";
      });
  },
});

export const { resetOrderState } = orderSlice.actions;
export default orderSlice.reducer;

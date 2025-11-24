import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const PLACE_ORDER_URL = "http://127.0.0.1:8000/api/v1/orders/place_order/";

export const placeOrder = createAsyncThunk(
  "orders/placeOrder",
  async (address_id, { getState, rejectWithValue }) => {
    try {
      const token = getState().profile?.accessToken || localStorage.getItem("access_token");

      if (!token) {
        return rejectWithValue("User is not authenticated");
      }

      const response = await fetch(PLACE_ORDER_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address_id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(
        error.message || "Something went wrong"
      );
    }
  }
);

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
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
        state.taskId = null;
        state.message = null;
      })

      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload?.message || null;
        state.taskId = action.payload?.task_id || null;
      })

      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || "Order failed";
      });
  },
});

export const { resetOrderState } = orderSlice.actions;
export default orderSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// API URLs
const PLACE_ORDER_URL = "http://127.0.0.1:8000/api/v1/orders/place_order/";
const FETCH_ORDERS_URL = "http://127.0.0.1:8000/api/v1/orders/";
const CHECK_TASK_URL = "http://127.0.0.1:8000/api/v1/orders/check_task/";

// Helper function to get token
const getAuthToken = (getState) => {
  return getState().profile?.accessToken || localStorage.getItem("access_token");
};

// Place order thunk
export const placeOrder = createAsyncThunk(
  "orders/placeOrder",
  async (address_id, { getState, rejectWithValue }) => {
    try {
      const token = getAuthToken(getState);

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

// Fetch orders thunk
export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getAuthToken(getState);

      if (!token) {
        return rejectWithValue("User is not authenticated");
      }

      const response = await fetch(FETCH_ORDERS_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(
        error.message || "Failed to fetch orders"
      );
    }
  }
);

// Check task status thunk
export const checkTask = createAsyncThunk(
  "orders/checkTask",
  async (task_id, { getState, rejectWithValue }) => {
    try {
      const token = getAuthToken(getState);

      if (!token) {
        return rejectWithValue("User is not authenticated");
      }

      const response = await fetch(`${CHECK_TASK_URL}?task_id=${task_id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      const data = await response.json();
      return { task_id, ...data };
    } catch (error) {
      return rejectWithValue(
        error.message || "Failed to check task status"
      );
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    // Place order states
    loading: false,
    success: false,
    error: null,
    taskId: null,
    message: null,
    
    // Fetch orders states
    orders: [],
    ordersLoading: false,
    ordersError: null,
    
    // Check task states
    taskStatus: null,
    taskCheckLoading: false,
    taskCheckError: null,
  },

  reducers: {
    resetOrderState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.taskId = null;
      state.message = null;
    },
    resetOrdersState: (state) => {
      state.orders = [];
      state.ordersLoading = false;
      state.ordersError = null;
    },
    resetTaskState: (state) => {
      state.taskStatus = null;
      state.taskCheckLoading = false;
      state.taskCheckError = null;
    },
    resetAllOrderState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.taskId = null;
      state.message = null;
      state.orders = [];
      state.ordersLoading = false;
      state.ordersError = null;
      state.taskStatus = null;
      state.taskCheckLoading = false;
      state.taskCheckError = null;
    }
  },

  extraReducers: (builder) => {
    // Place Order
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

    // Fetch Orders
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.ordersLoading = true;
        state.ordersError = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.ordersLoading = false;
        state.orders = action.payload || [];
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.ordersLoading = false;
        state.ordersError = action.payload || "Failed to fetch orders";
      });

    // Check Task
    builder
      .addCase(checkTask.pending, (state) => {
        state.taskCheckLoading = true;
        state.taskCheckError = null;
      })
      .addCase(checkTask.fulfilled, (state, action) => {
        state.taskCheckLoading = false;
        state.taskStatus = action.payload;
      })
      .addCase(checkTask.rejected, (state, action) => {
        state.taskCheckLoading = false;
        state.taskCheckError = action.payload || "Failed to check task status";
      });
  },
});

export const { 
  resetOrderState, 
  resetOrdersState, 
  resetTaskState,
  resetAllOrderState 
} = orderSlice.actions;

export default orderSlice.reducer;
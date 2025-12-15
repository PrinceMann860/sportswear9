import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API_CONFIG from "../../services/apiConfig";

// Helper function to get token
const getAuthToken = () => {
  return localStorage.getItem("access_token");
};

// Create Razorpay order
export const createRazorpayOrder = createAsyncThunk(
  "payment/createRazorpayOrder",
  async (order_uuid, { rejectWithValue }) => {
    try {
      const token = getAuthToken();

      if (!token) {
        return rejectWithValue("User is not authenticated");
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}/api/v1/payments/create-razorpay-order/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ order_uuid }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.detail || errorData.message || "Failed to create Razorpay order");
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

// Verify payment after Razorpay checkout
export const verifyPayment = createAsyncThunk(
  "payment/verifyPayment",
  async (paymentData, { rejectWithValue }) => {
    try {
      const token = getAuthToken();

      if (!token) {
        return rejectWithValue("User is not authenticated");
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}/api/v1/payments/verify/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.detail || errorData.message || "Payment verification failed");
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message || "Payment verification failed");
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    // Razorpay order creation
    razorpayOrder: null,
    razorpayLoading: false,
    razorpayError: null,
    
    // Payment verification
    verificationResult: null,
    verificationLoading: false,
    verificationError: null,
    
    // Payment status
    paymentStatus: null, // 'pending' | 'processing' | 'success' | 'failed'
    paymentMethod: null,
  },

  reducers: {
    resetPaymentState: (state) => {
      state.razorpayOrder = null;
      state.razorpayLoading = false;
      state.razorpayError = null;
      state.verificationResult = null;
      state.verificationLoading = false;
      state.verificationError = null;
      state.paymentStatus = null;
      state.paymentMethod = null;
    },
    setPaymentStatus: (state, action) => {
      state.paymentStatus = action.payload;
    },
    setPaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
    },
  },

  extraReducers: (builder) => {
    // Create Razorpay Order
    builder
      .addCase(createRazorpayOrder.pending, (state) => {
        state.razorpayLoading = true;
        state.razorpayError = null;
        state.razorpayOrder = null;
      })
      .addCase(createRazorpayOrder.fulfilled, (state, action) => {
        state.razorpayLoading = false;
        state.razorpayOrder = action.payload;
      })
      .addCase(createRazorpayOrder.rejected, (state, action) => {
        state.razorpayLoading = false;
        state.razorpayError = action.payload || "Failed to create Razorpay order";
      });

    // Verify Payment
    builder
      .addCase(verifyPayment.pending, (state) => {
        state.verificationLoading = true;
        state.verificationError = null;
        state.paymentStatus = 'processing';
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.verificationLoading = false;
        state.verificationResult = action.payload;
        state.paymentStatus = 'success';
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.verificationLoading = false;
        state.verificationError = action.payload || "Payment verification failed";
        state.paymentStatus = 'failed';
      });
  },
});

export const { resetPaymentState, setPaymentStatus, setPaymentMethod } = paymentSlice.actions;
export default paymentSlice.reducer;

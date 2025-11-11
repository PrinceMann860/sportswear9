import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api/v1/cart/";

const getAuthHeader = () => {
  const token = localStorage.getItem("accessToken");
  return { headers: { Authorization: `Bearer ${token}` } };
};

// Fetch Cart Items
export const fetchCartItems = createAsyncThunk("cart/fetchCartItems", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(BASE_URL, getAuthHeader());
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || "Failed to fetch cart");
  }
});

// Add to Cart
export const addToCart = createAsyncThunk("cart/addToCart", async (cartData, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${BASE_URL}add/`, cartData, getAuthHeader());
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || "Failed to add item");
  }
});

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchCartItems.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // add
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default cartSlice.reducer;

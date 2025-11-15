import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api/v1/cart/";

// Function to get authorization header with token
const getAuthHeader = () => {
  const token = localStorage.getItem("access_token"); // Ensure correct token key
  if (!token) {
    throw new Error("No access token found");
  }
  return { headers: { Authorization: `Bearer ${token}` } };
};

// Fetch Cart Items
export const fetchCartItems = createAsyncThunk("cart/fetchCartItems", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(BASE_URL, getAuthHeader());
    console.log("Fetched Cart Items:", res.data); // Log the response data
    return res.data;
  } catch (err) {
    console.error("Error fetching cart items:", err); // Log the error
    return rejectWithValue(err.response?.data || "Failed to fetch cart");
  }
});

// Add to Cart
export const addToCart = createAsyncThunk("cart/addToCart", async (cartData, { rejectWithValue }) => {
  try {
    console.log("Adding item to cart with data:", cartData); // Log cartData
    const res = await axios.post(`${BASE_URL}add/`, cartData, getAuthHeader());
    console.log("Item added to cart:", res.data); // Log response data
    return res.data;
  } catch (err) {
    console.error("Error adding item to cart:", err); // Log the error
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
      // Fetch Cart Items
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
      // Add Item to Cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload); // Add the new item to the cart
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default cartSlice.reducer;

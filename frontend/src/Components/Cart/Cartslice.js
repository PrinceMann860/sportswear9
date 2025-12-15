import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api/v1/cart/";

// ⚠️ AUTH HEADERS — NEVER TOUCHED
const getAuthHeader = () => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No access token found");
  return { headers: { Authorization: `Bearer ${token}` } };
};

/* ---------------------------------------------------
   FETCH CART ITEMS
----------------------------------------------------- */
export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(BASE_URL, getAuthHeader());
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch cart");
    }
  }
);

/* ---------------------------------------------------
   ADD TO CART
----------------------------------------------------- */
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (cartData, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${BASE_URL}add/`,
        cartData,
        getAuthHeader()
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to add item");
    }
  }
);

/* ---------------------------------------------------
   UPDATE CART ITEM (PATCH)
----------------------------------------------------- */
export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async ({ id, quantity }, { rejectWithValue }) => {
    try {
      const res = await axios.patch(
        `http://127.0.0.1:8000/api/v1/cart-items/${id}/`,
        { quantity: quantity.toString() },
        getAuthHeader()
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to update cart");
    }
  }
);

/* ---------------------------------------------------
   DELETE CART ITEM
----------------------------------------------------- */
export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/v1/cart-items/${id}/`,
        getAuthHeader()
      );
      return id; // return id to remove locally
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to delete item");
    }
  }
);

/* ---------------------------------------------------
   SLICE
----------------------------------------------------- */
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    subtotal: 0,
    total_price: 0,
    total_items: 0,
    loading: false,
    error: null,
  },

  // reducers: {
  //   clearCart: (state) => {
  //     state.items = [];
  //     state.subtotal = 0;
  //     state.total_price = 0;
  //     state.total_items = 0;
  //   },
  // },

  extraReducers: (builder) => {
    builder
      /* ---------------- FETCH ---------------- */
      .addCase(fetchCartItems.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.subtotal = Number(action.payload.subtotal) || 0;
        state.total_price = Number(action.payload.total_price) || 0;
        state.total_items = action.payload.total_items || 0;
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ---------------- ADD ---------------- */
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload); // add item locally
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ---------------- UPDATE ---------------- */
      .addCase(updateCartItem.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.items.findIndex(
          (item) => item.cart_item_id === updated.cart_item_id
        );
        if (index !== -1) state.items[index] = updated;
      })

      /* ---------------- DELETE ---------------- */
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (item) => item.cart_item_id !== action.payload
        );
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;

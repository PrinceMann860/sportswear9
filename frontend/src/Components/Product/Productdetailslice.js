import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios"
import BASE_URL from "../../store/Baseurl";

// Thunk to fetch product details by UUID
export const fetchProductDetail = createAsyncThunk(
  "productDetail/fetchProductDetail",
  async (product_uuid, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/products/${product_uuid}/`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch product details"
      );
    }
  }
);

const Productdetailslice = createSlice({
  name: "productDetail",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearProductDetail: (state) => {
      state.data = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchProductDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProductDetail } = Productdetailslice.actions;
export default Productdetailslice.reducer;

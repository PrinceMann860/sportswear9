// reviewSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { fetchProductDetail } from "./productslice";
import BASE_URL from "../../store/Baseurl";

const URL = `${BASE_URL}/api/v1/reviews/`;

// Helper for token
const getToken = () => localStorage.getItem("access_token");

// ------------------------------------------------------
// 1. GET ALL REVIEWS
// ------------------------------------------------------
export const getAllReviews = createAsyncThunk(
  "reviews/getAllReviews",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(URL);
      // support paginated and non-paginated responses
      return response.data.results ? response.data.results : response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch reviews");
    }
  }
);

// ------------------------------------------------------
// 2. GET REVIEWS BY PRODUCT
// ------------------------------------------------------
export const getReviewsByProduct = createAsyncThunk(
  "reviews/getReviewsByProduct",
  async (product_id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${URL}?product_id=${product_id}`);
      // support paginated responses (DRF PageNumberPagination)
      return response.data.results ? response.data.results : response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch reviews");
    }
  }
);

// ------------------------------------------------------
// 3. GET SINGLE REVIEW
// ------------------------------------------------------
export const getReviewById = createAsyncThunk(
  "reviews/getReviewById",
  async (review_id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${URL}${review_id}/`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch review");
    }
  }
);

// ------------------------------------------------------
// 4. CREATE REVIEW (JSON / Multipart)
// ------------------------------------------------------
export const createReview = createAsyncThunk(
  "reviews/createReview",
  async ({ product_uuid, data, isMultipart = false }, { dispatch, rejectWithValue }) => {
    try {
      const token = getToken();

      let headers = { Authorization: `Bearer ${token}` };
      if (!isMultipart) headers["Content-Type"] = "application/json";

      const response = await axios.post(URL, data, { headers });

      // refresh product details
      dispatch(fetchProductDetail(product_uuid));

      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to create review");
    }
  }
);

// ------------------------------------------------------
// 5. UPDATE REVIEW (FULL PUT)
// ------------------------------------------------------
export const updateReview = createAsyncThunk(
  "reviews/updateReview",
  async ({ review_id, product_uuid, data }, { dispatch, rejectWithValue }) => {
    try {
      const token = getToken();

      const response = await axios.put(
        `${URL}${review_id}/`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      dispatch(fetchProductDetail(product_uuid));
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to update review");
    }
  }
);

// ------------------------------------------------------
// 6. PARTIAL UPDATE (PATCH)
// ------------------------------------------------------
export const partialUpdateReview = createAsyncThunk(
  "reviews/partialUpdateReview",
  async ({ review_id, product_uuid, data, isMultipart = false }, { dispatch, rejectWithValue }) => {
    try {
      const token = getToken();

      let headers = { Authorization: `Bearer ${token}` };
      if (!isMultipart) headers["Content-Type"] = "application/json";

      const response = await axios.patch(
        `${URL}${review_id}/`,
        data,
        { headers }
      );

      dispatch(fetchProductDetail(product_uuid));
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to edit review");
    }
  }
);

// ------------------------------------------------------
// 7. DELETE REVIEW
// ------------------------------------------------------
export const deleteReview = createAsyncThunk(
  "reviews/deleteReview",
  async ({ review_id, product_uuid }, { dispatch, rejectWithValue }) => {
    try {
      const token = getToken();

      await axios.delete(`${URL}${review_id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch(fetchProductDetail(product_uuid));

      return review_id;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to delete review");
    }
  }
);

// ------------------------------------------------------
// SLICE
// ------------------------------------------------------
const reviewSlice = createSlice({
  name: "reviews",
  initialState: {
    allReviews: [],
    productReviews: [],
    singleReview: null,

    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    clearReviewStatus: (state) => {
      state.loading = false;
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // GET ALL REVIEWS
      .addCase(getAllReviews.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.allReviews = action.payload;
      })
      .addCase(getAllReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET PRODUCT REVIEWS
      .addCase(getReviewsByProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(getReviewsByProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.productReviews = action.payload;
      })
      .addCase(getReviewsByProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET SINGLE REVIEW
      .addCase(getReviewById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getReviewById.fulfilled, (state, action) => {
        state.loading = false;
        state.singleReview = action.payload;
      })
      .addCase(getReviewById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE
      .addCase(createReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(createReview.fulfilled, (state) => {
        state.loading = false;
        state.success = "Review created successfully";
      })
      .addCase(createReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateReview.fulfilled, (state) => {
        state.loading = false;
        state.success = "Review updated successfully";
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // PATCH
      .addCase(partialUpdateReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(partialUpdateReview.fulfilled, (state) => {
        state.loading = false;
        state.success = "Review edited successfully";
      })
      .addCase(partialUpdateReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE
      .addCase(deleteReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteReview.fulfilled, (state) => {
        state.loading = false;
        state.success = "Review deleted successfully";
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearReviewStatus } = reviewSlice.actions;
export default reviewSlice.reducer;

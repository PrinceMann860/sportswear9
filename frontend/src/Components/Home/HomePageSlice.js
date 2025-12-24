import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import BASE_URL from "../../store/Baseurl";

// ✅ Adjust according to your backend route
const URL = `${BASE_URL}/api/main/levels`;

// ✅ Thunk for fetching homepage sections/levels
export const fetchHomepageLevels = createAsyncThunk(
  "homepage/fetchHomepageLevels",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(URL);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch homepage data"
      );
    }
  }
);

// ✅ Initial state
const initialState = {
  homepageLevels: [], // array of homepage levels (each may contain sections)
  loading: false,
  error: null,
};

// ✅ Slice
const homepageSlice = createSlice({
  name: "homepage",
  initialState,
  reducers: {
    clearHomepage: (state) => {
      state.homepageLevels = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomepageLevels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHomepageLevels.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload;

        // ✅ Ensure the structure is an array
        if (Array.isArray(data)) {
          state.homepageLevels = data;
        } else if (data?.results && Array.isArray(data.results)) {
          // handle paginated response
          state.homepageLevels = data.results;
        } else if (data) {
          // fallback: wrap object into array if needed
          state.homepageLevels = [data];
        } else {
          state.homepageLevels = [];
        }
      })
      .addCase(fetchHomepageLevels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load homepage data";
      });
  },
});

// ✅ Selectors
export const selectHomepageLevels = (state) => state.homepage.homepageLevels;
export const selectHomepageLoading = (state) => state.homepage.loading;
export const selectHomepageError = (state) => state.homepage.error;

export const { clearHomepage } = homepageSlice.actions;

export default homepageSlice.reducer;

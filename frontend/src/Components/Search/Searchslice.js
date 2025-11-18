// Searchslice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchSearchResults = createAsyncThunk(
  "search/fetchSearchResults",
  async (query, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/products/?search=${encodeURIComponent(query)}`
      );
      return res.data; // array
    } catch (err) {
      return rejectWithValue(err.response?.data || "Search failed");
    }
  }
);

const searchSlice = createSlice({
  name: "search",
  initialState: {
    query: "",
    results: [],
    loading: false,
    error: null,
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.query = action.payload;
    },
    clearSearch: (state) => {
      state.query = "";
      state.results = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSearchResults.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload; // array of products
      })
      .addCase(fetchSearchResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error fetching results";
      });
  },
});

export const { setSearchQuery, clearSearch } = searchSlice.actions;
export default searchSlice.reducer;

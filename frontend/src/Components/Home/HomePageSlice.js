// src/store/slices/homepage/homepageSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for fetching homepage levels
export const fetchHomepageLevels = createAsyncThunk(
  'homepage/fetchLevels',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/main/levels/');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const homepageSlice = createSlice({
  name: 'homepage',
  initialState: {
    levels: [],
    loading: false,
    error: null,
    lastFetched: null,
  },
  reducers: {
    clearHomepageError: (state) => {
      state.error = null;
    },
    resetHomepageState: (state) => {
      state.levels = [];
      state.loading = false;
      state.error = null;
      state.lastFetched = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch levels
      .addCase(fetchHomepageLevels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHomepageLevels.fulfilled, (state, action) => {
        state.loading = false;
        state.levels = action.payload;
        state.lastFetched = Date.now();
        state.error = null;
      })
      .addCase(fetchHomepageLevels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch homepage data';
        state.levels = [];
      });
  },
});

// Export actions
export const { clearHomepageError, resetHomepageState } = homepageSlice.actions;

// Export selectors
export const selectHomepageLevels = (state) => state.homepage.levels;
export const selectHomepageLoading = (state) => state.homepage.loading;
export const selectHomepageError = (state) => state.homepage.error;
export const selectHomepageLastFetched = (state) => state.homepage.lastFetched;

// Export specific level selectors
export const selectLevelByUuid = (uuid) => (state) => 
  state.homepage.levels.find(level => level.level_uuid === uuid);

export const selectSectionByUuid = (sectionUuid) => (state) => {
  for (const level of state.homepage.levels) {
    const section = level.sections.find(sec => sec.section_uuid === sectionUuid);
    if (section) return section;
  }
  return null;
};

export const selectItemsBySectionUuid = (sectionUuid) => (state) => {
  for (const level of state.homepage.levels) {
    const section = level.sections.find(sec => sec.section_uuid === sectionUuid);
    if (section) return section.items || [];
  }
  return [];
};

// Export reducer
export default homepageSlice.reducer;
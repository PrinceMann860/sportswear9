import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  stats: {
    totalProducts: 0,
    totalRevenue: 0,
    totalOrders: 0,
    growthRate: 0,
  },
  recentProducts: [],
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setStats: (state, action) => {
      state.stats = action.payload;
    },
    setRecentProducts: (state, action) => {
      state.recentProducts = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setStats, setRecentProducts, setLoading, setError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  brands: [],
  loading: false,
  error: null,
};

const brandsSlice = createSlice({
  name: 'brands',
  initialState,
  reducers: {
    setBrands: (state, action) => {
      state.brands = action.payload;
    },
    addBrand: (state, action) => {
      state.brands.push(action.payload);
    },
    updateBrand: (state, action) => {
      const index = state.brands.findIndex(b => b.brand_uuid === action.payload.brand_uuid);
      if (index !== -1) {
        state.brands[index] = action.payload;
      }
    },
    removeBrand: (state, action) => {
      state.brands = state.brands.filter(b => b.brand_uuid !== action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setBrands,
  addBrand,
  updateBrand,
  removeBrand,
  setLoading,
  setError,
} = brandsSlice.actions;

export default brandsSlice.reducer;
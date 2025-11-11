import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE_URL = "http://127.0.0.1:8000";

// ✅ Fetch profile info
export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`${API_BASE_URL}/profile/me/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch profile");
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Update profile info
export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`${API_BASE_URL}/profile/me/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });
      if (!response.ok) throw new Error("Failed to update profile");
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Fetch addresses (handles pagination)
export const fetchAddresses = createAsyncThunk(
  "profile/fetchAddresses",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`${API_BASE_URL}/profile/addresses/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch addresses");
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Add new address
export const addAddress = createAsyncThunk(
  "profile/addAddress",
  async (addressData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`${API_BASE_URL}/profile/addresses/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(addressData),
      });
      if (!response.ok) throw new Error("Failed to add address");
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Update existing address
export const updateAddress = createAsyncThunk(
  "profile/updateAddress",
  async ({ addressId, updatedData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        `${API_BASE_URL}/profile/addresses/${addressId}/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );
      if (!response.ok) throw new Error("Failed to update address");
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Delete address
export const deleteAddress = createAsyncThunk(
  "profile/deleteAddress",
  async (addressId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        `${API_BASE_URL}/profile/addresses/${addressId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to delete address");
      return addressId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Slice
const profileSlice = createSlice({
  name: "profile",
  initialState: {
    data: null,
    addresses: [],
    addressPagination: { count: 0, next: null, previous: null },
    loading: false,
    error: null,
    updateSuccess: false,
  },
  reducers: {
    clearProfileError: (state) => {
      state.error = null;
    },
    clearUpdateSuccess: (state) => {
      state.updateSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- Fetch Profile ---
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- Update Profile ---
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.updateSuccess = false;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.updateSuccess = true;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.updateSuccess = false;
      })

      // --- Fetch Addresses ---
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        const data = action.payload;
        if (data && Array.isArray(data.results)) {
          // Paginated data
          state.addresses = data.results;
          state.addressPagination = {
            count: data.count || 0,
            next: data.next,
            previous: data.previous,
          };
        } else if (Array.isArray(data)) {
          state.addresses = data;
          state.addressPagination = { count: data.length, next: null, previous: null };
        } else {
          state.addresses = [];
        }
      })

      // --- Add Address ---
      .addCase(addAddress.fulfilled, (state, action) => {
        if (Array.isArray(state.addresses)) {
          state.addresses.push(action.payload);
        } else {
          state.addresses = [action.payload];
        }
      })

      // --- Update Address ---
      .addCase(updateAddress.fulfilled, (state, action) => {
        const updated = action.payload;
        state.addresses = state.addresses.map((addr) =>
          addr.address_id === updated.address_id ? updated : addr
        );
      })

      // --- Delete Address ---
      .addCase(deleteAddress.fulfilled, (state, action) => {
        const id = action.payload;
        state.addresses = state.addresses.filter(
          (addr) => addr.address_id !== id
        );
      });
  },
});

export const { clearProfileError, clearUpdateSuccess } = profileSlice.actions;
export default profileSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;

// Async thunks
export const addAccount = createAsyncThunk(
  "accounts/addAccount",
  async (accountData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/account/add`, accountData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to add account" });
    }
  }
);

export const getAccounts = createAsyncThunk(
  "accounts/getAccounts",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/account/all`, { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to fetch accounts" });
    }
  }
);

export const getAccount = createAsyncThunk(
  "accounts/getAccount",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/account/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to fetch account" });
    }
  }
);

export const updateAccount = createAsyncThunk(
  "accounts/updateAccount",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/account/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to update account" });
    }
  }
);

export const deleteAccount = createAsyncThunk(
  "accounts/deleteAccount",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL}/account/${id}`);
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to delete account" });
    }
  }
);

export const updateAccountBalance = createAsyncThunk(
  "accounts/updateAccountBalance",
  async ({ id, balance, reason }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/account/${id}/balance`, { balance, reason });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to update balance" });
    }
  }
);

const accountSlice = createSlice({
  name: "accounts",
  initialState: {
    accounts: [],
    currentAccount: null,
    balanceSummary: {},
    totalAccounts: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentAccount: (state) => {
      state.currentAccount = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add account
      .addCase(addAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.accounts.unshift(action.payload.account);
        state.totalAccounts += 1;
      })
      .addCase(addAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get accounts
      .addCase(getAccounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAccounts.fulfilled, (state, action) => {
        state.loading = false;
        state.accounts = action.payload.data.accounts;
        state.balanceSummary = action.payload.data.balanceSummary;
        state.totalAccounts = action.payload.data.totalAccounts;
      })
      .addCase(getAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get single account
      .addCase(getAccount.fulfilled, (state, action) => {
        state.currentAccount = action.payload.data;
      })

      // Update account
      .addCase(updateAccount.fulfilled, (state, action) => {
        const index = state.accounts.findIndex(acc => acc._id === action.payload.account._id);
        if (index !== -1) {
          state.accounts[index] = action.payload.account;
        }
        if (state.currentAccount?.account._id === action.payload.account._id) {
          state.currentAccount.account = action.payload.account;
        }
      })

      // Delete account
      .addCase(deleteAccount.fulfilled, (state, action) => {
        state.accounts = state.accounts.filter(acc => acc._id !== action.payload.id);
        state.totalAccounts -= 1;
        if (state.currentAccount?.account._id === action.payload.id) {
          state.currentAccount = null;
        }
      })

      // Update balance
      .addCase(updateAccountBalance.fulfilled, (state, action) => {
        const index = state.accounts.findIndex(acc => acc._id === action.payload.data.account._id);
        if (index !== -1) {
          state.accounts[index] = action.payload.data.account;
        }
      });
  },
});

export default accountSlice.reducer;


// AUTO-GENERATED PLACEHOLDER: added because other files import 'clearError' from this module
// Please replace this placeholder with the proper implementation.
export function clearError(...args) {
  throw new Error("Placeholder export 'clearError' called from PERSONAL-FINANCE-TRACKER/frontend/src/redux/slices/accountSlice.js — implement this function properly in this file.");
}

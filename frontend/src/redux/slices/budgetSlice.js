import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const createBudget = createAsyncThunk(
  "budgets/createBudget",
  async (budgetData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/budget`, budgetData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to create budget" });
    }
  }
);

export const getBudgets = createAsyncThunk(
  "budgets/getBudgets",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/budget`, { 
        withCredentials: true,
        params
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to fetch budgets" });
    }
  }
);

export const getBudget = createAsyncThunk(
  "budgets/getBudget",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/budget/${id}`, { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to fetch budget" });
    }
  }
);

export const updateBudget = createAsyncThunk(
  "budgets/updateBudget",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/budget/${id}`, data, { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to update budget" });
    }
  }
);

export const deleteBudget = createAsyncThunk(
  "budgets/deleteBudget",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/budget/${id}`, { withCredentials: true });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to delete budget" });
    }
  }
);

export const getBudgetAnalytics = createAsyncThunk(
  "budgets/getBudgetAnalytics",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/budget/analytics`, { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to fetch analytics" });
    }
  }
);

const budgetSlice = createSlice({
  name: "budgets",
  initialState: {
    budgets: [],
    selectedBudget: null,
    analytics: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBudget.pending, (state) => {
        state.loading = true;
      })
      .addCase(createBudget.fulfilled, (state, action) => {
        state.loading = false;
        state.budgets.push(action.payload.budget);
      })
      .addCase(createBudget.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getBudgets.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBudgets.fulfilled, (state, action) => {
        state.loading = false;
        state.budgets = action.payload.data.budgets;
      })
      .addCase(getBudgets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getBudget.fulfilled, (state, action) => {
        state.selectedBudget = action.payload.data;
      })
      .addCase(updateBudget.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.budgets.findIndex((b) => b._id === action.payload.budget._id);
        if (index !== -1) {
          state.budgets[index] = action.payload.budget;
        }
      })
      .addCase(deleteBudget.fulfilled, (state, action) => {
        state.loading = false;
        state.budgets = state.budgets.filter((b) => b._id !== action.payload);
      })
      .addCase(getBudgetAnalytics.fulfilled, (state, action) => {
        state.analytics = action.payload.data;
      });
  },
});

export default budgetSlice.reducer;


// AUTO-GENERATED PLACEHOLDER: added because other files import 'clearError' from this module
// Please replace this placeholder with the proper implementation.
export function clearError(...args) {
  throw new Error("Placeholder export 'clearError' called from PERSONAL-FINANCE-TRACKER/frontend/src/redux/slices/budgetSlice.js — implement this function properly in this file.");
}

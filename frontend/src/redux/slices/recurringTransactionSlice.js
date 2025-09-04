import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const addRecurringTransaction = createAsyncThunk(
  "recurringTransactions/add",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/recurring-transaction/add`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to add recurring transaction" });
    }
  }
);

export const getRecurringTransactions = createAsyncThunk(
  "recurringTransactions/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/recurring-transaction/all`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to fetch recurring transactions" });
    }
  }
);

export const getRecurringTransaction = createAsyncThunk(
  "recurringTransactions/get",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/recurring-transaction/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to fetch recurring transaction" });
    }
  }
);

export const updateRecurringTransaction = createAsyncThunk(
  "recurringTransactions/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/recurring-transaction/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to update recurring transaction" });
    }
  }
);

export const deleteRecurringTransaction = createAsyncThunk(
  "recurringTransactions/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL}/recurring-transaction/${id}`);
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to delete recurring transaction" });
    }
  }
);

const recurringTransactionSlice = createSlice({
  name: "recurringTransactions",
  initialState: {
    transactions: [],
    currentTransaction: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentTransaction: (state) => {
      state.currentTransaction = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add
      .addCase(addRecurringTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addRecurringTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions.unshift(action.payload.recurringTransaction);
      })
      .addCase(addRecurringTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get all
      .addCase(getRecurringTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRecurringTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload.transactions;
      })
      .addCase(getRecurringTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get single
      .addCase(getRecurringTransaction.fulfilled, (state, action) => {
        state.currentTransaction = action.payload.transaction;
      })

      // Update
      .addCase(updateRecurringTransaction.fulfilled, (state, action) => {
        const index = state.transactions.findIndex(tx => tx._id === action.payload.transaction._id);
        if (index !== -1) {
          state.transactions[index] = action.payload.transaction;
        }
      })

      // Delete
      .addCase(deleteRecurringTransaction.fulfilled, (state, action) => {
        state.transactions = state.transactions.filter(tx => tx._id !== action.payload.id);
      });
  },
});

export const { clearError, clearCurrentTransaction } = recurringTransactionSlice.actions;
export default recurringTransactionSlice.reducer;

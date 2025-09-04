import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Configure axios to include cookies
axios.defaults.withCredentials = true;

// ✅ Add Transaction
export const addTransaction = createAsyncThunk(
  "transactions/addTransaction",
  async (transactionData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/transaction`, transactionData);
      return response.data.transaction;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to add transaction" }
      );
    }
  }
);

// ✅ Get All Transactions with Filters
export const getTransactions = createAsyncThunk(
  "transactions/getTransactions",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      
      // Add filters to query params
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });

      const response = await axios.get(
        `${API_URL}/transaction${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch transactions" }
      );
    }
  }
);

// ✅ Get Single Transaction
export const getTransaction = createAsyncThunk(
  "transactions/getTransaction",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/transaction/${id}`);
      return response.data.transaction;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch transaction" }
      );
    }
  }
);

// ✅ Update Transaction
export const updateTransaction = createAsyncThunk(
  "transactions/updateTransaction",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/transaction/${id}`, updatedData);
      return response.data.transaction;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to update transaction" }
      );
    }
  }
);

// ✅ Delete Transaction
export const deleteTransaction = createAsyncThunk(
  "transactions/deleteTransaction",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/transaction/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to delete transaction" }
      );
    }
  }
);

// ✅ Bulk Delete Transactions
export const bulkDeleteTransactions = createAsyncThunk(
  "transactions/bulkDeleteTransactions",
  async (transactionIds, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL}/transaction/bulk`, {
        data: { transactionIds }
      });
      return { transactionIds, deletedCount: response.data.deletedCount };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to delete transactions" }
      );
    }
  }
);

// ✅ Get Transaction Analytics
export const getTransactionAnalytics = createAsyncThunk(
  "transactions/getTransactionAnalytics",
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });

      const response = await axios.get(
        `${API_URL}/transaction/analytics${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch analytics" }
      );
    }
  }
);

// ✅ Get Recent Transactions
export const getRecentTransactions = createAsyncThunk(
  "transactions/getRecentTransactions",
  async (limit = 10, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/transaction/recent?limit=${limit}`);
      return response.data.transactions;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch recent transactions" }
      );
    }
  }
);

// ✅ Duplicate Transaction
export const duplicateTransaction = createAsyncThunk(
  "transactions/duplicateTransaction",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/transaction/${id}/duplicate`);
      return response.data.transaction;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to duplicate transaction" }
      );
    }
  }
);

const transactionSlice = createSlice({
  name: "transactions",
  initialState: {
    // Transaction data
    transactions: [],
    currentTransaction: null,
    recentTransactions: [],
    
    // Pagination
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalCount: 0,
      hasNextPage: false,
      hasPrevPage: false,
      limit: 50
    },
    
    // Analytics
    analytics: null,
    
    // Loading states
    loading: false,
    addLoading: false,
    updateLoading: false,
    deleteLoading: false,
    analyticsLoading: false,
    recentLoading: false,
    
    // Error states
    error: null,
    
    // Success states
    addSuccess: false,
    updateSuccess: false,
    deleteSuccess: false,
    
    // Filters (for UI state management)
    filters: {
      type: '',
      category: '',
      startDate: '',
      endDate: '',
      minAmount: '',
      maxAmount: '',
      paymentMethod: '',
      search: '',
      sortBy: 'date',
      sortOrder: 'desc'
    }
  },
  reducers: {
    // Clear states
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.addSuccess = false;
      state.updateSuccess = false;
      state.deleteSuccess = false;
    },
    clearCurrentTransaction: (state) => {
      state.currentTransaction = null;
    },
    
    // Filter management
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        type: '',
        category: '',
        startDate: '',
        endDate: '',
        minAmount: '',
        maxAmount: '',
        paymentMethod: '',
        search: '',
        sortBy: 'date',
        sortOrder: 'desc'
      };
    },
    
    // Local transaction updates
    updateTransactionLocally: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.transactions.findIndex(txn => txn._id === id);
      if (index !== -1) {
        state.transactions[index] = { ...state.transactions[index], ...updates };
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Add Transaction
      .addCase(addTransaction.pending, (state) => {
        state.addLoading = true;
        state.error = null;
        state.addSuccess = false;
      })
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.addLoading = false;
        state.addSuccess = true;
        state.transactions.unshift(action.payload);
        // Update pagination count
        state.pagination.totalCount += 1;
      })
      .addCase(addTransaction.rejected, (state, action) => {
        state.addLoading = false;
        state.error = action.payload;
        state.addSuccess = false;
      })

      // Get Transactions
      .addCase(getTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload.transactions || [];
        state.pagination = action.payload.pagination || state.pagination;
      })
      .addCase(getTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Single Transaction
      .addCase(getTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTransaction = action.payload;
      })
      .addCase(getTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Transaction
      .addCase(updateTransaction.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.updateSuccess = true;
        
        // Update in transactions array
        const index = state.transactions.findIndex(
          (txn) => txn._id === action.payload._id
        );
        if (index !== -1) {
          state.transactions[index] = action.payload;
        }
        
        // Update current transaction if it's the same
        if (state.currentTransaction?._id === action.payload._id) {
          state.currentTransaction = action.payload;
        }
      })
      .addCase(updateTransaction.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
        state.updateSuccess = false;
      })

      // Delete Transaction
      .addCase(deleteTransaction.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
        state.deleteSuccess = false;
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.deleteSuccess = true;
        state.transactions = state.transactions.filter(
          (txn) => txn._id !== action.payload
        );
        // Update pagination count
        state.pagination.totalCount = Math.max(0, state.pagination.totalCount - 1);
      })
      .addCase(deleteTransaction.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
        state.deleteSuccess = false;
      })

      // Bulk Delete Transactions
      .addCase(bulkDeleteTransactions.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(bulkDeleteTransactions.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.deleteSuccess = true;
        const { transactionIds } = action.payload;
        state.transactions = state.transactions.filter(
          (txn) => !transactionIds.includes(txn._id)
        );
        state.pagination.totalCount = Math.max(0, state.pagination.totalCount - transactionIds.length);
      })
      .addCase(bulkDeleteTransactions.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
      })

      // Get Analytics
      .addCase(getTransactionAnalytics.pending, (state) => {
        state.analyticsLoading = true;
        state.error = null;
      })
      .addCase(getTransactionAnalytics.fulfilled, (state, action) => {
        state.analyticsLoading = false;
        state.analytics = action.payload;
      })
      .addCase(getTransactionAnalytics.rejected, (state, action) => {
        state.analyticsLoading = false;
        state.error = action.payload;
      })

      // Get Recent Transactions
      .addCase(getRecentTransactions.pending, (state) => {
        state.recentLoading = true;
        state.error = null;
      })
      .addCase(getRecentTransactions.fulfilled, (state, action) => {
        state.recentLoading = false;
        state.recentTransactions = action.payload;
      })
      .addCase(getRecentTransactions.rejected, (state, action) => {
        state.recentLoading = false;
        state.error = action.payload;
      })

      // Duplicate Transaction
      .addCase(duplicateTransaction.pending, (state) => {
        state.addLoading = true;
        state.error = null;
      })
      .addCase(duplicateTransaction.fulfilled, (state, action) => {
        state.addLoading = false;
        state.addSuccess = true;
        state.transactions.unshift(action.payload);
        state.pagination.totalCount += 1;
      })
      .addCase(duplicateTransaction.rejected, (state, action) => {
        state.addLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  clearSuccess,
  clearCurrentTransaction,
  setFilters,
  clearFilters,
  updateTransactionLocally
} = transactionSlice.actions;

export default transactionSlice.reducer;
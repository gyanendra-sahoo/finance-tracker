import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const addFinancialGoal = createAsyncThunk(
  "financialGoals/addGoal",
  async (goalData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/financial-goal/add`, goalData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to add goal" });
    }
  }
);

export const getFinancialGoals = createAsyncThunk(
  "financialGoals/getGoals",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/financial-goal/all`, { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to fetch goals" });
    }
  }
);

export const getFinancialGoal = createAsyncThunk(
  "financialGoals/getGoal",
  async (goalId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/financial-goal/${goalId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to fetch goal" });
    }
  }
);

export const updateFinancialGoal = createAsyncThunk(
  "financialGoals/updateGoal",
  async ({ goalId, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/financial-goal/${goalId}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to update goal" });
    }
  }
);

export const addContribution = createAsyncThunk(
  "financialGoals/addContribution",
  async ({ goalId, amount, description }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/financial-goal/${goalId}/contribute`, {
        amount,
        description,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to add contribution" });
    }
  }
);

export const deleteFinancialGoal = createAsyncThunk(
  "financialGoals/deleteGoal",
  async (goalId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL}/financial-goal/${goalId}`);
      return { goalId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to delete goal" });
    }
  }
);

const financialGoalSlice = createSlice({
  name: "financialGoals",
  initialState: {
    goals: [],
    currentGoal: null,
    summary: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentGoal: (state) => {
      state.currentGoal = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add goal
      .addCase(addFinancialGoal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFinancialGoal.fulfilled, (state, action) => {
        state.loading = false;
        state.goals.push(action.payload.goal);
      })
      .addCase(addFinancialGoal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get goals
      .addCase(getFinancialGoals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFinancialGoals.fulfilled, (state, action) => {
        state.loading = false;
        state.goals = action.payload.data.goals;
        state.summary = action.payload.data.summary;
      })
      .addCase(getFinancialGoals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get single goal
      .addCase(getFinancialGoal.fulfilled, (state, action) => {
        state.currentGoal = action.payload.goal;
      })

      // Update goal
      .addCase(updateFinancialGoal.fulfilled, (state, action) => {
        const index = state.goals.findIndex(goal => goal._id === action.payload.goal._id);
        if (index !== -1) {
          state.goals[index] = action.payload.goal;
        }
      })

      // Add contribution
      .addCase(addContribution.fulfilled, (state, action) => {
        const index = state.goals.findIndex(goal => goal._id === action.payload.data.goal._id);
        if (index !== -1) {
          state.goals[index] = action.payload.data.goal;
        }
        if (state.currentGoal?._id === action.payload.data.goal._id) {
          state.currentGoal = action.payload.data.goal;
        }
      })

      // Delete goal
      .addCase(deleteFinancialGoal.fulfilled, (state, action) => {
        state.goals = state.goals.filter(goal => goal._id !== action.payload.goalId);
      });
  },
});

export const { clearError, clearCurrentGoal } = financialGoalSlice.actions;
export default financialGoalSlice.reducer;
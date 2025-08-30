import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

axios.defaults.withCredentials = true;

const getTokenFromStorage = () => localStorage.getItem("authToken");
const setTokenToStorage = (token) => localStorage.setItem("authToken", token);
const removeTokenFromStorage = () => localStorage.removeItem("authToken");

const getUserFromStorage = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};
const setUserToStorage = (user) =>
  localStorage.setItem("user", JSON.stringify(user));
const removeUserFromStorage = () => localStorage.removeItem("user");

const token = getTokenFromStorage();
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const token = getTokenFromStorage();
      if (!token) throw new Error("No token found");

      const response = await axios.get(`${API_URL}/user/profile`);
      return response.data;
    } catch (error) {
      removeTokenFromStorage();
      removeUserFromStorage();
      delete axios.defaults.headers.common["Authorization"];
      return rejectWithValue(
        error.response?.data || { message: "Authentication failed" }
      );
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/user/login`, userData);
      const { token, user } = response.data;

      if (token) {
        setTokenToStorage(token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
      if (user) setUserToStorage(user);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Login failed" }
      );
    }
  }
);

export const signup = createAsyncThunk(
  "auth/signup",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/user/register`, userData);
      const { token, user } = response.data;

      if (token) {
        setTokenToStorage(token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
      if (user) setUserToStorage(user);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Signup failed" }
      );
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await axios.post(`${API_URL}/user/logout`);
      removeTokenFromStorage();
      removeUserFromStorage();
      delete axios.defaults.headers.common["Authorization"];
      return {};
    } catch (error) {
      removeTokenFromStorage();
      removeUserFromStorage();
      delete axios.defaults.headers.common["Authorization"];
      return rejectWithValue(
        error.response?.data || { message: "Logout failed" }
      );
    }
  }
);

export const sendOtp = createAsyncThunk(
  "auth/sendOtp",
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/user/send-otp`, { email });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to send OTP" }
      );
    }
  }
);

export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/user/verify-otp`, {
        email,
        otp,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "OTP verification failed" }
      );
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ email, otp, newPassword, confirmPassword }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/user/reset-password`, {
        email,
        otp,
        newPassword,
        confirmPassword,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Password reset failed" }
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: getUserFromStorage(),
    loading: false,
    error: null,
    isAuthenticated: !!getTokenFromStorage(),
    otpSent: false,
    otpVerified: false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      removeTokenFromStorage();
      removeUserFromStorage();
      delete axios.defaults.headers.common["Authorization"];
    },
    setAuthFromStorage: (state) => {
      const user = getUserFromStorage();
      const token = getTokenFromStorage();
      if (user && token) {
        state.user = user;
        state.isAuthenticated = true;
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // checkAuth
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      })

      // login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // signup
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // logout
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload;
      })

      // sendOtp
      .addCase(sendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOtp.fulfilled, (state) => {
        state.loading = false;
        state.otpSent = true;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // verifyOtp
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state) => {
        state.loading = false;
        state.otpVerified = true;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // resetPassword
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.otpSent = false;
        state.otpVerified = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearUser, setAuthFromStorage } = authSlice.actions;
export default authSlice.reducer;

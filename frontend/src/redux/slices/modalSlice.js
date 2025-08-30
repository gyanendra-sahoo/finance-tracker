import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loginModal: false,
  signupModal: false,
  forgotPasswordModal: false,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    toggleLoginModal: (state) => {
      state.loginModal = !state.loginModal;
    },
    toggleSignupModal: (state) => {
      state.signupModal = !state.signupModal;
    },
    setLoginModal: (state, action) => {
      state.loginModal = action.payload;
    },
    setSignupModal: (state, action) => {
      state.signupModal = action.payload;
    },
    setForgotPasswordModal: (state, action) => {
      state.forgotPasswordModal = action.payload;
    },
    closeModals: (state) => {
      state.loginModal = false;
      state.signupModal = false;
      state.forgotPasswordModal = false;
    },
  },
});

export const {
  toggleLoginModal,
  toggleSignupModal,
  setLoginModal,
  setSignupModal,
  setForgotPasswordModal,
  closeModals,
} = modalSlice.actions;

export default modalSlice.reducer;

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "motion/react";
import {
  setLoginModal,
  setSignupModal,
  setForgotPasswordModal
} from "../../redux/slices/modalSlice.js";

const Login = () => {
  const dispatch = useDispatch();
  const loginModal = useSelector((state) => state.modal.loginModal);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    document.body.style.overflow = loginModal ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [loginModal]);

  const handleLogin = (e) => e.preventDefault();

  if (!loginModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-black text-white p-8 w-full max-w-md relative rounded-2xl"
      >
        <div
          onClick={() => dispatch(setLoginModal(false))}
          className="absolute top-2 right-2 px-2 py-1 bg-gray-700 hover:bg-red-500 text-white rounded cursor-pointer transition duration-200"
        >
          ✕
        </div>

        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-3 rounded-lg bg-[#111] text-white outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-3 rounded-lg bg-[#111] text-white outline-none"
          />
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-gray-300 text-sm">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 accent-blue-500"
            />
            Remember Me
          </label>
          <span
            onClick={() => {
              dispatch(setLoginModal(false));
              dispatch(setSignupModal(false));
              dispatch(setForgotPasswordModal(true));
            }}
            className="text-blue-500 cursor-pointer"
          >
            forgot password
          </span>
          </div>
          <button
            type="submit"
            className="bg-gradient-to-r from-green-500 to-emerald-600 transition-colors rounded-lg py-3 font-semibold cursor-pointer"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <span
            onClick={() => {
              dispatch(setLoginModal(false));
              dispatch(setSignupModal(true));
            }}
            className="text-blue-500 cursor-pointer hover:underline"
          >
            Sign Up
          </span>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;

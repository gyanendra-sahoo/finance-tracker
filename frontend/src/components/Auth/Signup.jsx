import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { setSignupModal, setLoginModal } from "../../redux/slices/modalSlice.js";

const Signup = () => {
  const dispatch = useDispatch();
  const signupModal = useSelector((state) => state.modal.signupModal);

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    document.body.style.overflow = signupModal ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [signupModal]);

  const handleSignup = (e) => e.preventDefault();

  if (!signupModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="bg-black text-white p-8 w-full max-w-md relative rounded-2xl"
      >
        <div
          onClick={() => dispatch(setSignupModal(false))}
          className="absolute top-2 right-2 px-2 py-1 bg-gray-700 hover:bg-red-500 text-white rounded cursor-pointer transition duration-200"
        >
          ✕
        </div>

        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Full Name"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            className="px-4 py-3 rounded-lg bg-[#111] text-white outline-none"
          />
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
          <button
            type="submit"
            className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg py-3 font-semibold cursor-pointer"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <span
            onClick={() => {
              dispatch(setSignupModal(false));
              dispatch(setLoginModal(true));
            }}
            className="text-blue-500 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { signup } from "../../redux/slices/authSlice.js";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.auth);

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user && !loading && !error) {
      navigate("/dashboard");
    }
  }, [user, loading, error, navigate]);

  const handleSignup = (e) => {
    e.preventDefault();
    dispatch(signup({ fullname, email, password }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-black text-white p-8 w-full max-w-md rounded-2xl border border-gray-700 shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

        {error && (
          <p className="text-red-500 text-sm mb-2">
            {error.message || error || "Something went wrong"}
          </p>
        )}

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Full Name"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            className="px-4 py-3 rounded-lg bg-[#111] text-white outline-none border border-gray-600 focus:border-green-400"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-3 rounded-lg bg-[#111] text-white outline-none border border-gray-600 focus:border-green-400"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-3 rounded-lg bg-[#111] text-white outline-none border border-gray-600 focus:border-green-400"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`${
              loading 
                ? "bg-gray-500 cursor-not-allowed" 
                : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            } transition-all rounded-lg py-3 font-semibold`}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;

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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-white relative overflow-hidden px-4 sm:px-6">
      {/* Outer */}
      <div className="hidden sm:block w-80 h-80 md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] rounded-full bg-gradient-to-br from-indigo-100/40 to-purple-100/40 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
      {/* Middle */}
      <div className="hidden sm:block w-64 h-64 md:w-[400px] md:h-[400px] lg:w-[480px] lg:h-[480px] rounded-full bg-gradient-to-br from-indigo-200/30 to-purple-200/30 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-ping"></div>
      {/* Inner */}
      <div className="hidden sm:block w-48 h-48 md:w-[300px] md:h-[300px] lg:w-[360px] lg:h-[360px] rounded-full bg-gradient-to-br from-indigo-300/20 to-purple-300/20 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>

      {/* Signup Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 bg-white text-black p-6 sm:p-8 w-full max-w-sm sm:max-w-md border border-gray-200 rounded-2xl shadow-xl"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Sign Up</h2>

        {error && (
          <p className="text-red-500 text-sm mb-2 text-center">
            {error.message || error || "Something went wrong"}
          </p>
        )}

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Full Name"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            className="px-4 py-3 bg-white text-black outline-none border border-gray-300 rounded-lg focus:border-indigo-400 shadow-sm text-sm sm:text-base"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-3 bg-white text-black outline-none border border-gray-300 rounded-lg focus:border-indigo-400 shadow-sm text-sm sm:text-base"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-3 bg-white text-black outline-none border border-gray-300 rounded-lg focus:border-indigo-400 shadow-sm text-sm sm:text-base"
            required
          />

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className={`${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#6265B8] hover:bg-[#4E52A8]"
            } transition-all rounded-lg py-3 font-semibold text-white shadow-md text-sm sm:text-base`}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </motion.button>
        </form>

        <p className="mt-4 text-center text-xs sm:text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </motion.div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-12 sm:h-20"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,
            70.36-5.37,136.33-33.31,206.8-37.5,
            73.84-4.36,147.54,16.88,218.2,35.26,
            69.27,18,138.3,24.88,209.4,13.08,
            36.15-6,69.85-17.84,104.45-29.34,
            67.64-22.72,191.15-62,278.1,4.76V0Z"
            opacity=".3"
            className="fill-indigo-200"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default Signup;

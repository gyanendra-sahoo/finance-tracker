import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { signup } from "../../redux/slices/authSlice.js";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    phone: "",
    dateOfBirth: "",
    occupation: "",
    monthlyIncome: "",
    currency: "INR",
    timezone: "Asia/Kolkata",
  });

  useEffect(() => {
    if (user && !loading && !error) {
      navigate("/dashboard");
    }
  }, [user, loading, error, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignup = (e) => {
    e.preventDefault();
    dispatch(signup(formData));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-white relative overflow-hidden px-4 sm:px-6">
      {/* Gradient Circles */}
      <div className="hidden sm:block w-80 h-80 md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] rounded-full bg-gradient-to-br from-indigo-100/40 to-purple-100/40 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
      <div className="hidden sm:block w-64 h-64 md:w-[400px] md:h-[400px] lg:w-[480px] lg:h-[480px] rounded-full bg-gradient-to-br from-indigo-200/30 to-purple-200/30 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-ping"></div>
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
            name="fullname"
            placeholder="Full Name"
            value={formData.fullname}
            onChange={handleChange}
            required
            className="px-4 py-3 border rounded-lg focus:border-indigo-400 shadow-sm text-sm sm:text-base"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="px-4 py-3 border rounded-lg focus:border-indigo-400 shadow-sm text-sm sm:text-base"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="px-4 py-3 border rounded-lg focus:border-indigo-400 shadow-sm text-sm sm:text-base"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            className="px-4 py-3 border rounded-lg focus:border-indigo-400 shadow-sm text-sm sm:text-base"
          />
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="px-4 py-3 border rounded-lg focus:border-indigo-400 shadow-sm text-sm sm:text-base"
          />
          <input
            type="text"
            name="occupation"
            placeholder="Occupation"
            value={formData.occupation}
            onChange={handleChange}
            className="px-4 py-3 border rounded-lg focus:border-indigo-400 shadow-sm text-sm sm:text-base"
          />
          <input
            type="number"
            name="monthlyIncome"
            placeholder="Monthly Income"
            value={formData.monthlyIncome}
            onChange={handleChange}
            className="px-4 py-3 border rounded-lg focus:border-indigo-400 shadow-sm text-sm sm:text-base"
          />
          <select
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            className="px-4 py-3 border rounded-lg focus:border-indigo-400 shadow-sm text-sm sm:text-base"
          >
            <option value="INR">INR</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
          <select
            name="timezone"
            value={formData.timezone}
            onChange={handleChange}
            className="px-4 py-3 border rounded-lg focus:border-indigo-400 shadow-sm text-sm sm:text-base"
          >
            <option value="Asia/Kolkata">Asia/Kolkata</option>
            <option value="UTC">UTC</option>
            <option value="America/New_York">America/New_York</option>
          </select>

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
    </div>
  );
};

export default Signup;

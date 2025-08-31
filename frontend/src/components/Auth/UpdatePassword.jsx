import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  sendOtp,
  verifyOtp,
  resetPassword,
} from "../../redux/slices/authSlice.js";
import { motion } from "framer-motion";

const UpdatePassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, success, otpSent, otpVerified } = useSelector(
    (state) => state.auth
  );

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [timeLeft, setTimeLeft] = useState(120);

  useEffect(() => {
    if (otpSent && !otpVerified && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [otpSent, otpVerified, timeLeft]);

  const handleSendOtp = () => {
    if (!email) return alert("Enter your email");
    dispatch(sendOtp(email));
  };

  const handleVerifyOtp = () => {
    if (!otp) return alert("Enter OTP");
    dispatch(verifyOtp({ email, otp }));
  };

  const handleUpdatePassword = () => {
    if (newPassword !== confirmPassword) {
      return alert("Passwords do not match");
    }
    dispatch(resetPassword({ email, otp, newPassword, confirmPassword }));
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Outer Glow */}
      <div className="w-80 h-80 sm:w-96 sm:h-96 md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] rounded-full bg-gradient-to-br from-indigo-100/40 to-purple-100/40 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
      {/* Middle Glow */}
      <div className="w-64 h-64 sm:w-80 sm:h-80 md:w-[400px] md:h-[400px] lg:w-[480px] lg:h-[480px] rounded-full bg-gradient-to-br from-indigo-200/30 to-purple-200/30 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-ping"></div>
      {/* Inner Glow */}
      <div className="w-48 h-48 sm:w-64 sm:h-64 md:w-[300px] md:h-[300px] lg:w-[360px] lg:h-[360px] rounded-full bg-gradient-to-br from-indigo-300/20 to-purple-300/20 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 bg-white text-black p-8 w-full max-w-md border border-gray-200 rounded-2xl shadow-xl"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Update Password</h2>
        {/* Feedback */}
        {error && (
          <p className="text-red-500 text-sm mb-2 text-center">{error}</p>
        )}
        {success && (
          <p className="text-green-500 text-sm mb-2 text-center">{success}</p>
        )}

        {/* STEP 1: SEND OTP */}
        {!otpSent && (
          <div className="flex flex-col gap-4">
            <p className="text-gray-500 mb-2">
              <span className="text-red-500">*</span> Please enter the email
              address associated with your account
            </p>
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-3 bg-white text-black outline-none border border-gray-300 rounded-lg focus:border-indigo-400 shadow-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSendOtp}
              disabled={loading}
              className={`${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#6265B8] hover:bg-[#4E52A8]"
              } transition-all rounded-lg py-3 font-semibold text-white shadow-md`}
            >
              {loading ? "Sending..." : "Send OTP"}
            </motion.button>
          </div>
        )}

        {/* STEP 2: VERIFY OTP */}
        {otpSent && !otpVerified && (
          <div className="flex flex-col gap-4">
            {/* Timer Message */}
            {timeLeft > 0 ? (
              <p className="text-gray-500 text-sm">
                Please enter the OTP within{" "}
                <span className="text-red-500 font-semibold">
                  {Math.floor(timeLeft / 60)}:
                  {("0" + (timeLeft % 60)).slice(-2)}
                </span>{" "}
                minutes
              </p>
            ) : (
              <p className="text-red-500 text-sm font-semibold">
                OTP expired. Please request a new one.
              </p>
            )}

            <input
              type="text"
              placeholder="Enter OTP"
              className="px-4 py-3 bg-white text-black outline-none border border-gray-300 rounded-lg focus:border-indigo-400 shadow-sm"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleVerifyOtp}
              disabled={loading || timeLeft <= 0}
              className={`${
                loading || timeLeft <= 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              } transition-all rounded-lg py-3 font-semibold text-white shadow-md`}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </motion.button>
          </div>
        )}

        {/* STEP 3: RESET PASSWORD */}
        {otpVerified && (
          <div className="flex flex-col gap-4">
            <input
              type="password"
              placeholder="New Password"
              className="px-4 py-3 bg-white text-black outline-none border border-gray-300 rounded-lg focus:border-indigo-400 shadow-sm"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="px-4 py-3 bg-white text-black outline-none border border-gray-300 rounded-lg focus:border-indigo-400 shadow-sm"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleUpdatePassword}
              disabled={loading}
              className={`${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700"
              } transition-all rounded-lg py-3 font-semibold text-white shadow-md`}
            >
              {loading ? "Updating..." : "Update Password"}
            </motion.button>
          </div>
        )}
      </motion.div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-20"
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

export default UpdatePassword;

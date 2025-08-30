import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { sendOtp, verifyOtp, resetPassword } from "../../redux/slices/authSlice.js";

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
    navigate('/login');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-6 w-96">
        <h2 className="text-xl font-bold mb-4 text-center">Update Password</h2>

        {/* STEP 1: SEND OTP */}
        {!otpSent && (
          <div>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-2 mb-3 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full bg-blue-600 text-white p-2 rounded"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </div>
        )}

        {/* STEP 2: VERIFY OTP */}
        {otpSent && !otpVerified && (
          <div>
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full p-2 mb-3 border rounded"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full bg-green-600 text-white p-2 rounded"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        )}

        {/* STEP 3: SET NEW PASSWORD */}
        {otpVerified && (
          <div>
            <input
              type="password"
              placeholder="New Password"
              className="w-full p-2 mb-3 border rounded"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full p-2 mb-3 border rounded"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              onClick={handleUpdatePassword}
              disabled={loading}
              className="w-full bg-purple-600 text-white p-2 rounded"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>
        )}

        {/* FEEDBACK */}
        {error && <p className="text-red-600 mt-3">{error}</p>}
        {success && <p className="text-green-600 mt-3">{success}</p>}
      </div>
    </div>
  );
};

export default UpdatePassword;

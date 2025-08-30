import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  setForgotPasswordModal,
  setLoginModal,
} from "../../redux/slices/modalSlice.js";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const forgotPasswordModal = useSelector(
    (state) => state.modal.forgotPasswordModal
  );

  const [step, setStep] = useState(1); // Step 1: Email, Step 2: OTP, Step 3: Reset Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Disable background scroll
  useEffect(() => {
    document.body.style.overflow = forgotPasswordModal ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [forgotPasswordModal]);

  const handleSendCode = async (e) => {
    e.preventDefault();
    // setError("");
    // setSuccess("");

    // if (!email) {
    //   setError("Please enter your email");
    //   return;
    // }

    // try {
    //   // Call your API to send code
    //   const res = await fetch(
    //     "http://localhost:5000/api/v1/user/forgot-password/send-code",
    //     {
    //       method: "POST",
    //       headers: { "Content-Type": "application/json" },
    //       body: JSON.stringify({ email }),
    //     }
    //   );
    //   const data = await res.json();

    //   if (!data.success) {
    //     setError(data.message);
    //   } else {
    //     setStep(2); // Move to OTP step
    //     setSuccess("Code sent to your email");
    //   }
    // } catch (err) {
    //   setError("Something went wrong. Try again.");
    // }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
//     setError("");
//     setSuccess("");

//     if (!otp) {
//       setError("Please enter the code");
//       return;
//     }

//     try {
//       const res = await fetch(
//         "http://localhost:5000/api/v1/user/forgot-password/verify-code",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ email, code: otp }),
//         }
//       );
//       const data = await res.json();

//       if (!data.success) {
//         setError(data.message);
//       } else {
//         setStep(3); // Move to Reset Password step
//       }
//     } catch (err) {
//       setError("Something went wrong. Try again.");
//     }
//   };

//   const handleResetPassword = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     if (!newPassword || !confirmPassword) {
//       setError("Please fill in all fields");
//       return;
//     }

//     if (newPassword !== confirmPassword) {
//       setError("Passwords do not match");
//       return;
//     }

//     try {
//       const res = await fetch(
//         "http://localhost:5000/api/v1/user/forgot-password/reset-password",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ email, password: newPassword }),
//         }
//       );
//       const data = await res.json();

//       if (!data.success) {
//         setError(data.message);
//       } else {
//         setSuccess("Password reset successfully!");
//         setTimeout(() => {
//           dispatch(setForgotPasswordModal(false));
//           dispatch(setLoginModal(true));
//         }, 2000);
//       }
//     } catch (err) {
//       setError("Something went wrong. Try again.");
//     }
  };

  if (!forgotPasswordModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="bg-black text-white p-8 w-full max-w-md relative rounded-2xl"
      >
        <div
          onClick={() => dispatch(setForgotPasswordModal(false))}
          className="absolute top-2 right-2 px-2 py-1 bg-gray-700 hover:bg-red-500 text-white rounded cursor-pointer transition duration-200"
        >
          ✕
        </div>

        <h2 className="text-2xl font-bold mb-6 text-center">
          Forgot Password
        </h2>

        {error && <p className="text-red-500 mb-2">{error}</p>}
        {success && <p className="text-green-500 mb-2">{success}</p>}

        {step === 1 && (
          <form onSubmit={handleSendCode} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-3 rounded-lg bg-[#111] text-white outline-none"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg py-3 font-semibold cursor-pointer"
            >
              Send Code
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Enter 6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="px-4 py-3 rounded-lg bg-[#111] text-white outline-none"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg py-3 font-semibold cursor-pointer"
            >
              Verify Code
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="px-4 py-3 rounded-lg bg-[#111] text-white outline-none"
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="px-4 py-3 rounded-lg bg-[#111] text-white outline-none"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg py-3 font-semibold cursor-pointer"
            >
              Reset Password
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;

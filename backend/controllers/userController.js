import { User } from "../models/userSchema.js";
import { clearCookie } from "../utils/clearCookie.js";
import { setCookie } from "../utils/cookieOptions.js";
import { generateToken } from "../utils/generateToken.js";
import { sendEmail } from "../utils/sendEmail.js";

const registerUser = async (req, res, next) => {
  // Getting the data from the body or frontend
  let { fullname, email, password } = req.body;
  // Validating the fields are not empty
  if (!fullname || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide all the fields",
    });
  }
  try {
    // Create a new user
    const newUser = await User.create({ fullname, email, password });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: newUser._id,
        fullname: newUser.fullname,
        email: newUser.email,
      },
    });
  } catch (error) {
    // Handle duplicate email error
    if (error.code === 11000 && error.keyPattern.email) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: messages[0],
      });
    }
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

const loginUser = async (req, res, next) => {
  // Getting the data from body or frontend
  let { email, password } = req.body;
  // Checking the data is there or not
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide all the fields",
    });
  }
  try {
    // Checking the user is available or not
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User does not exist with this email",
      });
    }
    // Password matching
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password",
      });
    }
    // Token generation
    const token = generateToken(user.id);
    // Setting the cookie
    setCookie(res, "token", token);
    // Removing the password filed from the user
    const { password: pwd, ...userData } = user._doc;
    return res.status(200).json({
      success: true,
      message: "User login successfully",
      user: userData,
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

const logoutUser = async (req, res, next) => {
  clearCookie(res, "token");
  res.status(200).json({
    success: true,
    message: "User logged out successfully",
  });
};

const sendOtp = async (req, res) => {
  let { email } = req.body;
  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Email is required" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000); // 6 digit OTP
    const otpExpiry = Date.now() + 5 * 60 * 1000; // valid for 5 minutes
    user.resetOtp = otp;
    user.resetOtpExpiry = otpExpiry;
    await user.save();
    // Send OTP to email
    await sendEmail(req.body.email, "OTP for Password Reset", `<p>Your OTP for password reset is: <b>${otp}</b></p>`);

    return res
      .status(200)
      .json({ success: true, message: "OTP sent to email" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res
      .status(400)
      .json({ success: false, message: "Email and OTP are required" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user || user.resetOtp !== otp || user.resetOtpExpiry < Date.now()) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP" });
    }

    return res
      .status(200)
      .json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const resetPassword = async (req, res) => {
  const { email, otp, newPassword, confirmPassword } = req.body;
  console.log(email, otp, newPassword, confirmPassword);
  if (!email || !otp || !newPassword || !confirmPassword) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }
  if (newPassword !== confirmPassword) {
    return res
      .status(400)
      .json({ success: false, message: "Passwords do not match" });
  }
  try {
    const user = await User.findOne({ email });

    if (!user || user.resetOtp !== otp || user.resetOtpExpiry < Date.now()) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP" });
    }
    user.password = newPassword;
    user.resetOtp = undefined;
    user.resetOtpExpiry = undefined;
    await user.save();
    return res
      .status(200)
      .json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export { registerUser, loginUser, logoutUser, sendOtp, verifyOtp, resetPassword };

import { User } from "../models/userSchema.js";
import { clearCookie } from "../utils/clearCookie.js";
import { setCookie } from "../utils/cookieOptions.js";
import { generateToken } from "../utils/generateToken.js";
import { sendEmail } from "../utils/sendEmail.js";

const registerUser = async (req, res) => {
  try {
    const {
      fullname,
      email,
      password,
      phone,
      dateOfBirth,
      occupation,
      monthlyIncome,
      currency = "INR",
      timezone = "Asia/Kolkata",
    } = req.body;

    // Enhanced validation
    if (!fullname || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Full name, email, and password are required fields",
      });
    }

    // Password strength validation
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // Email format validation (additional check)
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    // Create user data object
    const userData = {
      fullname: fullname.trim(),
      email: email.toLowerCase().trim(),
      password,
      phone: phone?.trim() || undefined,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      occupation: occupation?.trim() || undefined,
      monthlyIncome: monthlyIncome ? parseFloat(monthlyIncome) : 0,
      currency,
      timezone,
      lastLogin: new Date(),
      subscription: {
        plan: "free",
        isActive: true,
        startDate: new Date(),
      },
    };

    // Create new user
    const newUser = await User.create(userData);

    // Generate welcome token (optional)
    const token = generateToken(newUser._id);
    setCookie(res, "token", token);

    // Send welcome email (optional)
    try {
      await sendEmail(
        email,
        "Welcome to FinanceTracker!",
        `<div style="font-family: Arial, sans-serif;">
          <h2>Welcome ${fullname}!</h2>
          <p>Thank you for joining FinanceTracker. You're now ready to take control of your finances.</p>
          <p>Get started by:</p>
          <ul>
            <li>Adding your first transaction</li>
            <li>Setting up your budget</li>
            <li>Connecting your bank accounts</li>
          </ul>
          <p>Happy tracking!</p>
        </div>`
      );
    } catch (emailError) {
      console.log("Welcome email failed:", emailError.message);
      // Don't fail registration if email fails
    }

    // Remove sensitive data from response
    const {
      password: pwd,
      resetOtp,
      resetOtpExpiry,
      ...userResponse
    } = newUser._doc;

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: userResponse,
      token,
    });
  } catch (error) {
    console.error("Registration error:", error);

    // Handle duplicate email error
    if (error.code === 11000) {
      if (error.keyPattern?.email) {
        return res.status(409).json({
          success: false,
          message: "User already exists with this email address",
        });
      }
    }

    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: messages[0],
      });
    }

    return res.status(500).json({
      success: false,
      message: "Registration failed. Please try again.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// ✅ Login User (Enhanced)
const loginUser = async (req, res) => {
  try {
    const { email, password, rememberMe = false } = req.body;
    console.log(email, password);
    // Input validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user and include password for comparison
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check if user is verified (optional)
    // if (!user.isVerified) {
    //   return res.status(403).json({
    //     success: false,
    //     message: "Please verify your email address before logging in",
    //   });
    // }

    // Password comparison
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token with extended expiry if rememberMe is true
    const token = generateToken(user._id, rememberMe);

    // Set cookie with appropriate expiry
    setCookie(res, "token", token, rememberMe);

    // Remove sensitive data from response
    const {
      password: pwd,
      resetOtp,
      resetOtpExpiry,
      twoFactorAuth,
      ...userData
    } = user._doc;

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: userData,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Login failed. Please try again.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// ✅ Logout User (Enhanced)
const logoutUser = async (req, res) => {
  try {
    // Clear the authentication cookie
    clearCookie(res, "token");

    // Optional: You could also blacklist the token here if using JWT blacklisting

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Logout failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// ✅ Send OTP (Enhanced)
const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Email format validation
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email address",
      });
    }

    // Check if user recently requested OTP (rate limiting)
    if (user.resetOtpExpiry && user.resetOtpExpiry > Date.now()) {
      const remainingTime = Math.ceil(
        (user.resetOtpExpiry - Date.now()) / 1000
      );
      return res.status(429).json({
        success: false,
        message: `Please wait ${remainingTime} seconds before requesting a new OTP`,
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = Date.now() + 10 * 60 * 1000; // Valid for 10 minutes (increased from 2)

    // Update user with OTP
    user.resetOtp = otp;
    user.resetOtpExpiry = otpExpiry;
    await user.save();

    // Send OTP email with better formatting
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center;">
          <h1>Password Reset Request</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <p>Hello ${user.fullname},</p>
          <p>You've requested to reset your password. Please use the following OTP:</p>
          <div style="background: white; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #667eea; font-size: 32px; margin: 0; letter-spacing: 5px;">${otp}</h2>
          </div>
          <p><strong>This OTP will expire in 10 minutes.</strong></p>
          <p>If you didn't request this, please ignore this email.</p>
          <p>Best regards,<br>FinanceTracker Team</p>
        </div>
      </div>
    `;

    await sendEmail(email, "Password Reset OTP - FinanceTracker", emailHtml);

    return res.status(200).json({
      success: true,
      message: "OTP sent to your email address. Please check your inbox.",
    });
  } catch (error) {
    console.error("Send OTP error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP. Please try again.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// ✅ Verify OTP (Enhanced)
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    // Convert OTP to string for comparison
    const otpString = otp.toString().trim();

    if (otpString.length !== 6) {
      return res.status(400).json({
        success: false,
        message: "OTP must be 6 digits",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.resetOtp || !user.resetOtpExpiry) {
      return res.status(400).json({
        success: false,
        message: "No OTP request found. Please request a new OTP.",
      });
    }

    if (user.resetOtpExpiry < Date.now()) {
      // Clear expired OTP
      user.resetOtp = undefined;
      user.resetOtpExpiry = undefined;
      await user.save();

      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    if (user.resetOtp !== otpString) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP. Please check and try again.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully. You can now reset your password.",
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return res.status(500).json({
      success: false,
      message: "OTP verification failed. Please try again.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// ✅ Reset Password (Enhanced)
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword, confirmPassword } = req.body;

    // Input validation
    if (!email || !otp || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match",
      });
    }

    // Password strength validation
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify OTP
    if (!user.resetOtp || !user.resetOtpExpiry) {
      return res.status(400).json({
        success: false,
        message: "No valid OTP found. Please request a new OTP.",
      });
    }

    if (user.resetOtpExpiry < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    if (user.resetOtp !== otp.toString().trim()) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Update password and clear OTP
    user.password = newPassword;
    user.resetOtp = undefined;
    user.resetOtpExpiry = undefined;
    await user.save();

    // Send password reset confirmation email
    try {
      await sendEmail(
        email,
        "Password Reset Successful",
        `<div style="font-family: Arial, sans-serif;">
          <h2>Password Reset Successful</h2>
          <p>Hello ${user.fullname},</p>
          <p>Your password has been successfully reset.</p>
          <p>If you didn't make this change, please contact our support team immediately.</p>
          <p>Best regards,<br>FinanceTracker Team</p>
        </div>`
      );
    } catch (emailError) {
      console.log(
        "Password reset confirmation email failed:",
        emailError.message
      );
    }

    return res.status(200).json({
      success: true,
      message:
        "Password reset successfully. You can now login with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({
      success: false,
      message: "Password reset failed. Please try again.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// ✅ Get User Profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "-password -resetOtp -resetOtpExpiry -twoFactorAuth.secret"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      user,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// ✅ Update User Profile
const updateUserProfile = async (req, res) => {
  try {
    const {
      fullname,
      phone,
      dateOfBirth,
      occupation,
      monthlyIncome,
      currency,
      timezone,
      notifications,
    } = req.body;

    const updateData = {};

    // Only update provided fields
    if (fullname !== undefined) updateData.fullname = fullname.trim();
    if (phone !== undefined) updateData.phone = phone.trim();
    if (dateOfBirth !== undefined)
      updateData.dateOfBirth = new Date(dateOfBirth);
    if (occupation !== undefined) updateData.occupation = occupation.trim();
    if (monthlyIncome !== undefined)
      updateData.monthlyIncome = parseFloat(monthlyIncome);
    if (currency !== undefined) updateData.currency = currency;
    if (timezone !== undefined) updateData.timezone = timezone;
    if (notifications !== undefined) updateData.notifications = notifications;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password -resetOtp -resetOtpExpiry -twoFactorAuth.secret");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update profile error:", error);

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: messages[0],
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// ✅ Change Password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All password fields are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    const user = await User.findById(req.user._id).select("+password");

    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to change password",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// ✅ Delete Account
const deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required to delete account",
      });
    }

    const user = await User.findById(req.user._id).select("+password");

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password",
      });
    }

    // Soft delete or hard delete based on your preference
    await User.findByIdAndDelete(req.user._id);

    // Clear cookie
    clearCookie(res, "token");

    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Delete account error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete account",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export {
  registerUser,
  loginUser,
  logoutUser,
  sendOtp,
  verifyOtp,
  resetPassword,
  getUserProfile,
  updateUserProfile,
  changePassword,
  deleteAccount,
};

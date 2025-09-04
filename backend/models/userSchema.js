import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: [6, "Your password must contain at least 6 characters"],
    },
    avatar: {
      type: String,
      default: "",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
      match: [/^\+?[\d\s\-\(\)]{10,15}$/, "Please provide a valid phone number"],
    },
    dateOfBirth: {
      type: Date,
    },
    occupation: {
      type: String,
      trim: true,
    },
    monthlyIncome: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: "INR",
      enum: ["INR", "USD", "EUR", "GBP", "JPY", "AUD", "CAD"],
    },
    timezone: {
      type: String,
      default: "Asia/Kolkata",
    },
    financialGoals: [{
      name: String,
      targetAmount: Number,
      currentAmount: { type: Number, default: 0 },
      targetDate: Date,
      category: {
        type: String,
        enum: ["Emergency Fund", "Vacation", "House", "Car", "Investment", "Other"],
      },
    }],
    monthlyBudget: {
      totalBudget: { type: Number, default: 0 },
      categoryBudgets: [{
        category: String,
        budgetAmount: Number,
        alertThreshold: { type: Number, default: 80 },
      }],
    },
    
    // Notification Preferences
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      budgetAlerts: { type: Boolean, default: true },
      weeklyReports: { type: Boolean, default: true },
      monthlyReports: { type: Boolean, default: true },
    },
    
    // Security & Account
    twoFactorAuth: {
      enabled: { type: Boolean, default: false },
      secret: String,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    resetOtp: {
      type: String,
    },
    resetOtpExpiry: {
      type: Date,
    },
    
    // Subscription & Premium Features
    subscription: {
      plan: {
        type: String,
        enum: ["free", "premium", "pro"],
        default: "free",
      },
      startDate: Date,
      endDate: Date,
      isActive: { type: Boolean, default: true },
    },
  },
  { 
    timestamps: true,
    // Add indexes for better performance
    indexes: [
      { email: 1 },
      { "subscription.plan": 1 },
      { lastLogin: 1 }
    ]
  }
);

// Enhanced pre-save middleware
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const hashedPassword = await bcrypt.hash(this.password, 12); // Increased salt rounds
    this.password = hashedPassword;
  }
  next();
});

// Enhanced password comparison
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to check subscription status
userSchema.methods.hasActiveSubscription = function() {
  return this.subscription.isActive && 
         this.subscription.endDate && 
         this.subscription.endDate > new Date();
};

// Method to calculate budget utilization
userSchema.methods.getBudgetUtilization = async function() {
  // This would integrate with Transaction model
  // Implementation depends on your transaction aggregation logic
  return {};
};

export const User = mongoose.model("User", userSchema);
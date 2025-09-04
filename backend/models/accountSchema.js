import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["bank", "credit_card", "wallet", "investment", "cash"],
    required: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
  currency: {
    type: String,
    default: "INR",
  },
  bankName: String,
  accountNumber: String,
  isActive: {
    type: Boolean,
    default: true,
  },
  autoSync: {
    type: Boolean,
    default: false,
  },
  lastSyncDate: Date,
}, { timestamps: true });

export const Account = mongoose.model("Account", accountSchema);
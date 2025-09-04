import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: String,
  period: {
    type: String,
    enum: ["weekly", "monthly", "yearly"],
    default: "monthly",
  },
  totalBudget: {
    type: Number,
    required: true,
  },
  categories: [{
    category: String,
    budgetAmount: Number,
    spent: { type: Number, default: 0 },
    remaining: { type: Number, default: 0 },
  }],
  startDate: Date,
  endDate: Date,
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

export const Budget = mongoose.model("Budget", budgetSchema);
import mongoose from "mongoose";

const recurringTransactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  templateTransaction: {
    type: Object, // Store transaction template
    required: true,
  },
  frequency: {
    type: String,
    enum: ["daily", "weekly", "monthly", "yearly"],
    required: true,
  },
  nextDueDate: {
    type: Date,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  endDate: Date,
}, { timestamps: true });

export const RecurringTransaction = mongoose.model("RecurringTransaction", recurringTransactionSchema);
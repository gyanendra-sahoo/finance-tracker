import { RecurringTransaction } from "../models/recurringTransactionSchema.js";
import { Transaction } from "../models/transactionSchema.js";

// ✅ Add Recurring Transaction
export const addRecurringTransaction = async (req, res) => {
  try {
    const { templateTransaction, frequency, nextDueDate, endDate } = req.body;

    if (!templateTransaction || !frequency || !nextDueDate) {
      return res.status(400).json({
        success: false,
        message: "Template transaction, frequency, and next due date are required"
      });
    }

    const validFrequencies = ["daily", "weekly", "monthly", "yearly"];
    if (!validFrequencies.includes(frequency)) {
      return res.status(400).json({
        success: false,
        message: `Frequency must be one of: ${validFrequencies.join(", ")}`
      });
    }

    const recurringTx = new RecurringTransaction({
      userId: req.user._id,
      templateTransaction,
      frequency,
      nextDueDate: new Date(nextDueDate),
      endDate: endDate ? new Date(endDate) : undefined,
      isActive: true
    });

    await recurringTx.save();

    res.status(201).json({
      success: true,
      message: "Recurring transaction added successfully",
      recurringTransaction: recurringTx
    });
  } catch (error) {
    console.error("Add recurring transaction error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add recurring transaction",
      error: error.message
    });
  }
};

// ✅ Get All Recurring Transactions
export const getRecurringTransactions = async (req, res) => {
  try {
    const transactions = await RecurringTransaction.find({
      userId: req.user._id,
      isActive: true
    }).sort({ nextDueDate: 1 });

    res.status(200).json({
      success: true,
      message: "Recurring transactions fetched successfully",
      transactions
    });
  } catch (error) {
    console.error("Get recurring transactions error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch recurring transactions",
      error: error.message
    });
  }
};

// ✅ Get Single Recurring Transaction
export const getRecurringTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await RecurringTransaction.findOne({
      _id: id,
      userId: req.user._id
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Recurring transaction not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Recurring transaction fetched successfully",
      transaction
    });
  } catch (error) {
    console.error("Get recurring transaction error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch recurring transaction",
      error: error.message
    });
  }
};

// ✅ Update Recurring Transaction
export const updateRecurringTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await RecurringTransaction.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      req.body,
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Recurring transaction not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Recurring transaction updated successfully",
      transaction
    });
  } catch (error) {
    console.error("Update recurring transaction error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update recurring transaction",
      error: error.message
    });
  }
};

// ✅ Delete/Cancel Recurring Transaction
export const deleteRecurringTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await RecurringTransaction.findOneAndDelete({
      _id: id,
      userId: req.user._id
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Recurring transaction not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Recurring transaction deleted successfully"
    });
  } catch (error) {
    console.error("Delete recurring transaction error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete recurring transaction",
      error: error.message
    });
  }
};

// ✅ Process Due Recurring Transactions (Cron Job)
export const processRecurringTransactions = async () => {
  try {
    const now = new Date();

    const dueTransactions = await RecurringTransaction.find({
      isActive: true,
      nextDueDate: { $lte: now }
    });

    for (const recurring of dueTransactions) {
      // Create actual transaction from template
      const tx = new Transaction({
        ...recurring.templateTransaction,
        userId: recurring.userId,
        date: new Date()
      });
      await tx.save();

      // Calculate next due date
      let nextDate = new Date(recurring.nextDueDate);
      switch (recurring.frequency) {
        case "daily":
          nextDate.setDate(nextDate.getDate() + 1);
          break;
        case "weekly":
          nextDate.setDate(nextDate.getDate() + 7);
          break;
        case "monthly":
          nextDate.setMonth(nextDate.getMonth() + 1);
          break;
        case "yearly":
          nextDate.setFullYear(nextDate.getFullYear() + 1);
          break;
      }

      // Update recurring transaction
      recurring.nextDueDate = nextDate;
      if (recurring.endDate && nextDate > recurring.endDate) {
        recurring.isActive = false;
      }
      await recurring.save();
    }

    console.log(`Processed ${dueTransactions.length} recurring transactions.`);
  } catch (error) {
    console.error("Process recurring transactions error:", error);
  }
};

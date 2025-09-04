import { Account } from "../models/accountSchema.js";
import { Transaction } from "../models/transactionSchema.js";
import mongoose from "mongoose";

// ✅ Add New Account
export const addAccount = async (req, res) => {
  try {
    const { 
      name, 
      type, 
      balance = 0, 
      currency = "INR", 
      bankName, 
      accountNumber,
      autoSync = false
    } = req.body;

    if (!name || !type) {
      return res.status(400).json({
        success: false,
        message: "Account name and type are required"
      });
    }

    if (!['bank', 'credit_card', 'wallet', 'investment', 'cash'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid account type"
      });
    }

    const account = new Account({
      userId: req.user._id,
      name: name.trim(),
      type,
      balance: parseFloat(balance),
      currency,
      bankName: bankName?.trim(),
      accountNumber: accountNumber?.trim(),
      autoSync
    });

    await account.save();

    res.status(201).json({
      success: true,
      message: "Account added successfully",
      account
    });

  } catch (error) {
    console.error("Add account error:", error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages[0]
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to add account",
      error: error.message
    });
  }
};

// ✅ Get All User Accounts
export const getAccounts = async (req, res) => {
  try {
    const { type, isActive } = req.query;

    const filter = { 
      userId: req.user._id 
    };

    if (type) filter.type = type;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const accounts = await Account.find(filter).sort({ createdAt: -1 });

    // Calculate total balance by currency
    const balanceSummary = accounts.reduce((summary, account) => {
      if (!summary[account.currency]) {
        summary[account.currency] = 0;
      }
      summary[account.currency] += account.balance;
      return summary;
    }, {});

    res.status(200).json({
      success: true,
      message: "Accounts fetched successfully",
      data: {
        accounts,
        balanceSummary,
        totalAccounts: accounts.length
      }
    });

  } catch (error) {
    console.error("Get accounts error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch accounts",
      error: error.message
    });
  }
};

// ✅ Get Single Account with Transaction Summary
export const getAccount = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid account ID"
      });
    }

    const account = await Account.findOne({
      _id: id,
      userId: req.user._id
    });

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Account not found"
      });
    }

    // Get recent transactions for this account
    const recentTransactions = await Transaction.find({
      accountId: id,
      userId: req.user._id,
      isDeleted: { $ne: true }
    })
      .sort({ date: -1 })
      .limit(10);

    // Get account statistics
    const stats = await Transaction.aggregate([
      {
        $match: {
          accountId: mongoose.Types.ObjectId(id),
          userId: mongoose.Types.ObjectId(req.user._id),
          isDeleted: { $ne: true }
        }
      },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    const totalIncome = stats.find(s => s._id === 'income')?.total || 0;
    const totalExpense = stats.find(s => s._id === 'expense')?.total || 0;

    res.status(200).json({
      success: true,
      message: "Account details fetched successfully",
      data: {
        account,
        recentTransactions,
        statistics: {
          totalIncome,
          totalExpense,
          netFlow: totalIncome - totalExpense,
          transactionCount: stats.reduce((sum, s) => sum + s.count, 0)
        }
      }
    });

  } catch (error) {
    console.error("Get account error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch account details",
      error: error.message
    });
  }
};

// ✅ Update Account
export const updateAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid account ID"
      });
    }

    // Remove fields that shouldn't be updated directly
    delete updateData.userId;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    const account = await Account.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Account not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Account updated successfully",
      account
    });

  } catch (error) {
    console.error("Update account error:", error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages[0]
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update account",
      error: error.message
    });
  }
};

// ✅ Delete Account
export const deleteAccount = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid account ID"
      });
    }

    // Check if account has transactions
    const transactionCount = await Transaction.countDocuments({
      accountId: id,
      userId: req.user._id,
      isDeleted: { $ne: true }
    });

    if (transactionCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete account with ${transactionCount} transactions. Please delete transactions first or transfer them to another account.`
      });
    }

    const account = await Account.findOneAndDelete({
      _id: id,
      userId: req.user._id
    });

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Account not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Account deleted successfully"
    });

  } catch (error) {
    console.error("Delete account error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete account",
      error: error.message
    });
  }
};

// ✅ Update Account Balance
export const updateAccountBalance = async (req, res) => {
  try {
    const { id } = req.params;
    const { balance, reason } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid account ID"
      });
    }

    if (balance === undefined || balance === null) {
      return res.status(400).json({
        success: false,
        message: "Balance is required"
      });
    }

    const account = await Account.findOne({
      _id: id,
      userId: req.user._id
    });

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Account not found"
      });
    }

    const oldBalance = account.balance;
    const newBalance = parseFloat(balance);
    const difference = newBalance - oldBalance;

    // Update account balance
    account.balance = newBalance;
    await account.save();

    // Optionally create a balance adjustment transaction
    if (Math.abs(difference) > 0.01 && reason) {
      const adjustmentTransaction = new Transaction({
        userId: req.user._id,
        accountId: id,
        type: difference > 0 ? 'income' : 'expense',
        category: 'Balance Adjustment',
        amount: Math.abs(difference),
        description: reason || `Balance adjustment from ${oldBalance} to ${newBalance}`,
        date: new Date()
      });
      await adjustmentTransaction.save();
    }

    res.status(200).json({
      success: true,
      message: "Account balance updated successfully",
      data: {
        account,
        oldBalance,
        newBalance,
        difference
      }
    });

  } catch (error) {
    console.error("Update balance error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update account balance",
      error: error.message
    });
  }
};
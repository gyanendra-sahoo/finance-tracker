import { Transaction } from "../models/transactionSchema.js";
import { User } from "../models/userSchema.js";
import { Account } from "../models/accountSchema.js";
import mongoose from "mongoose";

// ✅ Add Transaction
export const addTransaction = async (req, res) => {
  try {
    const {
      type,
      category,
      subcategory,
      amount,
      currency,
      date,
      description,
      notes,
      paymentMethod,
      accountId,
      location,
      tags,
      isTaxDeductible,
      businessExpense,
      isRecurring,
      recurringFrequency,
      attachments
    } = req.body;

    // Validation
    if (!type || !category || !amount) {
      return res.status(400).json({
        success: false,
        message: "Type, category, and amount are required fields"
      });
    }

    if (!['income', 'expense', 'transfer'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Type must be 'income', 'expense', or 'transfer'"
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than 0"
      });
    }

    // Get user's default currency if not provided
    const user = await User.findById(req.user._id);
    const transactionCurrency = currency || user.currency || 'INR';

    // Create transaction object
    const transactionData = {
      userId: req.user._id,
      type,
      category,
      subcategory,
      amount: parseFloat(amount),
      currency: transactionCurrency,
      date: date ? new Date(date) : new Date(),
      description: description?.trim() || '',
      notes: notes?.trim() || '',
      paymentMethod: paymentMethod || 'cash',
      accountId: accountId || null,
      location: location || null,
      tags: tags || [],
      isTaxDeductible: isTaxDeductible || false,
      businessExpense: businessExpense || false,
      attachments: attachments || []
    };

    const transaction = new Transaction(transactionData);
    await transaction.save();

    // Update account balance if accountId is provided
    if (accountId) {
      const account = await Account.findOne({ _id: accountId, userId: req.user._id });
      if (account) {
        const balanceChange = type === 'income' ? amount : -amount;
        account.balance += balanceChange;
        await account.save();
      }
    }

    // Populate the transaction with account details
    const populatedTransaction = await Transaction.findById(transaction._id)
      .populate('accountId', 'name type bankName')
      .populate('userId', 'fullname email currency');

    res.status(201).json({
      success: true,
      message: "Transaction added successfully",
      transaction: populatedTransaction
    });

  } catch (error) {
    console.error('Add transaction error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages[0]
      });
    }

    res.status(500).json({
      success: false,
      message: "Error adding transaction",
      error: error.message
    });
  }
};

// ✅ Get All Transactions with Advanced Filtering
export const getTransactions = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      type,
      category,
      startDate,
      endDate,
      minAmount,
      maxAmount,
      paymentMethod,
      accountId,
      tags,
      search,
      sortBy = 'date',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = { 
      userId: req.user._id,
      isDeleted: { $ne: true }
    };

    // Add filters
    if (type && ['income', 'expense', 'transfer'].includes(type)) {
      filter.type = type;
    }

    if (category) {
      filter.category = { $regex: category, $options: 'i' };
    }

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    if (minAmount || maxAmount) {
      filter.amount = {};
      if (minAmount) filter.amount.$gte = parseFloat(minAmount);
      if (maxAmount) filter.amount.$lte = parseFloat(maxAmount);
    }

    if (paymentMethod) {
      filter.paymentMethod = paymentMethod;
    }

    if (accountId) {
      filter.accountId = accountId;
    }

    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      filter.tags = { $in: tagArray };
    }

    if (search) {
      filter.$or = [
        { description: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute queries
    const [transactions, totalCount] = await Promise.all([
      Transaction.find(filter)
        .populate('accountId', 'name type bankName')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit)),
      Transaction.countDocuments(filter)
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;

    res.status(200).json({
      success: true,
      message: "Transactions fetched successfully",
      data: {
        transactions,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalCount,
          hasNextPage,
          hasPrevPage,
          limit: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      message: "Error fetching transactions",
      error: error.message
    });
  }
};

// ✅ Get Single Transaction
export const getTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid transaction ID"
      });
    }

    const transaction = await Transaction.findOne({
      _id: id,
      userId: req.user._id,
      isDeleted: { $ne: true }
    }).populate('accountId', 'name type bankName');

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Transaction fetched successfully",
      transaction
    });

  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({
      success: false,
      message: "Error fetching transaction",
      error: error.message
    });
  }
};

// ✅ Update Transaction
export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid transaction ID"
      });
    }

    // Remove fields that shouldn't be updated directly
    delete updateData.userId;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    // Validate amount if provided
    if (updateData.amount !== undefined && updateData.amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than 0"
      });
    }

    // Validate type if provided
    if (updateData.type && !['income', 'expense', 'transfer'].includes(updateData.type)) {
      return res.status(400).json({
        success: false,
        message: "Type must be 'income', 'expense', or 'transfer'"
      });
    }

    const transaction = await Transaction.findOneAndUpdate(
      { 
        _id: id, 
        userId: req.user._id,
        isDeleted: { $ne: true }
      },
      { 
        $set: {
          ...updateData,
          updatedAt: new Date()
        }
      },
      { new: true, runValidators: true }
    ).populate('accountId', 'name type bankName');

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found or you don't have permission to update it"
      });
    }

    res.status(200).json({
      success: true,
      message: "Transaction updated successfully",
      transaction
    });

  } catch (error) {
    console.error('Update transaction error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages[0]
      });
    }

    res.status(500).json({
      success: false,
      message: "Error updating transaction",
      error: error.message
    });
  }
};

// ✅ Delete Transaction (Soft Delete)
export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid transaction ID"
      });
    }

    const transaction = await Transaction.findOneAndUpdate(
      { 
        _id: id, 
        userId: req.user._id,
        isDeleted: { $ne: true }
      },
      { 
        $set: {
          isDeleted: true,
          deletedAt: new Date()
        }
      },
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found or already deleted"
      });
    }

    res.status(200).json({
      success: true,
      message: "Transaction deleted successfully"
    });

  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({
      success: false,
      message: "Error deleting transaction",
      error: error.message
    });
  }
};

// ✅ Bulk Delete Transactions
export const bulkDeleteTransactions = async (req, res) => {
  try {
    const { transactionIds } = req.body;

    if (!transactionIds || !Array.isArray(transactionIds) || transactionIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Transaction IDs array is required"
      });
    }

    // Validate all IDs
    const invalidIds = transactionIds.filter(id => !mongoose.Types.ObjectId.isValid(id));
    if (invalidIds.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid transaction IDs provided"
      });
    }

    const result = await Transaction.updateMany(
      { 
        _id: { $in: transactionIds },
        userId: req.user._id,
        isDeleted: { $ne: true }
      },
      { 
        $set: {
          isDeleted: true,
          deletedAt: new Date()
        }
      }
    );

    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} transactions deleted successfully`,
      deletedCount: result.modifiedCount
    });

  } catch (error) {
    console.error('Bulk delete error:', error);
    res.status(500).json({
      success: false,
      message: "Error deleting transactions",
      error: error.message
    });
  }
};

// ✅ Get Transaction Analytics
export const getTransactionAnalytics = async (req, res) => {
  try {
    const { startDate, endDate, groupBy = 'month' } = req.query;

    const matchStage = {
      userId: req.user._id,
      isDeleted: { $ne: true }
    };

    if (startDate || endDate) {
      matchStage.date = {};
      if (startDate) matchStage.date.$gte = new Date(startDate);
      if (endDate) matchStage.date.$lte = new Date(endDate);
    }

    // Group by format based on groupBy parameter
    let groupByFormat;
    switch (groupBy) {
      case 'day':
        groupByFormat = '%Y-%m-%d';
        break;
      case 'week':
        groupByFormat = '%Y-%U';
        break;
      case 'year':
        groupByFormat = '%Y';
        break;
      default:
        groupByFormat = '%Y-%m';
    }

    const analytics = await Transaction.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            period: { $dateToString: { format: groupByFormat, date: '$date' } },
            type: '$type'
          },
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$_id.period',
          income: {
            $sum: {
              $cond: [{ $eq: ['$_id.type', 'income'] }, '$totalAmount', 0]
            }
          },
          expense: {
            $sum: {
              $cond: [{ $eq: ['$_id.type', 'expense'] }, '$totalAmount', 0]
            }
          },
          incomeCount: {
            $sum: {
              $cond: [{ $eq: ['$_id.type', 'income'] }, '$count', 0]
            }
          },
          expenseCount: {
            $sum: {
              $cond: [{ $eq: ['$_id.type', 'expense'] }, '$count', 0]
            }
          }
        }
      },
      {
        $addFields: {
          profit: { $subtract: ['$income', '$expense'] },
          period: '$_id'
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Category-wise breakdown
    const categoryBreakdown = await Transaction.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            category: '$category',
            type: '$type'
          },
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { totalAmount: -1 }
      }
    ]);

    // Overall totals
    const totals = await Transaction.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    const totalIncome = totals.find(t => t._id === 'income')?.total || 0;
    const totalExpense = totals.find(t => t._id === 'expense')?.total || 0;
    const netProfit = totalIncome - totalExpense;

    res.status(200).json({
      success: true,
      message: "Analytics fetched successfully",
      data: {
        overview: {
          totalIncome,
          totalExpense,
          netProfit,
          savingsRate: totalIncome > 0 ? ((netProfit / totalIncome) * 100).toFixed(2) : 0
        },
        timeline: analytics,
        categoryBreakdown,
        period: {
          startDate: startDate || 'All time',
          endDate: endDate || 'All time',
          groupBy
        }
      }
    });

  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      success: false,
      message: "Error fetching analytics",
      error: error.message
    });
  }
};

// ✅ Get Recent Transactions (for dashboard)
export const getRecentTransactions = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const transactions = await Transaction.find({
      userId: req.user._id,
      isDeleted: { $ne: true }
    })
      .populate('accountId', 'name type')
      .sort({ date: -1, createdAt: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      message: "Recent transactions fetched successfully",
      transactions
    });

  } catch (error) {
    console.error('Recent transactions error:', error);
    res.status(500).json({
      success: false,
      message: "Error fetching recent transactions",
      error: error.message
    });
  }
};

// ✅ Duplicate Transaction
export const duplicateTransactions = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid transaction ID"
      });
    }

    const originalTransaction = await Transaction.findOne({
      _id: id,
      userId: req.user._id,
      isDeleted: { $ne: true }
    });

    if (!originalTransaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found"
      });
    }

    // Create duplicate with current date
    const duplicateData = originalTransaction.toObject();
    delete duplicateData._id;
    delete duplicateData.createdAt;
    delete duplicateData.updatedAt;
    duplicateData.date = new Date();

    const duplicatedTransaction = new Transaction(duplicateData);
    await duplicatedTransaction.save();

    const populatedTransaction = await Transaction.findById(duplicatedTransaction._id)
      .populate('accountId', 'name type bankName');

    res.status(201).json({
      success: true,
      message: "Transaction duplicated successfully",
      transaction: populatedTransaction
    });

  } catch (error) {
    console.error('Duplicate transaction error:', error);
    res.status(500).json({
      success: false,
      message: "Error duplicating transaction",
      error: error.message
    });
  }
};

import { Budget } from "../models/budgetSchema.js";
import { Transaction } from "../models/transactionSchema.js";
import mongoose from "mongoose";

// ✅ Create Budget
export const createBudget = async (req, res) => {
  try {
    const {
      name,
      period = "monthly",
      totalBudget,
      categories,
      startDate,
      endDate
    } = req.body;

    if (!name || !totalBudget || !categories || categories.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Name, total budget, and categories are required"
      });
    }

    // Validate period
    if (!['weekly', 'monthly', 'yearly'].includes(period)) {
      return res.status(400).json({
        success: false,
        message: "Period must be weekly, monthly, or yearly"
      });
    }

    // Calculate category totals
    const categoryTotal = categories.reduce((sum, cat) => sum + cat.budgetAmount, 0);
    if (categoryTotal > totalBudget) {
      return res.status(400).json({
        success: false,
        message: "Category budgets exceed total budget"
      });
    }

    // Set default dates based on period
    let budgetStartDate = startDate ? new Date(startDate) : new Date();
    let budgetEndDate;

    if (!endDate) {
      budgetEndDate = new Date(budgetStartDate);
      switch (period) {
        case 'weekly':
          budgetEndDate.setDate(budgetEndDate.getDate() + 7);
          break;
        case 'monthly':
          budgetEndDate.setMonth(budgetEndDate.getMonth() + 1);
          break;
        case 'yearly':
          budgetEndDate.setFullYear(budgetEndDate.getFullYear() + 1);
          break;
      }
    } else {
      budgetEndDate = new Date(endDate);
    }

    // Process categories with remaining amounts
    const processedCategories = categories.map(cat => ({
      category: cat.category,
      budgetAmount: cat.budgetAmount,
      spent: 0,
      remaining: cat.budgetAmount
    }));

    const budget = new Budget({
      userId: req.user._id,
      name: name.trim(),
      period,
      totalBudget: parseFloat(totalBudget),
      categories: processedCategories,
      startDate: budgetStartDate,
      endDate: budgetEndDate,
      isActive: true
    });

    await budget.save();

    res.status(201).json({
      success: true,
      message: "Budget created successfully",
      budget
    });

  } catch (error) {
    console.error("Create budget error:", error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages[0]
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create budget",
      error: error.message
    });
  }
};

// ✅ Get All Budgets
export const getBudgets = async (req, res) => {
  try {
    const { 
      isActive, 
      period, 
      page = 1, 
      limit = 10,
      includeSpent = true 
    } = req.query;

    const filter = { userId: req.user._id };
    
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (period) filter.period = period;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    let budgets = await Budget.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    if (includeSpent === 'true') {
      // Calculate spent amounts for each budget
      budgets = await Promise.all(budgets.map(async (budget) => {
        const updatedBudget = await updateBudgetSpentAmounts(budget);
        return updatedBudget;
      }));
    }

    const totalCount = await Budget.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: "Budgets fetched successfully",
      data: {
        budgets,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / parseInt(limit)),
          totalCount,
          limit: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error("Get budgets error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch budgets",
      error: error.message
    });
  }
};

// ✅ Get Single Budget with Details
export const getBudget = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid budget ID"
      });
    }

    let budget = await Budget.findOne({
      _id: id,
      userId: req.user._id
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: "Budget not found"
      });
    }

    // Update spent amounts
    budget = await updateBudgetSpentAmounts(budget);

    // Get recent transactions for this budget period
    const recentTransactions = await Transaction.find({
      userId: req.user._id,
      type: 'expense',
      date: {
        $gte: budget.startDate,
        $lte: budget.endDate
      },
      category: { $in: budget.categories.map(cat => cat.category) },
      isDeleted: { $ne: true }
    })
      .sort({ date: -1 })
      .limit(20);

    // Calculate budget progress
    const totalSpent = budget.categories.reduce((sum, cat) => sum + cat.spent, 0);
    const totalRemaining = budget.totalBudget - totalSpent;
    const progressPercentage = (totalSpent / budget.totalBudget) * 100;

    res.status(200).json({
      success: true,
      message: "Budget details fetched successfully",
      data: {
        budget,
        recentTransactions,
        summary: {
          totalBudget: budget.totalBudget,
          totalSpent,
          totalRemaining,
          progressPercentage: Math.min(progressPercentage, 100),
          isOverBudget: totalSpent > budget.totalBudget,
          daysRemaining: Math.max(0, Math.ceil((budget.endDate - new Date()) / (1000 * 60 * 60 * 24)))
        }
      }
    });

  } catch (error) {
    console.error("Get budget error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch budget details",
      error: error.message
    });
  }
};

// ✅ Update Budget
export const updateBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid budget ID"
      });
    }

    // Remove fields that shouldn't be updated directly
    delete updateData.userId;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    // If updating categories, recalculate spent amounts
    if (updateData.categories) {
      updateData.categories = updateData.categories.map(cat => ({
        category: cat.category,
        budgetAmount: cat.budgetAmount,
        spent: cat.spent || 0,
        remaining: cat.budgetAmount - (cat.spent || 0)
      }));
    }

    const budget = await Budget.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: "Budget not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Budget updated successfully",
      budget
    });

  } catch (error) {
    console.error("Update budget error:", error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages[0]
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update budget",
      error: error.message
    });
  }
};

// ✅ Delete Budget
export const deleteBudget = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid budget ID"
      });
    }

    const budget = await Budget.findOneAndDelete({
      _id: id,
      userId: req.user._id
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: "Budget not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Budget deleted successfully"
    });

  } catch (error) {
    console.error("Delete budget error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete budget",
      error: error.message
    });
  }
};

// ✅ Get Budget Analytics
export const getBudgetAnalytics = async (req, res) => {
  try {
    const { period = "monthly" } = req.query;
    console.log(period);
    // Get active budgets
    const activeBudgets = await Budget.find({
      userId: req.user._id,
      isActive: true,
      period
    });
    console.log(activeBudgets);
    if (activeBudgets.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No active budgets found",
        data: {
          budgets: [],
          overallAnalytics: {
            totalBudget: 0,
            totalSpent: 0,
            totalRemaining: 0,
            averageUtilization: 0,
            budgetsOverLimit: 0
          }
        }
      });
    }

    // Update spent amounts for all budgets
    const updatedBudgets = await Promise.all(
      activeBudgets.map(budget => updateBudgetSpentAmounts(budget))
    );

    // Calculate overall analytics
    const overallAnalytics = updatedBudgets.reduce((analytics, budget) => {
      const totalSpent = budget.categories.reduce((sum, cat) => sum + cat.spent, 0);
      const totalRemaining = budget.totalBudget - totalSpent;
      const utilization = (totalSpent / budget.totalBudget) * 100;

      analytics.totalBudget += budget.totalBudget;
      analytics.totalSpent += totalSpent;
      analytics.totalRemaining += totalRemaining;
      analytics.utilizationSum += utilization;
      
      if (totalSpent > budget.totalBudget) {
        analytics.budgetsOverLimit++;
      }

      return analytics;
    }, {
      totalBudget: 0,
      totalSpent: 0,
      totalRemaining: 0,
      utilizationSum: 0,
      budgetsOverLimit: 0
    });

    overallAnalytics.averageUtilization = overallAnalytics.utilizationSum / updatedBudgets.length;

    // Category-wise spending analysis
    const categoryAnalysis = {};
    updatedBudgets.forEach(budget => {
      budget.categories.forEach(cat => {
        if (!categoryAnalysis[cat.category]) {
          categoryAnalysis[cat.category] = {
            totalBudget: 0,
            totalSpent: 0,
            budgetCount: 0
          };
        }
        categoryAnalysis[cat.category].totalBudget += cat.budgetAmount;
        categoryAnalysis[cat.category].totalSpent += cat.spent;
        categoryAnalysis[cat.category].budgetCount++;
      });
    });

    // Convert to array and calculate percentages
    const categoryBreakdown = Object.keys(categoryAnalysis).map(category => {
      const data = categoryAnalysis[category];
      return {
        category,
        totalBudget: data.totalBudget,
        totalSpent: data.totalSpent,
        utilization: (data.totalSpent / data.totalBudget) * 100,
        averageBudget: data.totalBudget / data.budgetCount
      };
    }).sort((a, b) => b.totalSpent - a.totalSpent);

    res.status(200).json({
      success: true,
      message: "Budget analytics fetched successfully",
      data: {
        budgets: updatedBudgets,
        overallAnalytics: {
          ...overallAnalytics,
          averageUtilization: Math.round(overallAnalytics.averageUtilization * 100) / 100
        },
        categoryBreakdown
      }
    });

  } catch (error) {
    console.error("Budget analytics error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch budget analytics",
      error: error.message
    });
  }
};

// ✅ Helper function to update spent amounts
async function updateBudgetSpentAmounts(budget) {
  try {
    // Get spending for each category within the budget period
    const spendingData = await Transaction.aggregate([
      {
        $match: {
          userId: budget.userId,
          type: 'expense',
          date: {
            $gte: budget.startDate,
            $lte: budget.endDate
          },
          category: { $in: budget.categories.map(cat => cat.category) },
          isDeleted: { $ne: true }
        }
      },
      {
        $group: {
          _id: '$category',
          totalSpent: { $sum: '$amount' }
        }
      }
    ]);

    // Create a map for quick lookup
    const spendingMap = {};
    spendingData.forEach(item => {
      spendingMap[item._id] = item.totalSpent;
    });

    // Update categories with spent amounts
    budget.categories = budget.categories.map(cat => ({
      category: cat.category,
      budgetAmount: cat.budgetAmount,
      spent: spendingMap[cat.category] || 0,
      remaining: cat.budgetAmount - (spendingMap[cat.category] || 0)
    }));

    // Save the updated budget
    await budget.save();
    
    return budget;
  } catch (error) {
    console.error("Error updating budget spent amounts:", error);
    return budget;
  }
}
import { User } from "../models/userSchema.js";
import { Transaction } from "../models/transactionSchema.js";
import mongoose from "mongoose";

// ✅ Add Financial Goal
export const addFinancialGoal = async (req, res) => {
  try {
    const {
      name,
      targetAmount,
      targetDate,
      category = "Other",
      initialAmount = 0
    } = req.body;

    if (!name || !targetAmount || !targetDate) {
      return res.status(400).json({
        success: false,
        message: "Name, target amount, and target date are required"
      });
    }

    if (parseFloat(targetAmount) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Target amount must be greater than 0"
      });
    }

    if (new Date(targetDate) <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Target date must be in the future"
      });
    }

    const validCategories = ["Emergency Fund", "Vacation", "House", "Car", "Investment", "Other"];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: `Category must be one of: ${validCategories.join(", ")}`
      });
    }

    const user = await User.findById(req.user._id);

    const newGoal = {
      name: name.trim(),
      targetAmount: parseFloat(targetAmount),
      currentAmount: parseFloat(initialAmount),
      targetDate: new Date(targetDate),
      category
    };

    user.financialGoals.push(newGoal);
    await user.save();

    const addedGoal = user.financialGoals[user.financialGoals.length - 1];

    res.status(201).json({
      success: true,
      message: "Financial goal added successfully",
      goal: addedGoal
    });

  } catch (error) {
    console.error("Add financial goal error:", error);
    
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages[0]
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to add financial goal",
      error: error.message
    });
  }
};

// ✅ Get All Financial Goals
export const getFinancialGoals = async (req, res) => {
  try {
    const { category, status } = req.query;

    const user = await User.findById(req.user._id);
    let goals = user.financialGoals || [];

    // Filter by category
    if (category) {
      goals = goals.filter(goal => goal.category === category);
    }

    // Calculate progress and add status for each goal
    goals = goals.map(goal => {
      const progress = (goal.currentAmount / goal.targetAmount) * 100;
      const isCompleted = progress >= 100;
      const daysRemaining = Math.ceil((goal.targetDate - new Date()) / (1000 * 60 * 60 * 24));
      const isOverdue = daysRemaining < 0 && !isCompleted;

      return {
        ...goal.toObject(),
        progress: Math.min(progress, 100),
        isCompleted,
        isOverdue,
        daysRemaining: Math.max(0, daysRemaining),
        remainingAmount: Math.max(0, goal.targetAmount - goal.currentAmount)
      };
    });

    // Filter by status
    if (status) {
      switch (status) {
        case "completed":
          goals = goals.filter(goal => goal.isCompleted);
          break;
        case "active":
          goals = goals.filter(goal => !goal.isCompleted && !goal.isOverdue);
          break;
        case "overdue":
          goals = goals.filter(goal => goal.isOverdue);
          break;
      }
    }

    // Sort goals by target date (nearest first)
    goals.sort((a, b) => new Date(a.targetDate) - new Date(b.targetDate));

    // Calculate summary statistics
    const summary = {
      totalGoals: user.financialGoals.length,
      completedGoals: goals.filter(g => g.isCompleted).length,
      activeGoals: goals.filter(g => !g.isCompleted && !g.isOverdue).length,
      overdueGoals: goals.filter(g => g.isOverdue).length,
      totalTargetAmount: goals.reduce((sum, g) => sum + g.targetAmount, 0),
      totalCurrentAmount: goals.reduce((sum, g) => sum + g.currentAmount, 0),
      averageProgress: goals.length > 0 ? goals.reduce((sum, g) => sum + g.progress, 0) / goals.length : 0
    };

    res.status(200).json({
      success: true,
      message: "Financial goals fetched successfully",
      data: {
        goals,
        summary
      }
    });

  } catch (error) {
    console.error("Get financial goals error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch financial goals",
      error: error.message
    });
  }
};

// ✅ Get Single Financial Goal
export const getFinancialGoal = async (req, res) => {
  try {
    const { goalId } = req.params;

    const user = await User.findById(req.user._id);
    const goal = user.financialGoals.id(goalId);

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Financial goal not found"
      });
    }

    // Calculate detailed progress
    const progress = (goal.currentAmount / goal.targetAmount) * 100;
    const isCompleted = progress >= 100;
    const daysRemaining = Math.ceil((goal.targetDate - new Date()) / (1000 * 60 * 60 * 24));
    const isOverdue = daysRemaining < 0 && !isCompleted;
    const remainingAmount = Math.max(0, goal.targetAmount - goal.currentAmount);

    // Calculate required monthly savings (if not overdue)
    let requiredMonthlySavings = 0;
    if (!isCompleted && !isOverdue && daysRemaining > 0) {
      const remainingMonths = Math.max(1, daysRemaining / 30);
      requiredMonthlySavings = remainingAmount / remainingMonths;
    }

    // Get recent contributions (last 30 days)
    const recentContributions = await Transaction.find({
      userId: req.user._id,
      type: "income",
      category: { $in: ["Savings", "Investment", goal.category] },
      date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      isDeleted: { $ne: true }
    })
      .sort({ date: -1 })
      .limit(10);

    const goalWithDetails = {
      ...goal.toObject(),
      progress: Math.min(progress, 100),
      isCompleted,
      isOverdue,
      daysRemaining: Math.max(0, daysRemaining),
      remainingAmount,
      requiredMonthlySavings,
      recentContributions
    };

    res.status(200).json({
      success: true,
      message: "Financial goal details fetched successfully",
      goal: goalWithDetails
    });

  } catch (error) {
    console.error("Get financial goal error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch financial goal details",
      error: error.message
    });
  }
};

// ✅ Update Financial Goal
export const updateFinancialGoal = async (req, res) => {
  try {
    const { goalId } = req.params;
    const updateData = req.body;

    const user = await User.findById(req.user._id);
    const goal = user.financialGoals.id(goalId);

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Financial goal not found"
      });
    }

    // Validate updates
    if (updateData.targetAmount !== undefined && parseFloat(updateData.targetAmount) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Target amount must be greater than 0"
      });
    }

    if (updateData.targetDate !== undefined && new Date(updateData.targetDate) <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Target date must be in the future"
      });
    }

    // Update allowed fields
    if (updateData.name !== undefined) goal.name = updateData.name.trim();
    if (updateData.targetAmount !== undefined) goal.targetAmount = parseFloat(updateData.targetAmount);
    if (updateData.currentAmount !== undefined) goal.currentAmount = parseFloat(updateData.currentAmount);
    if (updateData.targetDate !== undefined) goal.targetDate = new Date(updateData.targetDate);
    if (updateData.category !== undefined) goal.category = updateData.category;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Financial goal updated successfully",
      goal
    });

  } catch (error) {
    console.error("Update financial goal error:", error);
    
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages[0]
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update financial goal",
      error: error.message
    });
  }
};

// ✅ Add Contribution
export const addContribution = async (req, res) => {
  try {
    const { goalId } = req.params;
    const { amount, description } = req.body;

    if (!amount || parseFloat(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Contribution amount must be greater than 0"
      });
    }

    const user = await User.findById(req.user._id);
    const goal = user.financialGoals.id(goalId);

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Financial goal not found"
      });
    }

    const contributionAmount = parseFloat(amount);
    const oldAmount = goal.currentAmount;
    goal.currentAmount += contributionAmount;

    await user.save();

    // Create a transaction record for this contribution
    const contributionTransaction = new Transaction({
      userId: req.user._id,
      type: "income",
      category: "Goal Contribution",
      subcategory: goal.name,
      amount: contributionAmount,
      description: description || `Contribution to ${goal.name}`,
      tags: ["goal-contribution", goal.category?.toLowerCase().replace(/\s+/g, "-")],
      date: new Date()
    });

    await contributionTransaction.save();

    // Check if goal is completed
    const progress = (goal.currentAmount / goal.targetAmount) * 100;
    const isCompleted = progress >= 100;

    res.status(200).json({
      success: true,
      message: isCompleted
        ? "🎉 Congratulations! You've reached your financial goal!"
        : "Contribution added successfully",
      data: {
        goal,
        contribution: {
          amount: contributionAmount,
          oldAmount,
          newAmount: goal.currentAmount,
          transaction: contributionTransaction
        },
        progress: Math.min(progress, 100),
        isCompleted
      }
    });

  } catch (error) {
    console.error("Add contribution error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add contribution",
      error: error.message
    });
  }
};

// ✅ Delete Financial Goal
export const deleteFinancialGoal = async (req, res) => {
  try {
    const { goalId } = req.params;

    const user = await User.findById(req.user._id);
    const goal = user.financialGoals.id(goalId);

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Financial goal not found"
      });
    }

    goal.deleteOne(); // remove subdocument
    await user.save();

    res.status(200).json({
      success: true,
      message: "Financial goal deleted successfully"
    });

  } catch (error) {
    console.error("Delete financial goal error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete financial goal",
      error: error.message
    });
  }
};

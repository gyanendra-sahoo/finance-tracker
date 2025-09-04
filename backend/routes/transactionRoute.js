import express from "express";
import {
  addTransaction,
  getTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction,
  bulkDeleteTransactions,
  getTransactionAnalytics,
  getRecentTransactions,
  duplicateTransactions
} from "../controllers/transactionController.js";
import { verifyUser } from "../middlewares/verifyUser.js";

const router = express.Router();

// Basic CRUD operations
router.post("/", verifyUser, addTransaction);
router.get("/", verifyUser, getTransactions);
router.get("/recent", verifyUser, getRecentTransactions); // Must come before /:id to avoid conflicts
router.get("/analytics", verifyUser, getTransactionAnalytics);
router.get("/:id", verifyUser, getTransaction);
router.put("/:id", verifyUser, updateTransaction);
router.delete("/:id", verifyUser, deleteTransaction);

// Bulk operations
router.delete("/bulk", verifyUser, bulkDeleteTransactions);

// Utility operations
router.post("/:id/duplicate", verifyUser, duplicateTransactions);

export default router;
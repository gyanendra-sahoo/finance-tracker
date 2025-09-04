import express from "express";
import { 
  createBudget, 
  getBudgets, 
  getBudget, 
  updateBudget, 
  deleteBudget, 
  getBudgetAnalytics
} from "../controllers/budgetController.js";
import { verifyUser } from "../middlewares/verifyUser.js";

const router = express.Router();

router.post("/", verifyUser, createBudget);
router.get("/", verifyUser, getBudgets);
router.get("/:id", verifyUser, getBudget);
router.put("/:id", verifyUser, updateBudget);
router.delete("/:id", verifyUser, deleteBudget);
router.get("/analytics", verifyUser, getBudgetAnalytics);

export default router;

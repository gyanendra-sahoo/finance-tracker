import express from "express";
import { 
  addFinancialGoal, 
  getFinancialGoals, 
  getFinancialGoal, 
  updateFinancialGoal, 
  addContribution 
} from "../controllers/financialGoalController.js";
import { verifyUser } from "../middlewares/verifyUser.js";

const router = express.Router();

router.post("/", verifyUser, addFinancialGoal);
router.get("/", verifyUser, getFinancialGoals);
router.get("/:goalId", verifyUser, getFinancialGoal);
router.put("/:goalId", verifyUser, updateFinancialGoal);
router.post("/:goalId/contribute", verifyUser, addContribution);

export default router;

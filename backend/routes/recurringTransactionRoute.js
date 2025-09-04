import express from "express";
import { 
  addRecurringTransaction, 
  getRecurringTransactions, 
  getRecurringTransaction, 
  updateRecurringTransaction, 
  deleteRecurringTransaction 
} from "../controllers/recurringTransactionController.js";
import { verifyUser } from "../middlewares/verifyUser.js";

const router = express.Router();

router.post("/", verifyUser, addRecurringTransaction);
router.get("/", verifyUser, getRecurringTransactions);
router.get("/:id", verifyUser, getRecurringTransaction);
router.put("/:id", verifyUser, updateRecurringTransaction);
router.delete("/:id", verifyUser, deleteRecurringTransaction);

export default router;

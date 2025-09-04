import express from "express";
import { 
  addAccount, 
  getAccounts, 
  getAccount, 
  updateAccount, 
  deleteAccount 
} from "../controllers/AccountController.js";
import { verifyUser } from "../middlewares/verifyUser.js";

const router = express.Router();

router.post("/", verifyUser, addAccount);
router.get("/", verifyUser, getAccounts);
router.get("/:id", verifyUser, getAccount);
router.put("/:id", verifyUser, updateAccount);
router.delete("/:id", verifyUser, deleteAccount);

export default router;

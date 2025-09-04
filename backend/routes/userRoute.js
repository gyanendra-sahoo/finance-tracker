import express from "express";
import { 
  registerUser, 
  loginUser, 
  changePassword, 
  getUserProfile,
  updateUserProfile
} from "../controllers/userController.js";
import { verifyUser } from "../middlewares/verifyUser.js";

const router = express.Router();

// Auth
router.post("/register", registerUser);
router.post("/login", loginUser);

// Profile
router.get("/profile", verifyUser, getUserProfile);
router.put("/profile", verifyUser, updateUserProfile);

// Security
router.put("/change-password", verifyUser, changePassword);

export default router;

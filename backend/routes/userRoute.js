import express from 'express';
import { loginUser, logoutUser, registerUser, resetPassword, sendOtp, verifyOtp } from '../controllers/userController.js';
import { verifyUser } from '../middlewares/verifyUser.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/logout',verifyUser, logoutUser);
userRouter.post("/send-otp", sendOtp);
userRouter.post("/verify-otp", verifyOtp);
userRouter.post("/reset-password", resetPassword);

export { userRouter };
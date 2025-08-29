import express from 'express';
import { loginUser, logoutUser, registerUser } from '../controllers/userController.js';
import { verifyUser } from '../middlewares/verifyUser.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/logout',verifyUser, logoutUser);

export { userRouter };
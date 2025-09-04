import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './database/dbConnect.js';
import userRoutes from './routes/userRoute.js';
import transactionRoutes from './routes/transactionRoute.js';
import accountRoutes from './routes/accountRoute.js';
import budgetRoutes from './routes/budgetRoute.js';
import financialGoalRoutes from './routes/financialGoalRoute.js';
import recurringTransactionRoutes from './routes/recurringTransactionRoute.js';


const app = express();
const PORT = process.env.PORT || 5000;


// Cors Options
const corsOptions = {
  // origin: (origin, callback) => {
  //   if (origin === process.env.FRONTEND_URL || !origin) {
  //     callback(null, true);
  //   } else {
  //     callback(new Error("Not allowed by CORS"));
  //   }
  // },
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));

// Routing
app.use("/api/user", userRoutes);
app.use("/api/account", accountRoutes);
app.use("/api/transaction", transactionRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/goal", financialGoalRoutes);
app.use("/api/recurring-transaction", recurringTransactionRoutes);


// Database Connection
connectDB();


// Server Running
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
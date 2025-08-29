import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './database/dbConnect.js';
import { userRouter } from './routes/userRoute.js';


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
app.use('/api/v1/user', userRouter);



// Database Connection
connectDB();


// Server Running
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
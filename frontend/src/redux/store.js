import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.js";
import accountReducer from "./slices/accountSlice";
import budgetReducer from "./slices/budgetSlice.js";
import financialGoalReducer from "./slices/financialGoalSlice.js";
import recurringTransactionReducer from "./slices/recurringTransactionSlice.js";
import transactionReducer from "./slices/transactionSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    accounts: accountReducer,
    budgets: budgetReducer,
    financialGoals: financialGoalReducer,
    recurringTransactions: recurringTransactionReducer,
    transactions: transactionReducer,
  },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
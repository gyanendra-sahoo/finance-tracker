// Dashboard.jsx
import React, { useState, useEffect } from "react";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  Plus, 
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  EyeOff,
  BarChart3,
  Search
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getTransactions, addTransaction, deleteTransaction } from "../redux/slices/transactionSlice";

// Components
import KPICard from "../components/Dashboard/KPICard";
import DashboardHeader from "../components/Dashboard/DashboardHeader";
import CashflowChart from "../components/Dashboard/CashFlowChart";
import IncomeExpenseChart from "../components/Dashboard/IncomeExpenseChart";
import RecentTransactions from "../components/Dashboard/RecentTransactions";
import BankAccountCTA from "../components/Dashboard/BankAccountCTA";
import AddTransactionModal from "../components/Dashboard/AddTransactionModal";
import AddTransactionButton from "../components/Dashboard/AddTransaction";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { transactions, loading, total } = useSelector((state) => state.transactions);

  // UI state
  const [showBalance, setShowBalance] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    search: "",
    type: "",
    sortBy: "date",
    sortOrder: "desc",
  });
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // Fetch transactions whenever filters/page change
  useEffect(() => {
    dispatch(getTransactions({ ...filters, page, limit }));
  }, [dispatch, filters, page, limit]);

  // KPIs
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalBalance = totalIncome - totalExpense;
  const businessProfit = totalIncome > 0 ? totalIncome * 0.2 : 0;
  const savingsRate =
    totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

  const kpiData = {
    totalBalance,
    netWorth: totalBalance,
    monthlyIncome: totalIncome,
    monthlyExpense: totalExpense,
    businessProfit,
    savingsRate: parseFloat(savingsRate.toFixed(1)),
  };

  // Cashflow chart data
  const cashflowData = transactions.reduce((acc, txn) => {
    const month = new Date(txn.date).toLocaleString("default", { month: "short" });
    let monthData = acc.find((d) => d.month === month);

    if (!monthData) {
      monthData = { month, income: 0, expense: 0, profit: 0 };
      acc.push(monthData);
    }

    if (txn.type === "income") {
      monthData.income += txn.amount;
    } else {
      monthData.expense += txn.amount;
    }
    monthData.profit = monthData.income - monthData.expense;

    return acc;
  }, []);

  // Currency formatter
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(amount));

  // Event handlers
  const handleToggleBalance = () => setShowBalance(!showBalance);
  const handleAddTransaction = () => setIsAddModalOpen(true);
  const handleAddTransactionSubmit = (transactionData) =>
    dispatch(addTransaction(transactionData));
  const handleDeleteTransaction = (transactionId) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      dispatch(deleteTransaction(transactionId));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <div className="px-3 sm:px-5 pb-8">
        {/* Header with filters */}
        <DashboardHeader
          showBalance={showBalance}
          onToggleBalance={handleToggleBalance}
          onAddTransaction={handleAddTransaction}
          filters={filters}
          setFilters={setFilters}
        />

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 lg:gap-4 mb-6">
          <KPICard
            title="Total Balance"
            value={kpiData.totalBalance}
            change={5.2}
            trend="up"
            icon={DollarSign}
            showBalance={showBalance}
            formatCurrency={formatCurrency}
          />
          <KPICard
            title="Net Worth"
            value={kpiData.netWorth}
            change={3.1}
            trend="up"
            icon={TrendingUp}
            showBalance={showBalance}
            formatCurrency={formatCurrency}
          />
          <KPICard
            title="Income"
            value={kpiData.monthlyIncome}
            change={8.5}
            trend="up"
            icon={TrendingUp}
            showBalance={showBalance}
            formatCurrency={formatCurrency}
          />
          <KPICard
            title="Expense"
            value={kpiData.monthlyExpense}
            change={2.3}
            trend="down"
            icon={TrendingDown}
            showBalance={showBalance}
            formatCurrency={formatCurrency}
          />
          <KPICard
            title="Business Profit"
            value={kpiData.businessProfit}
            change={12.7}
            trend="up"
            icon={PieChart}
            showBalance={showBalance}
            formatCurrency={formatCurrency}
          />
          <KPICard
            title="Savings Rate"
            value={kpiData.savingsRate}
            change={1.2}
            trend="up"
            icon={TrendingUp}
            showBalance={showBalance}
            formatCurrency={formatCurrency}
          />
        </div>

        {/* Charts */}
        <CashflowChart data={cashflowData} formatCurrency={formatCurrency} />
        <IncomeExpenseChart data={cashflowData} formatCurrency={formatCurrency} />

        {/* Recent Transactions */}
        <RecentTransactions
          transactions={transactions}
          loading={loading}
          total={total}
          page={page}
          limit={limit}
          sortBy={filters.sortBy}
          order={filters.sortOrder}
          setPage={setPage}
          formatCurrency={formatCurrency}
          onDelete={handleDeleteTransaction}
        />

        {/* CTA */}
        <BankAccountCTA onConnect={() => console.log("Connecting bank...")} />

        {/* Add Transaction Modal */}
        <AddTransactionModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddTransactionSubmit}
        />

        {/* Floating Button */}
        <AddTransactionButton onClick={handleAddTransaction} />
      </div>
    </div>
  );
};

export default Dashboard;

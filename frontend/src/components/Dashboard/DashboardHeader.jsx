// DashboardHeader.jsx
import React from "react";

const DashboardHeader = ({ 
  onToggleBalance, 
  showBalance, 
  onAddTransaction,
  filters,
  setFilters
}) => {
  return (
    <div className="col-span-2 lg:col-span-3 xl:col-span-6 bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-4">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        
        {/* Left Section */}
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold">Dashboard</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleBalance}
              className="px-3 py-1 bg-gray-100 rounded text-sm"
            >
              {showBalance ? "Hide Balance" : "Show Balance"}
            </button>
            <button
              onClick={onAddTransaction}
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
            >
              + Add Transaction
            </button>
          </div>
        </div>

        {/* Right Section → Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <input
            type="text"
            placeholder="Search..."
            value={filters.search || ""}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="border px-2 py-1 rounded text-sm"
          />
          <select
            value={filters.type || ""}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className="border px-2 py-1 rounded text-sm"
          >
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
            <option value="transfer">Transfer</option>
          </select>
          <select
            value={filters.sortBy || "date"}
            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
            className="border px-2 py-1 rounded text-sm"
          >
            <option value="date">Date</option>
            <option value="amount">Amount</option>
            <option value="category">Category</option>
          </select>
          <select
            value={filters.sortOrder || "desc"}
            onChange={(e) =>
              setFilters({ ...filters, sortOrder: e.target.value })
            }
            className="border px-2 py-1 rounded text-sm"
          >
            <option value="desc">Desc</option>
            <option value="asc">Asc</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;

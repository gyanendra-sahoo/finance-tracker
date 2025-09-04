import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

const KPICard = ({ title, value, change, icon: Icon, trend, showBalance, formatCurrency }) => (
  <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 border border-gray-700 rounded-xl p-4 lg:p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-gray-600">
    <div className="flex items-center justify-between mb-2">
      <div className="p-2 bg-white/10 rounded-lg">
        <Icon className="w-4 h-4 lg:w-5 lg:h-5 text-blue-400" />
      </div>
      {change && (
        <div
          className={`flex items-center text-xs lg:text-sm ${
            trend === "up" ? "text-green-400" : "text-red-400"
          }`}
        >
          {trend === "up" ? (
            <TrendingUp className="w-3 h-3 mr-1" />
          ) : (
            <TrendingDown className="w-3 h-3 mr-1" />
          )}
          {change}%
        </div>
      )}
    </div>
    <div className="text-white">
      <p className="text-xs lg:text-sm text-gray-400 mb-1">{title}</p>
      <p className="text-lg lg:text-2xl font-bold">
        {title.includes("Balance") ||
        title.includes("Worth") ||
        title.includes("Income") ||
        title.includes("Expense") ||
        title.includes("Profit")
          ? showBalance
            ? formatCurrency(value)
            : "••••••"
          : `${value}%`}
      </p>
    </div>
  </div>
);

export default KPICard;
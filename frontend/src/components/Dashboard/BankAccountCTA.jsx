import React from "react";
import { CreditCard } from "lucide-react";

const BankAccountCTA = ({ onConnect }) => {
  return (
    <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white text-center">
      <CreditCard className="w-8 h-8 mx-auto mb-3" />
      <h3 className="text-xl font-semibold mb-2">Connect Your Bank Account</h3>
      <p className="text-blue-100 mb-4">
        Automatically sync your transactions and get real-time insights
      </p>
      <button 
        onClick={onConnect}
        className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
      >
        Connect Account
      </button>
    </div>
  );
};

export default BankAccountCTA;
import React from "react";
import { Plus } from "lucide-react";

const AddTransactionButton = ({ onClick }) => {
  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Mobile FAB */}
      <button
        onClick={onClick}
        className="lg:hidden bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        aria-label="Add Transaction"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Desktop Button */}
      <button
        onClick={onClick}
        className="hidden lg:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
      >
        <Plus className="w-5 h-5" />
        Add Transaction
      </button>
    </div>
  );
};

export default AddTransactionButton;
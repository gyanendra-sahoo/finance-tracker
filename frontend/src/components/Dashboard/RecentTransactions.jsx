import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTransactions } from "../../redux/slices/transactionSlice.js";

const RecentTransactions = () => {
  const dispatch = useDispatch();
  const { transactions, total, loading } = useSelector(
    (state) => state.transactions
  );

  // Pagination + Sorting states
  const [page, setPage] = useState(1);
  const [limit] = useState(5); // Show 5 per page
  const [sortBy, setSortBy] = useState("date");
  const [order, setOrder] = useState("desc");

  useEffect(() => {
    dispatch(getTransactions({ page, limit, sortBy, order }));
  }, [dispatch, page, limit, sortBy, order]);

  return (
    <div className="bg-white shadow-md rounded-xl p-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-gray-700">
          Recent Transactions
        </h2>
        {/* Sorting Dropdown */}
        <select
          className="border rounded-md px-2 py-1 text-sm"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="date">Date</option>
          <option value="amount">Amount</option>
          <option value="category">Category</option>
        </select>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : transactions.length === 0 ? (
        <p className="text-center text-gray-500">No transactions found</p>
      ) : (
        <ul className="divide-y">
          {transactions.map((tx) => (
            <li
              key={tx._id}
              className="flex justify-between items-center py-2"
            >
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {tx.category} {tx.subcategory && `- ${tx.subcategory}`}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(tx.date).toLocaleDateString()} •{" "}
                  {tx.paymentMethod || "N/A"}
                </p>
              </div>
              <p
                className={`text-sm font-semibold ${
                  tx.type === "income" ? "text-green-600" : "text-red-600"
                }`}
              >
                {tx.type === "income" ? "+" : "-"} {tx.amount} {tx.currency}
              </p>
            </li>
          ))}
        </ul>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-3">
        <button
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Prev
        </button>
        <p className="text-sm text-gray-600">
          Page {page} of {Math.ceil(total / limit) || 1}
        </p>
        <button
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          onClick={() =>
            setPage((prev) =>
              prev < Math.ceil(total / limit) ? prev + 1 : prev
            )
          }
          disabled={page >= Math.ceil(total / limit)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default RecentTransactions;

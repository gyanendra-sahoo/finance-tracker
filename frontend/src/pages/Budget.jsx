import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createBudget,
  getBudgets,
  updateBudget,
  deleteBudget,
  getBudgetAnalytics,
  clearError,
} from "../redux/slices/budgetSlice.js";

const BudgetPage = () => {
  const dispatch = useDispatch();
  const { budgets, analytics, loading, error } = useSelector((state) => state.budgets);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);

  const [form, setForm] = useState({
    name: "",
    period: "monthly",
    totalBudget: "",
    categories: [{ category: "", budgetAmount: "" }],
  });

  useEffect(() => {
    dispatch(getBudgets());
    dispatch(getBudgetAnalytics());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("category")) {
      const index = parseInt(name.replace("category", ""));
      const newCategories = [...form.categories];
      newCategories[0] = { ...newCategories[0], [name === "categoryName" ? "category" : "budgetAmount"]: value };
      setForm({ ...form, categories: newCategories });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleCategoryChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      categories: [{ ...prevForm.categories[0], [name]: value }]
    }));
  };

  const handleSubmit = async () => {
    const budgetData = {
      name: form.name,
      period: form.period,
      totalBudget: parseFloat(form.totalBudget),
      categories: form.categories.map(cat => ({
        category: cat.category,
        budgetAmount: parseFloat(cat.budgetAmount)
      })),
    };

    if (editingBudget) {
      await dispatch(updateBudget({ id: editingBudget._id, data: budgetData }));
      setEditingBudget(null);
    } else {
      await dispatch(createBudget(budgetData));
    }

    setForm({ name: "", period: "monthly", totalBudget: "", categories: [{ category: "", budgetAmount: "" }] });
    setIsModalOpen(false);
  };

  const handleEditClick = (budget) => {
    setEditingBudget(budget);
    setForm({
      name: budget.name,
      period: budget.period,
      totalBudget: budget.totalBudget,
      categories: budget.categories.map(cat => ({
        category: cat.category,
        budgetAmount: cat.budgetAmount
      })),
    });
    setIsModalOpen(true);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Budgets</h2>
      <button
        className="px-3 py-2 bg-blue-500 text-white rounded"
        onClick={() => {
          setEditingBudget(null);
          setForm({ name: "", period: "monthly", totalBudget: "", categories: [{ category: "", categoryAmount: "" }] });
          setIsModalOpen(true);
        }}
      >
        + Create Budget
      </button>

      {loading && <p>Loading...</p>}
      {error && (
        <div className="p-2 bg-red-200 text-red-700 mb-2 flex justify-between items-center">
          <span>{error.message || "Something went wrong"}</span>
          <button onClick={() => dispatch(clearError())} className="text-sm underline">
            Dismiss
          </button>
        </div>
      )}

      <div className="mt-4 space-y-3">
        {budgets.map((b) => (
          <div key={b._id} className="p-3 border rounded flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{b.name}</h3>
              <p>
                {b.period} – ₹{b.totalBudget}
              </p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEditClick(b)}
                className="px-2 py-1 bg-yellow-400 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => dispatch(deleteBudget(b._id))}
                className="px-2 py-1 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {analytics?.overallAnalytics && (
        <div className="mt-6">
          <h3 className="font-bold">Analytics</h3>
          <p>Total Spent: ₹{analytics.overallAnalytics.totalSpent}</p>
          <p>Remaining Budget: ₹{analytics.overallAnalytics.totalRemaining}</p>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-5 rounded shadow w-96">
            <h3 className="text-lg font-bold mb-3">
              {editingBudget ? "Edit Budget" : "Create Budget"}
            </h3>

            <input
              type="text"
              name="name"
              placeholder="Budget Name"
              value={form.name}
              onChange={handleChange}
              className="w-full border p-2 mb-2"
            />
            <input
              type="number"
              name="totalBudget"
              placeholder="Total Budget"
              value={form.totalBudget}
              onChange={handleChange}
              className="w-full border p-2 mb-2"
            />
            <input
              type="text"
              name="category"
              placeholder="Category"
              value={form.categories[0]?.category}
              onChange={handleCategoryChange}
              className="w-full border p-2 mb-2"
            />
            <input
              type="number"
              name="budgetAmount"
              placeholder="Category Amount"
              value={form.categories[0]?.budgetAmount}
              onChange={handleCategoryChange}
              className="w-full border p-2 mb-2"
            />
            <select
              name="period"
              value={form.period}
              onChange={handleChange}
              className="w-full border p-2 mb-2"
            >
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
              <option value="yearly">Yearly</option>
            </select>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-3 py-2 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-3 py-2 bg-blue-500 text-white rounded"
              >
                {editingBudget ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetPage;
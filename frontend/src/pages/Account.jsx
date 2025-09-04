import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  CreditCard,
  Plus,
  Trash2,
  Edit3,
  Eye,
  EyeOff,
  Search,
  MoreVertical,
  Building,
  Wallet,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import {
  getAccounts,
  addAccount,
  updateAccount,
  deleteAccount,
  clearError
} from '../redux/slices/accountSlice';

const Account = () => {
  const dispatch = useDispatch();
  const { accounts, loading, error, totalAccounts, balanceSummary } = useSelector(
    (state) => state.accounts
  );

  // UI State
  const [showBalances, setShowBalances] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Form state for add/edit account
  const [accountForm, setAccountForm] = useState({
    name: '',
    type: 'checking',
    balance: '',
    description: ''
  });

  useEffect(() => {
    dispatch(getAccounts());
  }, [dispatch]);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(amount));

  const getAccountIcon = (type) => {
    switch (type) {
      case 'checking': return Building;
      case 'savings': return PiggyBank;
      case 'credit': return CreditCard;
      default: return Wallet;
    }
  };

  const getAccountTypeColor = (type) => {
    switch (type) {
      case 'checking': return 'bg-blue-100 text-blue-800';
      case 'savings': return 'bg-green-100 text-green-800';
      case 'credit': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSubmitAccount = async (e) => {
    e.preventDefault();
    try {
      const accountData = {
        ...accountForm,
        balance: parseFloat(accountForm.balance) || 0
      };

      if (editingAccount) {
        await dispatch(updateAccount({
          id: editingAccount._id,
          data: accountData
        })).unwrap();
        setEditingAccount(null);
      } else {
        await dispatch(addAccount(accountData)).unwrap();
        setIsAddModalOpen(false);
      }
      
      setAccountForm({ name: '', type: 'checking', balance: '', description: '' });
    } catch (error) {
      console.error('Failed to save account:', error);
    }
  };

  const handleDeleteAccount = async (accountId) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      try {
        await dispatch(deleteAccount(accountId)).unwrap();
      } catch (error) {
        console.error('Failed to delete account:', error);
      }
    }
  };

  const startEditAccount = (account) => {
    setEditingAccount(account);
    setAccountForm({
      name: account.name,
      type: account.type,
      balance: account.balance.toString(),
      description: account.description || ''
    });
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    setEditingAccount(null);
    setAccountForm({ name: '', type: 'checking', balance: '', description: '' });
  };

  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = account.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || account.type === filterType;
    return matchesSearch && matchesType;
  });

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Account Management</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Total Balance:</span>
                <span className="text-lg font-semibold text-gray-900">
                  {showBalances ? formatCurrency(totalBalance) : '••••••'}
                </span>
                <button
                  onClick={() => setShowBalances(!showBalances)}
                  className="p-1 hover:bg-gray-200 rounded-full"
                >
                  {showBalances ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Add Account
          </button>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search accounts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="checking">Checking</option>
              <option value="savings">Savings</option>
              <option value="credit">Credit</option>
            </select>
          </div>
        </div>

        {/* Accounts Grid */}
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading accounts...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAccounts.map((account) => {
              const IconComponent = getAccountIcon(account.type);
              return (
                <div key={account._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <IconComponent size={24} className="text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{account.name}</h3>
                        <span className={`inline-block px-2 py-1 text-xs rounded-full capitalize ${getAccountTypeColor(account.type)}`}>
                          {account.type}
                        </span>
                      </div>
                    </div>
                    <div className="relative group">
                      <button className="p-1 hover:bg-gray-100 rounded-full">
                        <MoreVertical size={16} className="text-gray-400" />
                      </button>
                      <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                        <button
                          onClick={() => startEditAccount(account)}
                          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg"
                        >
                          <Edit3 size={16} />
                          Edit Account
                        </button>
                        <button
                          onClick={() => handleDeleteAccount(account._id)}
                          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-lg"
                        >
                          <Trash2 size={16} />
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Current Balance</span>
                      <div className="flex items-center gap-1">
                        {account.balance >= 0 ? (
                          <ArrowUpRight size={16} className="text-green-500" />
                        ) : (
                          <ArrowDownRight size={16} className="text-red-500" />
                        )}
                        <span className={`text-lg font-semibold ${account.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {showBalances ? formatCurrency(account.balance) : '••••••'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {account.description && (
                    <p className="text-sm text-gray-600">{account.description}</p>
                  )}

                  <div className="mt-4 text-xs text-gray-500">
                    Created: {new Date(account.createdAt).toLocaleDateString()}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Add/Edit Account Modal */}
        {(isAddModalOpen || editingAccount) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full max-h-96 overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                  {editingAccount ? 'Edit Account' : 'Add New Account'}
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Account Name
                    </label>
                    <input
                      type="text"
                      required
                      value={accountForm.name}
                      onChange={(e) => setAccountForm({ ...accountForm, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Main Checking"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Account Type
                    </label>
                    <select
                      value={accountForm.type}
                      onChange={(e) => setAccountForm({ ...accountForm, type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="checking">Checking</option>
                      <option value="savings">Savings</option>
                      <option value="credit">Credit</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Initial Balance
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={accountForm.balance}
                      onChange={(e) => setAccountForm({ ...accountForm, balance: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={accountForm.description}
                      onChange={(e) => setAccountForm({ ...accountForm, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Add any notes about this account..."
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitAccount}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {editingAccount ? 'Update Account' : 'Add Account'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


export default Account;
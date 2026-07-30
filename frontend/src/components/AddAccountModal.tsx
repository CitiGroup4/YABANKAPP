import React, { useState } from 'react';
import type { Account } from '../types/bank';

interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAccount: (newAccount: Account) => void;
}

export const AddAccountModal: React.FC<AddAccountModalProps> = ({
  isOpen,
  onClose,
  onAddAccount,
}) => {
  const [balance, setBalance] = useState<string>('');
  const [accountType, setAccountType] = useState<Account['account_type']>('Checking');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedBalance = parseFloat(balance);
    if (isNaN(parsedBalance)) return;

    // Generate ISO string formatted timestamp
    const now = new Date();
    const formattedDate = now.toISOString().replace('T', ' ').substring(0, 19);

    const newAcc: Account = {
      account_id: Math.floor(100 + Math.random() * 900), // Generates random 3-digit account_id
      user_id: 1,
      balance: parsedBalance,
      account_type: accountType,
      created_at: formattedDate,
    };

    onAddAccount(newAcc);
    setBalance('');
    setAccountType('Checking');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 backdrop-blur-sm p-4">
      <div className="bg-amber-50 border border-amber-200 rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-lg font-bold text-amber-950">Add New Account</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-amber-200/60 text-amber-950 flex items-center justify-center hover:bg-amber-300 transition-colors font-bold"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Account Type Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-amber-900 uppercase tracking-wider mb-1">
              Account Type
            </label>
            <select
              value={accountType}
              onChange={(e) => setAccountType(e.target.value as Account['account_type'])}
              className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2.5 text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm font-medium"
            >
              <option value="Checking">Checking</option>
              <option value="Saving">Saving</option>
              <option value="Investment">Investment</option>
              <option value="Business">Business</option>
            </select>
          </div>

          {/* Initial Balance Field */}
          <div>
            <label className="block text-xs font-semibold text-amber-900 uppercase tracking-wider mb-1">
              Initial Balance ($)
            </label>
            <input
              type="number"
              step="0.01"
              required
              placeholder="0.00"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2.5 text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm font-medium"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-amber-200/60">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-amber-900 bg-amber-200/50 hover:bg-amber-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-amber-50 bg-amber-800 hover:bg-amber-900 rounded-xl transition-colors shadow-sm"
            >
              Save Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
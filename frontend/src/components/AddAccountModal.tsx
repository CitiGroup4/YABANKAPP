import React, { useState } from 'react';
import type { Account } from '../types/bank';

export interface AddAccountModalProps {
  isOpen: boolean;
  userId: number;
  onClose: () => void;
  onAddAccount: (newAccount: Account) => void;
}

export const AddAccountModal: React.FC<AddAccountModalProps> = ({
  isOpen,
  userId,
  onClose,
  onAddAccount,
}) => {
  const [accountType, setAccountType] = useState<Account['account_type']>('Checking');
  const [initialBalance, setInitialBalance] = useState('0');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newAccount: Account = {
      account_id: Math.floor(1000 + Math.random() * 9000),
      user_id: userId,
      balance: parseFloat(initialBalance) || 0,
      account_type: accountType,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    onAddAccount(newAccount);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white border border-amber-200/80 rounded-2xl p-6 w-full max-w-md shadow-xl space-y-4">
        <div className="flex justify-between items-center border-b border-amber-100 pb-3">
          <h3 className="text-base font-bold text-amber-950">Add New Account</h3>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 text-sm font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-amber-950">
              Account Type
            </label>
            <select
              value={accountType}
              onChange={(e) => setAccountType(e.target.value as Account['account_type'])}
              className="w-full text-xs px-3 py-2 rounded-xl border border-amber-200 bg-stone-50 text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="Checking">Checking</option>
              <option value="Saving">Saving</option>
              <option value="Investment">Investment</option>
              <option value="Business">Business</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-amber-950">
              Initial Deposit ($)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={initialBalance}
              onChange={(e) => setInitialBalance(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-amber-200 bg-stone-50 text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 transition-all cursor-pointer"
            >
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
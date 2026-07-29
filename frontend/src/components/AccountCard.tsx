import React from 'react';
import type { Account } from '../types/bank';

interface AccountCardProps {
  account: Account;
  onSelectAccount?: (account: Account) => void;
}

export const AccountCard: React.FC<AccountCardProps> = ({ account, onSelectAccount }) => {
  return (
    <div
      onClick={() => onSelectAccount && onSelectAccount(account)}
      className="flex-shrink-0 w-72 bg-amber-100/60 border border-amber-200/80 hover:border-amber-400 p-5 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer hover:-translate-y-1 group"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 bg-amber-200/60 px-2 py-0.5 rounded-md">
            {account.account_type}
          </span>
          <h3 className="text-lg font-semibold text-amber-950 mt-2 group-hover:text-amber-800 transition-colors">
            Account #{account.account_id}
          </h3>
        </div>
        <span className="text-xs text-amber-800/60 group-hover:translate-x-1 transition-transform">
          →
        </span>
      </div>
      <div className="pt-2 border-t border-amber-200/60">
        <span className="text-xs text-amber-700/80">Available Balance</span>
        <p className="text-2xl font-bold text-amber-950">
          ${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </p>
      </div>
    </div>
  );
};